import React from "react";

export default function ScadaDevelopmentExecution() {
    return (
        <div className="ml-60 min-h-screen bg-gray-100 py-16">
            <div className="mx-auto max-w-5xl px-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm shadow-lg space-y-5">
                    {/* Title */}
                    <div className="space-y-1">

                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">
                                17. SCADA DEVELOPMENT EXECUTION
                            </h3>
                            <span className="rounded-full border border-indigo-300 bg-indigo-50 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-indigo-700">
                                SCADA Panel
                            </span>
                        </div>
                    </div>

                    {/* Number of Sections */}
                    <div className="flex items-center gap-4">
                        <label className="font-semibold w-48 text-xs uppercase tracking-wide text-gray-700">
                            Number of Sections
                        </label>
                        <input
                            disabled
                            className="w-24 rounded-md bg-gray-50 border border-gray-300 px-2 py-1 text-xs text-gray-700"
                        />
                        <span className="text-red-600 text-xs">
                            Auto-calc based on how many sections have been assigned to the engineer
                        </span>
                    </div>

                    <div className="my-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                    {/* Section Header */}
                    <h4 className="font-semibold text-gray-900 flex items-center justify-between">
                        <span>
                            Section #1{" "}
                            <span className="text-xs font-normal text-gray-500">
                                (to be repeated for each assigned section)
                            </span>
                        </span>
                        <button className="rounded-md border border-cyan-300 bg-cyan-50 px-3 py-1 text-[11px] font-medium text-cyan-700 hover:bg-cyan-100 transition">
                            + Add Section
                        </button>
                    </h4>

                    {/* Section Info */}
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-rose-600">
                                Section Name
                            </label>
                            <input className="mt-1 w-full rounded-md bg-gray-50 border border-gray-300 px-2 py-1 text-xs text-gray-800 placeholder:text-gray-400" />
                        </div>

                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-rose-600">
                                # of Screens
                            </label>
                            <input className="mt-1 w-full rounded-md bg-gray-50 border border-gray-300 px-2 py-1 text-xs text-gray-800 placeholder:text-gray-400" />
                        </div>

                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-rose-600">
                                Assigned to (Email IDs)
                            </label>
                            <input className="mt-1 w-full rounded-md bg-gray-50 border border-gray-300 px-2 py-1 text-xs text-gray-800 placeholder:text-gray-400" />
                        </div>
                    </div>

                    {/* Target Dates */}
                    <div className="grid grid-cols-4 gap-6 items-end">
                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-rose-600">
                                Target Start Date
                            </label>
                            <input
                                type="date"
                                className="mt-1 w-full rounded-md bg-gray-50 border border-gray-300 px-2 py-1 text-xs text-gray-800"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-rose-600">
                                Target End Date
                            </label>
                            <input
                                type="date"
                                className="mt-1 w-full rounded-md bg-gray-50 border border-gray-300 px-2 py-1 text-xs text-gray-800"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-gray-700">
                                # of days
                            </label>
                            <input
                                disabled
                                className="mt-1 w-20 rounded-md bg-gray-100 border border-gray-300 px-2 py-1 text-center text-xs text-gray-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">(Auto-calc)</p>
                        </div>
                    </div>

                    {/* Target Progress */}
                    <div>
                        <label className="block font-semibold text-xs uppercase tracking-wide text-rose-600">
                            Target Progress (Day)
                        </label>

                        <div className="mt-2 inline-flex rounded-md border border-emerald-300 bg-emerald-50 px-2 py-2">
                            <div className="flex gap-1 text-[10px]">
                                {Array.from({ length: 26 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex h-4 w-6 items-center justify-center rounded-[3px] bg-emerald-400 text-[9px] font-semibold text-white"
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-1 text-[10px] mt-1 text-gray-600">
                            {Array.from({ length: 26 }).map((_, i) => (
                                <div key={i} className="w-6 text-center">
                                    {Math.round(((i + 1) / 26) * 100)}%
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actual Dates */}
                    <div className="grid grid-cols-4 gap-6 items-end">
                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-gray-700">
                                Actual Start Date
                            </label>
                            <input
                                type="date"
                                className="mt-1 w-full rounded-md bg-amber-50 border border-amber-300 px-2 py-1 text-xs text-amber-900"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-gray-700">
                                Actual End Date
                            </label>
                            <input
                                disabled
                                className="mt-1 w-full rounded-md bg-gray-100 border border-gray-300 px-2 py-1 text-xs text-gray-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                (Auto-calc when completion is 100%)
                            </p>
                        </div>

                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-gray-700">
                                # of days
                            </label>
                            <input
                                disabled
                                className="mt-1 w-20 rounded-md bg-gray-100 border border-gray-300 px-2 py-1 text-center text-xs text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-gray-700">
                                Current Date
                            </label>
                            <input
                                disabled
                                className="mt-1 w-full rounded-md bg-amber-50 border border-amber-300 px-2 py-1 text-xs text-amber-900"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-gray-700">
                                Actual Progress Day
                            </label>
                            <input
                                disabled
                                className="mt-1 w-full rounded-md bg-gray-100 border border-gray-300 px-2 py-1 text-xs text-gray-600"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                (Auto-calc from current & actual start)
                            </p>
                        </div>

                        <div>
                            <label className="block font-semibold text-xs uppercase tracking-wide text-gray-700">
                                Actual Completion %
                            </label>
                            <input
                                className="mt-1 w-full rounded-md bg-amber-50 border border-amber-300 px-2 py-1 text-xs text-amber-900 placeholder:text-amber-500"
                            />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block font-semibold text-xs uppercase tracking-wide text-gray-700">
                            Remarks
                        </label>
                        <textarea
                            rows={2}
                            className="mt-1 w-full rounded-md bg-amber-50 border border-amber-300 px-2 py-2 text-xs text-amber-900 placeholder:text-amber-500"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center pt-4">
                        <button
                            type="button"
                            className="px-6 py-2 text-white font-semibold rounded-md
                bg-gradient-to-b from-blue-500 to-blue-700
                shadow-md hover:from-blue-600 hover:to-blue-800
                transition"
                        >
                            SUBMIT PROGRESS STATUS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
