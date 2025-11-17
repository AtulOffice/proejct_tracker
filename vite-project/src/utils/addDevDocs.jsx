import React, { useState } from "react";
import { CheckCircle, FileText, Package, Users } from "lucide-react";
const ENUMVAL = ["YES", "NO", "N/A"];

const FIELD_LABELS = {
  internalDocuments: {
    panelGA: "Panel GA",
    wiringDiagram: "Wiring Diagram",
    ioList: "I/O List",
    systemConfiguration: "System Configuration",
    cableSchedule: "Cable Schedule",
    logicSchedule: "Logic Schedule",
    logicBackup: "Logic Backup",
    scada: "SCADA",
  },
  customerDocuments: {
    pAndIDs: "P&IDs",
    controlPhilosophy: "Control Philosophy",
    anyOther: "Any Other",
  },
  dispatchDocuments: {
    packingList: "Packing List",
    deliveryChallan: "Delivery Challan",
    anyOther: "Any Other",
  },
  completionDocuments: {
    asBuiltDrawings: "As Built",
    finalLogicBackup: "Final Logic Backup",
    finalScadaBackup: "Final Scada Backup",
    expenseSettlement: "ExpenseSettlement",
  },
};

const DocumentsSection = ({ Docs, setDocs }) => {
  const calculateProgress = () => {
    const allFields = [
      ...Object.values(Docs.internalDocuments),
      ...Object.values(Docs.customerDocuments),
      ...Object.values(Docs.dispatchDocuments),
      ...Object.values(Docs.completionDocuments),
    ];
    const filled = allFields.filter(Boolean).length;
    return Math.round((filled / allFields.length) * 100);
  };

  const getSectionProgress = (section) => {
    const fields = Object.values(Docs[section]);
    const filled = fields.filter(Boolean).length;
    return { filled, total: fields.length };
  };

  const handleChange = (section, field, value) => {
    setDocs((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const renderRadioGroup = (section, field, label) => {
    const value = Docs[section][field];
    return (
      <div
        key={`${section}-${field}`}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/60 p-3 sm:p-4 rounded-xl mb-3 border border-gray-200 transition-all duration-200 hover:shadow-md"
      >
        <label className="text-sm font-semibold text-gray-800 flex items-center gap-3 mb-2 sm:mb-0">
          {value ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
          )}
          {label}
        </label>
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-start sm:justify-end">
          {ENUMVAL.map((val) => (
            <label
              key={val}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold cursor-pointer transition-all duration-200 ${Docs[section][field] === val
                  ? val === "YES"
                    ? "bg-emerald-500 text-white"
                    : val === "NO"
                      ? "bg-rose-500 text-white"
                      : "bg-amber-500 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              <input
                type="radio"
                name={`${section}-${field}`}
                value={val}
                checked={Docs[section][field] === val}
                onChange={() => handleChange(section, field, val)}
                className="sr-only"
              />
              {val}
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderSection = (sectionKey, icon, gradientColors) => {
    const { filled, total } = getSectionProgress(sectionKey);
    const progress = total > 0 ? Math.round((filled / total) * 100) : 0;

    return (
      <section className="mb-8 bg-white/70 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${gradientColors}`}
            >
              {icon}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-blue-600">
              {filled}/{total}
            </div>
            <div className="relative w-28 sm:w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${gradientColors}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {Object.keys(Docs[sectionKey] || {}).map((field) =>
            renderRadioGroup(
              sectionKey,
              field,
              FIELD_LABELS?.[sectionKey]?.[field] || field
            )
          )}
        </div>
      </section>
    );
  };

  const progress = calculateProgress();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-purple-100 via-purple-100 to-pink-100 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side: full height section */}
          <div className="flex flex-col">
            {renderSection(
              "internalDocuments",
              <FileText className="w-6 h-6 text-white" />,
              "from-blue-500 to-cyan-500"
            )}
          </div>

          {/* Right side: two equal stacked cards */}
          <div className="flex flex-col justify-between gap-6">
            {renderSection(
              "customerDocuments",
              <Users className="w-6 h-6 text-white" />,
              "from-purple-500 to-pink-500"
            )}
            {renderSection(
              "dispatchDocuments",
              <Package className="w-6 h-6 text-white" />,
              "from-amber-500 to-orange-500"
            )}
          </div>

          {/* Full-width third card below */}
          <div className="lg:col-span-2">
            {renderSection(
              "completionDocuments",
              <FileText className="w-5 h-5 text-white" />,
              "from-green-400 to-green-500"
            )}
          </div>
        </div>

        <footer className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200 text-center sm:text-left">
          <p className="text-sm">
            {progress === 100 ? (
              <span className="text-emerald-600 font-bold flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle className="w-5 h-5" />
                All documents verified successfully!
              </span>
            ) : (
              <span className="flex items-center justify-center sm:justify-start gap-2 text-gray-700">
                <span className="font-semibold">
                  {100 - progress}% remaining to complete
                </span>
              </span>
            )}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DocumentsSection;
