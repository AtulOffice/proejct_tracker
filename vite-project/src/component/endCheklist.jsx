import React, { useState } from "react";

const ENUMVAL = ["YES", "NO", "N/A"];
const PROJECT_STATUS = ["OPEN", "CLOSED"];

export default function EndChecklistForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: "",
    jobNumber: "",
    engineerName: "",
    customerName: "",
    endUser: "",
    site: "",
    poNumber: "",
    poDate: "",
    contactPerson: "",
    contactPersonNumber: "",
    visitStartDate: "",
    visitEndDate: "",
    momNumber: "",
    projectStatus: "",
    momSignedByCustomer: "",
    pendingPoints: "",
    customerRemarks: "",
    completedWithinEstimatedTime: false,
    facedChallenges: false,
    challengeDetails: "",
    completionDocuments: {
      asBuiltDrawings: "",
      finalLogicBackup: "",
      finalScadaBackup: "",
      expenseSettlement: "",
    },
  });

  const handleChange = (e, section, key) => {
    const { name, value, type, checked } = e.target;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
    console.log("Form Submitted:", formData);
  };

  const renderEnumSelect = (
    section,
    key,
    label,
    colorClass,
    options = ENUMVAL
  ) => (
    <div key={key} className="flex flex-col">
      <label className={`text-sm font-semibold mb-1 text-${colorClass}-600`}>
        {label.replace(/([A-Z])/g, " $1")}
      </label>
      <div className="relative group">
        <select
          value={section ? formData[section][key] : formData[key]}
          onChange={(e) => handleChange(e, section, key)}
          className="w-full p-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 outline-none transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 appearance-none cursor-pointer"
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-16 px-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-300 opacity-10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 sm:p-8 space-y-12 border border-white/20">
          {/* Header */}
          <div className="text-center pb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-3xl opacity-20 rounded-full"></div>
            <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-3 tracking-tight relative animate-pulse">
              End Checklist
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <span className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
              <p className="text-sm font-semibold uppercase tracking-wider">
                Submit after Project Completion
              </p>
              <span className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
            </div>
          </div>

          {/* Basic Information */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="bg-white rounded-[1.4rem] p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 rounded-full"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    👤
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-800">
                  Basic Information
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "email",
                  "jobNumber",
                  "engineerName",
                  "customerName",
                  "endUser",
                  "site",
                  "poNumber",
                  "poDate",
                  "contactPerson",
                  "contactPersonNumber",
                  "visitStartDate",
                  "visitEndDate",
                  "momNumber",
                ].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-sm font-semibold text-blue-600 mb-1">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                      type={field.includes("Date") ? "date" : "text"}
                      className="w-full p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 text-gray-700 outline-none transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Project Status */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="bg-white rounded-[1.4rem] p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 blur-xl opacity-50 rounded-full"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    📈
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-800">
                  Project Status
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderEnumSelect(
                  null,
                  "projectStatus",
                  "Project Status",
                  "green",
                  PROJECT_STATUS
                )}
                {renderEnumSelect(
                  null,
                  "momSignedByCustomer",
                  "MOM Signed by Customer",
                  "green"
                )}
              </div>
            </div>
          </section>

          {/* Pending & Remarks */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="bg-white rounded-[1.4rem] p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500 blur-xl opacity-50 rounded-full"></div>
                  <div className="relative bg-gradient-to-br from-orange-500 to-amber-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    📝
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-800">
                  Pending Points & Remarks
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-orange-600 mb-1">
                    Pending Points (if any)
                  </label>
                  <textarea
                    name="pendingPoints"
                    value={formData.pendingPoints}
                    onChange={handleChange}
                    placeholder="Pending Points"
                    className="w-full p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 text-gray-700 outline-none transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:border-orange-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 h-28"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-orange-600 mb-1">
                    Customer Remarks
                  </label>
                  <textarea
                    name="customerRemarks"
                    value={formData.customerRemarks}
                    onChange={handleChange}
                    placeholder="Customer Remarks"
                    className="w-full p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 text-gray-700 outline-none transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:border-orange-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 h-28"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Project Performance */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="bg-white rounded-[1.4rem] p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50 rounded-full"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    ⚡
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-800">
                  Project Performance
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 text-lg font-medium p-2 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400">
                  <input
                    type="checkbox"
                    name="completedWithinEstimatedTime"
                    checked={formData.completedWithinEstimatedTime}
                    onChange={handleChange}
                    className="accent-purple-500 w-5 h-5"
                  />
                  Completed Within Estimated Time
                </label>
                <label className="flex items-center gap-3 text-lg font-medium p-2 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400">
                  <input
                    type="checkbox"
                    name="facedChallenges"
                    checked={formData.facedChallenges}
                    onChange={handleChange}
                    className="accent-pink-500 w-5 h-5"
                  />
                  Faced Challenges
                </label>
              </div>
              {formData.facedChallenges && (
                <div className="flex flex-col mt-4">
                  <label className="text-sm font-semibold text-pink-600 mb-1">
                    Challenge Details
                  </label>
                  <textarea
                    name="challengeDetails"
                    value={formData.challengeDetails}
                    onChange={handleChange}
                    placeholder="Describe challenges faced during project"
                    className="w-full p-3 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 text-gray-700 outline-none transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:border-pink-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 h-28"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Completion Documents */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="bg-white rounded-[1.4rem] p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 rounded-full"></div>
                  <div className="relative bg-gradient-to-br from-indigo-500 to-violet-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    📂
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-800">
                  Completion Documents
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.keys(formData.completionDocuments).map((key) =>
                  renderEnumSelect("completionDocuments", key, key, "indigo")
                )}
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-center pt-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="relative group px-16 py-5 overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center gap-3 text-white font-black text-xl tracking-wide">
                <span className="text-2xl">✨</span>
                <span>Submit End Checklist</span>
                <span className="text-2xl">✨</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
