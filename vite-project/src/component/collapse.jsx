import React from "react";
import { useState } from "react";

export const Collapsible = ({ title, children }) => {
    const [open, setOpen] = useState(true);

    return (
        <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg shadow-sm overflow-hidden">

            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center p-4 bg-indigo-100 hover:bg-indigo-200 transition text-indigo-800 font-bold text-lg"
            >
                <span>{title}</span>

                <svg
                    className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : "rotate-0"
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Content */}
            <div
                className={`transition-all duration-300 ${open ? "max-h-screen opacity-100 p-6" : "max-h-0 opacity-0 p-0"
                    }`}
            >
                {children}
            </div>
        </div>
    );
};
