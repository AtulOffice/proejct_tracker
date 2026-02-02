import React, { useEffect, useRef, useState } from "react";
import { fetchbyOrderbyId, fetchbyProjectbyId, fetchProgressByforEngineer } from "../utils/apiCall";
import ProjectDetailsPopup from "../utils/cardPopup";
import OrderDetailsPopup from "../utils/OrderShower";
import { handlePrint } from "../utils/print";
import { FaEye, FaTools } from "react-icons/fa";
import { IoDocumentsOutline } from "react-icons/io5";
import DocSRecordChecklist from "./DocSRecordChecklist";
import ProgressShowed from "./ProgressShowed";
import { GiProgression } from "react-icons/gi";
import SectionDetailsModal from "./DevelopMentSection";
import toast from "react-hot-toast";

const ProjectTableAllOperation = ({ data, tableVal, isEdit, onEditFun, printTitle }) => {
    const printRef = useRef();
    const [selectedProjectForPopup, setSelectedProjectForPopup] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isOrderFetched, setIsOrderFetched] = useState(false);
    const [activeExecution, setActiveExecution] = useState();
    const [start, setStart] = useState(false);
    const [end, setEnd] = useState(false);
    const [work, setWork] = useState(false);
    const [progress, setPorgress] = useState(false)
    const [progressData, setProgressData] = useState()

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
                val = await fetchbyOrderbyId(project.OrderMongoId?._id);
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

    const formatValue = (val, key) => {
        if (Array.isArray(val)) return val.join(", ");
        if ((key.toLowerCase().includes("date") || key.toLowerCase().includes("submitted")) && val)
            return new Date(val).toISOString().split("T")[0];
        return val || "—";
    };

    const openAction = (type, project) => {
        setSelectedProject(project);
        if (type === "start") setStart(true);
        if (type === "work") setWork(true);
        if (type === "end") setEnd(true);
    };

    const handleRoutePlan = (onEditFun, project) => {
        setWork(true);
        setActiveExecution(onEditFun);
        setSelectedProject(project);

    }

    const handleShowProgress = async (entry) => {
        try {
            const data = await fetchProgressByforEngineer({
                projectId: entry?.project?._id,
                type: onEditFun,
            });
            setProgressData(data);
            setPorgress(true);
        } catch (e) {
            toast.error(e.response.data.message || "some error occured");
            setPorgress(false);
        }
    };

    return (
        <div className="relative h-full col-span-full w-full overflow-hidden rounded-2xl shadow-2xl bg-linear-to-b from-white via-blue-50 to-blue-100 border border-blue-200">

            {progress && progressData && (
                <ProgressShowed project={selectedProject} onClose={() => setPorgress(false)} progressData={progressData} />
            )}

            {start && (
                <DocSRecordChecklist
                    project={selectedProject}
                    start={start}
                    onClose={() => setStart(false)}
                />
            )}
            {work && activeExecution === "LOGIC" && (
                <SectionDetailsModal onClose={() => setWork(false)} project={selectedProject} setSelectedProject={setSelectedProject} activeExecution={activeExecution} />
            )}

            {work && activeExecution === "SCADA" && (
                <SectionDetailsModal onClose={() => setWork(false)} project={selectedProject} setSelectedProject={setSelectedProject} activeExecution={activeExecution} />
            )}

            {work && activeExecution === "TESTING" && (
                <SectionDetailsModal onClose={() => setWork(false)} project={selectedProject} setSelectedProject={setSelectedProject} activeExecution={activeExecution} />
            )}


            {
                selectedProjectForPopup &&
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
                ))
            }


            <div className="overflow-x-auto hidden md:block">
                <div ref={printRef} className="max-h-[560px] overflow-y-auto">
                    <table className="w-full table-fixed">
                        <thead className="sticky top-0">
                            <tr className="bg-gray-900">
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
                                        <th className="w-24 px-4 py-1.5 text-center font-semibold text-white!">
                                            VIEW
                                        </th>
                                        <th className="w-24 px-4 py-1.5 text-center font-semibold text-white!">
                                            PROGRESS
                                        </th>

                                        {onEditFun !== "WORKING" && (
                                            <th className="w-24 px-4 py-1.5 text-center font-semibold text-white!">
                                                ACTION
                                            </th>
                                        )}
                                    </>
                                )}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 bg-white">
                            {data?.map((row, i) => (
                                <tr
                                    key={i}
                                    className={`transition-colors duration-150
          ${i % 2 === 1 ? "bg-gray-200 hover:bg-slate-100" : "bg-white hover:bg-slate-50"}
        `}
                                >
                                    <td className="px-4 py-1 text-center text-sm font-semibold text-gray-700">
                                        {i + 1}
                                    </td>

                                    {tableVal.map((col, j) => {
                                        const val =
                                            onEditFun === "WORKING" ? row?.[col.val] : row?.project?.[col.val];

                                        const display = formatValue(val, col.val);

                                        return (
                                            <td key={j} className="px-6 py-1 text-base text-gray-700 whitespace-nowrap">
                                                <div
                                                    className={`truncate ${col.val === "projectName" ? "cursor-pointer hover:text-indigo-600" : ""
                                                        }`}
                                                    onClick={() =>
                                                        col.val === "projectName" && hadleOpenPopup
                                                            ? hadleOpenPopup(row?.project)
                                                            : null
                                                    }
                                                >
                                                    {display}
                                                </div>
                                            </td>
                                        );
                                    })}

                                    {isEdit && (
                                        <>
                                            {/* VIEW */}
                                            <td onClick={() => openAction("start", row)} className="px-6 py-1 text-center">
                                                <button
                                                    className="p-2.5 rounded-lg transition-all bg-transparent text-gray-700 hover:bg-gray-200"
                                                    aria-label="Update"
                                                    type="button"
                                                >
                                                    <FaEye className="w-5 h-5" />
                                                </button>
                                            </td>

                                            {/* PROGRESS */}
                                            <td className="px-6 py-1 text-center">
                                                <button
                                                    onClick={() => handleShowProgress(row)}
                                                    className="p-2.5 rounded-lg transition-all bg-transparent text-gray-700 hover:bg-gray-200"
                                                    aria-label="Update"
                                                    type="button"
                                                >
                                                    <GiProgression className="w-5 h-5" />
                                                </button>
                                            </td>

                                            {/* ACTION */}
                                            {onEditFun !== "WORKING" && (
                                                <td onClick={() => handleRoutePlan(onEditFun, row)} className="px-6 py-1 text-center">
                                                    <button
                                                        className="p-2.5 rounded-lg transition-all bg-transparent text-gray-700 hover:bg-gray-200"
                                                        aria-label="Update"
                                                        type="button"
                                                    >
                                                        <FaTools className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            )}
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>

            {/* sm view */}
            <div className="md:hidden space-y-4 p-2">
                {data?.map((row, indx) => {
                    // Same data source logic as desktop
                    const projectData =
                        onEditFun === "WORKING" ? row : row?.project;

                    return (
                        <div
                            key={indx}
                            onClick={() =>
                                projectData && hadleOpenPopup
                                    ? hadleOpenPopup(projectData)
                                    : null
                            }
                            className="
          bg-linear-to-br from-blue-50 via-white to-indigo-50
          shadow-lg rounded-xl p-4 border border-blue-200
          transition-transform hover:scale-[1.02]
        "
                        >
                            {/* HEADER */}
                            <div className="flex items-center justify-between mb-3">
                                {/* TITLE */}
                                <div
                                    className="text-base font-bold text-indigo-700 truncate max-w-[70%]"
                                    title={projectData?.[tableVal[0]?.val]}
                                >
                                    {formatValue(
                                        projectData?.[tableVal[0]?.val],
                                        tableVal[0]?.val
                                    )}
                                </div>

                                {/* ACTION BUTTONS */}
                                {isEdit && (
                                    <div className="flex items-center justify-end gap-3">
                                        {/* VIEW */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openAction("start", row);
                                            }}
                                            className="
                  flex items-center justify-center
                  bg-gradient-to-tr from-blue-500 via-cyan-500 to-indigo-500
                  hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-600
                  text-white p-2 rounded-full shadow-lg
                  transition-all duration-200
                  hover:scale-110 hover:-rotate-6
                  ring-2 ring-transparent hover:ring-blue-300
                  focus:outline-none focus:ring-4 focus:ring-blue-400
                "
                                            aria-label="View"
                                            type="button"
                                        >
                                            <FaEye className="w-5 h-5 drop-shadow" />
                                        </button>

                                        {/* PROGRESS */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShowProgress(row);
                                            }}
                                            className="
                  flex items-center justify-center
                  bg-gradient-to-tr from-green-500 via-emerald-500 to-lime-500
                  hover:from-green-600 hover:via-emerald-600 hover:to-lime-600
                  text-white p-2 rounded-full shadow-lg
                  transition-all duration-200
                  hover:scale-110 hover:-rotate-6
                  ring-2 ring-transparent hover:ring-green-300
                  focus:outline-none focus:ring-4 focus:ring-green-400
                "
                                            aria-label="Progress"
                                            type="button"
                                        >
                                            <GiProgression className="w-5 h-5 drop-shadow" />
                                        </button>

                                        {/* ACTION (ONLY IF NOT WORKING) */}
                                        {onEditFun !== "WORKING" && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRoutePlan(onEditFun, row);
                                                }}
                                                className="
                    flex items-center justify-center
                    bg-gradient-to-tr from-red-500 via-pink-500 to-yellow-500
                    hover:from-red-600 hover:via-pink-600 hover:to-yellow-600
                    text-white p-2 rounded-full shadow-lg
                    transition-all duration-200
                    hover:scale-110 hover:rotate-6
                    ring-2 ring-transparent hover:ring-red-300
                    focus:outline-none focus:ring-4 focus:ring-red-400
                  "
                                                aria-label="Action"
                                                type="button"
                                            >
                                                <FaTools className="w-5 h-5 drop-shadow" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* DETAILS */}
                            <div className="space-y-2 text-sm text-blue-800">
                                {tableVal.slice(1).map((col, i) => {
                                    const val = projectData?.[col.val];
                                    const display = formatValue(val, col.val);

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
            <div className="bg-linear-to-r from-blue-50 to-indigo-50/70 px-4 py-2 border-t border-blue-100 mt-2">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-blue-700">
                        Showing{" "}
                        <span className="font-semibold text-blue-800">{data.length}</span>{" "}
                        project{data.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

        </div >
    );
};

export default ProjectTableAllOperation;
