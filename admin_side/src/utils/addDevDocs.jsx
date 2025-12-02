import React from "react";
import { CheckCircle, FileText, Package, Users } from "lucide-react";

const ENUMVAL = ["YES", "NO", "N/A"];

const FIELD_TYPES = {
  CustomerDevDocuments: "CUSTOMER",
  SIEVPLDevDocuments: "SIEVPL",
  swDevDocumentsforFat: "SWFAT",
  inspectionDocuments: "INSPECTION",
  dispatchDocuments: "DISPATCH",
  PostCommisionDocuments: "POSTCOMM",
};

const inputClass =
  "border border-gray-300 p-3 rounded-md w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300";

const DocumentsSection = ({ Docs, setDocs }) => {
  /* ------------------------------------------------------------------ */
  /* 🔄 UPDATE FIELD (Support for normal & array-based dispatch section) */
  /* ------------------------------------------------------------------ */
  const updateField = (section, field, key, value, index = null) => {
    setDocs((prev) => {
      const updated = { ...prev };

      // For dispatch array
      if (Array.isArray(updated[section]) && index !== null) {
        updated[section][index] = {
          ...updated[section][index],
          [field]: {
            ...updated[section][index][field],
            [key]: value,
          },
        };
        return updated;
      }

      // Normal object sections
      updated[section] = {
        ...updated[section],
        [field]: {
          ...updated[section][field],
          [key]: value,
        },
      };

      return updated;
    });
  };

  /* ------------------------- DOCUMENT PROGRESS ------------------------ */
  const countValues = (obj) => {
    let total = 0;
    let filled = 0;

    const scan = (item) => {
      if (!item) return;

      if (typeof item === "object" && item !== null && "value" in item) {
        total++;
        if (item.value) filled++;
      }

      if (Array.isArray(item)) item.forEach(scan);
      else if (typeof item === "object") Object.values(item).forEach(scan);
    };

    scan(obj);
    return { filled, total };
  };

  const calculateProgress = () => {
    const { filled, total } = countValues(Docs);
    return total ? Math.round((filled / total) * 100) : 0;
  };

  /* -------------------------- RADIO BUTTONS --------------------------- */
  const renderRadios = (section, field, item, index = null) => {
    const value = item?.value || "";

    return (
      <div className="flex space-x-2 rounded-full bg-gray-100 p-1 shadow-inner ring-1 ring-gray-300">
        {ENUMVAL.map((val) => {
          const isActive = value === val;
          return (
            <label
              key={val}
              className={`flex-1 text-center cursor-pointer rounded-full py-2 px-4 font-semibold transition select-none
                ${isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-400/50"
                  : "text-gray-700 hover:bg-blue-100 shadow-sm hover:scale-[1.05]"
                }
              `}
            >
              <input
                type="radio"
                className="sr-only"
                name={`${section}-${field}-${index ?? ""}`}
                checked={isActive}
                onChange={() =>
                  updateField(section, field, "value", val, index)
                }
              />
              {val}
            </label>
          );
        })}
      </div>
    );
  };

  /* -------------------------- RENDER SECTIONS -------------------------- */
  const renderCustomerDev = (section, field, item) => (
    <div className="space-y-4 ml-7">
      {renderRadios(section, field, item)}

      <input
        type="date"
        value={item.date || ""}
        onChange={(e) => updateField(section, field, "date", e.target.value)}
        className={inputClass}
        placeholder="Select date"
      />

      {"name" in item && (
        <input
          type="text"
          placeholder="Name"
          value={item.name}
          onChange={(e) => updateField(section, field, "name", e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  );

  const renderSIEVPL = (section, field, item) => (
    <div className="space-y-4 ml-7">
      {renderRadios(section, field, item)}

      <input
        type="date"
        value={item.date || ""}
        onChange={(e) => updateField(section, field, "date", e.target.value)}
        className={inputClass}
        placeholder="Select date"
      />

      <input
        type="text"
        placeholder="Version"
        value={item.version}
        onChange={(e) => updateField(section, field, "version", e.target.value)}
        className={inputClass}
      />
    </div>
  );

  const renderSwFat = (section, field, item) => (
    <div className="space-y-4 ml-7">
      {renderRadios(section, field, item)}

      <input
        type="date"
        value={item.date || ""}
        onChange={(e) => updateField(section, field, "date", e.target.value)}
        className={inputClass}
        placeholder="Select date"
      />

      <input
        type="text"
        placeholder="Version"
        value={item.version}
        onChange={(e) => updateField(section, field, "version", e.target.value)}
        className={inputClass}
      />
    </div>
  );

  const renderInspection = (section, field, item) => (
    <div className="space-y-4 ml-7">
      {renderRadios(section, field, item)}

      <input
        type="date"
        value={item.date || ""}
        onChange={(e) => updateField(section, field, "date", e.target.value)}
        className={inputClass}
        placeholder="Select date"
      />

      <input
        type="text"
        placeholder="Submitted By"
        value={item.submittedBy || ""}
        onChange={(e) => updateField(section, field, "submittedBy", e.target.value)}
        className={inputClass}
      />
    </div>
  );

  const renderDispatch = (section, index, field, item) => (
    <div className="space-y-4 ml-7">
      {renderRadios(section, field, item, index)}

      <input
        type="date"
        value={item.date || ""}
        onChange={(e) => updateField(section, field, "date", e.target.value, index)}
        className={inputClass}
        placeholder="Select date"
      />
    </div>
  );

  const renderPostComm = (section, field, item) => (
    <div className="space-y-4 ml-7">
      {renderRadios(section, field, item)}

      <input
        type="date"
        value={item.date || ""}
        onChange={(e) => updateField(section, field, "date", e.target.value)}
        className={inputClass}
        placeholder="Select date"
      />

      <input
        type="text"
        placeholder="Input Value"
        value={item.inputVal}
        onChange={(e) => updateField(section, field, "inputVal", e.target.value)}
        className={inputClass}
      />

      <input
        type="text"
        placeholder="Submitted By"
        value={item.submittedBy}
        onChange={(e) => updateField(section, field, "submittedBy", e.target.value)}
        className={inputClass}
      />

      <textarea
        placeholder="Remarks"
        value={item.remarks}
        onChange={(e) => updateField(section, field, "remarks", e.target.value)}
        className={`${inputClass} resize-y min-h-[80px]`}
      />
    </div>
  );

  /* -------------------------- FIELD ROUTER ---------------------------- */
  const renderField = (section, field, item, index = null) => {
    const type = FIELD_TYPES[section];

    switch (type) {
      case "CUSTOMER":
        return renderCustomerDev(section, field, item);

      case "SIEVPL":
        return renderSIEVPL(section, field, item);

      case "SWFAT":
        return renderSwFat(section, field, item);

      case "INSPECTION":
        return renderInspection(section, field, item);

      case "DISPATCH":
        return renderDispatch(section, index, field, item);

      case "POSTCOMM":
        return renderPostComm(section, field, item);

      default:
        return null;
    }
  };

  /* -------------------------- SECTION WRAPPER -------------------------- */
  const renderSection = (sectionKey, title, icon, color) => (
    <div
      className={`bg-${color} text-white rounded-2xl shadow-lg p-5 relative overflow-hidden`}
    >
      <h3 className="flex items-center gap-2 font-bold text-lg mb-3">
        {icon}
        {title}
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {Array.isArray(Docs[sectionKey])
          ? Docs[sectionKey].map((phase, index) =>
            Object.entries(phase).map(([field, item]) =>
              field !== "phaseIndex" ? (
                <div key={`${field}-${index}`}>
                  <div className="font-semibold">{field}</div>
                  {renderField(sectionKey, field, item, index)}
                </div>
              ) : null
            )
          )
          : Object.entries(Docs[sectionKey]).map(([field, item]) => (
            <div key={field}>
              <div className="font-semibold">{field}</div>
              {renderField(sectionKey, field, item)}
            </div>
          ))}
      </div>
    </div>
  );

  /* ------------------------------- FINAL UI ---------------------------- */
  const progress = calculateProgress();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200">
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="flex flex-col gap-6">
            {renderSection(
              "CustomerDevDocuments",
              "Customer Development Documents",
              <FileText className="w-6 h-6 text-white" />,
              "blue-500"
            )}

            {renderSection(
              "SIEVPLDevDocuments",
              "SIEVPL Development Documents",
              <Users className="w-6 h-6 text-white" />,
              "purple-500"
            )}
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-6">
            {renderSection(
              "swDevDocumentsforFat",
              "Software/FAT Documents",
              <Package className="w-6 h-6 text-white" />,
              "orange-500"
            )}

            {renderSection(
              "inspectionDocuments",
              "Inspection Documents",
              <FileText className="w-5 h-5 text-white" />,
              "green-500"
            )}
          </div>

          {/* FULL WIDTH */}
          <div className="lg:col-span-2">
            {renderSection(
              "PostCommisionDocuments",
              "Post Commission Documents",
              <FileText className="w-5 h-5 text-white" />,
              "emerald-500"
            )}
          </div>
        </div>

        <footer className="bg-gray-50 p-4 border-t border-gray-200 text-center">
          {progress === 100 ? (
            <span className="text-emerald-600 font-bold flex justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              All documents verified!
            </span>
          ) : (
            <span className="text-gray-700 font-semibold">{100 - progress}% remaining</span>
          )}
        </footer>
      </div>
    </div>
  );
};

export default DocumentsSection;
