import React from "react";

export default function LogicDevelopmentExecution() {
  return (
    <div className="ml-60 min-h-screen bg-gray-100 py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-sm shadow-lg">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-wide">
                16. LOGIC DEVELOPMENT EXECUTION
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Plan, assign and monitor logic development sections with clearly defined targets.
              </p>
            </div>

            <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-700">
              In Progress
            </span>
          </div>

          {/* Number of Sections */}
          <div className="mb-4 flex items-center gap-4">
            <label className="w-48 text-xs font-semibold uppercase tracking-wide text-gray-700">
              Number of Sections
            </label>
            <input
              className="w-24 rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-xs text-gray-800"
              disabled
            />
            <span className="text-[10px] text-amber-600">
              Auto-calculated from assigned sections.
            </span>
          </div>

          <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Section Header */}
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Section #1
              <span className="ml-2 text-[10px] font-normal text-gray-500">
                (repeated for each assigned section)
              </span>
            </h3>
            <button className="rounded-md border border-cyan-300 bg-cyan-50 px-3 py-1 text-[11px] font-medium text-cyan-700 hover:bg-cyan-100 transition">
              + Add Section
            </button>
          </div>

          {/* Section Name & Scope */}
          <div className="mb-4 grid grid-cols-2 gap-6">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                Section Name
              </label>
              <input
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-xs text-gray-800 placeholder:text-gray-400"
                placeholder="e.g. Packing Line PLC Logic"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                Dev. Scope
              </label>
              <input
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-xs text-gray-800 placeholder:text-gray-400"
                placeholder="Brief scope / boundaries of logic development"
              />
            </div>
          </div>

          {/* Assigned To */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
              Assigned to (Email IDs)
            </label>
            <input
              className="w-3/4 rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-xs text-gray-800 placeholder:text-gray-400"
              placeholder="engineer1@company.com, engineer2@company.com"
            />
          </div>

          {/* Target Dates */}
          <div className="mb-5 grid grid-cols-4 gap-6 items-end">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-rose-600">
                Target Start Date
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-xs text-gray-800"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-rose-600">
                Target End Date
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-xs text-gray-800"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                # of days
              </label>
              <input
                className="w-20 rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-center text-xs text-gray-500"
                disabled
              />
            </div>
          </div>

          {/* Target Progress */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-rose-600">
              Target Progress (Day)
            </label>

            <div className="inline-flex rounded-md border border-emerald-300 bg-emerald-50 px-2 py-2">
              <div className="flex items-center gap-1 text-[10px]">
                {Array.from({ length: 26 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-4 w-5 items-center justify-center rounded-[3px] bg-emerald-400 text-[9px] font-semibold text-white"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-1 flex gap-1 text-[9px] text-gray-600">
              {Array.from({ length: 26 }).map((_, i) => (
                <div key={i} className="w-5 text-center">
                  {Math.round(((i + 1) / 26) * 100)}%
                </div>
              ))}
            </div>
          </div>

          {/* Actual Dates */}
          <div className="mb-5 grid grid-cols-4 gap-6 items-end">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                Actual Start Date
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                Actual End Date
              </label>
              <input
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs text-gray-500"
                disabled
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                # of days
              </label>
              <input
                className="w-20 rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-center text-xs text-gray-500"
                disabled
              />
            </div>
          </div>

          {/* Current Progress */}
          <div className="mb-5 grid grid-cols-3 gap-6">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                Current Date
              </label>
              <input
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs text-gray-600"
                disabled
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                Actual Progress Day
              </label>
              <input
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs text-gray-600"
                disabled
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                Actual Completion %
              </label>
              <input
                className="w-full rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-900 placeholder:text-amber-500"
                placeholder="e.g. 45%"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
              Remarks
            </label>
            <textarea
              rows={3}
              className="w-full rounded-md border border-amber-300 bg-amber-50 px-2 py-2 text-xs text-amber-900 placeholder:text-amber-500"
              placeholder="Add important notes, risks or dependencies related to this section."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
