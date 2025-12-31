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
import { FaEye } from "react-icons/fa";
import { SlDocs } from "react-icons/sl";
import { middleEllipsis } from "../utils/middleEliminator";

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
      navigate(`/timelineform/${project?._id}`)
      return;
      // setSelectedProject(project)
      // setPlanOpen(true)
    } catch (e) {
      console.log("some error occured", e)
    }
  }

  const hadleOpenPopup = async (project) => {
    try {
      const id = project?.OrderMongoId || project?._id || project?.id;

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

  const handleDocsOpen = (project) => {
    navigate(`/addDocs/${project?._id}`)
  }

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
            <thead className="sticky top-0">
              <tr className="bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 border-b-2 border-purple-400 shadow-md">
                <th className="w-20 px-6 py-4 text-center text-sm font-semibold tracking-wide uppercase text-white!">
                  SR NO
                </th>
                {tableVal.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-5 text-left text-base font-bold tracking-wide uppercase text-gray-400!"
                  >
                    {col.head}
                  </th>
                ))}
                {isEdit && (
                  <>
                    <th className="w-20 px-6 py-4 text-center text-sm font-semibold tracking-wide uppercase text-white!">
                      view
                    </th>
                    <th className="w-20 px-6 py-4 text-center text-sm font-semibold tracking-wide uppercase text-white!">
                      Docs
                    </th>
                    <th className="w-20 px-6 py-4 text-center text-sm font-semibold tracking-wide uppercase text-white!">
                      Edit
                    </th></>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((row, i) => {
                const isCancelled = row?.isCancelled === true;

                const disabledBtn =
                  "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed pointer-events-none";

                return (
                  <tr
                    key={i}
                    className={`transition-colors duration-150
          ${isCancelled
                        ? "bg-red-50 text-red-700"
                        : "hover:bg-slate-50"
                      }`}
                  >
                    {/* SR NO */}
                    <td className="px-4 py-4 text-center text-sm font-semibold">
                      {i + 1}
                    </td>

                    {tableVal.map((col, j) => {
                      const val = row[col.val];
                      const display = Array.isArray(val)
                        ? val.join(", ")
                        : col.val.toLowerCase().includes("date") && val
                          ? new Date(val).toISOString().split("T")[0]
                          : val || "—";

                      const hideFull =
                        col.val === "jobNumber" || col.val === "projectName" || col.val === "endUser";

                      return (
                        <td
                          key={j}
                          className="px-6 py-4 text-base whitespace-nowrap"
                        >
                          <div
                            className={`truncate
                  ${col.val === "projectName" && !isCancelled
                                ? "cursor-pointer hover:text-indigo-600"
                                : ""
                              }`}
                          >
                            {hideFull ? middleEllipsis(display, 4, 3) : display}
                          </div>
                        </td>
                      );
                    })}

                    {/* ACTIONS */}
                    {isEdit && (
                      <>
                        {/* VIEW */}
                        <td className="px-6 py-4 text-center">
                          <button
                            disabled={isCancelled}
                            onClick={
                              isCancelled ? undefined : () => hadleOpenPopup(row)
                            }
                            className={`p-3 rounded-xl transition-all
                  ${isCancelled
                                ? disabledBtn
                                : "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-white hover:shadow-xl"
                              }`}
                            title={isCancelled ? "Action not allowed" : "View"}
                          >
                            <FaEye size={18} />
                          </button>
                        </td>

                        {/* DOCS */}
                        <td className="px-6 py-4 text-center">
                          <button
                            disabled={isCancelled}
                            onClick={
                              isCancelled ? undefined : () => handleDocsOpen(row)
                            }
                            className={`p-3 rounded-xl transition-all
                  ${isCancelled
                                ? disabledBtn
                                : "bg-gradient-to-br from-indigo-400 via-blue-500 to-sky-500 text-white hover:shadow-xl"
                              }`}
                            title={isCancelled ? "Action not allowed" : "Documents"}
                          >
                            <SlDocs size={18} />
                          </button>
                        </td>

                        {/* EDIT / ASSIGN */}
                        <td className="px-6 py-4 text-center">
                          {onEditFun === "DEVLOPMENT" ? (
                            <button
                              disabled={isCancelled}
                              onClick={
                                isCancelled ? undefined : () => handlAssignedDev(row)
                              }
                              className={`p-2 rounded-full shadow-lg transition-all
                    ${isCancelled
                                  ? disabledBtn
                                  : row?.isPlanRecord
                                    ? "bg-linear-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-white hover:scale-110"
                                    : "bg-linear-to-tr from-rose-500 via-pink-400 to-red-400 text-white hover:scale-110"
                                }`}
                            >
                              <LuNotepadText className="w-5 h-5" />
                            </button>
                          ) : onEditFun === "URGENT" ? (
                            <button
                              disabled={isCancelled}
                              onClick={
                                isCancelled
                                  ? undefined
                                  : () => handleEditAction(onEditFun, row)
                              }
                              className={`p-2 rounded-full shadow-lg transition-all
                    ${isCancelled
                                  ? disabledBtn
                                  : "bg-linear-to-tr from-yellow-500 via-amber-400 to-orange-400 text-white hover:scale-110"
                                }`}
                            >
                              <MdEngineering className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              disabled={isCancelled}
                              onClick={
                                isCancelled
                                  ? undefined
                                  : () => handleEditAction(onEditFun, row)
                              }
                              className={`p-2.5 rounded-lg transition-all
                    ${isCancelled
                                  ? disabledBtn
                                  : "bg-linear-to-br from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-200 hover:border-emerald-400"
                                }`}
                            >
                              <MdEdit size={18} />
                            </button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>



          </table>
        </div>
      </div>

      {/* sm view */}
      <div className="md:hidden space-y-4 p-2">
        {data.map((project, indx) => {
          const isCancelled = project?.isCancelled === true;

          const disabledBtn =
            "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed pointer-events-none";

          return (
            <div
              key={indx}
              onClick={isCancelled ? undefined : () => hadleOpenPopup(project)}
              className={`shadow-lg rounded-xl p-4 border transition-all
        ${isCancelled
                  ? "bg-red-50 border-red-200 text-red-700 cursor-not-allowed"
                  : "bg-linear-to-br from-blue-50 via-white to-indigo-50 border-blue-200 hover:scale-[1.02] cursor-pointer"
                }`}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="text-base font-bold truncate max-w-[70%]"
                  title={project[tableVal[0]?.val]}
                >
                  {project[tableVal[0]?.val]}
                </div>

                {isEdit && (
                  <>
                    {/* DEVELOPMENT */}
                    {onEditFun === "DEVLOPMENT" ? (
                      <button
                        disabled={isCancelled}
                        onClick={
                          isCancelled
                            ? undefined
                            : (e) => {
                              e.stopPropagation();
                              handlAssignedDev(project);
                            }
                        }
                        className={`flex items-center justify-center p-2 rounded-full shadow-lg transition-all
                  ${isCancelled
                            ? disabledBtn
                            : project?.isPlanRecord
                              ? "bg-linear-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-white hover:scale-110"
                              : "bg-linear-to-tr from-rose-500 via-pink-400 to-red-400 text-white hover:scale-110"
                          }`}
                        title={isCancelled ? "Action not allowed" : "Assign Development"}
                      >
                        <LuNotepadText className="w-5 h-5" />
                      </button>
                    ) : onEditFun === "URGENT" ? (
                      /* URGENT */
                      <button
                        disabled={isCancelled}
                        onClick={
                          isCancelled
                            ? undefined
                            : (e) => {
                              e.stopPropagation();
                              handleEditAction(onEditFun, project);
                            }
                        }
                        className={`flex items-center justify-center p-2 rounded-full shadow-lg transition-all
                  ${isCancelled
                            ? disabledBtn
                            : "bg-linear-to-tr from-yellow-500 via-amber-400 to-orange-400 text-white hover:scale-110"
                          }`}
                        title={isCancelled ? "Action not allowed" : "Urgent Edit"}
                      >
                        <MdEngineering className="w-5 h-5" />
                      </button>
                    ) : (
                      /* NORMAL EDIT */
                      <button
                        disabled={isCancelled}
                        onClick={
                          isCancelled
                            ? undefined
                            : (e) => {
                              e.stopPropagation();
                              handleEditAction(onEditFun, project);
                            }
                        }
                        className={`inline-flex items-center justify-center p-2.5 rounded-lg transition-all
                  ${isCancelled
                            ? disabledBtn
                            : "bg-linear-to-br from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-200 hover:border-emerald-400"
                          }`}
                        title={isCancelled ? "Action not allowed" : "Edit"}
                      >
                        <MdEdit size={18} />
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* BODY */}
              <div className="space-y-2 text-sm">
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
          );
        })}

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
      {
        open && (
          <EngineerForm
            setOpen={setOpen}
            formRef={formRef}
            selectedProject={selectedProject}
          />
        )
      }


      {
        planopen && (
          <ProjectTimelineForm
            project={selectedProject}
            open={planopen}
            onClose={() => setOpen(setPlanOpen)}
          />
        )
      }
    </div >
  );
};

export default ProjectTableAll;
