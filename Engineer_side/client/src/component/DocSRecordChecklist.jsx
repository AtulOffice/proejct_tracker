import React from "react";

const DocSRecordChecklist = ({ project, onClose }) => {
    const documents = project?.project || {};
    const [collOpen, setCollOpen] = React.useState(false);

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-IN");
    };

    const COLOR_MAP = {
        indigo: {
            title: "from-indigo-500 to-indigo-700",
            border: "border-indigo-500",
        },
        emerald: {
            title: "from-emerald-500 to-emerald-700",
            border: "border-emerald-500",
        },
        amber: {
            title: "from-amber-500 to-amber-700",
            border: "border-amber-500",
        },
    };

    const DocumentTableSection = ({ title, data, color = "indigo" }) => {
        if (!data || Object.keys(data).length === 0) return null;

        const theme = COLOR_MAP[color] || COLOR_MAP.indigo;

        return (
            <div className="space-y-4">
                {/* SECTION TITLE */}
                <h3
                    className={`text-2xl font-black bg-gradient-to-r ${theme.title}
                    bg-clip-text text-transparent border-l-6 pl-4 py-2 ${theme.border} shadow-md backdrop-blur-sm`}
                >
                    {title}
                </h3>

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto min-w-[750px]">
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-50/80 to-gray-100/80 backdrop-blur-sm border-b-2 border-gray-200 sticky top-0 z-20">
                                    <th className="px-6 py-4 text-left text-lg font-bold text-gray-800 border-r border-gray-200">
                                        Document
                                    </th>
                                    <th className="px-6 py-4 text-center text-lg font-bold text-gray-800 w-28">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-bold text-gray-800 w-32">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-bold text-gray-800 w-28">
                                        Version
                                    </th>
                                    <th className="px-6 py-4 text-left text-lg font-bold text-gray-800">
                                        Name
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data).map(([key, item], index) => (
                                    <tr
                                        key={key}
                                        className={`group hover:bg-gradient-to-r hover:from-indigo-50/80 hover:to-purple-50/80 backdrop-blur-sm transition-all duration-300 border-b border-gray-100/50 last:border-b-0 ${index % 2 === 0 ? "bg-white/90" : "bg-slate-50/70"
                                            }`}
                                    >
                                        <td className="px-6 py-6 font-semibold text-base text-gray-800 capitalize border-r border-gray-200 max-w-[220px]">
                                            {key.replace(/([A-Z])/g, " $1")}
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span
                                                className={`inline-flex px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full shadow-lg transform group-hover:scale-105 transition-all duration-300 ring-2 ring-offset-2 ring-white/50
                                                ${item.value === "YES"
                                                        ? "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-emerald-400/50 ring-emerald-400/30"
                                                        : item.value === "NO"
                                                            ? "bg-gradient-to-r from-rose-400 to-rose-600 text-white shadow-rose-400/50 ring-rose-400/30"
                                                            : "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-400/50 ring-gray-400/30"
                                                    }`}
                                            >
                                                {item.value || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 font-bold text-base text-gray-700 min-w-[120px]">
                                            {formatDate(item.date)}
                                        </td>
                                        <td className="px-6 py-6 font-bold text-base text-gray-700 min-w-[100px]">
                                            {item.version || "—"}
                                        </td>
                                        <td className="px-6 py-6 font-bold text-base text-gray-700 max-w-[280px] truncate">
                                            {item.name || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const DispatchDocumentTableSection = ({ title, data }) => {
        if (!Array.isArray(data) || data.length === 0) return null;

        return (
            <div className="space-y-6">
                {/* SECTION TITLE */}
                <h3 className="text-2xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent border-l-6 pl-4 py-2 border-amber-500 shadow-md backdrop-blur-sm">
                    {title}
                </h3>

                {data.map((lot, lotIndex) => (
                    <div
                        key={lot._id || lotIndex}
                        className="group/lot rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/80 to-yellow-50/70 border border-amber-200/60 shadow-xl backdrop-blur-xl hover:shadow-amber-500/30 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                    >
                        {/* LOT HEADER */}
                        <div className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-b border-amber-200/50 p-6 sticky top-0 z-20 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-xl flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-black bg-gradient-to-r from-amber-700 to-orange-800 bg-clip-text text-transparent tracking-wide">
                                    Lot {lot.phaseIndex ?? lotIndex + 1}
                                </h4>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto min-w-[650px]">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 backdrop-blur-sm border-b-2 border-amber-200 sticky top-0 z-10">
                                            <th className="px-6 py-4 text-left text-lg font-bold text-amber-900 border-r border-amber-200">
                                                Document
                                            </th>
                                            <th className="px-6 py-4 text-center text-lg font-bold text-amber-900 w-28">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-lg font-bold text-amber-900 w-32">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-lg font-bold text-amber-900">
                                                Name
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(lot)
                                            .filter(([key]) => !["_id", "phaseIndex"].includes(key))
                                            .map(([key, item], docIndex) => (
                                                <tr
                                                    key={key}
                                                    className={`group hover:bg-gradient-to-r hover:from-amber-100/80 hover:to-orange-100/80 backdrop-blur-sm transition-all duration-300 border-b border-amber-100/40 last:border-b-0 ${docIndex % 2 === 0 ? "bg-white/90" : "bg-amber-50/60"
                                                        }`}
                                                >
                                                    <td className="px-6 py-6 font-semibold text-base text-gray-800 capitalize border-r border-amber-200 max-w-[220px]">
                                                        {key.replace(/([A-Z])/g, " $1")}
                                                    </td>
                                                    <td className="px-6 py-6 text-center">
                                                        <span
                                                            className={`inline-flex px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full shadow-lg transform group-hover:scale-105 transition-all duration-300 ring-2 ring-offset-2 ring-white/50
                                                            ${item.value === "YES"
                                                                    ? "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-emerald-400/50 ring-emerald-400/30"
                                                                    : item.value === "NO"
                                                                        ? "bg-gradient-to-r from-rose-400 to-rose-600 text-white shadow-rose-400/50 ring-rose-400/30"
                                                                        : "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-400/50 ring-gray-400/30"
                                                                }`}
                                                        >
                                                            {item.value || "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6 font-bold text-base text-gray-700 min-w-[120px]">
                                                        {item.date
                                                            ? new Date(item.date).toLocaleDateString("en-IN")
                                                            : "—"}
                                                    </td>
                                                    <td className="px-6 py-6 font-bold text-base text-gray-700 max-w-[280px] truncate">
                                                        {item.name || "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    const Info = ({ label, value }) => {
        return (
            <div className="group bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                <dt className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-indigo-600 transition-colors"></span>
                    {label}
                </dt>
                <dd className="text-base font-semibold text-gray-900 truncate">
                    {value || <span className="text-gray-400 font-normal italic">Not specified</span>}
                </dd>
            </div>
        );
    };
    const SERVICE_LABELS = {
        DEV: "Development",
        DEVCOM: "Development + Commissioning",
        COMMISSIONING: "Commissioning",
        AMC: "AMC",
        SERVICE: "Service",
        SEPERATE: "Separate",
        "": "",
        "N/A": "N/A",
    };

    const formatIndianAmount = (value) => {
        if (value === null || value === undefined || value === "") return "—";

        const num = Number(value);
        if (isNaN(num)) return "—";

        return num.toLocaleString("en-IN");
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/80 via-black/70 to-slate-900/80 backdrop-blur-2xl p-4 overflow-hidden">
            <div className="relative w-full max-w-7xl max-h-[95vh] bg-white/95 backdrop-blur-3xl rounded-3xl shadow-3xl shadow-indigo-500/30 border border-white/40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-purple-500/8 to-pink-500/8 animate-pulse-slow pointer-events-none" />
                <button
                    onClick={onClose}
                    className="group absolute top-4 right-4 z-[9999]
  w-12 h-12 bg-white/90 backdrop-blur-xl
  hover:bg-white border border-white/60
  rounded-2xl shadow-2xl
  hover:scale-110 transition-all duration-300
  flex items-center justify-center
  text-gray-700 hover:text-gray-900
  font-bold text-xl"
                >
                    <svg
                        className="w-6 h-6 transition-transform duration-300 group-hover:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div className="relative pt-12 pb-3 px-4 text-center border-b border-gray-200/50 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 sticky top-0 z-30 bg-white/90 backdrop-blur-xl">
                    <div className="inline-flex items-center gap-2">
                        <div>
                            <h2 className="text-xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight leading-tight">
                                📋 DOCUMENTS AND PROJECTS INFO
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="px-6 pb-8 max-h-[calc(95vh-160px)] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/80 scrollbar-track-gray-100/50 scrollbar-thumb-rounded-full scrollbar-w-2 hover:scrollbar-thumb-indigo-600 space-y-16">

                    <div className="w-full mb-6">
                        <button
                            onClick={() => setCollOpen(!collOpen)}
                            className="w-full bg-gray-300 p-3 rounded-lg flex justify-between items-center hover:bg-gray-400 transition"
                        >
                            <span className="text-lg font-medium">
                                {collOpen ? "Hide" : "Show"} Order Details
                            </span>
                            <span className="text-xl">{collOpen ? "▲" : "▼"}</span>
                        </button>
                        {collOpen && (
                            <div className="space-y-6 mb-6">
                                <div className="relative bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-indigo-200/30 to-purple-200/30 rounded-bl-full blur-2xl"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-xl text-indigo-900">
                                                Basic Project Information
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Info label="Job Number" value={project?.project.jobNumber} />
                                            <Info label="Entity Type" value={project?.project?.OrderMongoId.entityType} />
                                            <Info label="SO Type" value={project?.project?.OrderMongoId.soType} />
                                            <Info label="Booking Date" value={project?.project?.OrderMongoId.bookingDate} />
                                            <Info label="Client" value={project?.project?.OrderMongoId.client} />
                                            <Info label="End User" value={project?.project?.OrderMongoId.endUser} />
                                            <Info label="Location" value={project?.project?.OrderMongoId.site} />
                                            <Info label="Accournt manager Email" value={project?.project?.OrderMongoId.concerningSalesManager.name} />
                                            <Info label="Technical Name" value={project?.project?.OrderMongoId.name} />
                                            <Info label="Technical Email" value={project?.project?.OrderMongoId.technicalEmail} />
                                            <Info label="Technical Phone" value={project?.project?.OrderMongoId.phone} />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-xl text-blue-900">
                                                Order Value
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Info label="Order Value (Supply)" value={formatIndianAmount(project?.project?.OrderMongoId.orderValueSupply)} />
                                            <Info label="Order Value (Service)" value={formatIndianAmount(project?.project?.OrderMongoId.orderValueService)} />
                                            <Info label="Order Value (Total)" value={formatIndianAmount(project?.project?.OrderMongoId.orderValueTotal)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-xl text-blue-900">
                                                PO Details
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Info label="PO Received" value={project?.project?.OrderMongoId.poReceived} />
                                            <Info label="Order Number" value={project?.project?.OrderMongoId.orderNumber} />
                                            <Info label="Order Date" value={project?.project?.OrderMongoId.orderDate} />
                                            <Info label="Delivery Date" value={project?.project?.OrderMongoId.deleveryDate} />
                                            <Info label="Actual Delivery Date" value={project?.project?.OrderMongoId.actualDeleveryDate} />
                                            <Info label="Amendment Required" value={project?.project?.OrderMongoId.amndReqrd} />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-xl text-blue-900">
                                                Service Details
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Info label="Service Type" value={SERVICE_LABELS[project?.project?.service] || project?.service} />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-xl text-blue-900">
                                                Development Scope
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Info label="Scada/Logic" value={project?.project?.Development} />
                                            <Info label="Logic development Place" value={project?.project?.LogicPlace} />
                                            <Info label="Scada devvelopment Place" value={project?.project?.ScadaPlace} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                    <DocumentTableSection
                        title="Customer Development Documents"
                        data={documents.CustomerDevDocuments}
                        color="indigo"
                    />

                    <DocumentTableSection
                        title="SIEVPL Development Documents"
                        data={documents.SIEVPLDevDocuments}
                        color="emerald"
                    />

                    <DispatchDocumentTableSection
                        title="Dispatch Documents"
                        data={documents.dispatchDocuments}
                    />
                </div>
            </div>
        </div>
    );
};

export default DocSRecordChecklist;
