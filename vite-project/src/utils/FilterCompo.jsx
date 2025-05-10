import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const FilterCompo = ({
  setToggle,
  searchTerm,
  setSearchTerm,
  timeFilter,
  setTimeFilter,
  filteredProjects,
  fetchProjects,
  isFilterOpen,
  setIsFilterOpen,
  filterRef,
}) => {
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between mb-10 gap-6">
        <div className="relative w-full lg:w-1/2 group">
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

        <div className="flex">
          <div className="mx-4 my-2">
            <button
              onClick={() => {
                const refreshIcon = document.getElementById("refreshIcon");
                refreshIcon.classList.add("animate-spin");

                fetchProjects(true);
                setTimeFilter("all");
                setSearchTerm("");
                setToggle((prev) => !prev);

                setTimeout(() => {
                  refreshIcon.classList.remove("animate-spin");
                }, 1000);
              }}
              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 flex items-center justify-center shadow-sm relative overflow-hidden"
              title="Refresh tasks"
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
            </button>
          </div>
          <div>
            <div ref={filterRef} className="relative w-full lg:w-auto">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full lg:w-auto text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-xl text-md px-6 py-3.5 text-center inline-flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all"
                type="button"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Filter by time
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 w-40 mt-3 bg-white rounded-xl shadow-xl border border-gray-100 dark:bg-gray-400"
                  >
                    <ul className="p-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      {[
                        "all",
                        "today",
                        "thisWeek",
                        "thisMonth",
                        "thisYear",
                      ].map((filter) => (
                        <li key={filter}>
                          <div className="flex p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
                            <input
                              type="radio"
                              id={`filter-${filter}`}
                              name="timeFilter"
                              value={filter}
                              checked={timeFilter === filter}
                              onChange={() => setTimeFilter(filter)}
                              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-700"
                            />
                            <label
                              htmlFor={`filter-${filter}`}
                              className="ml-2 w-full text-md font-medium text-gray-900 dark:text-gray-300"
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
      </div>
      <div className="mb-6 flex items-center">
        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full mr-2">
          {filteredProjects.length}
        </span>
        <p className="text-gray-600">projects found</p>
      </div>
    </>
  );
};

export default FilterCompo;
