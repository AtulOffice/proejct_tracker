import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../appContex";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";
import { getAllEngineers } from "../utils/apiCall";
import EngineerTable from "./Engineer.table.jsx";

const EngineerActions = () => {
  const { toggle } = useAppContext();
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
    <div className="max-w-8xl min-h-[100vh] h-full lg:ml-60 px-6 py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm">
      <div
        layout="true"
        className="w-full min-h-[55vh] h-full overflow-hidden rounded-xl shadow-lg bg-white border border-gray-200"
      >
         <EngineerTable data={data}/> 
      </div>
    </div>
  );
};

export default EngineerActions;
