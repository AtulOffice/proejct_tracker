import React from "react";

const DocSRecordChecklist = ({ project, onClose }) => {
    const documents = project?.project || {};

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
                                📋 DOCUMENTS
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="px-6 pb-8 max-h-[calc(95vh-160px)] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/80 scrollbar-track-gray-100/50 scrollbar-thumb-rounded-full scrollbar-w-2 hover:scrollbar-thumb-indigo-600 space-y-16">
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
