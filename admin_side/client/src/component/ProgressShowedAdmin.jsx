import React, { useState } from "react";

const ProgressShowed = ({ progressData, onClose }) => {
    const [expandedSections, setExpandedSections] = useState({});

    const sections = Array.isArray(progressData?.sections)
        ? [...progressData.sections].sort((a, b) => a.phaseIndex - b.phaseIndex)
        : [];

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const truncate = (text, max = 60) => {
        if (!text) return "—";
        return text.length > max ? text.slice(0, max) + "…" : text;
    };

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const getCompletionColor = (percent) => {
        if (percent >= 100) return "bg-green-500";
        if (percent >= 75) return "bg-blue-500";
        if (percent >= 50) return "bg-yellow-500";
        if (percent >= 25) return "bg-orange-500";
        return "bg-red-500";
    };

    const getCompletionBadgeStyle = (percent) => {
        if (percent >= 100) return "bg-green-50 text-green-700 ring-green-600/20";
        if (percent >= 75) return "bg-blue-50 text-blue-700 ring-blue-600/20";
        if (percent >= 50) return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
        if (percent >= 25) return "bg-orange-50 text-orange-700 ring-orange-600/20";
        return "bg-red-50 text-red-700 ring-red-600/20";
    };

    const getTypeIcon = (type) => {
        const icons = {
            logic: "⚙️",
            scada: "🖥️",
            testing: "🧪"
        };
        return icons[type] || "📋";
    };

    const getTypeColor = (type) => {
        const colors = {
            logic: "from-purple-500 to-indigo-600",
            scada: "from-blue-500 to-cyan-600",
            testing: "from-emerald-500 to-teal-600"
        };
        return colors[type] || "from-gray-500 to-gray-600";
    };

    const calculateSectionProgress = (section) => {
        let totalProgress = 0;
        let count = 0;

        ["logic", "scada", "testing"].forEach(type => {
            const engineers = section[type]?.engineers || [];
            engineers.forEach(engineer => {
                if (engineer.progressReports?.length > 0) {
                    const latestReport = engineer.progressReports[engineer.progressReports.length - 1];
                    totalProgress += latestReport.actualCompletionPercent || 0;
                    count++;
                }
            });
        });

        return count > 0 ? Math.round(totalProgress / count) : 0;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-600/80 via-gray-600/80 to-slate-600/80 backdrop-blur-sm p-4">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-7xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">

                <div className="relative px-8 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    <div className="relative flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-3xl">📊</span>
                                Development Progress Report
                            </h2>

                        </div>
                        <button
                            onClick={onClose}
                            className="w-11 h-11 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                <div className="p-8 max-h-[75vh] overflow-y-auto bg-gray-50">
                    {sections.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-500 text-lg">No progress data available yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {sections.map((section, sectionIndex) => {
                                const sectionProgress = calculateSectionProgress(section);
                                const sectionId = `section-${section.phaseIndex}`;
                                const isExpanded = expandedSections[sectionId] !== false;

                                return (
                                    <React.Fragment key={section.phaseIndex}>
                                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
                                            <div
                                                onClick={() => toggleSection(sectionId)}
                                                className="cursor-pointer bg-gradient-to-r from-gray-500 to-gray-100 px-6 py-4 border-b border-gray-200 hover:from-gray-100 hover:to-gray-500 transition-all"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-md">
                                                            {section.phaseIndex + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-gray-900 text-lg">
                                                                {section.sectionName}
                                                            </h3>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                                                                    <div
                                                                        className={`h-2 rounded-full transition-all duration-500 ${getCompletionColor(sectionProgress)}`}
                                                                        style={{ width: `${sectionProgress}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm font-semibold text-gray-600">
                                                                    {sectionProgress}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ring-2 ${getCompletionBadgeStyle(sectionProgress)}`}>
                                                            {sectionProgress >= 100 ? "✓ Complete" : "In Progress"}
                                                        </span>
                                                        <div className={`transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {isExpanded && (
                                                <div className="p-6 space-y-6">
                                                    {["logic", "scada", "testing"].map((type) => {
                                                        const engineers = section[type]?.engineers || [];
                                                        if (engineers.length === 0) return null;

                                                        return (
                                                            <div key={type} className="space-y-4">
                                                                <div className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${getTypeColor(type)} rounded-lg shadow-sm`}>
                                                                    <span className="text-2xl">{getTypeIcon(type)}</span>
                                                                    <h4 className="uppercase text-sm font-bold text-white tracking-wider">
                                                                        {type}
                                                                    </h4>
                                                                    <span className="ml-auto bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
                                                                        {engineers.length} {engineers.length === 1 ? "Engineer" : "Engineers"}
                                                                    </span>
                                                                </div>
                                                                {engineers.map((engineer) => {
                                                                    const latestProgress = engineer.progressReports?.length > 0
                                                                        ? engineer.progressReports[engineer.progressReports.length - 1].actualCompletionPercent
                                                                        : 0;

                                                                    return (
                                                                        <div
                                                                            key={engineer.engineerId}
                                                                            className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all bg-white shadow-sm"
                                                                        >
                                                            
                                                                            <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-3 border-b border-gray-200">
                                                                                <div className="flex items-center justify-between">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold shadow">
                                                                                            {engineer.name?.charAt(0)?.toUpperCase() || "?"}
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="font-semibold text-gray-900">
                                                                                                {engineer.name}
                                                                                            </p>
                                                                                            <p className="text-xs text-gray-500">
                                                                                                ID: {engineer.empId}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="text-right">
                                                                                            <p className="text-xs text-gray-500 uppercase">Latest Progress</p>
                                                                                            <p className={`text-lg font-bold ${latestProgress >= 100 ? "text-green-600" : "text-indigo-600"}`}>
                                                                                                {latestProgress}%
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="overflow-x-auto">
                                                                                <table className="w-full text-sm">
                                                                                    <thead className="bg-gray-100">
                                                                                        <tr className="text-xs uppercase text-gray-600 font-semibold">
                                                                                            <th className="px-4 py-3 text-center">Progress</th>
                                                                                            <th className="px-4 py-3 text-center">Report Date</th>
                                                                                            <th className="px-4 py-3 text-center">Completion Date</th>
                                                                                            <th className="px-4 py-3 text-left">Notes</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className="divide-y divide-gray-200">
                                                                                        {engineer.progressReports.map((row, idx) => (
                                                                                            <tr
                                                                                                key={idx}
                                                                                                className="hover:bg-gray-50 transition-colors"
                                                                                            >
                                                                                                <td className="px-4 py-3 text-center">
                                                                                                    <div className="flex items-center justify-center gap-2">
                                                                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ring-2 ${getCompletionBadgeStyle(row.actualCompletionPercent)}`}>
                                                                                                            {row.actualCompletionPercent}%
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </td>
                                                                                                <td className="px-4 py-3 text-center text-gray-700">
                                                                                                    <div className="flex items-center justify-center gap-1">
                                                                                                        <span className="text-gray-400">📅</span>
                                                                                                        {formatDate(row.reportDate)}
                                                                                                    </div>
                                                                                                </td>
                                                                                                <td className="px-4 py-3 text-center text-gray-700">
                                                                                                    <div className="flex items-center justify-center gap-1">
                                                                                                        <span className="text-gray-400">🎯</span>
                                                                                                        {formatDate(row.actualEndDate)}
                                                                                                    </div>
                                                                                                </td>
                                                                                                <td className="px-4 py-3">
                                                                                                    <p className="text-gray-600 leading-relaxed">
                                                                                                        {truncate(row.remarks, 10)}
                                                                                                    </p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        {sectionIndex < sections.length - 1 && (
                                            <div className="relative flex items-center justify-center py-6">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t-4 border-dashed border-gray-400"></div>
                                                </div>
                                                <div className="relative bg-white px-6 py-3 rounded-full border-4 border-gray-400 shadow-lg">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 text-lg font-bold">Next Section</span>
                                                    </div>
                                                </div>
                                            </div>

                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgressShowed;
