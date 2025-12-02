import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../appContex";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";
import { filterProjectsUtils } from "../utils/filterUtils";
import FilterCompo from "../utils/FilterCompo";
import { fetfchProejctAll } from "../utils/apiCall";
import ProjectTableAll from "./projectListTable";

const ProjectList = () => {
  const { toggle } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
          const val = await fetfchProejctAll({
            search: debounceSearchTerm,
          });
          if (val) {
            setData(val);
          }
        } catch (error) {
          console.error("Failed to fetch by jobNumber", error);
        }
      } else {
        const val = await fetfchProejctAll({
          search: "",
        });
        if (val) {
          setData(val);
        }
        try {
        } catch (error) {
          console.error("Failed to fetch paginated data", error);
        }
      }
    };
    getProjects();
  }, [toggle, debounceSearchTerm]);

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

  if (!data) {
    return <LoadingSkeltionAll />;
  }

  return (
    <div className="max-w-8xl h-full lg:ml-60 px-6 py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm">
      <FilterCompo
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        filteredProjects={filteredProjects}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        filterRef={filterRef}
        EngHandle={true}
      />

      <div
        layout="true"
        className="w-full min-h-[56vh] h-full overflow-hidden rounded-xl shadow-lg bg-white border border-gray-200"
      >
        {filteredProjects.length > 0 ? (
          <ProjectTableAll data={filteredProjects} />
        ) : (
          <Notfound />
        )}
      </div>
    </div>
  );
};

export default ProjectList;
