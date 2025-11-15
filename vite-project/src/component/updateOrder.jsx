import React, { useEffect, useState } from "react";
import { AlertCircle, Save, Loader } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { fetchbyOrderbyId } from "../utils/apiCall";
import { fields } from "../utils/FieldConstant";

export default function UpdateOrderForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState(fields);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const val = await fetchbyOrderbyId(id);

        if (val) {
          const formattedData = {
            ...val,
            bookingDate: val.bookingDate
              ? new Date(val.bookingDate).toISOString().split("T")[0]
              : "",
            orderDate: val.orderDate
              ? new Date(val.orderDate).toISOString().split("T")[0]
              : "",
            deleveryDate: val.deleveryDate
              ? new Date(val.deleveryDate).toISOString().split("T")[0]
              : "",
          };

          setFormData(formattedData);
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


  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "number" && value !== "" ? parseFloat(value) : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };

      if (name === "paymentAdvance" && newValue === "NO") {
        updated.paymentAgainst = "";
        updated.paymentPercent1 = 0;
        updated.paymentAmount1 = 0;
        updated.paymentType1 = "";
        updated.payemntCGBG1 = "";
        updated.paymentrecieved1 = "";

        updated.paymentPercent2 = 0;
        updated.paymentAmount2 = 0;
        updated.paymentType2 = "";
        updated.payemntCGBG2 = "";
        updated.paymentrecieved2 = "";
      }
      if (name === "retentionYesNo" && newValue === "NO") {
        updated.retentionDocs = "";
        updated.retentionPeriod = "";
        updated.retentionPercent = 0;
        updated.retentionAmount = 0;
      }

      if (name === "poReceived" && newValue === "NO") {
        updated.orderNumber = "";
        updated.orderDate = "";
        updated.deleveryDate = "";
      }



      const orderValueSupply = parseFloat(updated.orderValueSupply) || 0;
      const orderValueService = parseFloat(updated.orderValueService) || 0;
      const orderValueTotal = orderValueSupply + orderValueService;

      if (name === "orderValueSupply" || name === "orderValueService") {
        updated.orderValueTotal = orderValueTotal;
      }

      const total = parseFloat(updated.orderValueTotal) || 0;

      if (name === "paymentPercent1" || name === "orderValueTotal") {
        updated.paymentAmount1 =
          ((parseFloat(updated.paymentPercent1) || 0) / 100) * total;
      }

      if (name === "paymentPercent2" || name === "orderValueTotal") {
        updated.paymentAmount2 =
          ((parseFloat(updated.paymentPercent2) || 0) / 100) * total;
      }
      const totalPercent =
        (parseFloat(updated.paymentPercent1) || 0) +
        (parseFloat(updated.paymentPercent2) || 0) +
        (parseFloat(updated.invoicePercent) || 0);


      if (totalPercent <= 100 && updated.retentionYesNo === "YES") {
        const temppercent = 100 - totalPercent;
        updated.retentionPercent = temppercent;
        updated.retentionAmount = ((parseFloat(temppercent) || 0) / 100) * total;
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
      if (isEmpty(formData[field])) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase())} is required`;
      }
    });

    if (isEmpty(formData.jobNumber)) newErrors.jobNumber = "Job Number is required";
    if (isEmpty(formData.client)) newErrors.client = "Client is required";

    if (isEmpty(formData.technicalEmail)) {
      newErrors.technicalEmail = "Email is required";
    } else {
      const email = String(formData.technicalEmail).trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) newErrors.technicalEmail = "Enter a valid email";
    }

    if (formData.bookingDate && formData.orderDate) {
      if (new Date(formData.orderDate) < new Date(formData.bookingDate))
        newErrors.orderDate = "Order Date cannot be before Booking Date";
    }

    if (formData.orderDate && formData.deleveryDate) {
      if (new Date(formData.deleveryDate) < new Date(formData.orderDate))
        newErrors.deleveryDate = "Delivery Date cannot be before Order Date";
    }

    if (isEmpty(formData.bookingDate)) newErrors.bookingDate = "Booking Date is required";
    if (isEmpty(formData.poReceived)) newErrors.poReceived = "PO Received is required";
    if (isEmpty(formData.creditDays)) {
      newErrors.creditDays = "Credit Days is required";
    } else {
      const cd = toNumber(formData.creditDays);
      if (isNaN(cd)) {
        newErrors.creditDays = "Enter a valid number";
      } else if (cd <= 0) {
        newErrors.creditDays = "Credit Period must be greater than zero";
      }
    }


    if (isEmpty(formData.invoiceTerm)) newErrors.invoiceTerm = "Invoice Type is required";

    if (isEmpty(formData.invoicePercent)) newErrors.invoicePercent = "Invoice percent is required";
    else {
      const inv = toNumber(formData.invoicePercent);
      if (isNaN(inv) || inv < 0 || inv > 100) newErrors.invoicePercent = "Invoice percent must be between 0 and 100";
    }

    if (isEmpty(formData.mileStone)) newErrors.mileStone = "Milestone is required";

    if (isEmpty(formData.paymentAdvance)) newErrors.paymentAdvance = "Payment Advance selection is required";


    const supply = Number(formData.orderValueSupply);
    const service = Number(formData.orderValueService);
    if (touched.orderValueSupply) {
      if (isNaN(supply)) {
        newErrors.orderValueSupply = "Enter a valid number";
      }
    }

    if (touched.orderValueService) {
      if (isNaN(service)) {
        newErrors.orderValueService = "Enter a valid number";
      }
    }
    if ((touched.orderValueSupply || touched.orderValueService)
      && !isNaN(supply)
      && !isNaN(service)) {

      if (supply + service <= 0) {
        newErrors.orderValueSupply = "Total must be greater than zero";
        newErrors.orderValueService = "Total must be greater than zero";
      }
    }
    if (String(formData.poReceived).toUpperCase() === "YES") {
      if (isEmpty(formData.orderNumber)) newErrors.orderNumber = "PO number is required";
      if (isEmpty(formData.orderDate)) newErrors.orderDate = "PO order date is required";
      if (isEmpty(formData.deleveryDate)) newErrors.deleveryDate = "PO delivery date is required";
    }

    if (String(formData.paymentAdvance).toUpperCase() === "YES") {
      if (isEmpty(formData.paymentAgainst)) newErrors.paymentAgainst = "Payment against is required";

      const p1 = toNumber(formData.paymentPercent1);
      const p2 = toNumber(formData.paymentPercent2);

      if (isNaN(p1)) newErrors.paymentPercent1 = "Payment Percent 1 is required";
      else if (p1 < 0 || p1 > 100) newErrors.paymentPercent1 = "Percent must be between 0 and 100";

      if (isNaN(p2)) {
        newErrors.paymentPercent2 = "Payment Percent 2 is required";
      } else if (p2 < 0 || p2 > 100) newErrors.paymentPercent2 = "Percent must be between 0 and 100";

      if (p1 > 0 && isEmpty(formData.paymentType1)) newErrors.paymentType1 = "Milestone for payment 1 is required";
      if (p1 > 0 && isEmpty(formData.payemntCGBG1)) newErrors.payemntCGBG1 = "Payment CG/BG (1) is required";
      if (p1 > 0 && isEmpty(formData.paymentrecieved1)) newErrors.paymentrecieved1 = "Payment status (1) is required";

      if (p2 > 0) {
        if (isEmpty(formData.paymentType2)) newErrors.paymentType2 = "Milestone for payment 2 is required";
        if (isEmpty(formData.payemntCGBG2)) newErrors.payemntCGBG2 = "Payment CG/BG (2) is required";
        if (isEmpty(formData.paymentrecieved2)) newErrors.paymentrecieved2 = "Payment status (2) is required";
      }

      const inv = toNumber(formData.invoicePercent) || 0;
      const totalPercent = (isNaN(p1) ? 0 : p1) + (isNaN(p2) ? 0 : p2) + inv;
      if (totalPercent > 100) newErrors.paymentPercent2 = "Total payment/invoice percentage cannot exceed 100%";
    }


    if (isEmpty(formData.retentionYesNo)) {
      newErrors.retentionYesNo = "Retention selection is required";
    } else if (String(formData.retentionYesNo).toUpperCase() === "YES") {
      if (isEmpty(formData.retentionDocs)) newErrors.retentionDocs = "Retention docs are required";
      if (isEmpty(formData.retentionPeriod)) newErrors.retentionPeriod = "Retention period is required";

      const rPercent = toNumber(formData.retentionPercent);
      if (isNaN(rPercent)) newErrors.retentionPercent = "Retention percent is required";
      else if (rPercent < 0 || rPercent > 100) newErrors.retentionPercent = "Retention percent must be between 0 and 100";
    }

    if (isEmpty(formData.concerningSalesManager))
      newErrors.concerningSalesManager = "Account Manager is required";

    const p1s = toNumber(formData.paymentPercent1) || 0;
    const p2s = toNumber(formData.paymentPercent2) || 0;
    const invPercent = toNumber(formData.invoicePercent) || 0;
    if (p1s + p2s + invPercent > 100) {
      newErrors.paymentPercent2 = "Total percentage (payments + invoice) cannot exceed 100%";
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
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/order/update/${id}`,
          formData
        );
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


  const renderInput = (
    name,
    label,
    type = "text",
    placeholder = "",
    required = false,
    options = {}
  ) => {
    const hasError = touched[name] && errors[name];

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
              : "border-purple-200 bg-gradient-to-br from-blue-50 to-purple-50 hover:border-purple-300"
              }`}
          >
            <option value="">
              {options.placeholder || "Select an option"}
            </option>
            {options.choices?.map((choice) => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
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
              : "border-purple-200 bg-gradient-to-br from-indigo-50 to-purple-50 hover:border-purple-300"
              }`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            onWheel={(e) => {
              if (type === "number") {
                e.target.blur();
              }
            }}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (type === "number" && e.key === "-") e.preventDefault();
            }}
            min={options.min ?? 0}
            max={options.max}
            step={options.step}
            readOnly={options.readOnly}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 font-medium ${hasError
              ? "border-red-500 bg-red-50"
              : options.readOnly
                ? "border-purple-200 bg-gradient-to-br from-gray-100 to-purple-50 cursor-not-allowed text-gray-600"
                : "border-purple-200 bg-gradient-to-br from-pink-50 to-purple-50 hover:border-purple-300"
              }`}
          />
        )}
        {hasError && (
          <p className="mt-2 text-sm !text-red-600 flex items-center gap-1 font-semibold">
            <AlertCircle size={14} /> {errors[name]}
          </p>
        )}
      </div>
    );
  };


  return (
    <div className="transition-all duration-300  pt-16 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mt-6 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-6xl border border-white/30">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white drop-shadow-md">
          {formData?.client || ""}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
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
              {renderInput(
                "concerningSalesManager",
                "Account Manager",
                "text",
                "Enter sales manager name",
                true
              )}
              {renderInput(
                "technicalEmail",
                "Client Technical Email",
                "email",
                "Enter technical person email id",
                true
              )}
              {renderInput(
                "name",
                "Name",
                "text",
                "Enter Name",

              )}
              {renderInput(
                "email",
                "Email",
                "email",
                "Enter Email",
              )}
              {renderInput(
                "phone",
                "Contact No.",
                "text",
                "Enter Contact Number",

              )}
              {renderInput("status", "Status", "select", "", false, {
                choices: ["OPEN", "CLOSED"],
                placeholder: "Select Status",
              })}


            </div>
          </section>

          {/* Financial Information Section */}
          <section className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
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
              {/* this is start */}

              {renderInput(
                "salesBasic",
                "Sales Basic (₹)",
                "number",
                "",
                false,
                { min: 0, step: "0.01" }
              )}
              {renderInput(
                "salesTotal",
                "Sales Total (₹)",
                "number",
                "",
                false,
                { min: 0, step: "0.01" }
              )}
              {renderInput(
                "netOrderValue",
                "Net Order Value (₹)",
                "number",
                "",
                false,
                { step: "0.01" }
              )}
              {/* {renderInput(
                  "billPending",
                  "Bill Pending (₹)",
                  "number",
                  "",
                  false,
                  { min: 0, step: "0.01" }
                )} */}
              {/*  this is end*/}
              {/* {renderInput(
                  "billingStatus",
                  "Billing Status",
                  "select",
                  "",
                  false,
                  { choices: ["TBB", "ALL BILLED"] }
                )} */}
            </div>
          </section>
          {/* Order Details Section */}
          <section className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
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
                </>
              )}


              {renderInput(
                "formalOrderStatus",
                "Formal Order Status",
                "select",
                "",
                false,
                { choices: ["RECEIVED", "PENDING"] }
              )}

              {renderInput("actualDeleveryDate", "actual Delevery Date", "date")}

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
              {/* {renderInput(
                  "dispatchStatus",
                  "Dispatch Status",
                  "select",
                  "",
                  false,
                  { choices: ["DISPATCHED", "LD APPLIED", "URGENT"] }
                )} */}
            </div>
          </section>

          {/* Payment Information Section */}
          <section className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-lg border border-cyan-200 shadow-sm hover:shadow-md transition-shadow">
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
                  choices: ["YES", "NO"],
                }
              )}
            </div>

            {/* Payment Stage 1 */}
            {formData.paymentAdvance === "YES" && (
              <>

                <div className="mb-6">
                  {renderInput(
                    "paymentAgainst",
                    "Payment against PI/DISPATCH",
                    "text",
                    "Enter payment against details",
                    true
                  )}
                </div>
                <div className="bg-white p-6 rounded-lg mb-6 border-2 border-cyan-300 shadow-sm">
                  <h3 className="font-bold text-lg text-cyan-800 mb-4">
                    💳 Advance Terms 1
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderInput(
                      "paymentPercent1",
                      "Payment Percent (%)",
                      "number",
                      "",
                      true,
                      { min: 0, max: 100, step: "0.01" }
                    )}
                    {renderInput(
                      "paymentAmount1",
                      "Payment Amount  (₹)",
                      "number",
                      "",
                      true,
                      { min: 0, step: "0.01", readOnly: true }
                    )}
                    {renderInput(
                      "paymentType1",
                      "MileStone",
                      "select",
                      "",
                      true,
                      { choices: ["A/W ABG", "A/W PI", "A/W PO/OA/DWG", "OTHER"] }
                    )}
                    {renderInput(
                      "payemntCGBG1",
                      "Payment CG/BG ",
                      "select",
                      "",
                      true,
                      { choices: ["YES", "NO"] }
                    )}

                    {renderInput(
                      "paymentrecieved1",
                      "Payment status",
                      "select",
                      "",
                      true,
                      { choices: ["RECIEVED", "NOT RECIEVED"] }
                    )}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg mb-6 border-2 border-cyan-300 shadow-sm">
                  <h3 className="font-bold text-lg text-cyan-800 mb-4">
                    💳 Advance Terms 2
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderInput(
                      "paymentPercent2",
                      "Payment Percent (%)",
                      "number",
                      "",
                      true,
                      { min: 0, max: 100, step: "0.01" }
                    )}
                    {renderInput(
                      "paymentAmount2",
                      "Payment Amount  (₹)",
                      "number",
                      "",
                      false,
                      { min: 0, step: "0.01", readOnly: true }
                    )}
                    {renderInput(
                      "paymentType2",
                      "MileStone",
                      "select",
                      "",
                      formData.paymentPercent2 > 0,
                      { choices: ["A/W ABG", "A/W PI", "A/W PO/OA/DWG", "OTHER"] }
                    )}
                    {renderInput(
                      "payemntCGBG2",
                      "Payment CG/BG ",
                      "select",
                      "",
                      formData.paymentPercent2 > 0,
                      { choices: ["YES", "NO"] }
                    )}

                    {renderInput(
                      "paymentrecieved2",
                      "Payment status",
                      "select",
                      "",
                      formData.paymentPercent2 > 0,
                      { choices: ["RECIEVED", "NOT RECIEVED"] }
                    )}
                  </div>
                </div>
              </>
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
                  { choices: ["PI", "SI", "N/A"] }
                )}
                {renderInput(
                  "invoicePercent",
                  "Invoice Percent  (%)",
                  "number",
                  "",
                  true,
                  { min: 0, max: 100, step: "0.01" }
                )}
                {renderInput(
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
                  { choices: ["INSP CLRNCE", "DISPATCH", "DELEVERY", "OTHER"] }
                )}
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
                  { min: 0, max: 100, step: "0.01" }
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
                  { choices: ["CG", "BG", "N/A"] }
                )}
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
          <section className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
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
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 disabled:from-pink-400 disabled:to-rose-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
