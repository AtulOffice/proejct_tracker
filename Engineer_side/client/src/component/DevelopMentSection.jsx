import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatDateDDMMYY } from "../utils/timeFormatter";

export default function SectionDetailsModal({ project, onClose, activeExecution, setSelectedProject }) {
    const modalRef = useRef(null);
    const sections = project?.phases;

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose?.();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const navigate = useNavigate()

    const handlePlanSectionRoute = (sectionId) => {
        navigate(`/plan/${activeExecution}/${sectionId}`, {
            state: {
                fromProject: true
            }
        })
        onClose?.();
        setSelectedProject(null);

    }

    const getPhasePosition = (phaseStart, phaseEnd, sectionStart, sectionEnd) => {
        if (!phaseStart || !phaseEnd || !sectionStart || !sectionEnd) {
            return { left: "0%", width: "0%" };
        }

        const sStart = new Date(sectionStart);
        const sEnd = new Date(sectionEnd);
        const pStart = new Date(phaseStart);
        const pEnd = new Date(phaseEnd);

        const total = sEnd - sStart;

        let left = ((pStart - sStart) / total) * 100;
        let width = ((pEnd - pStart) / total) * 100;

        left = Math.max(0, Math.min(left, 100));
        width = Math.max(0, Math.min(width, 100 - left));

        return { left: `${left}%`, width: `${width}%` };
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/90 via-black/80 to-slate-900/90 backdrop-blur-xl p-4 overflow-hidden animate-in fade-in duration-300">
            <div
                ref={modalRef}
                className="relative w-[95vw] h-[95vh] overflow-hidden rounded-3xl border-2 border-white/20 bg-white shadow-2xl shadow-black/40 animate-in zoom-in-95 duration-300"
            >
                <button
                    onClick={onClose}
                    className="group absolute top-4 right-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-xl hover:bg-white border-2 border-gray-200 rounded-xl shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:rotate-90"
                >
                    <svg
                        className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="relative pt-4 pb-2 px-4 text-center border-b border-gray-200/40 bg-white/90 sticky top-0 z-40">
                    <h2 className="text-sm font-bold tracking-wide text-gray-800">
                        📦 SECTION DETAILS
                    </h2>
                </div>

                <div className="h-[calc(95vh-60px)] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/80 scrollbar-track-gray-100 scrollbar-thumb-rounded-full px-6 py-6 space-y-6">
                    {sections?.map((section, index) => (
                        <div
                            key={section._id || index}
                            className="group/section relative rounded-3xl border-2 border-indigo-200/60 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 p-6 shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500 hover:-translate-y-1"
                        >

                            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-indigo-200/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl text-white font-black text-lg">
                                        {section.phaseIndex + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            {section.sectionName || `Section ${section.phaseIndex + 1}`}
                                        </h3>
                                        <p className="text-xs text-gray-600 font-medium mt-1">
                                            Phase {section.phaseIndex + 1} of {section.totalPhases}
                                        </p>
                                    </div>
                                </div>


                                <div className="flex items-center gap-3">

                                    <div className="text-right">
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                            Completion
                                        </p>
                                        <p className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                                            {section.CompletionPercentage}%
                                        </p>
                                    </div>

                                    <div className="relative w-16 h-16">
                                        <svg className="w-16 h-16 transform -rotate-90">

                                            {/* Gradient definition */}
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#6366f1" />
                                                    <stop offset="100%" stopColor="#8b5cf6" />
                                                </linearGradient>
                                            </defs>

                                            {/* Background circle */}
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="28"
                                                stroke="#e5e7eb"
                                                strokeWidth="5"
                                                fill="none"
                                            />

                                            {/* Progress circle */}
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="28"
                                                stroke="url(#gradient)"
                                                strokeWidth="5"
                                                fill="none"
                                                strokeDasharray={2 * Math.PI * 28}
                                                strokeDashoffset={
                                                    2 * Math.PI * 28 * (1 - section.CompletionPercentage / 100)
                                                }
                                                strokeLinecap="round"
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                    </div>
                                    {(section.CompletionPercentage !== 100) && <button
                                        onClick={() => handlePlanSectionRoute(section?._id)}
                                        className="ml-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg hover:shadow-indigo-500/40 hover:scale-105 transition-all"
                                    >
                                        Action
                                    </button>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 shadow-md">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {activeExecution} Timeline
                                    </h4>

                                    {/* DATE INFO */}
                                    <div className="space-y-3 text-xs mb-3">

                                        {/* Section Dates */}
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-600">Section</span>
                                            <div className="flex gap-4 font-bold text-amber-900">
                                                <span>{formatDateDDMMYY(section.sectionStartDate)}</span>
                                                <span>→</span>
                                                <span>{formatDateDDMMYY(section.sectionEndDate)}</span>
                                            </div>
                                        </div>

                                        {/* Execution Dates */}
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-600">{activeExecution}</span>
                                            <div className="flex gap-4 font-bold text-amber-900">
                                                <span>{formatDateDDMMYY(section.startDate)}</span>
                                                <span>→</span>
                                                <span>{formatDateDDMMYY(section.endDate)}</span>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-gray-600">
                                            <span>{formatDateDDMMYY(section.sectionStartDate) || "Start"}</span>
                                            <span>{formatDateDDMMYY(section.sectionEndDate) || "End"}</span>
                                        </div>

                                        <div className="relative h-4 bg-gray-300 rounded-full overflow-hidden shadow-inner">
                                            {/* Section Background */}
                                            <div className="absolute h-full w-full bg-green-500/40 rounded-full"></div>

                                            {/* Floating Phase Bar */}
                                            {(() => {
                                                const { left, width } = getPhasePosition(
                                                    section.startDate,
                                                    section.endDate,
                                                    section.sectionStartDate,
                                                    section.sectionEndDate
                                                );
                                                return (
                                                    <div
                                                        className="absolute h-full bg-indigo-500 rounded-full opacity-90"
                                                        style={{ left, width }}
                                                    />
                                                );
                                            })()}
                                        </div>

                                        <div className="text-[10px] text-center font-medium text-gray-700">
                                            {formatDateDDMMYY(section.startDate) || "Start"} → {formatDateDDMMYY(section.endDate) || "End"}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4 p-1 rounded-xl bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 shadow-lg">
                                    <div className="h-full w-full rounded-lg bg-white p-4">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Development Scope
                                        </h4>
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {project?.project?.devScope || "No scope defined"}
                                        </p>
                                    </div>
                                </div>
                            </div>





                            {/* Engineers Section */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Assigned Engineers */}
                                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 shadow-md">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Assigned Engineers ({section.engineers?.length || 0})
                                    </h4>
                                    <div className="max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-400/80 scrollbar-track-emerald-100/50 scrollbar-thumb-rounded-full pr-2 space-y-2">
                                        {section.engineers?.length > 0 ? (
                                            section.engineers.map((engineer, idx) => (
                                                <div
                                                    key={engineer._id || idx}
                                                    className="flex items-center gap-2 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-emerald-200 hover:shadow-md hover:scale-[1.01] transition-all"
                                                >
                                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md flex-shrink-0">
                                                        {engineer.name?.charAt(0) || "E"}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-900 truncate">
                                                            {engineer.name}
                                                        </p>
                                                        <p className="text-[10px] text-gray-600 truncate">
                                                            {engineer.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">No engineers assigned</p>
                                        )}
                                    </div>
                                </div>

                                {/* Peer Engineers */}
                                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200/50 shadow-md">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-violet-700 mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        All Engineers ({section.peerEngineers?.length || 0})
                                    </h4>
                                    <div className="max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-violet-400/80 scrollbar-track-violet-100/50 scrollbar-thumb-rounded-full pr-2 space-y-2">
                                        {section.peerEngineers?.length > 0 ? (
                                            section.peerEngineers.map((peer, idx) => (
                                                <div
                                                    key={peer._id || idx}
                                                    className="flex items-center gap-2 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-violet-200 hover:shadow-md hover:scale-[1.01] transition-all"
                                                >
                                                    <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md flex-shrink-0">
                                                        {peer.name?.charAt(0) || "P"}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-900 truncate">
                                                            {peer.name}
                                                        </p>
                                                        <p className="text-[10px] text-gray-600 truncate">
                                                            {peer.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">No peer engineers assigned</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}
