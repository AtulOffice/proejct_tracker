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
import { middleEllipsis } from "../utils/middleEliminator";
import { GiProgression } from "react-icons/gi";
import toast from "react-hot-toast";
import { fetchOrderById } from "../apiCall/orders.Api";
import { fetchbyProjectbyId } from "../apiCall/project.api";
import { getAdminProjectProgressByPlanning } from "../apiCall/workProgress.Api";
import ProjectTimelineForm from "./project.Planning";



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


  // this funciton make some change
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
        <div ref={printRef} className="max-h-[560px] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0">
              <tr className="bg-gray-900 ">
                <th className="w-20 px-4 py-1.5 text-center font-semibold text-white!">
                  SR NO
                </th>

                {tableVal.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-1.5 text-left font-semibold text-white!"
                  >
                    {col.head}
                  </th>
                ))}

                {isEdit && (
                  <>
                    <th className="w-20 px-4 py-1.5 text-center font-semibold text-white!">
                      View
                    </th>
                    <th className="w-20 px-4 py-1.5 text-center font-semibold text-white!">
                      {onEditFun === "DEVLOPMENT" ? "PLAN" : "Edit"}
                    </th>
                    <th className="w-20 px-4 py-1.5 text-center font-semibold text-white!">
                      {onEditFun === "DEVLOPMENT" ? "Progress" : "Docs"}
                    </th>

                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((row, i) => {
                { console.log(row) }
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

                    {/* SR NO */}
                    <td className="px-4 py-1 text-center text-sm font-semibold">
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
                        col.val === "projectName" || col.val === "endUser";

                      return (
                        <td
                          key={j}
                          className="px-2 py-1 text-base whitespace-nowrap"
                        >
                          <div
                            className={`
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
                        <td className="px-6 py-1 text-center ">
                          <button
                            onClick={
                              () => hadleOpenPopup(row)
                            }
                            className={`p-3 rounded-xl transition-all bg-transparent text-white hover:bg-gray-200 cursor-pointer`}
                            title={isCancelled ? "Action not allowed" : "View"}
                          >
                            <FaEye size={18} />
                          </button>
                        </td>

                        <td className="px-6 py-1 text-center">
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
                              className={`p-2 rounded-full transition-all
                    ${isCancelled
                                  ? disabledBtn
                                  : "bg-transparent text-white hover:scale-110"
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
                              className={`p-2.5 rounded-full transition-all text-white
      ${isCancelled
                                  ? disabledBtn
                                  : row?.isDataSavedProject
                                    ? "bg-linear-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-white hover:scale-110"
                                    : "bg-linear-to-tr from-rose-500 via-pink-400 to-red-400 text-white hover:scale-110"

                                }`}
                            >
                              <MdEdit size={18} />
                            </button>
                          )}
                        </td>


                        {onEditFun === "DEVLOPMENT" ?
                          <td className="px-6 py-1 text-center">
                            <button
                              disabled={isCancelled}
                              onClick={
                                isCancelled ? undefined : () => handleShowProgress(row)
                              }
                              className={`p-3 rounded-xl transition-all
                  ${isCancelled
                                  ? disabledBtn
                                  : "bg-transparent text-white hover:bg-gray-200"
                                }`}
                              title={isCancelled ? "Action not allowed" : "Documents"}
                            >
                              <GiProgression size={18} />
                            </button>
                          </td>
                          :
                          <td className="px-6 py-1 text-center">
                            <button
                              disabled={isCancelled}
                              onClick={
                                isCancelled ? undefined : () => handleDocsOpen(row)
                              }
                              className={`p-3 rounded-full transition-all text-white
      ${isCancelled
                                  ? disabledBtn
                                  : row?.isProjectDocssave
                                    ? "bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 hover:scale-110"
                                    : "bg-gradient-to-tr from-rose-400 via-pink-300 to-red-400 hover:scale-110"
                                }`}
                              title={
                                isCancelled
                                  ? "Action not allowed"
                                  : row?.isProjectDocssave
                                    ? "Project data saved"
                                    : "Project data not saved"
                              }
                            >
                              <SlDocs size={18} />
                            </button>
                          </td>
                        }
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
