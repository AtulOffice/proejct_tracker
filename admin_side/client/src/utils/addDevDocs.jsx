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


const DocumentsSection = ({ Docs, setDocs }) => {
  const createDispatchPhase = (i) => ({
    phaseIndex: i + 1,
    packingList: { value: "", date: null },
    invoice: { value: "", date: null },
    DeleveryChallan: { value: "", date: null },
    otherDocument: {
      name: "",
      value: "",
      date: null,
      version: "",
    },
  });

  const updateField = (section, field, key, value, index = null) => {
    setDocs((prev) => {
      const updated = { ...prev };
      if (section === "dispatchDocuments" && index !== null) {
        const phases = [...updated.dispatchDocuments];
        const phase = { ...phases[index] };
        const fieldData = { ...phase[field] };

        fieldData[key] = value;

        phase[field] = fieldData;
        phases[index] = phase;

        updated.dispatchDocuments = phases;

        return updated;
      }
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

  const countSectionProgress = (sectionObj) => {
    let total = 0;
    let filled = 0;

    const scan = (item) => {
      if (!item) return;
      if (typeof item === "object" && "value" in item) {
        if (item.value !== "N/A") {
          total++;
          if (item.value === "YES") filled++;
        }
      }
      if (Array.isArray(item)) item.forEach(scan);
      else if (typeof item === "object") Object.values(item).forEach(scan);
    };

    scan(sectionObj);

    return { filled, total };
  };



  const calculateProgress = () => {
    const { filled, total } = countValues(Docs);
    return total ? Math.round((filled / total) * 100) : 0;
  };

  const handleLotsChange = (count) => {
    const c = Number(count);

    const updatedPhases = Array.from({ length: c }, (_, i) =>
      Docs.dispatchDocuments[i] ?? createDispatchPhase(i)
    );

    setDocs((prev) => ({
      ...prev,
      dispatchDocuments: updatedPhases,
    }));
  };

  const renderRadios = (section, field, item, index = null) => {
    const value = item?.value || "";

    const getButtonStyle = (val, isActive) => {
      if (!isActive) {
        return "text-gray-700 hover:bg-gray-50 hover:shadow-sm hover:scale-[1.05]";
      }
      if (val.toLowerCase() === "yes") return "bg-green-500 text-white shadow-md ring-2 ring-green-400";
      if (val.toLowerCase() === "no") return "bg-red-500 text-white shadow-md ring-2 ring-red-400";
      if (val.toLowerCase() === "n/a") return "bg-orange-500 text-white shadow-md ring-2 ring-orange-400";

      return "bg-white text-gray-900 shadow-md ring-2 ring-gray-400";
    };

    return (
      <div className="flex space-x-2 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-300">
        {ENUMVAL.map((val) => {
          const isActive = value === val;
          return (
            <label
              key={val}
              className={`flex-1 text-center cursor-pointer rounded-full py-2 px-4 font-semibold transition-all select-none ${getButtonStyle(val, isActive)}`}
            >
              <input
                type="radio"
                className="sr-only"
                name={`${section}-${field}-${index}`}
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


  const renderCustomerDev = (section, field, item) => (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-3">
          Select Option
        </label>
        {renderRadios(section, field, item)}
      </div>
      {
        item.value === "YES" && <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Date of Receipt
            </label>
            <input
              type="date"
              value={item.date || ""}
              onChange={(e) => updateField(section, field, "date", e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white"
            />
          </div>
          {"name" in item && (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={item.name || ""}
                onChange={(e) => updateField(section, field, "name", e.target.value)}
                className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400"
              />
            </div>
          )}
        </div>
      }
    </div>
  );


  const renderSIEVPL = (section, field, item) => (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-3">
          Select Option
        </label>
        {renderRadios(section, field, item)}
      </div>
      {
        item.value === "YES" && <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {"name" in item && (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={item.name || ""}
                onChange={(e) => updateField(section, field, "name", e.target.value)}
                className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Date
            </label>
            <input
              type="date"
              value={item.date || ""}
              onChange={(e) => updateField(section, field, "date", e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white"
            />
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Version
            </label>
            <input
              type="text"
              placeholder="Enter version"
              value={item.version || ""}
              onChange={(e) => updateField(section, field, "version", e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400"
            />
          </div>

        </div>
      }
    </div>
  );


  const renderSwFat = (section, field, item) => (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-3">
          Select Option
        </label>
        {renderRadios(section, field, item)}
      </div>
      {
        item.value === "YES" && <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {"name" in item && (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={item.name || ""}
                onChange={(e) => updateField(section, field, "name", e.target.value)}
                className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Date
            </label>
            <input
              type="date"
              value={item.date || ""}
              onChange={(e) => updateField(section, field, "date", e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Version
            </label>
            <input
              type="text"
              placeholder="Enter version"
              value={item.version || ""}
              onChange={(e) => updateField(section, field, "version", e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400"
            />
          </div>
        </div>
      }
    </div>
  );


  const renderInspection = (section, field, item) => (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-3">
          Select Option
        </label>
        {renderRadios(section, field, item)}
      </div>
      {
        item.value === "YES" && <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {"name" in item && (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={item.name || ""}
                onChange={(e) => updateField(section, field, "name", e.target.value)}
                className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Date
            </label>
            <input
              type="date"
              value={item.date || ""}
              onChange={(e) => updateField(section, field, "date", e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Submitted By
            </label>
            <input
              type="text"
              placeholder="Enter name"
              value={item.submittedBy || ""}
              onChange={(e) => updateField(section, field, "submittedBy", e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400"
            />
          </div>
        </div>
      }
    </div>
  );

  const renderDispatch = (section, index, field, item) => (
    <div className="relative mb-6">
      <div className="flex items-center gap-3 mb-0">
        <div className="bg-white border-2 border-b-0 border-gray-300 text-gray-800 px-6 py-3 rounded-t-xl font-bold text-base shadow-sm">
          LOT {index + 1}
        </div>
        <div className="flex-1 border-b-2 border-gray-300"></div>
      </div>
      <div className="space-y-6 p-7 bg-white rounded-xl rounded-tl-none border-2 border-gray-300 shadow-md">
        <h3 className="font-bold">{field}</h3>

        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Select Option
          </label>
          {renderRadios(section, field, item, index)}
        </div>
        {item.value === "YES" && <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {"name" in item && (
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={item.name || ""}
                onChange={(e) =>
                  updateField("dispatchDocuments", field, "name", e.target.value, index)
                }
                className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 
        rounded-lg focus:border-gray-500 focus:outline-none transition-colors 
        bg-white placeholder-gray-400"
              />
            </div>
          )}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Date
            </label>
            <input
              type="date"
              value={item.date || ""}
              onChange={(e) =>
                updateField(section, field, "date", e.target.value, index)
              }
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 
      rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-gray-200 
      focus:outline-none transition-all bg-white hover:border-gray-400"
            />
          </div>
        </div>}

      </div>
    </div>
  );


  const renderPostComm = (section, field, item) => (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-3">
          Select Option
        </label>
        {renderRadios(section, field, item)}
      </div>
      {
        item.value === "YES" && <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {"name" in item && (
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={item.name || ""}
                  onChange={(e) => updateField(section, field, "name", e.target.value)}
                  className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Date
              </label>
              <input
                type="date"
                value={item.date || ""}
                onChange={(e) => updateField(section, field, "date", e.target.value)}
                className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                DOCS No.
              </label>
              <input
                type="text"
                placeholder="Enter value"
                value={item.inputVal || ""}
                onChange={(e) => updateField(section, field, "inputVal", e.target.value)}
                className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Submitted By
            </label>
            <input
              type="text"
              placeholder="Enter name"
              value={item.submittedBy || ""}
              onChange={(e) => updateField(section, field, "submittedBy", e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Remarks
            </label>
            <textarea
              placeholder="Enter remarks"
              value={item.remarks || ""}
              onChange={(e) => updateField(section, field, "remarks", e.target.value)}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400 resize-y min-h-[100px]"
            />
          </div></>
      }
    </div>
  );


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

      case "POSTCOMM":
        return renderPostComm(section, field, item);

      default:
        return null;
    }
  };

  const renderSection = (sectionKey, title, icon, color) => {
    // if (sectionKey === "dispatchDocuments") return null;

    const { filled, total } = countSectionProgress(Docs[sectionKey]);
    const percent = total ? Math.round((filled / total) * 100) : 0;
    return (


      <div
        className={`bg-${color} text-white rounded-2xl shadow-lg p-5 relative overflow-hidden`}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="flex items-center gap-2 font-bold text-lg">
            {icon}
            {title}
          </h3>

          <span className="text-sm font-semibold">
            {filled}/{total}
          </span>
        </div>

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
  }

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
              "blue-100"
            )}
            {renderSection(
              "swDevDocumentsforFat",
              "Software/FAT Documents",
              <Package className="w-6 h-6 text-white" />,
              "blue-100"
            )}

          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-6">

            {renderSection(
              "SIEVPLDevDocuments",
              "SIEVPL Development Documents",
              <Users className="w-6 h-6 text-white" />,
              "blue-100"
            )}
            {renderSection(
              "inspectionDocuments",
              "Inspection Documents",
              <FileText className="w-5 h-5 text-white" />,
              "blue-100"
            )}
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Select Dispatch Lots
            </label>

            <div className="relative">
              <select
                onChange={(e) => handleLotsChange(e.target.value)}
                className="w-full appearance-none border-2 border-gray-300 bg-white text-gray-800 rounded-lg px-4 py-3 pr-10 font-medium shadow-sm hover:border-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none transition-all cursor-pointer"
              >
                <option value="1">1 Lot</option>
                <option value="2">2 Lots</option>
                <option value="3">3 Lots</option>
                <option value="4">4 Lots</option>
              </select>

              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>


          <div className="lg:col-span-2">
            <div className="bg-blue-100 text-white rounded-2xl shadow-lg p-5 relative overflow-hidden">
              <h3 className="flex items-center gap-2 font-bold text-lg mb-3">
                <Package className="w-6 h-6 text-white" />
                Dispatch Documents
              </h3>

              {Docs.dispatchDocuments.map((phase, index) => (
                <div key={index}>
                  {renderDispatch("dispatchDocuments", index, "packingList", phase.packingList)}
                  {renderDispatch("dispatchDocuments", index, "invoice", phase.invoice)}
                  {renderDispatch("dispatchDocuments", index, "DeleveryChallan", phase.DeleveryChallan)}
                  {renderDispatch("dispatchDocuments", index, "otherDocument", phase.otherDocument)}
                </div>
              ))}
            </div>
          </div>


          {/* FULL WIDTH */}
          <div className="lg:col-span-2">
            {renderSection(
              "PostCommisionDocuments",
              "Post Commission Documents",
              <FileText className="w-5 h-5 text-white" />,
              "blue-100"
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              REMARK FOR CUSTOMER DOCS
            </label>
            <textarea
              placeholder="Enter remarks"
              value={Docs.CustomerDevDocumentsRemarks || ""}
              onChange={(e) => {
                e.preventDefault();
                setDocs((prev) => ({ ...prev, CustomerDevDocumentsRemarks: e.target.value }))
              }}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400 resize-y min-h-[100px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              REMARK FOR SIEVPL DOCS
            </label>
            <textarea
              placeholder="Enter remarks"
              value={Docs.SIEVPLDevDocumentsRemarks || ""}
              onChange={(e) => {
                e.preventDefault();
                setDocs((prev) => ({ ...prev, SIEVPLDevDocumentsRemarks: e.target.value }))
              }}
              className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors bg-white placeholder-gray-400 resize-y min-h-[100px]"
            />
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
