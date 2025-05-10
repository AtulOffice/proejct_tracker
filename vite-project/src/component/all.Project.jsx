import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../appContex";
import CardAll from "./Card.All";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";
import { filterProjectsUtils } from "../utils/filterUtils";
import FilterCompo from "../utils/FilterCompo";

const ProjectsAll = () => {
  const { setPage, data, fetchProjects, hasMore, fullData } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filtMore, setFiltMore] = useState(true);

  const allData = useRef([]);
  const debounceTimer = useRef(null);
  allData.current = fullData;
  useEffect(() => {
    if (data.length == 0 || fullData.length == 0) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setFiltMore(searchTerm.length === 0);
    debounceTimer.current = setTimeout(() => {
      const sourceData = searchTerm.trim() === "" ? data : allData.current;

      const filtered = filterProjectsUtils({
        data: sourceData,
        searchTerm,
        timeFilter,
      });
      setFilteredProjects(filtered);
    }, 200);

    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, timeFilter, data, fullData]);

  const filterRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (data.length === 0 || fullData.length === 0) {
    return <LoadingSkeltionAll />;
  }
  return (
    <div className="max-w-8xl h-[100vh] ml-60 px-6 py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm">
      <h2 className="text-3xl font-bold text-gray-800 my-8 ml-10">
        ALL PROJECTS
      </h2>
      <FilterCompo
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        filteredProjects={filteredProjects}
        fetchProjects={fetchProjects}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        filterRef={filterRef}
      />
      <div
        layout="true"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, indx) => (
            <CardAll
              key={indx}
              project={project}
              indx={indx}
              fetchProjects={fetchProjects}
            />
          ))
        ) : (
          <Notfound />
        )}
      </div>
      {filtMore && hasMore && filteredProjects.length !== 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              setPage((prev) => prev + 1);
              setSearchTerm("");
              setTimeFilter("all");
            }}
            className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-600 hover:via-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out flex items-center gap-2 group"
          >
            <span>Load More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 animate-bounce group-hover:animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsAll;
