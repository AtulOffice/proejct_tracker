import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../appContex";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";
import { filterProjectsUtils } from "../utils/filterUtils";
import FilterCompo from "../utils/FilterCompo";
import ProjectTableAll from "./projectListTable";

const ProjectList = ({ tableVal, isEdit, fetchFun, onEditFun, printTitle }) => {
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
          const val = await fetchFun({
            search: debounceSearchTerm,
          });
          if (val) {
            setData(val);
          }
        } catch (error) {
          console.error("Failed to fetch by jobNumber", error);
        }
      } else {
        const val = await fetchFun({
          search: "",
        });
        if (val) {
          setData(val);
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
    <div className="min-h-screen flex flex-col lg:ml-60 px-6 py-20 bg-linear-to-br from-gray-50 to-white rounded-2xl shadow-sm">

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

      <div className="flex-1 w-full overflow-hidden rounded-xl shadow-lg bg-white border border-gray-200">
        {filteredProjects.length > 0 ? (
          <ProjectTableAll
            data={filteredProjects}
            tableVal={tableVal}
            isEdit={isEdit}
            onEditFun={onEditFun}
            printTitle={printTitle}
          />
        ) : (
          <Notfound />
        )}
      </div>

    </div>

  );
};

export default ProjectList;
