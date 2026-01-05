import React, { useEffect, useRef, useState } from "react";
import { fetchbyOrderbyId, fetchbyProjectbyId } from "../utils/apiCall";
import ProjectDetailsPopup from "../utils/cardPopup";
import OrderDetailsPopup from "../utils/OrderShower";
import { handlePrint } from "../utils/print";
import { FaPlay, FaStop, FaTools } from "react-icons/fa";
import EndChecklistForm from "./endCheklist";
import EngineerWorkStatus from "./add.work";
import StartChecklistForm from "./startcheckList";

const ProjectTableAll = ({ data, tableVal, isEdit, onEditFun, printTitle, editType }) => {

  const printRef = useRef();
  const [selectedProjectForPopup, setSelectedProjectForPopup] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isOrderFetched, setIsOrderFetched] = useState(false);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [work, setWork] = useState(false);
  const hadleOpenPopup = async (project) => {
    try {
      const id = project?.OrderMongoId || project?._id || project?.id;
      console.log(project)
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
    if (key.toLowerCase().includes("date") && val)
      return new Date(val).toISOString().split("T")[0];
    return val || "—";
  };

  const openAction = (type, project) => {
    setSelectedProject(project);
    if (type === "start") setStart(true);
    if (type === "work") setWork(true);
    if (type === "end") setEnd(true);
  };



  return (
    <div className="relative h-full col-span-full w-full italic overflow-hidden rounded-2xl shadow-2xl bg-linear-to-b from-white via-blue-50 to-blue-100 border border-blue-200">

      {start && (
        <StartChecklistForm
          project={selectedProject}
          start={start}
          onClose={() => setStart(false)}
        />
      )}
      {work && (
        <EngineerWorkStatus
          project={selectedProject}
          onClose={() => setWork(false)}
        />
      )}
      {end && (
        <EndChecklistForm
          project={selectedProject}
          end={end}
          onClose={() => setEnd(false)}
        />
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
        <div ref={printRef} className="max-h-[690px] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0">
              <tr className="bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 border-b-2 border-purple-400 shadow-md">
                <th className="w-16 px-4 py-5 text-center text-base font-bold tracking-wide uppercase !text-gray-400">
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
                    <th className="w-24 px-6 py-5 text-center text-base font-bold tracking-wide uppercase text-gray-400!">
                      START
                    </th>
                    {/* <th className="w-24 px-6 py-5 text-center text-base font-bold tracking-wide uppercase text-gray-400!">
                      WORK
                    </th> */}
                    <th className="w-24 px-6 py-5 text-center text-base font-bold tracking-wide uppercase text-gray-400!">
                      END
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50 transition-colors duration-150 group"
                >
                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-700">
                    {i + 1}
                  </td>
                  {tableVal.map((col, j) => {
                    const val = row[col.val];
                    const display = formatValue(val, col.val);
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
                    <>
                      <td
                        onClick={() => openAction("start", row)}
                        className="px-6 py-4 text-center">
                        <button
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
                          aria-label="Update"
                          type="button"
                        >
                          <FaPlay className="w-5 h-5 drop-shadow" />
                        </button>

                      </td>
                      {/* <td onClick={() => openAction("work", row)}
                        className="px-6 py-4 text-center">
                        <button
                          className="relative group
flex items-center justify-center
bg-gradient-to-tr from-red-500 via-pink-500 to-yellow-500
hover:from-red-600 hover:via-pink-600 hover:to-yellow-600
text-white p-2 rounded-full shadow-lg
transition-all duration-200
hover:scale-110 hover:rotate-6
ring-2 ring-transparent hover:ring-red-300
focus:outline-none focus:ring-4 focus:ring-red-400
"
                          aria-label="Update"
                          type="button"
                        >
                          <FaTools className="w-5 h-5 drop-shadow" />
                        </button>
                      </td> */}
                      <td
                        onClick={() => openAction("end", row)}
                        className="px-6 py-4 text-center">
                        <button
                          className="
flex items-center justify-center
bg-gradient-to-tr from-blue-500 via-cyan-500 to-indigo-500
hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-600
text-white p-2 rounded-full shadow-lg
transition-all duration-200
hover:scale-110 hover:-rotate-6
ring-2 ring-transparent hover:ring-blue-300
focus:outline-none focus:ring-4 focus:ring-blue-400"
                          aria-label="Update"
                          type="button"
                        >
                          <FaStop className="w-5 h-5 drop-shadow" />
                        </button>

                      </td>
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
              {isEdit && (
                <div className="flex items-center justify-end gap-3">
                  {/* START */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAction("start", project);
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
                    aria-label="Start"
                    type="button"
                  >
                    <FaPlay className="w-5 h-5 drop-shadow" />
                  </button>

                  {/* WORK */}
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAction("work", project);
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
                    aria-label="Work"
                    type="button"
                  >
                    <FaTools className="w-5 h-5 drop-shadow" />
                  </button> */}

                  {/* END */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAction("end", project);
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
                    aria-label="End"
                    type="button"
                  >
                    <FaStop className="w-5 h-5 drop-shadow" />
                  </button>
                </div>
              )}

            </div>

            <div className="space-y-2 text-sm text-blue-800">
              {tableVal.slice(1).map((col, i) => {
                const val = project[col.val];
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
    </div >
  );
};

export default ProjectTableAll;
