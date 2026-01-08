import React, { useState } from "react";
import WorkStatusModal from "../../../workPopup";

const ProgressShowedWorkAdmin = ({ progressData, onClose }) => {
    const engineers = progressData || [];
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

    const project = engineers[0]?.project;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            {flag && (
                <WorkStatusModal
                    workStatus={details}
                    onClose={() => setFlag(false)}
                />
            )}

            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-6xl bg-white shadow-2xl rounded-xl overflow-hidden">

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Work Progress History
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                {project?.jobNumber} • {project?.projectName}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-colors duration-200 flex items-center justify-center"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6 custom-scrollbar">
                    {engineers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-lg font-medium">No progress data available</p>
                        </div>
                    ) : (
                        engineers.map((eng, engIdx) => (
                            <div
                                key={eng.engineer._id}
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                                {/* Engineer header */}
                                <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-200">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-semibold">
                                        {eng.engineer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {eng.engineer.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {eng.engineer.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Reports table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="px-6 py-3 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">
                                                    Progress
                                                </th>
                                                <th className="px-6 py-3 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">
                                                    Report Date
                                                </th>
                                                <th className="px-6 py-3 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">
                                                    Date Range
                                                </th>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">
                                                    Work Status
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {eng.reports.map((row, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => {
                                                                setDetails(row.WorkStatus);
                                                                setFlag(true);
                                                            }}
                                                            className={`
                                                            inline-flex items-center justify-center
                                                            px-3 py-1.5 rounded-md text-xs font-semibold
                                                            transition-all duration-200 cursor-pointer
                                                            ${row.progressPercent >= 75
                                                                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                                                                    : row.progressPercent >= 50
                                                                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                                        : row.progressPercent >= 25
                                                                            ? 'bg-gray-500 text-white hover:bg-gray-400'
                                                                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                                                                }
                                                        `}
                                                        >
                                                            {row.progressPercent}%
                                                        </button>
                                                    </td>

                                                    <td className="px-6 py-4 text-center text-gray-700 font-medium">
                                                        {formatDate(row.submittedAt)}
                                                    </td>

                                                    <td className="px-6 py-4 text-center">
                                                        <div className="inline-flex items-center gap-2 text-xs text-gray-600">
                                                            <span>{formatDate(row.fromDate)}</span>
                                                            <span className="text-gray-400">→</span>
                                                            <span>{formatDate(row.toDate)}</span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-gray-700">
                                                        {truncate(row.WorkStatus, 60)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );


};

export default ProgressShowedWorkAdmin;
