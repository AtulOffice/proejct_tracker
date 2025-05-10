import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAppContext } from "../appContex";
import Notfound from "../utils/Notfound";
import FilterCompo from "../utils/FilterCompo";

import CardWorkStatus from "./CardWorkStatus";

const ProjectWorkStatus = () => {
  const { fullWrksts, setToggle, fetchProjects } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  useEffect(() => {
    const filtered = fullWrksts.filter((project) => {
      const matchesSearch =
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.jobNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const projectDate = new Date(project?.createdAt);
      const currentDate = new Date();

      if (timeFilter === "all") return matchesSearch;

      if (timeFilter === "today") {
        return (
          matchesSearch &&
          projectDate.toDateString() === currentDate.toDateString()
        );
      }

      if (timeFilter === "thisWeek") {
        const weekAgo = new Date();
        weekAgo.setDate(currentDate.getDate() - 7);
        return matchesSearch && projectDate >= weekAgo;
      }

      if (timeFilter === "thisMonth") {
        const monthAgo = new Date();
        monthAgo.setMonth(currentDate.getMonth() - 1);
        return matchesSearch && projectDate >= monthAgo;
      }

      if (timeFilter === "thisYear") {
        const projectYear = projectDate.getFullYear();
        const currentYear = currentDate.getFullYear();
        return matchesSearch && projectYear === currentYear;
      }

      return matchesSearch;
    });

    setFilteredProjects(filtered);
  }, [searchTerm, timeFilter, fullWrksts]);

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

  return (
    <div className="max-w-8xl h-[100vh] ml-60 px-6 py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm">
      <h2 className="text-3xl font-bold text-gray-800 my-8 ml-10">
        WORK STATUS
      </h2>

      <FilterCompo
        searchTerm={searchTerm}
        setToggle={setToggle}
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
            <CardWorkStatus
              key={indx}
              project={project}
              indx={indx}
              setToggle={setToggle}
            />
          ))
        ) : (
          <Notfound />
        )}
      </div>
    </div>
  );
};

export default ProjectWorkStatus;
