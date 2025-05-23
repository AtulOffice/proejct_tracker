import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../appContex";
import CardAll from "./Card.All";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";
import { filterProjectsUtils } from "../utils/filterUtils";
import FilterCompo from "../utils/FilterCompo";
import dayjs from "dayjs";
import { fetchProjectsUrgent } from "../utils/apiCall";

const UrgentProjects = () => {
  const { setToggle, toggle } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState();

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
          const val = await fetchProjectsUrgent({
            page: currentPage,
            search: debounceSearchTerm,
            status: "running",
            startDate: dayjs(Date.now()).format("YYYY-MM-DD"),
          });
          if (val?.data) {
            setData(val.data);
          }
          if (val?.hashMore !== undefined) {
            setHasMore(val.hashMore);
          }
        } catch (error) {
          console.error("Failed to fetch by jobNumber", error);
        }
      } else {
        const val = await fetchProjectsUrgent({
          search: "",
          status: "running",
          page: currentPage,
          startDate: dayjs(Date.now()).format("YYYY-MM-DD"),
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
  }, [currentPage, toggle, debounceSearchTerm]);

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

  if (!data) {
    return <LoadingSkeltionAll />;
  }

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

  return (
    <div className="max-w-8xl min-h-[140vh] ml-60 px-6 py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm">
      <h2 className="text-3xl font-bold text-gray-800 my-8 ml-10">
        URGENT
      </h2>

      <FilterCompo
        setToggle={setToggle}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        filteredProjects={filteredProjects}
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
              deleteButton={false}
              project={project}
              indx={indx}
              id={project._id}
              setToggle={setToggle}
              shortFlag={false}
            />
          ))
        ) : (
          <Notfound />
        )}
      </div>
      {hasMore && filteredProjects.length !== 0 && (
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
        </div>
      )}
    </div>
  );
};

export default UrgentProjects;
