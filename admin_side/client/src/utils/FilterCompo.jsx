import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { toggleMode } from "../redux/slices/uiSlice";

const FilterCompo = ({
  searchTerm,
  setSearchTerm,
  timeFilter,
  setTimeFilter,
  filteredProjects,
  isFilterOpen,
  setIsFilterOpen,
  filterRef,
  EngHandle = false,
}) => {

  const dispatch = useDispatch()

  const mapTime = {
    all: "All TIME",
    today: "TODAY",
    thisWeek: "THIS WEEK",
    thisMonth: "THIS MONTH",
    thisYear: "THIS YEAR",
  };
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between mb-2 gap-6 w-full">
        {/* SEARCH BOX */}
        <div className="relative w-full lg:w-1/2 group mb-4 lg:mb-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 group-focus-within:text-gray-700 transition-colors"
              fill="currentColor"
              viewBox="0 0 20 20"
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
            className="bg-white border-2 border-gray-200 text-gray-900 text-md rounded-xl 
        focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 
        block w-full pl-12 py-1 px-3 transition-all shadow-sm"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex w-full lg:w-auto justify-between lg:justify-start gap-4">

          {/* REFRESH BUTTON */}
          <button
            onClick={async (e) => {
              e.stopPropagation();
              const refreshIcon = document.getElementById("refreshIcon");
              refreshIcon.classList.add("animate-spin");
              setTimeFilter("all");
              setSearchTerm("");
              dispatch(toggleMode());
              setTimeout(() => refreshIcon.classList.remove("animate-spin"), 1000);
            }}
            className="h-9 w-9 rounded-lg bg-white hover:bg-gray-100 text-gray-800 
  border border-gray-300 transition-all duration-200 
  flex items-center justify-center shadow-sm shrink-0"
            title="Refresh tasks"
          >
            <svg
              id="refreshIcon"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform duration-1000"
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
          </button>


          {/* FILTER BUTTON */}
          <div ref={filterRef} className="relative w-auto lg:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full lg:w-auto text-gray-800 bg-white 
  hover:bg-gray-100 focus:ring-2 focus:ring-indigo-200 
  font-medium rounded-lg text-sm px-4 py-2 
  inline-flex items-center justify-center shadow-sm 
  transition-all shrink-0 border border-gray-300"

              type="button"
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                ></path>
              </svg>

              {mapTime[timeFilter] || "Filter by time"}

              <svg
                className="w-4 h-4 ml-2 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 z-40 w-40 mt-2 bg-white rounded-lg shadow-xl border border-gray-200"

                >
                  <ul className="p-2 space-y-1 text-sm text-gray-700">
                    {["all", "today", "thisWeek", "thisMonth", "thisYear"].map((filter) => (
                      <li key={filter}>
                        <div className="flex items-center p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                          <input
                            type="radio"
                            id={`filter-${filter}`}
                            name="timeFilter"
                            value={filter}
                            checked={timeFilter === filter}
                            onChange={() => {
                              setIsFilterOpen(false);
                              setTimeFilter(filter);
                            }}
                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-${filter}`}
                            className="ml-2 w-full text-sm font-medium text-gray-900"
                          >
                            {filter === "all" && "All time"}
                            {filter === "today" && "Today"}
                            {filter === "thisWeek" && "This week"}
                            {filter === "thisMonth" && "This month"}
                            {filter === "thisYear" && "This year"}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* PROJECT COUNT */}
      {!EngHandle && (
        <div className="mb-6 flex items-center">
          <span className="bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full mr-2">
            {filteredProjects.length}
          </span>
          <p className="text-gray-600">projects found</p>
        </div>
      )}
    </>

  );
};

export default FilterCompo;
