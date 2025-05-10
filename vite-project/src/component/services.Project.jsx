import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAppContext } from "../appContex";
import CardAll from "./Card.All";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";
import FilterCompo from "../utils/FilterCompo";
import { filterProjectsUtils } from "../utils/filterUtils";

const ProjectUpcomming = () => {
  const { fullData: rowData, setToggle, fetchProjects } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const data = useMemo(() => {
    if (!rowData) return [];
    return rowData.filter((project) => project.soType === "SERVICE");
  }, [rowData]);
  useEffect(() => {
    const filtered = filterProjectsUtils({
      data,
      searchTerm,
      timeFilter,
    });

    setFilteredProjects(filtered);
  }, [searchTerm, timeFilter, data]);

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
  if (rowData.length == 0) {
    return <LoadingSkeltionAll />;
  }
  return (
    <div className="max-w-8xl h-[100vh] ml-60 px-6 py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm">
      <h2 className="text-3xl font-bold text-gray-800 my-8 ml-10">
        SERVICES
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
    </div>
  );
};

export default ProjectUpcomming;
