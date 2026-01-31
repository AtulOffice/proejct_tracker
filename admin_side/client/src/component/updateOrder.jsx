import React, { useEffect, useState, useRef } from "react";
import { AlertCircle, Save, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { fields } from "../utils/FieldConstant";
import { fetchOrderById } from "../apiCall/orders.Api";
import apiClient from "../api/axiosClient";

export default function UpdateOrderForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState(fields);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const val = await fetchOrderById(id, false);
        if (val) {
          setFormData((prev) => ({ ...prev, ...val }));
        } else {
          toast.error("Failed to fetch order data");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Error fetching order data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const msgs = {};

    if (
      (touched.bookingDate ||
        touched.orderDate) &&
      formData.bookingDate &&
      formData.orderDate &&
      new Date(formData.orderDate) > new Date(formData.bookingDate)
    ) {
      msgs.orderDate = "Order Date must be earlier than Booking Date.";
      msgs.bookingDate = "Booking Date must be later than Order Date.";
    }

    if (
      (touched.orderDate ||
        touched.deleveryDate) &&
      formData.orderDate &&
      formData.deleveryDate &&
      new Date(formData.deleveryDate) < new Date(formData.orderDate)
    ) {
      msgs.deleveryDate = "Delivery Date cannot be before Order Date";
    }

    setMessages(msgs);
  }, [
    formData.bookingDate,
    formData.orderDate,
    formData.deleveryDate,
    touched.bookingDate,
    touched.orderDate,
    touched.deleveryDate,
  ]);



  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiClient.get(`/market/getall`)
        setEmployees(response?.data?.data);
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const sanitizeJobNumber = (value = "") => {
    return value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
  };


  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "jobNumber") {
      const cleaned = sanitizeJobNumber(value);
      setFormData((prev) => ({ ...prev, jobNumber: cleaned }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    const newValue =
      type === "number" && value !== "" ? parseFloat(value) : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };

      if (name === "paymentAdvance") {
        const allowed = newValue === "NO" ? 0 : Number(newValue) || 0;

        for (let i = 1; i <= 3; i++) {
          if (i > allowed) {
            updated[`paymentPercent${i}`] = "";
            updated[`paymentAmount${i}`] = "";
            updated[`paymentType${i}`] = "";
            updated[`paymentType${i}other`] = "";
            updated[`payemntCGBG${i}`] = "";
            updated[`paymentrecieved${i}`] = "";
          }
        }
      }

      const supply = parseFloat(updated.orderValueSupply) || 0;
      const service = parseFloat(updated.orderValueService) || 0;
      const total = supply + service;

      updated.orderValueTotal = total;
      updated.paymentAmount1 = ((parseFloat(updated.paymentPercent1) || 0) / 100) * total;
      updated.paymentAmount2 = ((parseFloat(updated.paymentPercent2) || 0) / 100) * total;
      updated.paymentAmount3 = ((parseFloat(updated.paymentPercent3) || 0) / 100) * total;
      updated.invoiceAmount = ((parseFloat(updated.invoicePercent) || 0) / 100) * total;

      const activeTerms = Number(updated.paymentAdvance) || 0;

      let totalPercent = parseFloat(updated.invoicePercent) || 0;
      for (let i = 1; i <= activeTerms; i++) {
        totalPercent += parseFloat(updated[`paymentPercent${i}`]) || 0;
      }
      if (updated.retentionYesNo === "YES" && totalPercent <= 100) {
        const remaining = 100 - totalPercent;
        updated.retentionPercent = remaining;
        updated.retentionAmount = (remaining / 100) * total;
      } else {
        updated.retentionPercent = 0;
        updated.retentionAmount = 0;
      }
      return updated;
    });


    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const newErrors = {};

    const isEmpty = (val) =>
      val === undefined || val === null || String(val).trim() === "";

    const toNumber = (val) => {
      const n = parseFloat(val);
      return Number.isFinite(n) ? n : NaN;
    };

    ["entityType", "soType"].forEach((field) => {
      if (touched[field] && isEmpty(formData[field])) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase())} is required`;
      }
    });

    if (touched.jobNumber && isEmpty(formData.jobNumber))
      newErrors.jobNumber = "Job Number is required";

    if (touched.client && isEmpty(formData.client))
      newErrors.client = "Client is required";

    if (touched.technicalEmail) {
      if (isEmpty(formData.technicalEmail)) {
        newErrors.technicalEmail = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.technicalEmail))
          newErrors.technicalEmail = "Enter a valid email";
      }
    }

    if (touched.bookingDate && isEmpty(formData.bookingDate))
      newErrors.bookingDate = "Booking Date is required";
    if (touched.actualDeleveryDate && isEmpty(formData.actualDeleveryDate))
      newErrors.actualDeleveryDate = "Target Delivery Date is required";

    if (touched.poReceived && isEmpty(formData.poReceived))
      newErrors.poReceived = "PO Received is required";

    if (touched.creditDays) {
      const cd = toNumber(formData.creditDays);
      if (isNaN(cd)) newErrors.creditDays = "Enter a valid number";
      else if (cd < 0) newErrors.creditDays = "Credit Period must be greater than zero";
    }

    if (touched.invoiceTerm && isEmpty(formData.invoiceTerm))
      newErrors.invoiceTerm = "Invoice Type is required";

    if (touched.invoicePercent) {
      const inv = toNumber(formData.invoicePercent);
      if (isNaN(inv) || inv < 0 || inv > 100)
        newErrors.invoicePercent = "Invoice percent must be between 0 and 100";
    }

    if (touched.mileStone && isEmpty(formData.mileStone))
      newErrors.mileStone = "Milestone is required";

    if (
      touched.invoicemileStoneOther &&
      formData.mileStone === "OTHER" &&
      isEmpty(formData.invoicemileStoneOther)
    ) {
      newErrors.invoicemileStoneOther = "Please specify other milestone";
    }

    if (touched.paymentAdvance && isEmpty(formData.paymentAdvance))
      newErrors.paymentAdvance = "Payment Advance selection is required";

    const terms = Number(formData.paymentAdvance) || 0;

    for (let i = 1; i <= terms; i++) {
      if (touched[`paymentPercent${i}`] && !formData[`paymentPercent${i}`])
        newErrors[`paymentPercent${i}`] = "Required";

      if (touched[`paymentType${i}`] && isEmpty(formData[`paymentType${i}`]))
        newErrors[`paymentType${i}`] = "Required";

      if (touched[`payemntCGBG${i}`] && isEmpty(formData[`payemntCGBG${i}`]))
        newErrors[`payemntCGBG${i}`] = "Required";

      if (touched[`paymentrecieved${i}`] && isEmpty(formData[`paymentrecieved${i}`]))
        newErrors[`paymentrecieved${i}`] = "Required";

      if (
        touched[`paymentType${i}other`] &&
        formData[`paymentType${i}`] === "OTHER" &&
        isEmpty(formData[`paymentType${i}other`])
      ) {
        newErrors[`paymentType${i}other`] = "Required";
      }
    }

    if (touched.orderValueSupply || touched.orderValueService) {
      const supply = Number(formData.orderValueSupply);
      const service = Number(formData.orderValueService);

      if (isNaN(supply)) newErrors.orderValueSupply = "Enter a valid number";
      if (isNaN(service)) newErrors.orderValueService = "Enter a valid number";

      if (!isNaN(supply) && !isNaN(service) && supply + service <= 0) {
        newErrors.orderValueSupply = "Total must be greater than zero";
        newErrors.orderValueService = "Total must be greater than zero";
      }
    }

    if (formData.poReceived === "YES") {
      if (touched.orderNumber && isEmpty(formData.orderNumber))
        newErrors.orderNumber = "PO number is required";
      if (touched.orderDate && isEmpty(formData.orderDate))
        newErrors.orderDate = "PO order date is required";
      if (touched.deleveryDate && isEmpty(formData.deleveryDate))
        newErrors.deleveryDate = "PO delivery date is required";
    }

    let totalPercent = parseFloat(formData.invoicePercent) || 0;
    for (let i = 1; i <= terms; i++) {
      totalPercent += parseFloat(formData[`paymentPercent${i}`]) || 0;
    }
    if ((touched.paymentPercent1 || touched.paymentPercent2 || touched.invoicePercent) && totalPercent > 100) {
      newErrors.paymentPercent1 = "Total percentage must not exceed 100%";
    }

    if (touched.retentionYesNo && String(formData.retentionYesNo).toUpperCase() === "YES") {
      if (touched.retentionDocs && isEmpty(formData.retentionDocs))
        newErrors.retentionDocs = "Retention docs are required";

      if (
        touched.retentinoDocsOther &&
        formData.retentionDocs === "OTHER" &&
        isEmpty(formData.retentinoDocsOther)
      ) {
        newErrors.retentinoDocsOther = "Please specify other retention docs";
      }

      if (touched.retentionPeriod && isEmpty(formData.retentionPeriod))
        newErrors.retentionPeriod = "Retention period is required";

      const rPercent = toNumber(formData.retentionPercent);
      if (touched.retentionPercent && (isNaN(rPercent) || rPercent < 0 || rPercent > 100))
        newErrors.retentionPercent = "Retention percent must be between 0 and 100";
    }

    if (touched.concerningSalesManager && !isEmpty(formData.concerningSalesManager)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.concerningSalesManager))
        newErrors.concerningSalesManager = "Enter valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(
      Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await apiClient.put(
          `/order/update/${id}`, formData);
        if (response.data) {
          toast.success("data update successfully");
          setFormData(fields);
          navigate("/page", {
            replace: true,
          });
        } else {
          setErrors({
            submit: response.data.message || "Something went wrong.",
          });
        }
      } catch (error) {
        if (error?.response) {
          toast.error(
            error?.response?.data?.message ||
            "some thing wrong when saved order"
          );
        }
        console.error("API Error:", error);
        setErrors({
          submit:
            error.response?.data?.message ||
            "Failed to submit form. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const SingleEngineerSelect = ({
    label,
    engineersList,
    value,
    onChange,
    required = false,
    getEngineerLabel,
  }) => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
      const handleOutside = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
          setOpen(false);
          setSearch("");
        }
      };
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }, []);
    const selectedEngineer = engineersList.find(
      (eng) => eng._id === value
    );
    const normalizedSearch = search.trim().toLowerCase();

    const filteredEngineers = engineersList.filter((eng) => {
      if (!normalizedSearch) return true;
      return [eng.username, eng.name, eng.email]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
    const inputValue = open
      ? search
      : selectedEngineer
        ? getEngineerLabel(selectedEngineer)
        : "";

    return (
      <div ref={wrapperRef} className="relative mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          autoComplete="new-password"
          spellCheck={false}
          placeholder="Select sales Name.."
          value={inputValue}
          onFocus={() => {
            setOpen(true);
            setSearch("");
          }}
          onChange={(e) => {
            setOpen(true);
            setSearch(e.target.value);
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white
                     focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {open && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredEngineers.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No engineers found
              </div>
            ) : (
              filteredEngineers.map((eng) => (
                <div
                  key={eng._id}
                  onClick={() => {
                    onChange(eng._id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`px-4 py-3 cursor-pointer transition truncate font-bold
                    ${eng._id === value
                      ? "bg-green-100 text-green-800 font-medium"
                      : "hover:bg-gray-50"
                    }`}
                >
                  {getEngineerLabel(eng)}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };


  const renderInput = (
    name,
    label,
    type = "text",
    placeholder = "",
    required = false,
    options = {}
  ) => {
    const hasError = touched[name] && errors[name];
    const formatNumber = (value) => {
      if (value === "" || value === null) return "";
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const unformatNumber = (value) => {
      return value.replace(/,/g, "");
    };
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === "select" ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 font-medium ${hasError
              ? "border-red-500 bg-red-50"
              : "border-purple-200 bg-linear-to-br from-blue-50 to-purple-50 hover:border-purple-300"
              }`}
          >
            <option value="">
              {options.placeholder || "Select an option"}
            </option>
            {options.choices?.map((choice) => {
              const value = typeof choice === "string" ? choice : choice.value;
              const label = typeof choice === "string" ? choice : choice.label;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}

          </select>
        ) : type === "textarea" ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={options.rows || 3}
            placeholder={placeholder}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 resize-none font-medium ${hasError
              ? "border-red-500 bg-red-50"
              : "border-purple-200 bg-linear-to-br from-indigo-50 to-purple-50 hover:border-purple-300"
              }`}
          />
        ) : (
          <input
            type={type === "number" ? "text" : type}
            name={name}
            value={
              type === "number"
                ? formatNumber(formData[name])
                : formData[name]
            }
            inputMode={type === "number" ? "numeric" : undefined}
            onChange={(e) => {
              if (type === "number") {
                const rawValue = unformatNumber(e.target.value);
                if (!/^\d*$/.test(rawValue)) return;

                const numericValue =
                  rawValue === "" ? "" : Number(rawValue);

                if (
                  options.min != null &&
                  numericValue !== "" &&
                  numericValue < options.min
                )
                  return;

                if (
                  options.max != null &&
                  numericValue !== "" &&
                  numericValue > options.max
                )
                  return;

                handleChange({
                  target: {
                    name,
                    value: numericValue,
                  },
                });
              } else {
                handleChange(e);
              }
            }}
            onBlur={handleBlur}
            placeholder={placeholder}
            readOnly={options.readOnly}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 font-medium ${hasError
              ? "border-red-500 bg-red-50"
              : options.readOnly
                ? "border-purple-200 bg-linear-to-br from-gray-100 to-purple-50 cursor-not-allowed text-gray-600"
                : "border-purple-200 bg-linear-to-br from-pink-50 to-purple-50 hover:border-purple-300"
              }`}
          />
        )}
        {hasError && (
          <p className="mt-2 text-sm text-red-600! flex items-center gap-1 font-semibold">
            <AlertCircle size={14} /> {errors[name]}
          </p>
        )}
        {messages[name] && (
          <div className="mt-3 p-4 bg-linear-to-r from-orange-500 to-red-500 border-l-4 border-red-700 rounded-lg shadow-lg">
            <p className="text-sm text-white flex items-center gap-2 font-bold drop-shadow-sm">
              <span className="text-xl animate-bounce">⚠️</span>
              <span>{messages[name]}</span>
            </p>
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="transition-all duration-300  pt-16 min-h-screen bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mt-6 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-6xl border border-white/30">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white drop-shadow-md">
          {formData?.client || ""}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-blue-600 rounded"></div>
              <h2 className="text-2xl font-bold text-blue-900">
                Basic Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderInput(
                "jobNumber",
                "Job Number",
                "text",
                "Enter job number",
                true
              )}
              {renderInput("entityType", "Entity Type", "select", "", true, {
                choices: ["SI DELHI", "SI PUNE", "SI NOIDA", "MS DELHI"],
                placeholder: "Select Entity Type",
              })}
              {renderInput("soType", "SO Type", "select", "", true, {
                choices: ["PROJECT", "AMC", "SERVICE", "WARRANTY", "SUPPLY"],
                placeholder: "Select SO Type",
              })}
              {renderInput("bookingDate", "Booking Date", "date", "", true)}
              {renderInput(
                "client",
                "Client Name",
                "text",
                "Enter client name",
                true
              )}
              {renderInput(
                "endUser",
                "End User",
                "text",
                "Enter end user",
                false
              )}
              {renderInput("site", "Site Location", "text", "Enter site")}
              {/* {renderInput(
                "concerningSalesManager",
                "SIEPL Acct. Mgr. Email",
                "email",
                "Enter sales manager Email",
                true
              )} */}

              <SingleEngineerSelect
                label="SIEPL Acct. Mgr. Email"
                engineersList={employees || []}
                value={formData.concerningSalesManager}
                onChange={(id) =>
                  setFormData((prev) => ({
                    ...prev,
                    concerningSalesManager: id,
                  }))
                }
                getEngineerLabel={(eng) => eng.name}
              />
              {renderInput(
                "name",
                "Client Technical Person Name",
                "text",
                "Enter Name",

              )}
              {renderInput(
                "technicalEmail",
                "Client Technical Person Email",
                "email",
                "Enter technical person email id",
                true
              )}

              {renderInput(
                "phone",
                "Client Technical Person Contact No.",
                "text",
                "Enter Contact Number",

              )}
              {renderInput("actualDeleveryDate", "Target Delivery Date", "date", "", true)}
            </div>
          </section>

          {/* Financial Information Section */}
          <section className="bg-linear-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-orange-600 rounded"></div>
              <h2 className="text-2xl font-bold text-orange-900">
                Order Value
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderInput(
                "orderValueSupply",
                "Order Value - Supply (₹)",
                "number",
                "",
                true,
                { min: 0, step: "0.01" }
              )}
              {renderInput(
                "orderValueService",
                "Order Value - Service (₹)",
                "number",
                "",
                true,
                { min: 0, step: "0.01" }
              )}
              {renderInput(
                "orderValueTotal",
                "Order Value - Total (₹)",
                "number",
                "",
                false,
                { min: 0, step: "0.01", readOnly: true }
              )}
            </div>
          </section>


          {/* Order Details Section */}
          <section className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-purple-600 rounded"></div>
              <h2 className="text-2xl font-bold text-purple-900">
                PO Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderInput("poReceived", "PO Received", "select", "", true, {
                choices: ["YES", "NO"],
              })}

              {formData.poReceived === "YES" && (
                <>
                  {renderInput("orderNumber", "PO Number", "text", "Enter po number", true)}
                  {renderInput("orderDate", "PO Order Date", "date", "", true)}
                  {renderInput("deleveryDate", "PO Delivery Date", "date", "", true)}

                  {renderInput(
                    "amndReqrd",
                    "Amendment Required",
                    "select",
                    "",
                    false,
                    { choices: ["YES", "NO"] }
                  )}
                  {renderInput(
                    "cancellation",
                    "Cancellation",
                    "select",
                    "",
                    false,
                    { choices: ["NONE", "PARTIAL", "COMPLETE"] }
                  )}
                </>
              )}
            </div>
          </section>

          {/* Payment Information Section */}
          <section className="bg-linear-to-br from-cyan-50 to-cyan-100 p-6 rounded-lg border border-cyan-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-cyan-600 rounded"></div>
              <h2 className="text-2xl font-bold text-cyan-900">
                Payment Information
              </h2>
            </div>


            <div className="mb-4">
              {renderInput(
                "paymentAdvance",
                "Payment Advance",
                "select",
                "",
                true,
                {
                  choices: [
                    { label: "Yes with 1 terms", value: "1" },
                    { label: "Yes with 2 terms", value: "2" },
                    { label: "Yes with 3 terms", value: "3" },
                    { label: "NO", value: "NO" },

                  ]
                }
              )}
            </div>

            {/* Payment Stage 1 */}

            {["1", "2", "3"].includes(formData.paymentAdvance) && (
              <div className="bg-white p-6 rounded-lg mb-6 border-2 border-cyan-300 shadow-sm">
                <h3 className="font-bold text-lg text-cyan-800 mb-4">💳 Advance Terms 1</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderInput("paymentPercent1", "Payment Percent (%)", "number", "", true, { min: 0, max: 100, step: "0.01" })}
                  {renderInput("paymentAmount1", "Payment Amount (₹)", "number", "", true, { min: 0, step: "0.01", readOnly: true })}
                  {renderInput("paymentType1", "MileStone", "select", "", true, { choices: ["OA", "PO", "DWG APPR.", "OTHER"] })}
                  {formData.paymentType1 === "OTHER" &&
                    renderInput("paymentType1other", "Other MileStone", "text", "Enter MileStone", true)
                  }
                  {renderInput("payemntCGBG1", "Payment CG/BG", "select", "", true, { choices: ["CG", "BG", "N/A"] })}
                  {renderInput("paymentrecieved1", "Payment Status", "select", "", true, { choices: ["RECIEVED", "NOT RECIEVED"] })}
                </div>
              </div>
            )}


            {["2", "3"].includes(formData.paymentAdvance) && (
              <div className="bg-white p-6 rounded-lg mb-6 border-2 border-cyan-300 shadow-sm">
                <h3 className="font-bold text-lg text-cyan-800 mb-4">💳 Advance Terms 2</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderInput("paymentPercent2", "Payment Percent (%)", "number", "", true, { min: 0, max: 100, step: "0.01" })}
                  {renderInput("paymentAmount2", "Payment Amount (₹)", "number", "", false, { min: 0, step: "0.01", readOnly: true })}
                  {renderInput("paymentType2", "MileStone", "select", "", true, { choices: ["OA", "PO", "DWG APPR.", "OTHER"] })}
                  {formData.paymentType2 === "OTHER" &&
                    renderInput("paymentType2other", "Other MileStone", "text", "Enter MileStone", true)
                  }
                  {renderInput("payemntCGBG2", "Payment CG/BG", "select", "", true, { choices: ["CG", "BG", "N/A"] })}
                  {renderInput("paymentrecieved2", "Payment Status", "select", "", true, { choices: ["RECIEVED", "NOT RECIEVED"] })}
                </div>
              </div>
            )}

            {formData.paymentAdvance === "3" && (
              <div className="bg-white p-6 rounded-lg mb-6 border-2 border-cyan-300 shadow-sm">
                <h3 className="font-bold text-lg text-cyan-800 mb-4">💳 Advance Terms 3</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderInput("paymentPercent3", "Payment Percent (%)", "number", "", true, { min: 0, max: 100, step: "0.01" })}
                  {renderInput("paymentAmount3", "Payment Amount (₹)", "number", "", false, { min: 0, step: "0.01", readOnly: true })}
                  {renderInput("paymentType3", "MileStone", "select", "", true, { choices: ["OA", "PO", "DWG APPR.", "OTHER"] })}
                  {formData.paymentType3 === "OTHER" &&
                    renderInput("paymentType3other", "Other MileStone", "text", "Enter MileStone", true)
                  }
                  {renderInput("payemntCGBG3", "Payment CG/BG", "select", "", true, { choices: ["CG", "BG", "N/A"] })}
                  {renderInput("paymentrecieved3", "Payment Status", "select", "", true, { choices: ["RECIEVED", "NOT RECIEVED"] })}
                </div>
              </div>
            )}


            {/* Payment Stage 2 */}

            <div className="bg-white p-6 rounded-lg border-2 border-amber-300 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-orange-600 rounded"></div>
                <h2 className="text-2xl font-bold text-orange-900">
                  Invoice Details
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderInput(
                  "invoiceTerm",
                  "Invoice Type ",
                  "select",
                  "",
                  true,
                  { choices: ["PI", "SI",] }
                )}
                {renderInput(
                  "invoicePercent",
                  "Invoice Percent  (%)",
                  "number",
                  "",
                  true,
                  { min: 0, max: 100, step: "0.01" }
                )}
                {renderInput("invoiceAmount", "Amount (₹)", "number", "", true, { min: 0, step: "0.01", readOnly: true })}

                {(formData.invoiceTerm === "SI") &&
                  renderInput(
                    "creditDays",
                    "Credit Periods",
                    "number",
                    "",
                    true,
                    {
                      min: 0,
                    }
                  )}

                {renderInput(
                  "mileStone",
                  "MileStone",
                  "select",
                  "",
                  true,
                  { choices: ["INSP CLRNCE", "DISPATCH", "DELIVERY", "OTHER"] }
                )}
                {formData.mileStone === "OTHER" &&
                  renderInput("invoicemileStoneOther", "Other MileStone", "text", "Enter specific MileStone", true)
                }

              </div>
            </div>


            <div className="my-4 ">
              {renderInput(
                "retentionYesNo",
                "Retention",
                "select",
                "",
                true,
                {
                  choices: ["YES", "NO"],
                }
              )}
            </div>

            {(formData?.retentionYesNo === "YES") && (<div className="bg-white p-6 mb-6 rounded-lg border-2 border-amber-300 shadow-sm">
              <h3 className="font-bold text-lg text-amber-800 mb-4">
                💳 Retention
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderInput(
                  "retentionPercent",
                  "Retention Percent  (%)",
                  "number",
                  "",
                  true,
                  { min: 0, max: 100, step: "0.01", readOnly: true }
                )}
                {renderInput(
                  "retentionAmount",
                  "Retention Amount  (₹)",
                  "number",
                  "",
                  false,
                  { min: 0, step: "0.01", readOnly: true }
                )}
                {renderInput(
                  "retentionDocs",
                  "Retention Docs ",
                  "select",
                  "",
                  true,
                  { choices: ["CG", "BG", "N/A", "OTHER"] }
                )}
                {
                  formData.retentionDocs === "OTHER"
                  &&
                  renderInput("retentinoDocsOther", "Other Docs", "text", "Enter Docs", true)
                }
                {renderInput(
                  "retentionPeriod",
                  "Retention days",
                  "number",
                  "",
                  true,
                  { min: 0, step: "0.01", readOnly: false }
                )}
              </div>
            </div>)}
          </section>

          {/* Additional Information Section */}
          <section className="bg-linear-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-indigo-600 rounded"></div>
              <h2 className="text-2xl font-bold text-indigo-900">
                Additional Information
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {renderInput(
                "jobDescription",
                "Job Description",
                "textarea",
                "Enter job description",
                false,
                { rows: 3 }
              )}
              {renderInput(
                "remarks",
                "Remarks",
                "textarea",
                "Enter any additional remarks",
                false,
                { rows: 3 }
              )}
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex justify-center md:justify-center pt-6 border-t-2 border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 disabled:from-pink-400 disabled:to-rose-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
