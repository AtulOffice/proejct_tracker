import React, { useState } from "react";

const YESNO = ["Yes", "No", "NA"];
const ARRANGEMENT = ["Self", "Customer", "NA"];

export default function StartChecklistForm() {
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
    poCollected: "",
    scopeClarityTaken: "",
    scopeUnderstanding: "",
    freeDaysInPO: "",
    estimatedDuration: "",
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
    customerDocuments: {
      pAndIDs: "",
      controlPhilosophy: "",
      anyOther: "",
    },
    dispatchDocuments: {
      packingList: "",
      deliveryChallan: "",
      anyOther: "",
    },
    toolsRequired: {
      basicTools: "",
      multimeter: "",
      signalSource: "",
      hartCalibrator: "",
      ferruleMachine: "",
      anyOther: "",
    },
    readinessConfirmation: "",
    travelArrangementBy: "",
    travelCostBy: "",
    boardingArrangementBy: "",
    boardingCostBy: "",
    gatePassDocsSent: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length === 1) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
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

  const renderEnumSelect = (section, field, label, options = YESNO) => {
    const name = section ? `${section}.${field}` : field;
    const value = section ? formData[section][field] : formData[field];

    return (
      <div key={name} className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-1">
          {label.replace(/([A-Z])/g, " $1")}
        </label>
        <select
          name={name}
          value={value}
          onChange={handleChange}
          className="w-full p-2.5 rounded-lg bg-gradient-to-br from-white to-blue-50 border border-gray-300 text-gray-700 shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
        >
          <option value="">Select Option</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  };

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
        className="w-full p-2.5 rounded-lg bg-gradient-to-br from-white to-indigo-50 border border-gray-300 text-gray-700 shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-10 space-y-10 border border-gray-200">
        {/* Header */}
        <div className="text-center pb-4 border-b border-gray-200">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-2">
            Start Checklist
          </h2>
          <p className="text-gray-600 font-medium">
            Please fill in all required details carefully
          </p>
        </div>

        {/* Sections */}
        <Section title="Basic Information" color="from-blue-500 to-cyan-500">
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
          color="from-purple-500 to-pink-500"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderEnumSelect(null, "poCollected", "PO Collected")}
            {renderEnumSelect(null, "scopeClarityTaken", "Scope Clarity Taken")}
            {renderInput("scopeUnderstanding", "Scope Understanding")}
            {renderInput("freeDaysInPO", "Free Days In PO")}
            {renderInput("estimatedDuration", "Estimated Duration")}
          </div>
        </Section>

        <Section
          title="Internal Design Documents"
          color="from-green-500 to-emerald-500"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(formData.internalDocuments).map((key) =>
              renderEnumSelect("internalDocuments", key, key)
            )}
          </div>
        </Section>

        <Section
          title="Customer Documents"
          color="from-amber-500 to-orange-400"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(formData.customerDocuments).map((key) =>
              renderEnumSelect("customerDocuments", key, key)
            )}
          </div>
        </Section>

        <Section title="Dispatch Documents" color="from-rose-500 to-red-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(formData.dispatchDocuments).map((key) =>
              renderEnumSelect("dispatchDocuments", key, key)
            )}
          </div>
        </Section>

        <Section title="Tools Required" color="from-indigo-500 to-violet-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(formData.toolsRequired).map((key) =>
              renderEnumSelect("toolsRequired", key, key)
            )}
          </div>
        </Section>

        <Section title="Travel & Boarding" color="from-teal-500 to-cyan-500">
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
            {renderEnumSelect(null, "gatePassDocsSent", "Gate Pass Docs Sent")}
          </div>
        </Section>

        {/* Submit */}
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform hover:scale-[1.03]"
          >
            Submit Checklist
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition hover:shadow-md">
      <div
        className={`bg-gradient-to-r ${color} px-5 py-3 border-b border-gray-200 text-white`}
      >
        <h3 className="text-lg font-bold tracking-wide">{title}</h3>
      </div>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
        {children}
      </div>
    </section>
  );
}
