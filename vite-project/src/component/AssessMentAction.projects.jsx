import React, { useState, useEffect } from "react";
import { useAppContext } from "../appContex";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";

import FilterCompoWeek from "../utils/FilterCompoWeek.jsx";
import { fetchWeeklyAssment } from "../utils/apiCall";
import WeeklyTableAll from "./WeeklyTableAll.jsx";

const WeekRecordList = () => {
  const { setToggle, toggle } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
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
          const val = await fetchWeeklyAssment({
            search: debounceSearchTerm,
          });
          if (val) {
            setData(val?.data);
          }
        } catch (error) {
          console.error("Failed to fetch ", error);
        }
      } else {
        const val = await fetchWeeklyAssment({
          search: "",
        });
        if (val) {
          setData(val?.data);
        }
        try {
        } catch (error) {
          console.error("Failed to fetch data", error);
        }
      }
    };
    getProjects();
  }, [toggle, debounceSearchTerm]);

  if (!data) {
    return <LoadingSkeltionAll />;
  }

  return (
    <div className="max-w-8xl h-full lg:ml-60 px-6 py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm">
      <FilterCompoWeek searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div
        layout="true"
        className="w-full min-h-[80vh] h-full overflow-auto sm:overflow-hidden rounded-xl shadow-lg bg-white border border-gray-200 p-2 sm:p-0"
      >
        {data && data?.length > 0 ? (
          <WeeklyTableAll data={data} />
        ) : (
          <Notfound />
        )}
      </div>
    </div>
  );
};

export default WeekRecordList;
