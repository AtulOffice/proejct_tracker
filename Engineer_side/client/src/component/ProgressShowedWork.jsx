import React, { useState } from "react";
import WorkStatusModal from "./workPopup";

const ProgressShowedWork = ({ progressData, onClose }) => {

    const rows = progressData?.data || [];

    const [details, setDetails] = useState("");
    const [flag, setFlag] = useState(false);

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-IN");
    };

    const truncate = (text, max = 40) => {
        if (!text) return "—";
        return text.length > max ? text.slice(0, max) + "…" : text;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60  p-4">
            {flag && (
                <WorkStatusModal
                    workStatus={details}
                    onClose={() => setFlag((prev) => !prev)}
                />
            )}
            <div className="absolute inset-0" onClick={onClose} />

            <div
                className="relative w-full max-w-5xl bg-white/80 border border-white/60 shadow-2xl rounded-3xl 
                   overflow-hidden backdrop-blur-2xl"
            >

                <div className="px-6 py-4 border-b border-white/70 bg-white/70 backdrop-blur">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {`📊 Work Progress History for ${rows[0].jobNumber} ${rows[0]?.projectName}`}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        View all reported updates with completion status and remarks.
                    </p>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/80 border border-white/70 
                     hover:bg-white shadow-md flex items-center justify-center text-gray-500 
                     hover:text-gray-700 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Table wrapper with white scrollbar */}
                <div
                    className="p-6 max-h-[65vh] overflow-y-auto overflow-x-auto
                     scrollbar-thin scrollbar-thumb-white/70 scrollbar-track-white/20"
                >
                    {rows.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No progress data available.
                        </p>
                    ) : (
                        <table className="w-full border-separate border-spacing-0 text-sm">
                            <thead>
                                <tr className="bg-white/80 text-gray-600 uppercase text-xs">

                                    <th className="px-4 py-3 text-center border-b border-gray-200">
                                        Completion %
                                    </th>
                                    <th className="px-4 py-3 text-center border-b border-gray-200">
                                        Report Date
                                    </th>
                                    <th className="px-4 py-3 text-center border-b border-gray-200">
                                        Range
                                    </th>
                                    <th className="px-4 py-3 text-left rounded-tr-2xl border-b border-gray-200">
                                        Report
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr
                                        key={row.progressId ?? idx}
                                        className={`transition-colors ${idx % 2 === 0 ? "bg-white/90" : "bg-white/60"
                                            } hover:bg-white`}
                                    >

                                        <td onClick={() => { setFlag(true), setDetails(row?.WorkStatus) }} className="px-4 py-3 text-center border-b border-gray-100">
                                            <span
                                                className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer
                          ${row.actualCompletionPercent === 100
                                                        ? "bg-white text-gray-800 border border-gray-300"
                                                        : "bg-white/80 text-gray-700 border border-gray-200"
                                                    }`}
                                            >
                                                {row.progressPercent}%
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-center text-gray-500 border-b border-gray-100">
                                            {formatDate(row.createdAt)}
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-500 border-b border-gray-100">
                                            {`${formatDate(row.fromDate)} - ${formatDate(row.toDate)}`}

                                        </td>

                                        <td className="px-4 py-3 text-gray-700 border-b border-gray-100">
                                            {truncate(row.WorkStatus, 10)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgressShowedWork;
