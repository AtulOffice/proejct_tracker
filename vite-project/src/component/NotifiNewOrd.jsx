import React from "react";

const NotifiNewOrd = ({ setOpen, data, setSelectData }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slideIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-3rem)] border border-indigo-200/50 overflow-hidden">
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-700 to-purple-900 text-white px-5 py-3 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
          </div>

          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg border border-white/30">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-wide">New Orders</h2>
                <p className="text-xs text-purple-200 flex items-center gap-1 -mt-0.5">
                  <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                  {data.length} {data.length === 1 ? "order" : "orders"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Close notifications"
            >
              <svg
                className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto overflow-x-hidden scrollbar-modern">
          {data.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.map((note, i) => (
                <div
                  onClick={() => {
                    setSelectData(note);
                    setOpen(false);
                  }}
                  key={i}
                  className="group px-4 py-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {note.jobNumber || "—"}
                        </p>
                        <span className="flex-shrink-0 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          New
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate font-medium">
                        {note.client || "—"}
                      </p>

                      {/* Optional: Show order value */}
                      {note.orderValueTotal && (
                        <p className="text-xs text-indigo-600 font-semibold mt-1">
                          ₹{(note.orderValueTotal / 100000).toFixed(2)} Lacs
                        </p>
                      )}
                    </div>

                    {/* Arrow Icon */}
                    <svg
                      className="flex-shrink-0 w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-2">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-700 mb-0.5">
                All caught up!
              </p>
              <p className="text-xs text-gray-500">No new orders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotifiNewOrd;
