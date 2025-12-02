import React from "react";
import { useAppContext } from "../appContex";

const FilterCompoWeek = ({ searchTerm, setSearchTerm }) => {
  const { setToggle } = useAppContext();
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <div className="relative w-full sm:w-1/2 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              className="w-5 h-5 text-indigo-500 group-focus-within:text-indigo-600 transition-colors"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            className="bg-white border-2 border-gray-200 text-gray-900 text-md rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 block w-full pl-12 p-3.5 transition-all shadow-sm"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="hidden sm:flex sm:justify-end w-auto">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              const refreshIcon = document.getElementById("refreshIcon");
              refreshIcon.classList.add("animate-spin");
              setSearchTerm("");
              setToggle((prev) => !prev);
              setTimeout(() => {
                refreshIcon.classList.remove("animate-spin");
              }, 1000);
            }}
            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 flex items-center justify-center shadow-sm relative overflow-hidden"
            title="Refresh projects"
          >
            <svg
              id="refreshIcon"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transition-transform duration-1000"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>{" "}
        </div>
      </div>
    </>
  );
};

export default FilterCompoWeek;
