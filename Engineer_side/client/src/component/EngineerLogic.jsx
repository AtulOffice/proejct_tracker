import React from "react";

export default function LogicDevelopmentExecution({ project }) {
  console.log(project);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border-2 border-white/60 bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border-b-2 border-gray-200 p-8">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LOGIC DEVELOPMENT EXECUTION
                </h2>

              </div>

              <span className="flex-shrink-0 rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100 px-5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-lg">
                In Progress
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Section Name & Scope */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                  Section Name
                </label>
                <input
                  className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                  placeholder="e.g. Packing Line PLC Logic"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                  Dev. Scope
                </label>
                <input
                  className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
                  placeholder="Brief scope / boundaries of logic development"
                />
              </div>
            </div>

            {/* Assigned To */}
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                Assigned to (Email IDs)
              </label>
              <input
                className="w-3/4 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
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
                  {Array.from({ length: 25 }).map((_, i) => (
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
                  value={new Date().toLocaleDateString('en-IN')}
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
                className="group relative px-10 py-5 text-white font-black text-base uppercase tracking-wider rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
