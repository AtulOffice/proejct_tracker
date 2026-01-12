import React, { useState, useEffect, useRef } from "react";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";
import EngineerTable from "./Engineer.table.jsx";
import { getAllEngineers } from "../apiCall/engineer.Api.js";
import { useSelector } from "react-redux";

const EngineerActions = () => {
  const { toggle } = useSelector((state) => state.ui);
  const [data, setData] = useState();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const val = await getAllEngineers();
        if (val) {
          setData(val.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };
    getProjects();
  }, [toggle]);

  if (!data) {
    return <LoadingSkeltionAll />;
  }

  return (
    <div className="max-w-8xl min-h-screen h-full lg:ml-60 px-6 py-20 bg-linear-to-br from-gray-50 to-white rounded-2xl shadow-sm">
      <div
        layout="true"
        className="w-full min-h-[55vh] h-full overflow-hidden rounded-xl shadow-lg bg-white border border-gray-200"
      >
        <EngineerTable data={data} />
      </div>
    </div>
  );
};

export default EngineerActions;
