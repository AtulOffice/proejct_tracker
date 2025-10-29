import React, { useState } from "react";

const YESNO = ["Yes", "No", "NA"];
const ARRANGEMENT = ["Self", "Customer", "NA"];

export default function StartChecklistForm() {
  const [formData, setFormData] = useState({
    // 🔹 Basic Info
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

    // 🔹 Understanding & Scope
    poCollected: "",
    scopeClarityTaken: "",
    scopeUnderstanding: "",
    freeDaysInPO: "",
    estimatedDuration: "",

    // 🔹 Internal Design Documents
    internalDocuments: {
      panelGA: "",
      wiringDiagram: "",
      ioList: "",
      systemConfiguration: "",
      cableSchedule: "",
      logicSchedule: "",
      logicBackup: "",
      scada: "",
    },

    // 🔹 Customer Documents
    customerDocuments: {
      pAndIDs: "",
      controlPhilosophy: "",
      anyOther: "",
    },

    // 🔹 Dispatch Documents
    dispatchDocuments: {
      packingList: "",
      deliveryChallan: "",
      anyOther: "",
    },

    // 🔹 Tools Required
    toolsRequired: {
      basicTools: "",
      multimeter: "",
      signalSource: "",
      hartCalibrator: "",
      ferruleMachine: "",
      anyOther: "",
    },

    // 🔹 Readiness & Travel / Boarding
    readinessConfirmation: "",
    travelArrangementBy: "",
    travelCostBy: "",
    boardingArrangementBy: "",
    boardingCostBy: "",
    gatePassDocsSent: "",
  });

  // ✅ Unified change handler for both top-level & nested fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length === 1) {
      // Top-level key
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      // Nested object (e.g. internalDocuments.panelGA)
      const [section, field] = keys;
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("✅ Form submitted:", formData);
  };

  // 🔹 Dropdown generator (auto-detects nested names)
  const renderEnumSelect = (section, field, label, options = YESNO) => {
    const name = section ? `${section}.${field}` : field;
    const value = section ? formData[section][field] : formData[field];

    return (
      <div key={name} className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-1">
          {label.replace(/([A-Z])/g, " $1")}
        </label>
        <div className="relative group">
          <select
            name={name}
            value={value}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 outline-none transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:border-indigo-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 appearance-none cursor-pointer"
          >
            <option value="">Select Option</option>
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
  };

  // 🔹 Input generator (for text/date fields)
  const renderInput = (name, label, type = "text") => (
    <div key={name} className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-1">
        {label.replace(/([A-Z])/g, " $1")}
      </label>
      <input
        name={name}
        value={formData[name]}
        onChange={handleChange}
        type={type}
        placeholder={`Enter ${label}`}
        className="w-full p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 text-gray-700 outline-none transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-16 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 space-y-12 border border-white/20">
          {/* Header */}
          <div className="text-center pb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-3xl opacity-20 rounded-full"></div>
            <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-3 tracking-tight relative animate-pulse">
              Start Checklist
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <span className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
              <p className="text-sm font-semibold uppercase tracking-wider">
                Fill Out All Details
              </p>
              <span className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
            </div>
          </div>

          {/* Sections */}
          <Section
            title="Basic Information"
            icon="👤"
            gradient="from-blue-500 to-cyan-500"
          >
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
              ].map((field) =>
                renderInput(
                  field,
                  field,
                  field.includes("Date") ? "date" : "text"
                )
              )}
            </div>
          </Section>

          <Section
            title="Understanding & Scope"
            icon="🎯"
            gradient="from-purple-500 to-pink-500"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderEnumSelect(null, "poCollected", "PO Collected")}
              {renderEnumSelect(
                null,
                "scopeClarityTaken",
                "Scope Clarity Taken"
              )}
              {renderInput("scopeUnderstanding", "Scope Understanding")}
              {renderInput("freeDaysInPO", "Free Days In PO")}
              {renderInput("estimatedDuration", "Estimated Duration")}
            </div>
          </Section>

          <Section
            title="Internal Design Documents"
            icon="📋"
            gradient="from-green-500 to-emerald-500"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.keys(formData.internalDocuments).map((key) =>
                renderEnumSelect("internalDocuments", key, key)
              )}
            </div>
          </Section>

          <Section
            title="Customer Documents"
            icon="📑"
            gradient="from-orange-500 to-amber-500"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.keys(formData.customerDocuments).map((key) =>
                renderEnumSelect("customerDocuments", key, key)
              )}
            </div>
          </Section>

          <Section
            title="Dispatch Documents"
            icon="📦"
            gradient="from-red-500 to-rose-500"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.keys(formData.dispatchDocuments).map((key) =>
                renderEnumSelect("dispatchDocuments", key, key)
              )}
            </div>
          </Section>

          <Section
            title="Tools Required"
            icon="🔧"
            gradient="from-indigo-500 to-violet-500"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.keys(formData.toolsRequired).map((key) =>
                renderEnumSelect("toolsRequired", key, key)
              )}
            </div>
          </Section>

          <Section
            title="Travel & Boarding"
            icon="✈️"
            gradient="from-teal-500 to-cyan-500"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderEnumSelect(
                null,
                "readinessConfirmation",
                "Readiness Confirmation"
              )}
              {renderEnumSelect(
                null,
                "travelArrangementBy",
                "Travel Arrangement By",
                ARRANGEMENT
              )}
              {renderEnumSelect(
                null,
                "travelCostBy",
                "Travel Cost By",
                ARRANGEMENT
              )}
              {renderEnumSelect(
                null,
                "boardingArrangementBy",
                "Boarding Arrangement By",
                ARRANGEMENT
              )}
              {renderEnumSelect(
                null,
                "boardingCostBy",
                "Boarding Cost By",
                ARRANGEMENT
              )}
              {renderEnumSelect(
                null,
                "gatePassDocsSent",
                "Gate Pass Docs Sent"
              )}
            </div>
          </Section>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="button"
              onClick={handleSubmit}
              className="relative group px-16 py-5 overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center gap-3 text-white font-black text-xl tracking-wide">
                <span>✨</span>
                <span>Submit Checklist</span>
                <span>✨</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔹 Reusable Section Wrapper
function Section({ title, icon, gradient, children }) {
  return (
    <section
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-1 shadow-xl hover:shadow-2xl transition-all duration-300 group`}
    >
      <div className="bg-white rounded-[1.4rem] p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div
              className={`absolute inset-0 ${
                gradient.split(" ")[0]
              } blur-xl opacity-50 rounded-full`}
            ></div>
            <div
              className={`relative bg-gradient-to-br ${gradient} text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}
            >
              {icon}
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-800">{title}</h3>
        </div>
        {children}
      </div>
    </section>
  );
}
