import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../appContex";
import { getAssignedEngineers } from "../utils/apiCall";
import { FaCalendar } from "react-icons/fa6";
import { handlePrint } from "../utils/print";

const NotificationForm = ({ setOpen, formRef }) => {
  const { toggle, setToggle } = useAppContext();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef, setOpen]);

  // useEffect(() => {
  //   const getProjects = async () => {
  //     try {
  //       const val = await getAssignedEngineers();
  //       setNotifications(val?.data || []);
  //     } catch (error) {
  //       console.error("Failed to fetch", error);
  //     }
  //   };
  //   getProjects();
  // }, [toggle]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const val = await getAssignedEngineers();
        const data = val?.data || [];
        data.sort((a, b) => {
          const aDate = a.assignments?.length
            ? new Date(a.assignments[a.assignments.length - 1].assignedAt)
            : new Date(0);

          const bDate = b.assignments?.length
            ? new Date(b.assignments[b.assignments.length - 1].assignedAt)
            : new Date(0);

          return aDate - bDate;
        });

        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };
    getProjects();
  }, [toggle]);

  const toLocaltimeString = (dateObj) => {
    if (!dateObj) return "";
    const date = new Date(dateObj);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const printRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handlePrint(printRef);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sky-900/80 via-indigo-700/70 to-blue-950/80 backdrop-blur-sm transition">
      <div
        ref={formRef}
        className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-blue-200 scrollbar-glass"
      >
        <div className="p-8">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 tracking-tight drop-shadow-lg italic">
            NOTIFICATION
          </h2>
          <div className="flex justify-end space-x-4 pb-6">
            <button
              type="button"
              onClick={() => setToggle((prev) => !prev)}
              className={`px-8 py-2 rounded-lg text-white font-semibold shadow transition bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-700 hover:bg-blue-700/90 hover:shadow-lg`}
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => handlePrint(printRef)}
              className="px-8 py-2 rounded-lg text-white font-semibold shadow transition bg-green-600 hover:bg-green-700"
            >
              Print
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 shadow-sm hover:shadow-md hover:bg-gray-400/50 transition"
            >
              Close
            </button>
          </div>
          <div className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-indigo-400 bg-gradient-to-b from-white/80 via-blue-50 to-blue-100">
            <div ref={printRef} className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-600 text-white shadow-lg">
                    <th className="px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                      Engineer
                    </th>
                    <th className="px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                      Job No.
                    </th>
                    <th className="px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                      Project
                    </th>
                    <th className="px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                      From{" "}
                      <FaCalendar className="inline-block text-yellow-300 ml-2" />
                    </th>
                    <th className="px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                      To{" "}
                      <FaCalendar className="inline-block text-green-300 ml-2" />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {notifications.map((note, i) => (
                    <tr
                      key={i}
                      className={`hover:bg-blue-200/30 transition duration-150 ${
                        i % 2 === 0
                          ? "bg-gradient-to-r from-white via-indigo-50 to-white"
                          : "bg-gradient-to-r from-white via-blue-100 to-white"
                      }`}
                    >
                      <td className="px-6 py-4 text-indigo-900 font-medium truncate">
                        {note?.name}
                      </td>
                      <td className="px-6 py-4 text-blue-800 font-semibold">
                        {note?.assignments &&
                          note?.assignments[note?.assignments.length - 1]
                            ?.jobNumber}
                      </td>
                      <td
                        className={`px-6 py-4 font-bold truncate ${
                          note.priority === "High"
                            ? "text-red-600"
                            : note.priority === "Medium"
                            ? "text-orange-500"
                            : "text-green-600"
                        }`}
                      >
                        {note?.assignments &&
                          note?.assignments[note?.assignments.length - 1]
                            ?.projectName}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm break-words">
                        {note?.assignments?.length > 0 &&
                          toLocaltimeString(
                            new Date(note.assignments.at(-1)?.assignedAt)
                          )}
                      </td>
                      <td className="px-6 py-4 text-blue-700 whitespace-nowrap">
                        {note?.assignments?.length > 0 &&
                          toLocaltimeString(
                            new Date(note.assignments.at(-1)?.endTime)
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 px-6 py-4 border-t border-indigo-200">
              <p className="text-base text-blue-700">
                Showing{" "}
                <span className="font-bold text-indigo-800">
                  {notifications.length}
                </span>{" "}
                notification{notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationForm;
