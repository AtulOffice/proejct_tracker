import React from "react";
import { OrderDetailsCard } from "./financialCard";
import { ProjectDetailsCard } from "./ProjectviewCard";

const OrderDetailsPopup = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-linear-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md sm:max-w-3xl lg:max-w-6xl max-h-[92vh] overflow-hidden flex flex-col transform transition-all duration-300 animate-slideUp">
        <div className="relative bg-linear-to-r from-indigo-600 via-purple-700 to-purple-900 text-white px-6 sm:px-8 py-6 sm:py-8 flex justify-between items-center overflow-hidden min-h-20 sm:min-h-[100px]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight mb-1.5 sm:mb-2">
                Order Details
              </h2>
              <p className="text-sm sm:text-base text-purple-100 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse"></span>
                {order?.orderNumber || "N/A"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-2.5 transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
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

        <div className="overflow-y-auto p-5 sm:p-8 bg-linear-to-br from-gray-50 to-blue-50/30 scrollbar-modern">
          <OrderDetailsCard order={order} />
          <ProjectDetailsCard project={order?.ProjectDetails} />
        </div>
      </div>
    </div>
  );
};
export default OrderDetailsPopup;