import React, { useEffect, useState } from "react";
import { AlertCircle, Save, Loader } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { fields } from "../utils/FieldConstant";

export default function OrderForm() {
  const [formData, setFormData] = useState({
    entityType: "",
    soType: "",
    jobNumber: "",
    orderNumber: "",
    bookingDate: "",
    client: "",
    technicalEmail: "",
    site: "",
    endUser: "",
    orderDate: "",
    deleveryDate: "",
    formalOrderStatus: "",
    amndReqrd: "",
    orderValueSupply: 0,
    orderValueService: 0,
    orderValueTotal: 0,
    cancellation: "",
    netOrderValue: 0,
    paymentAgainst: "",
    paymentAdvance: "",
    paymentPercent1: 0,
    paymentType1: "",
    payemntCGBG1: "",
    paymentrecieved1: "",
    paymentAmount1: 0,
    paymentPercent2: 0,
    paymentType2: "",
    payemntCGBG2: "",
    paymentAmount2: 0,
    paymentrecieved2: "",
    retentionPercent: 0,
    retentionAmount: 0,
    retentionDocs: "",
    retentionPeriod: "",
    status: "OPEN",
    creditDays: 0,
    dispatchStatus: "",
    salesBasic: 0,
    salesTotal: 0,
    billPending: 0,
    billingStatus: "",
    jobDescription: "",
    remarks: "",
    concerningSalesManager: "",
    poReceived: "",
    invoiceTerm: "",
    invoicePercent: "",
    mileStone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [debounceJobnumber, setdebounceJobNumber] = useState("");

  useEffect(() => {
    const handelJob = setTimeout(() => {
      setdebounceJobNumber(formData.jobNumber);
    }, 2000);
    return () => clearTimeout(handelJob);
  }, [formData.jobNumber]);

  useEffect(() => {
    if (debounceJobnumber.length > 2) {
      const firstChar = debounceJobnumber[0].toUpperCase();
      const secondChar = debounceJobnumber[1].toUpperCase();

      const entityMap = {
        N: "SI NOIDA",
        S: "SI DELHI",
        P: "SI PUNE",
        M: "MS DELHI",
      };

      const soTypeMap = {
        P: "PROJECT",
        A: "AMC",
        R: "SERVICE",
      };
      const updated = {};
      if (entityMap[firstChar]) {
        updated.entityType = entityMap[firstChar];
      }
      if (soTypeMap[secondChar]) {
        updated.soType = soTypeMap[secondChar];
      }

      if (Object.keys(updated).length > 0) {
        setFormData((prev) => ({ ...prev, ...updated }));
      }
    }
  }, [debounceJobnumber]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "number" && value !== "" ? parseFloat(value) : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };

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
    const requiredSelects = [
      "entityType",
      "soType",
      // "cancellation",
      // "formalOrderStatus",
      // "amndReqrd",
      // "dispatchStatus",
      "billingStatus",
    ];

    requiredSelects.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} is required`;
      }
    });

    if (!formData.jobNumber.trim())
      newErrors.jobNumber = "Job Number is required";
    if (!formData.technicalEmail.trim())
      newErrors.technicalEmail = "Email is required";

    if (!formData?.client?.trim()) newErrors.client = "Client is required";

    if (formData.bookingDate && formData.orderDate) {
      if (new Date(formData.orderDate) < new Date(formData.bookingDate)) {
        newErrors.orderDate = "Order Date cannot be before Booking Date";
      }
    }

    if (!formData.bookingDate) {
      newErrors.bookingDate = "Booking Date is required";
    }
    if (!formData.poReceived) {
      newErrors.bookingDate = "this field is required";
    }
    if (!formData.concerningSalesManager) {
      newErrors.concerningSalesManager = "sales Manager is required";
    }

    if (formData.orderDate && formData.deleveryDate) {
      if (new Date(formData.deleveryDate) < new Date(formData.orderDate)) {
        newErrors.deleveryDate = "Delivery Date cannot be before Order Date";
      }
    }

    if (formData.paymentPercent1 + formData.paymentPercent2 > 100) {
      newErrors.paymentPercent2 = "Total payment percentage cannot exceed 100%";
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
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/order/save`,
          formData
        );
        if (response.data) {
          toast.success("data saved successfully");
          setFormData(fields);
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
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 font-medium ${
              hasError
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
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 resize-none font-medium ${
              hasError
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
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 font-medium ${
              hasError
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
    <div className="transition-all duration-300 lg:ml-64 pt-16 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mt-6 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-6xl border border-white/30">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white drop-shadow-md">
          New Order
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
              {renderInput("bookingDate", "Booking Date", "date", "", true)}
              {renderInput("status", "Status", "select", "", false, {
                choices: ["OPEN", "CLOSED"],
                placeholder: "Select Status",
              })}
              {renderInput(
                "concerningSalesManager",
                "Sales Manager",
                "text",
                "Enter sales manager name",
                true
              )}
              {renderInput(
                "technicalEmail",
                "Technical Email",
                "email",
                "Enter technical person email id",
                true
              )}
            </div>
          </section>

          {/* Client Information Section */}
          {/* <section className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-green-600 rounded"></div>
              <h2 className="text-2xl font-bold text-green-900">
                Client Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             
            </div>
          </section> */}

          {/* Order Details Section */}
          <section className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-purple-600 rounded"></div>
              <h2 className="text-2xl font-bold text-purple-900">
                Order Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderInput("poReceived", "PO Received", "select", "", true, {
                choices: ["YES", "NO"],
              })}

              {formData.poReceived === "YES" && (
                <>
                  {renderInput("orderNumber", "PO Number", "text")}
                  {renderInput("orderDate", "PO Order Date", "date")}
                  {renderInput("deleveryDate", "PO Delivery Date", "date")}
                </>
              )}

              {renderInput(
                "orderValueSupply",
                "Order Value - Supply (₹)",
                "number",
                "",
                false,
                { min: 0, step: "0.01" }
              )}
              {renderInput(
                "orderValueService",
                "Order Value - Service (₹)",
                "number",
                "",
                false,
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

              {renderInput(
                "formalOrderStatus",
                "Formal Order Status",
                "select",
                "",
                false,
                { choices: ["RECEIVED", "PENDING"] }
              )}
              {renderInput(
                "amndReqrd",
                "Amendment Required",
                "select",
                "",
                false,
                { choices: ["RECEIVED", "PENDING"] }
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

          {/* Financial Information Section */}
          <section className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-orange-600 rounded"></div>
              <h2 className="text-2xl font-bold text-orange-900">
                Financial Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderInput(
                "netOrderValue",
                "Net Order Value (₹)",
                "number",
                "",
                false,
                { step: "0.01" }
              )}
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
                "billPending",
                "Bill Pending (₹)",
                "number",
                "",
                false,
                { min: 0, step: "0.01" }
              )}
              {renderInput(
                "billingStatus",
                "Billing Status",
                "select",
                "",
                false,
                { choices: ["TBB", "ALL BILLED"] }
              )}
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

            <div className="mb-6">
              {renderInput(
                "paymentAgainst",
                "Payment against PI/DISPATCH",
                "text",
                "Enter payment against details",
                true
              )}
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
                      "paymentType1",
                      "Payment Type ",
                      "select",
                      "",
                      true,
                      { choices: ["A/W ABG", "A/W PI", "A/W PO/OA/DWG"] }
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
                      "paymentAmount1",
                      "Payment Amount  (₹)",
                      "number",
                      "",
                      true,
                      { min: 0, step: "0.01", readOnly: true }
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
                      "paymentType2",
                      "Payment Type ",
                      "select",
                      "",
                      true,
                      { choices: ["A/W ABG", "A/W PI", "A/W PO/OA/DWG"] }
                    )}
                    {renderInput(
                      "payemntCGBG2",
                      "Payment CG/BG ",
                      "select",
                      "",
                      formData?.paymentPercent1 > 0,
                      { choices: ["YES", "NO"] }
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
                      "paymentrecieved2",
                      "Payment status",
                      "select",
                      "",
                      formData?.paymentPercent1 > 0,
                      { choices: ["RECIEVED", "NOT RECIEVED"] }
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Payment Stage 2 */}
            <div className="bg-white p-6 mb-6 rounded-lg border-2 border-amber-300 shadow-sm">
              <h3 className="font-bold text-lg text-amber-800 mb-4">
                💳 Retention Amount 2
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
                  true,
                  { min: 0, step: "0.01", readOnly: true }
                )}
                {renderInput(
                  "retentionDocs",
                  "Retention Docs ",
                  "select",
                  "",
                  true,
                  { choices: ["YES", "NO", "N/A"] }
                )}
                {renderInput(
                  "retentionPeriod",
                  "Payment Periods(days)",
                  "number",
                  "",
                  true,
                  { min: 0, step: "0.01", readOnly: false }
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-amber-300 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-orange-600 rounded"></div>
                <h2 className="text-2xl font-bold text-orange-900">
                  Other Details
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  "invoiceTerm",
                  "Invoice Term ",
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
                  "mileStone",
                  "MileStone",
                  "text",
                  "Enter Mile Stone",
                  true
                )}
              </div>
            </div>
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
