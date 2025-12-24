// import React, { useEffect, useRef } from "react";

// export default function TestingDevelopmentExecution() {
//     const modalRef = useRef(null);

//     // Close on ESC key
//     useEffect(() => {
//         const handleEscape = (e) => {
//             if (e.key === "Escape") onClose?.();
//         };
//         document.addEventListener("keydown", handleEscape);
//         return () => document.removeEventListener("keydown", handleEscape);
//     }, [onClose]);

//     // Close on outside click
//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (modalRef.current && !modalRef.current.contains(e.target)) {
//                 onClose?.();
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [onClose]);

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/90 via-black/80 to-slate-900/90 backdrop-blur-xl p-6 overflow-hidden animate-in fade-in duration-300">
//             <div
//                 ref={modalRef}
//                 className="relative w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-3xl border-2 border-white/20 bg-white shadow-2xl shadow-black/40 animate-in zoom-in-95 duration-300"
//             >
//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="group absolute top-6 right-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-xl hover:bg-white border-2 border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:rotate-90"
//                 >
//                     <svg
//                         className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth={2.5}
//                         viewBox="0 0 24 24"
//                     >
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                 </button>

//                 {/* Scrollable Content */}
//                 <div className="max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
//                     <div className="p-10">
//                         {/* Header */}
//                         <div className="mb-8 flex items-center justify-between gap-6 pb-6 border-b-2 border-gray-200">
//                             <div>
//                                 <h2 className="text-2xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
//                                     18. TESTING DEVELOPMENT EXECUTION
//                                 </h2>
//                                 <p className="mt-2 text-sm text-gray-600">
//                                     Plan, assign and monitor Testing development sections with clearly defined targets.
//                                 </p>
//                             </div>

//                             <span className="flex-shrink-0 rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100 px-5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-lg">
//                                 In Progress
//                             </span>
//                         </div>

//                         {/* Number of Sections */}
//                         <div className="mb-6 flex items-center gap-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200">
//                             <label className="w-52 text-sm font-bold uppercase tracking-wide text-gray-700">
//                                 Number of Sections
//                             </label>
//                             <input
//                                 className="w-28 rounded-xl border-2 border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm"
//                                 disabled
//                             />
//                             <span className="text-xs text-amber-600 font-medium">
//                                 Auto-calculated from assigned sections.
//                             </span>
//                         </div>

//                         <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

//                         {/* Section Header */}
//                         <div className="mb-5 flex items-center justify-between">
//                             <h3 className="text-lg font-black text-gray-900">
//                                 Section #1
//                                 <span className="ml-3 text-xs font-normal text-gray-500">
//                                     (repeated for each assigned section)
//                                 </span>
//                             </h3>
//                             <button className="group rounded-xl border-2 border-cyan-300 bg-gradient-to-r from-cyan-50 to-cyan-100 px-5 py-2.5 text-xs font-bold text-cyan-700 hover:from-cyan-100 hover:to-cyan-200 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2">
//                                 <svg
//                                     className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth={2.5}
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//                                 </svg>
//                                 Add Section
//                             </button>
//                         </div>

//                         {/* Section Name & Scope */}
//                         <div className="mb-6 grid grid-cols-2 gap-6">
//                             <div>
//                                 <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
//                                     Section Name
//                                 </label>
//                                 <input
//                                     className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all"
//                                     placeholder="e.g. Packing Line PLC Testing"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
//                                     Dev. Scope
//                                 </label>
//                                 <input
//                                     className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all"
//                                     placeholder="Brief scope / boundaries of Testing development"
//                                 />
//                             </div>
//                         </div>

//                         {/* Assigned To */}
//                         <div className="mb-6">
//                             <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
//                                 Assigned to (Email IDs)
//                             </label>
//                             <input
//                                 className="w-3/4 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all"
//                                 placeholder="engineer1@company.com, engineer2@company.com"
//                             />
//                         </div>

//                         {/* Target Dates */}
//                         <div className="mb-6 grid grid-cols-4 gap-6 items-end">
//                             <div>
//                                 <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-rose-600">
//                                     Target Start Date
//                                 </label>
//                                 <input
//                                     type="date"
//                                     className="w-full rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-2.5 text-sm text-rose-900 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-rose-600">
//                                     Target End Date
//                                 </label>
//                                 <input
//                                     type="date"
//                                     className="w-full rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-2.5 text-sm text-rose-900 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
//                                     # of days
//                                 </label>
//                                 <input
//                                     className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-semibold text-gray-600 shadow-sm"
//                                     disabled
//                                 />
//                             </div>
//                         </div>

//                         {/* Target Progress */}
//                         <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
//                             <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-emerald-700">
//                                 Target Progress (Day)
//                             </label>

//                             <div className="inline-flex rounded-xl border-2 border-emerald-300 bg-white/80 backdrop-blur-sm px-3 py-3 shadow-lg">
//                                 <div className="flex items-center gap-1.5 text-xs">
//                                     {Array.from({ length: 26 }).map((_, i) => (
//                                         <div
//                                             key={i}
//                                             className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-[10px] font-black text-white shadow-md hover:scale-110 transition-transform cursor-pointer"
//                                         >
//                                             {i + 1}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="mt-2 flex gap-1.5 text-[10px] font-semibold text-emerald-700">
//                                 {Array.from({ length: 26 }).map((_, i) => (
//                                     <div key={i} className="w-6 text-center">
//                                         {Math.round(((i + 1) / 26) * 100)}%
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Actual Dates */}
//                         <div className="mb-6 grid grid-cols-4 gap-6 items-end">
//                             <div>
//                                 <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
//                                     Actual Start Date
//                                 </label>
//                                 <input
//                                     type="date"
//                                     className="w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
//                                     Actual End Date
//                                 </label>
//                                 <input
//                                     className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm"
//                                     disabled
//                                 />
//                             </div>
//                             <div>
//                                 <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
//                                     # of days
//                                 </label>
//                                 <input
//                                     className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-semibold text-gray-600 shadow-sm"
//                                     disabled
//                                 />
//                             </div>
//                         </div>

//                         {/* Current Progress */}
//                         <div className="mb-6 grid grid-cols-3 gap-6">
//                             <div>
//                                 <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
//                                     Current Date
//                                 </label>
//                                 <input
//                                     className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm"
//                                     disabled
//                                 />
//                             </div>
//                             <div>
//                                 <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
//                                     Actual Progress Day
//                                 </label>
//                                 <input
//                                     className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm"
//                                     disabled
//                                 />
//                             </div>
//                             <div>
//                                 <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
//                                     Actual Completion %
//                                 </label>
//                                 <input
//                                     className="w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-900 placeholder:text-amber-500 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all"
//                                     placeholder="e.g. 45%"
//                                 />
//                             </div>
//                         </div>

//                         {/* Remarks */}
//                         <div className="mb-8">
//                             <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
//                                 Remarks
//                             </label>
//                             <textarea
//                                 rows={3}
//                                 className="w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 placeholder:text-amber-500 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all resize-none"
//                                 placeholder="Add important notes, risks or dependencies related to this section."
//                             />
//                         </div>

//                         {/* Submit Button */}
//                         <div className="flex justify-center pt-4 border-t-2 border-gray-200">
//                             <button
//                                 type="button"
//                                 className="group relative px-8 py-4 text-white font-black text-sm uppercase tracking-wider rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 shadow-2xl hover:shadow-teal-500/50 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
//                             >
//                                 <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                                 <span className="relative z-10 flex items-center gap-2">
//                                     <svg
//                                         className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth={2.5}
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                                         />
//                                     </svg>
//                                     SUBMIT PROGRESS STATUS
//                                 </span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React from "react";

export default function TestingDevelopmentExecution() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-8 px-4">
            <div className="mx-auto max-w-6xl">
                <div className="relative overflow-hidden rounded-3xl border-2 border-white/60 bg-white shadow-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-teal-500/10 border-b-2 border-gray-200 p-8">
                        <div className="flex items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                    18. TESTING DEVELOPMENT EXECUTION
                                </h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    Plan, assign and monitor Testing development sections with clearly defined targets.
                                </p>
                            </div>

                            <span className="flex-shrink-0 rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100 px-5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-lg">
                                In Progress
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">
                        {/* Number of Sections */}
                        <div className="flex items-center gap-6 p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border-2 border-gray-200 shadow-sm">
                            <label className="w-52 text-sm font-bold uppercase tracking-wide text-gray-700">
                                Number of Sections
                            </label>
                            <input
                                className="w-28 rounded-xl border-2 border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 shadow-sm"
                                disabled
                            />
                            <span className="text-xs text-amber-600 font-medium">
                                Auto-calculated from assigned sections.
                            </span>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                        {/* Section Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900">
                                Section #1
                                <span className="ml-3 text-sm font-normal text-gray-500">
                                    (repeated for each assigned section)
                                </span>
                            </h3>
                            <button className="group rounded-xl border-2 border-cyan-300 bg-gradient-to-r from-cyan-50 to-cyan-100 px-6 py-3 text-sm font-bold text-cyan-700 hover:from-cyan-100 hover:to-cyan-200 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Section
                            </button>
                        </div>

                        {/* Section Name & Scope */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Section Name
                                </label>
                                <input
                                    className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all"
                                    placeholder="e.g. Packing Line PLC Testing"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Dev. Scope
                                </label>
                                <input
                                    className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all"
                                    placeholder="Brief scope / boundaries of Testing development"
                                />
                            </div>
                        </div>

                        {/* Assigned To */}
                        <div>
                            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                Assigned to (Email IDs)
                            </label>
                            <input
                                className="w-3/4 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all"
                                placeholder="engineer1@company.com, engineer2@company.com"
                            />
                        </div>

                        {/* Target Dates */}
                        <div className="grid grid-cols-3 gap-6 items-end">
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-rose-600">
                                    Target Start Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-rose-600">
                                    Target End Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    # of days
                                </label>
                                <input
                                    className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-3 text-center text-sm font-semibold text-gray-600 shadow-sm"
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Target Progress */}
                        <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-lg">
                            <label className="mb-4 block text-base font-bold uppercase tracking-wide text-emerald-700">
                                Target Progress (Day)
                            </label>

                            <div className="inline-flex rounded-xl border-2 border-emerald-300 bg-white/80 backdrop-blur-sm px-4 py-4 shadow-lg">
                                <div className="flex items-center gap-2 text-xs">
                                    {Array.from({ length: 26 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-black text-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-3 flex gap-2 text-xs font-semibold text-emerald-700">
                                {Array.from({ length: 26 }).map((_, i) => (
                                    <div key={i} className="w-8 text-center">
                                        {Math.round(((i + 1) / 26) * 100)}%
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actual Dates */}
                        <div className="grid grid-cols-3 gap-6 items-end">
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Actual Start Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Actual End Date
                                </label>
                                <input
                                    className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    # of days
                                </label>
                                <input
                                    className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-3 text-center text-sm font-semibold text-gray-600 shadow-sm"
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Current Progress */}
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Current Date
                                </label>
                                <input
                                    className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Actual Progress Day
                                </label>
                                <input
                                    className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Actual Completion %
                                </label>
                                <input
                                    className="w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900 placeholder:text-amber-500 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all"
                                    placeholder="e.g. 45%"
                                />
                            </div>
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                Remarks
                            </label>
                            <textarea
                                rows={4}
                                className="w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 placeholder:text-amber-500 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all resize-none"
                                placeholder="Add important notes, risks or dependencies related to this section."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6 border-t-2 border-gray-200">
                            <button
                                type="button"
                                className="group relative px-10 py-5 text-white font-black text-base uppercase tracking-wider rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 shadow-2xl hover:shadow-teal-500/50 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 flex items-center gap-3">
                                    <svg
                                        className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    SUBMIT PROGRESS STATUS
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
