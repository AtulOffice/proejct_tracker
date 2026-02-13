import React, { useEffect, useRef, useState } from "react";
import ProjectDetailsPopup from "../utils/cardPopup";
import OrderDetailsPopup from "../utils/OrderShower";
import { MdEdit, MdEngineering } from "react-icons/md";
import { handlePrint } from "../utils/print";
import EngineerForm from "./ProjectFormAction";
import { useNavigate } from "react-router-dom";
import { LuNotepadText } from "react-icons/lu";
import ProgressShowedAdmin from "./ProgressShowedAdmin";
import { FaEye } from "react-icons/fa";
import { SlDocs } from "react-icons/sl";
import { limitText, middleEllipsis } from "../utils/middleEliminator";
import { GiProgression } from "react-icons/gi";
import toast from "react-hot-toast";
import { fetchOrderById } from "../apiCall/orders.Api";
import { fetchbyProjectbyId } from "../apiCall/project.api";
import { getAdminProjectProgressByPlanning } from "../apiCall/workProgress.Api";
import ProjectTimelineForm from "./project.Planning";
import { formatDateDDMMYY } from "../utils/formatter";



const ProjectTableAll = ({ data, tableVal, isEdit, onEditFun, printTitle, editType }) => {

  const printRef = useRef();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [selectedProjectForPopup, setSelectedProjectForPopup] = useState(null);
  const [isOrderFetched, setIsOrderFetched] = useState(false);
  const [open, setOpen] = useState(false);
  const [planopen, setPlanOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null);
  const [progress, setPorgress] = useState(false)
  const [progressData, setProgressData] = useState()


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


  const handleShowProgress = async (entry) => {
    try {
      if (!entry?.PlanDetails) {
        toast.error("there is no plan related this project")
        return;
      }
      const data = await getAdminProjectProgressByPlanning({
        planId: entry?.PlanDetails
      });
      setProgressData(data);
      setPorgress(true);
    } catch (e) {
      toast.error(e.response.data.message || "some error occured");
      setPorgress(false);
    }
  };

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
      const id = project?.OrderMongoId?._id || project?._id || project?.id;
      if (!id) {
        console.log("Invalid project data — ID missing");
        return;
      }
      let val;
      let orderFlag = false;
      if (project?.OrderMongoId) {
        val = await fetchOrderById(project.OrderMongoId?._id);
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
    <div className="relative h-full col-span-full w-full  overflow-hidden rounded-2xl shadow-2xl bg-linear-to-b from-white via-blue-50 to-blue-100 border border-blue-200">

      {progress && progressData && (
        <ProgressShowedAdmin project={selectedProject} onClose={() => setPorgress(false)} progressData={progressData} />
      )}

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
        <div ref={printRef} className="max-h-[760px] overflow-x-auto hide-scrollbar">
          <table className="min-w-full w-max table-fixed">
            <thead className="sticky top-0 z-20">
              <tr className="bg-gray-900">
                <th className="w-20 px-3 py-1 text-center font-semibold text-xs text-white! bg-gray-900 sticky left-0 z-20">
                  SR NO
                </th>

                {tableVal.length > 0 && (
                  <th className="px-3 py-1 text-left font-semibold text-xs text-white! bg-gray-900 sticky left-20 z-20">
                    {tableVal[0].head}
                  </th>
                )}

                {tableVal.slice(1).map((col, idx) => (
                  <th
                    key={idx}
                    className="px-3 py-1 text-left font-semibold text-xs text-white! bg-gray-900"
                  >
                    {col.head}
                  </th>
                ))}

                {isEdit && (
                  <>
                    <th className="w-12 px-1 py-1 text-center font-semibold text-xs text-white! bg-gray-900 sticky right-[96px] z-20">
                      View
                    </th>
                    <th className="w-12 px-1 py-1 text-center font-semibold text-xs text-white! bg-gray-900 sticky right-[48px] z-20">
                      {
                        onEditFun === "DEVLOPMENT"
                          ? "PLAN"
                          : onEditFun === "URGENT"
                            ? "ENGINEER"
                            : "Edit"
                      }
                    </th>
                    <th className="w-12 px-1 py-1 text-center font-semibold text-xs text-white! bg-gray-900 sticky right-0 z-20">
                      {onEditFun === "DEVLOPMENT" ? "Progress" : "Docs"}
                    </th>

                  </>
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
                    className={`transition-colors duration-150 font-mono
        ${isCancelled
                        ? "bg-red-100 text-red-700"
                        : i % 2 === 1
                          ? "bg-gray-200 hover:bg-slate-100"
                          : "bg-white hover:bg-slate-50"
                      }`}
                  >
                    <td className="px-3 py-0.5 text-center text-xs font-semibold sticky left-0 bg-inherit z-10 font-mono">
                      {i + 1}
                    </td>

                    {tableVal.length > 0 && (
                      <td className="px-2 py-0.5 text-sm whitespace-nowrap sticky left-20 bg-inherit z-10 font-bold font-mono">
                        {row[tableVal[0].val] || "—"}
                      </td>
                    )}

                    {tableVal.slice(1).map((col, j) => {
                      const val = row[col.val];
                      const display = Array.isArray(val)
                        ? val.join(", ")
                        : col.val.toLowerCase().includes("date") && val
                          ? formatDateDDMMYY(val)
                          : val || "—";

                      const hideFull =
                        col.val === "projectName" || col.val === "endUser" || col.val === "client";
                      return (
                        <td key={j} className="px-2 py-0.5 text-xs whitespace-nowrap font-mono">
                          <div
                            className={`${col.val === "projectName" && !isCancelled
                              ? "cursor-pointer hover:text-indigo-600"
                              : ""
                              }`}
                          >
                            {hideFull ? limitText(display, 15) : display}
                          </div>
                        </td>
                      );
                    })}



                    {isEdit && (
                      <>
                        <td className="w-12 px-1 py-0.5 text-center sticky right-[96px] bg-inherit z-10">
                          <button
                            onClick={() => hadleOpenPopup(row)}
                            className="p-0.5 rounded-md transition-all bg-transparent text-white hover:bg-gray-200"
                          >
                            <FaEye size={14} />
                          </button>
                        </td>

                        <td className="w-12 px-1 py-0.5 text-center sticky right-[48px] bg-inherit z-10">
                          {onEditFun === "DEVLOPMENT" ? (
                            <button
                              disabled={isCancelled}
                              onClick={isCancelled ? undefined : () => handlAssignedDev(row)}
                              className={`p-0.5 rounded-md transition-all
            ${isCancelled
                                  ? disabledBtn
                                  : row?.isPlanRecord
                                    ? "bg-linear-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-white hover:scale-105"
                                    : "bg-linear-to-tr from-rose-500 via-pink-400 to-red-400 text-white hover:scale-105"
                                }`}
                            >
                              <LuNotepadText className="w-3.5 h-3.5" />
                            </button>
                          ) : onEditFun === "URGENT" ? (
                            <button
                              disabled={isCancelled}
                              onClick={isCancelled ? undefined : () => handleEditAction(onEditFun, row)}
                              className={`p-0.5 rounded-md transition-all text-white
            ${isCancelled
                                  ? disabledBtn
                                  : "bg-linear-to-tr from-emerald-500 via-teal-400 to-cyan-400 hover:scale-105"
                                }`}
                            >
                              <MdEngineering size={14} />
                            </button>
                          ) : (
                            <button
                              disabled={isCancelled}
                              onClick={isCancelled ? undefined : () => handleEditAction(onEditFun, row)}
                              className={`p-0.5 rounded-md transition-all text-white
            ${isCancelled
                                  ? disabledBtn
                                  : row?.isDataSavedProject
                                    ? "bg-linear-to-tr from-emerald-500 via-teal-400 to-cyan-400 hover:scale-105"
                                    : "bg-linear-to-tr from-rose-500 via-pink-400 to-red-400 hover:scale-105"
                                }`}
                            >
                              <MdEdit size={14} />
                            </button>
                          )}
                        </td>

                        <td className="w-12 px-1 py-0.5 text-center sticky right-0 bg-inherit z-10">
                          {onEditFun === "DEVLOPMENT" ? (
                            <button
                              disabled={isCancelled}
                              onClick={isCancelled ? undefined : () => handleShowProgress(row)}
                              className={`p-0.5 rounded-md transition-all
            ${isCancelled
                                  ? disabledBtn
                                  : "bg-transparent text-white hover:bg-gray-200"
                                }`}
                            >
                              <GiProgression size={14} />
                            </button>
                          ) : (
                            <button
                              disabled={isCancelled}
                              onClick={(isCancelled || onEditFun === "URGENT") ? undefined : () => handleDocsOpen(row)}
                              className={`p-0.5 rounded-md transition-all text-white
            ${isCancelled
                                  ? disabledBtn
                                  : row?.isProjectDocssave
                                    ? "bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 hover:scale-105"
                                    : "bg-gradient-to-tr from-rose-400 via-pink-300 to-red-400 hover:scale-105"
                                }`}
                            >
                              <SlDocs size={14} />
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

          return (
            <div
              key={indx}
              className={`shadow-lg rounded-xl p-4 border transition-all
          ${isCancelled
                  ? "bg-red-50 border-red-200 text-red-700 cursor-not-allowed"
                  : "bg-linear-to-br from-blue-50 via-white to-indigo-50 border-blue-200 hover:scale-[1.02] cursor-pointer"
                }`}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-3">
                {/* TITLE */}
                <div
                  className="text-base font-bold truncate max-w-[70%]"
                  title={project[tableVal[0]?.val]}
                >
                  {middleEllipsis(project[tableVal[0]?.val])}
                </div>

                {/* ACTION BUTTONS */}
                {isEdit && (
                  <div className={`flex items-center gap-2 ${isCancelled ? "opacity-60" : ""}`}>
                    {/* VIEW */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        hadleOpenPopup(project);
                      }}
                      className="p-2 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md hover:scale-105 transition"
                      title="View"
                    >
                      <FaEye size={18} />
                    </button>

                    {/* DOCS / PROGRESS */}
                    {!isCancelled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditFun === "DEVLOPMENT"
                            ? handleShowProgress(project)
                            : handleDocsOpen(project);
                        }}
                        className="p-2 rounded-lg bg-transparent text-white shadow-md hover:scale-105 transition"
                        title={onEditFun === "DEVLOPMENT" ? "Progress" : "Documents"}
                      >
                        {onEditFun === "DEVLOPMENT" ? (
                          <GiProgression size={18} />
                        ) : (
                          <SlDocs size={18} />
                        )}
                      </button>
                    )}

                    {/* EDIT / ASSIGN / URGENT */}
                    {!isCancelled && (
                      <>
                        {onEditFun === "DEVLOPMENT" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlAssignedDev(project);
                            }}
                            className={`p-2 rounded-full shadow-lg transition-all
                        ${project?.isPlanRecord
                                ? "bg-linear-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-white hover:scale-110"
                                : "bg-linear-to-tr from-rose-500 via-pink-400 to-red-400 text-white hover:scale-110"
                              }`}
                            title="Assign Development"
                          >
                            <LuNotepadText className="w-5 h-5" />
                          </button>
                        ) : onEditFun === "URGENT" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAction(onEditFun, project);
                            }}
                            className="p-2 rounded-full shadow-lg bg-linear-to-tr from-yellow-500 via-amber-400 to-orange-400 text-white hover:scale-110"
                            title="Urgent Edit"
                          >
                            <MdEngineering className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAction(onEditFun, project);
                            }}
                            className="p-2.5 rounded-lg bg-linear-to-br from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-200 hover:border-emerald-400"
                            title="Edit"
                          >
                            <MdEdit size={18} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* DETAILS */}
              <div className="space-y-2 text-sm">
                {tableVal.slice(1).map((col, i) => {
                  const val = project[col.val];

                  let display = Array.isArray(val)
                    ? val.join(", ")
                    : col.val.toLowerCase().includes("date") && val
                      ? new Date(val).toISOString().split("T")[0]
                      : val ?? "—";

                  display = String(display);

                  const hideFull = col.val === "projectName" ||
                    col.val === "endUser";

                  return (
                    <div key={i} className="flex justify-between gap-2">
                      <span className="font-medium text-indigo-600">
                        {col.head}:
                      </span>
                      <span className="text-right">
                        {hideFull ? middleEllipsis(display, 4, 3) : display}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>


      <div className="bg-linear-to-r from-blue-50 to-indigo-50/70 px-4 py-1.5 border-t border-blue-100 mt-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-700">
            Showing{" "}
            <span className="font-semibold text-blue-800">{data.length}</span>{" "}
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
