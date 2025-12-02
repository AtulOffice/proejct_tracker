import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import WeeklyAssignmentViewer from "./WeeklyAssignmentViewer";
import { fetchWeeklyAssmentbyId } from "../utils/apiCall";

const WeeklyTableAll = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [weekData, setWeekData] = useState([]);

  const navigate = useNavigate();
  const handleUpdate = (id) => {
    try {
      navigate(`/update/${id}`, {
        state: { fromButton: true, recordId: id },
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleFetch = async (id) => {
    try {
      const dataval = await fetchWeeklyAssmentbyId(id);
      if (dataval) {
        setWeekData(dataval?.data);
      }
      setOpen(true);
    } catch (e) {
      if (e.response) {
        toast.error(e.response?.data?.message);
      }
      console.log(e);
    }
  };

  return (
    <div className="relative h-full col-span-full w-full italic overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-b from-white via-blue-50 to-blue-100 border border-blue-200">
      <WeeklyAssignmentViewer
        open={open}
        onClose={() => setOpen(false)}
        weekData={weekData}
      />
      <div className="overflow-x-auto">
        <div className="max-h-[690px] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 via-pink-500 to-pink-600 text-white shadow-lg">
                <th className="w-1/5 px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                  ENGINEERS
                </th>
                <th className="w-1/5 px-6 py-5 text-right text-base font-bold tracking-wide uppercase">
                  DATE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {data.map((item, indx) => (
                <tr
                  key={indx}
                  className={`hover:bg-blue-50/60 transition-colors duration-150 ${indx % 2 === 0
                      ? "bg-gradient-to-r from-white via-blue-50 to-white"
                      : "bg-gradient-to-r from-white via-blue-100 to-white"
                    }`}
                >
                  <td className="px-6 py-4">
                    <div
                      className="text-[12px] text-blue-900 break-words max-w-xs"
                      title={item.engineerName || "Not assigned"}
                    >
                      {item.engineerName.join(" , ") || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base text-blue-800 whitespace-nowrap text-right">
                    <div
                      onClick={() => handleFetch(item._id)}
                      className="inline-block bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200
               px-4 py-2 rounded-xl border border-blue-300 shadow-sm
               hover:from-blue-200 hover:via-indigo-200 hover:to-blue-300
               transition-all duration-300 cursor-pointer"
                    >
                      {item?.weekStart
                        ? new Date(item.weekStart).toLocaleDateString()
                        : ""}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 px-6 py-5 border-t border-blue-100">
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <p className="text-base text-blue-700">
            Showing{" "}
            <span className="font-bold text-blue-800">{data.length}</span>{" "}
            project{data.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTableAll;
