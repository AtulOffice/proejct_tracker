import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../appContex";
import CardAll from "./Card.Projects";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";
import { filterProjectsUtils } from "../utils/filterUtils";
import FilterCompo from "../utils/FilterCompo";
import FilterCompodev from "../utils/filtercompo.dev";
import CardWorkStatus from "./CardWorkStatus";
import { fetchProjects, fetchWorkStatusEngineerEngineer } from "../utils/apiCall";
import { fetchProjectsDevprogress } from "../utils/apiCall.Dev";
import CardStatus from "./Card.Development";

export const ProjectCatogary = ({
  status,
  title,
  soType,
  urgentMode,
  all,
  devStatus,
  workStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [hasMore, setHasMore] = useState(true);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState();
  const [debounceSearchTerm, setdebounceSerchTerm] = useState(searchTerm);
  const { toggle, user } = useAppContext();

  useEffect(() => {
    const handler = setTimeout(() => {
      setdebounceSerchTerm(searchTerm);
    }, 2000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        let val;
        if (all) {
          val = await fetchProjects({
            id: user?._id,
            page: currentPage,
            search: debounceSearchTerm || "",
          });
        } else if (devStatus) {
          val = await fetchProjectsDevprogress({
            page: currentPage,
            search: debounceSearchTerm || "",
            statusFilter: statusFilter,
          });
        } else {
          val = await fetchWorkStatusEngineerEngineer({
            id: user?._id,
            page: currentPage,
            search: debounceSearchTerm || "",
          });
        }
        if (val?.data) setData(val.data);
        if (val?.hashMore !== undefined) setHasMore(val.hashMore);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    getProjects();
  }, [
    currentPage,
    toggle,
    debounceSearchTerm,
    soType,
    status,
    urgentMode,
    workStatus,
    devStatus,
  ]);

  useEffect(() => {
    if (!data) return;
    const filterfun = setTimeout(() => {
      const filtered = filterProjectsUtils({
        data: data,
        timeFilter,
      });
      setFilteredProjects(filtered);
    }, 100);

    return () => clearTimeout(filterfun);
  }, [timeFilter, data]);

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

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
      setSearchTerm("");
      setTimeFilter("all");
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setSearchTerm("");
      setTimeFilter("all");
    }
  };

  if (!data) {
    return <LoadingSkeltionAll />;
  }

  return (
    <div className="max-w-8xl min-h-[140vh] lg:ml-60 px-6 py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm">
      <h2 className="text-3xl font-bold text-gray-800 my-8 ml-10">{title}</h2>

      {devStatus ? (
        <FilterCompodev
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredProjects={filteredProjects}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          filterRef={filterRef}
        />
      ) : (
        <FilterCompo
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          filteredProjects={filteredProjects}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          filterRef={filterRef}
        />
      )}

      <div
        layout="true"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, indx) =>
            devStatus ? (
              <CardStatus key={indx} project={project} indx={indx} />
            ) : workStatus ? (
              <CardWorkStatus key={indx} project={project} indx={indx} />
            ) : (
              <CardAll
                key={indx}
                project={project}
                indx={indx}
              />
            )
          )
        ) : (
          <Notfound />
        )}
      </div>
      {hasMore && filteredProjects.length !== 0 && (
        <div className="w-full mt-12 px-4 flex flex-row justify-between items-center gap-3 overflow-x-auto">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 py-3 px-4 sm:px-6 rounded-full font-semibold text-white shadow-lg
                 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600
                 transform transition-all duration-300
                 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Prev</span>
          </button>
          <button
            onClick={handleNextPage}
            className="flex items-center gap-2 py-3 px-4 sm:px-6 rounded-full font-semibold text-white shadow-lg
                 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600
                 hover:from-green-500 hover:via-blue-600 hover:to-indigo-700
                 transform transition-all duration-300 flex-shrink-0"
          >
            <span className="hidden sm:inline">Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
