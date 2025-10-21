import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../appContex";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";
import FilterCompo from "../utils/filtercompo.dev";
import CardStatus from "./Card.Status";
import { fetchProjectsDevprogress } from "../utils/apiCall.Dev";

const ProjectDev = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [hasMore, setHasMore] = useState(true);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState();
  const { toggleDev, setToggleDev, user } = useAppContext();
  const [debounceSearchTerm, setdebounceSerchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setdebounceSerchTerm(searchTerm);
    }, 2000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const getProjects = async () => {
      if (debounceSearchTerm && debounceSearchTerm.trim() !== "") {
        try {
          const val = await fetchProjectsDevprogress({
            page: currentPage,
            search: debounceSearchTerm,
            statusFilter: statusFilter,
          });
          if (val?.data) {
            setData(val.data);
          }

          setHasMore(val?.hashMore ?? false);
        } catch (error) {
          console.error("Failed to fetch by jobNumber", error);
        }
      } else {
        const val = await fetchProjectsDevprogress({
          page: currentPage,
          search: "",
          statusFilter: statusFilter,
        });
        if (val?.data) {
          setData(val.data);
        }
        if (val?.hashMore !== undefined) {
          setHasMore(val.hashMore);
        }
        try {
        } catch (error) {
          console.error("Failed to fetch paginated data", error);
        }
      }
    };
    getProjects();
  }, [currentPage, toggleDev, debounceSearchTerm, statusFilter]);
  useEffect(() => {
    if (!data) return;
    const filterfun = setTimeout(() => {
      const filtered = data;
      setFilteredProjects(filtered);
    }, 100);

    return () => clearTimeout(filterfun);
  }, [statusFilter, data]);

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

  if (!data) {
    return <LoadingSkeltionAll />;
  }

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
      setSearchTerm("");
      setStatusFilter("all");
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setSearchTerm("");
      setStatusFilter("all");
    }
  };
  return (
    <div className="max-w-8xl min-h-[140vh] ml-60 px-6 py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm">
      <h2 className="text-3xl font-bold text-gray-800 my-8 ml-10">
        PROJECT DEVEVLOPMENT STATUS
      </h2>
      <FilterCompo
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filteredProjects={filteredProjects}
        setToggle={setToggleDev}
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
            <CardStatus
              key={indx}
              project={project}
              indx={indx}
              setToggleDev={setToggleDev}
              userRole={user?.role === "admin"}
            />
          ))
        ) : (
          <Notfound />
        )}
      </div>
      {filteredProjects.length !== 0 && (
        <div className="flex justify-between w-full mt-12 px-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="mb-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-2 border-transparent hover:border-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transition-transform group-hover:-translate-x-1"
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
            <span>Prev</span>
          </button>

          {hasMore && (
            <button
              onClick={handleNextPage}
              className="mb-10 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 hover:from-indigo-700 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center gap-3 border-2 border-transparent hover:border-white"
            >
              <span>Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
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
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDev;
