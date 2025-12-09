import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import { fetchbyOrderbyId, fetchbyProjectbyId } from "../utils/apiCall";
import ProjectDetailsPopup from "../utils/cardPopup";
import OrderDetailsPopup from "../utils/OrderShower";
import { MdEdit, MdEngineering } from "react-icons/md";
import { handlePrint } from "../utils/print";
import EngineerForm from "./ProjectFormAction";
import { useNavigate } from "react-router-dom";
import { LuNotepadText } from "react-icons/lu";
import ProjectTimelineForm from "../utils/project.Planning";

const ProjectTableAll = ({ data, tableVal, isEdit, onEditFun, printTitle, editType }) => {

  const printRef = useRef();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [selectedProjectForPopup, setSelectedProjectForPopup] = useState(null);
  const [isOrderFetched, setIsOrderFetched] = useState(false);
  const [open, setOpen] = useState(false);
  const [planopen, setPlanOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null);

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
  }, []);

  const handlAssignedDev = (project) => {
    try {
      //  this is handle assigned
      navigate(`/timelineform/${project?._id}`)
      return;
      setSelectedProject(project)
      setPlanOpen(true)
    } catch (e) {
      console.log("some error occured", e)
    }
  }

  const hadleOpenPopup = async (project) => {
    try {
      const id = project?.mongoOrderId || project?._id || project?.id;

      if (!id) {
        console.log("Invalid project data — ID missing");
        return;
      }
      let val;
      let orderFlag = false;
      if (project?.OrderMongoId) {
        val = await fetchbyOrderbyId(project.OrderMongoId);
        orderFlag = true;
      } else {
        val = await fetchbyProjectbyId(id);
      }

      if (val) {
        setSelectedProjectForPopup(val);
        setIsOrderFetched(orderFlag);
      }
    } catch (error) {
      console.error("Error fetching project/order details:", error);
    }
  };

  const handleUpdateProject = (id) => {
    try {
      navigate(`/update/${id}`, {
        state: { fromButton: true, recordId: id },
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleEngineer = (project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  const handleEditAction = (type, data) => {
    switch (type) {
      case "URGENT":
        handleEngineer(data);
        break;
      case "ALLPROJECT":
        handleUpdateProject(data._id);
        break;
      default:
        console.warn("Unknown edit type:", type);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handlePrint(printRef, printTitle);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative h-full col-span-full w-full italic overflow-hidden rounded-2xl shadow-2xl bg-linear-to-b from-white via-blue-50 to-blue-100 border border-blue-200">
      {selectedProjectForPopup &&
        (isOrderFetched ? (
          <OrderDetailsPopup
            order={selectedProjectForPopup}
            onClose={() => setSelectedProjectForPopup(null)}
          />
        ) : (
          <ProjectDetailsPopup
            project={selectedProjectForPopup}
            onClose={() => setSelectedProjectForPopup(null)}
          />
        ))}
      <div className="overflow-x-auto hidden md:block">
        <div ref={printRef} className="max-h-[690px] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 border-b-2 border-purple-400 shadow-md">
                {tableVal.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-5 text-left text-base font-bold tracking-wide uppercase text-gray-400!"
                  >
                    {col.head}
                  </th>
                ))}
                {isEdit && (
                  <th className="w-24 px-6 py-5 text-center text-base font-bold tracking-wide uppercase text-gray-400!">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50 transition-colors duration-150 group"
                >
                  {tableVal.map((col, j) => {
                    const val = row[col.val];
                    const display = Array.isArray(val)
                      ? val.join(", ")
                      : col.val.toLowerCase().includes("date") && val
                        ? new Date(val).toISOString().split("T")[0]
                        : val || "—";
                    return (
                      <td
                        key={j}
                        className="px-6 py-4 text-base text-gray-700 whitespace-nowrap"
                      >
                        <div
                          className={`truncate ${col.val === "projectName"
                            ? "cursor-pointer hover:text-indigo-600"
                            : ""
                            }`}
                          onClick={() =>
                            col.val === "projectName" && hadleOpenPopup
                              ? hadleOpenPopup(row)
                              : null
                          }
                        >
                          {display}
                        </div>
                      </td>
                    );
                  })}

                  {isEdit && (
                    <td className="px-6 py-4 text-center">

                      {onEditFun === "DEVLOPMENT" ? (
                        <button
                          onClick={() => handlAssignedDev(row)}
                          className={`flex items-center justify-center text-white p-2 rounded-full shadow-lg
      transition-all duration-200 hover:scale-110 hover:-rotate-6
      ring-2 ring-transparent focus:outline-none focus:ring-4
      ${row?.isPlanRecord
                              ? "bg-linear-to-tr from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-500 hover:ring-emerald-300 focus:ring-emerald-400"
                              : "bg-linear-to-tr from-rose-500 via-pink-400 to-red-400 hover:from-rose-600 hover:via-pink-500 hover:to-red-500 hover:ring-rose-300 focus:ring-rose-400"
                            }`}
                          type="button"
                        >
                          <LuNotepadText className="w-5 h-5 drop-shadow" />
                        </button>

                      ) : onEditFun === "URGENT" ? (

                        <button
                          onClick={() => handleEditAction(onEditFun, row)}
                          className="flex items-center justify-center text-white p-2 rounded-full shadow-lg
      bg-linear-to-tr from-yellow-500 via-amber-400 to-orange-400
      hover:scale-110 hover:-rotate-6 transition-all duration-200
      hover:from-yellow-600 hover:via-amber-500 hover:to-orange-500
      ring-2 ring-transparent focus:ring-amber-300"
                        >
                          <MdEngineering className="w-5 h-5 drop-shadow" />
                        </button>

                      ) : (

                        <button
                          onClick={() => handleEditAction(onEditFun, row)}
                          className="inline-flex items-center justify-center p-2.5 rounded-lg
      bg-linear-to-br from-emerald-50 to-teal-50 text-emerald-600
      border border-emerald-200 hover:border-emerald-400
      hover:from-emerald-100 hover:to-teal-100 shadow-sm hover:shadow-md
      transition-all duration-300 group"
                        >
                          <MdEdit
                            size={18}
                            className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
                          />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* sm view */}
      <div className="md:hidden space-y-4 p-2">
        {data.map((project, indx) => (
          <div
            key={indx}
            onClick={() => hadleOpenPopup(project)}
            className="bg-linear-to-br from-blue-50 via-white to-indigo-50 shadow-lg rounded-xl p-4 border border-blue-200 transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="text-base font-bold text-indigo-700 truncate max-w-[70%]"
                title={project[tableVal[0]?.val]}
              >
                {project[tableVal[0]?.val]}
              </div>
              <span
                onClick={
                  isEdit
                    ? onEditFun === "DEVLOPMENT" ? () => handlAssignedDev(project) : () => handleEditAction(onEditFun, project)
                    : undefined
                }
                className="inline-flex items-center px-2 py-1 border border-indigo-300 rounded-full font-semibold text-[11px] bg-indigo-100 text-indigo-700 shadow-sm"
                title={project.status}
              >
                {project.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-blue-800">
              {tableVal.slice(1).map((col, i) => {
                const val = project[col.val];
                const display = Array.isArray(val)
                  ? val.join(", ")
                  : col.val.toLowerCase().includes("date") && val
                    ? new Date(val).toISOString().split("T")[0]
                    : val || "—";

                return (
                  <div key={i}>
                    <span className="font-medium text-indigo-600">
                      {col.head}:
                    </span>
                    <span className="ml-2">{display}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-linear-to-r from-blue-50 to-indigo-50/70 px-6 py-5 border-t border-blue-100 mt-4">
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <p className="text-base text-blue-700">
            Showing{" "}
            <span className="font-bold text-blue-800">{data.length}</span>{" "}
            project{data.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      {open && (
        <EngineerForm
          setOpen={setOpen}
          formRef={formRef}
          selectedProject={selectedProject}
        />
      )}


      {planopen && (
        <ProjectTimelineForm
          project={selectedProject}
          open={planopen}
          onClose={() => setOpen(setPlanOpen)}
        />
      )}
    </div>
  );
};

export default ProjectTableAll;
