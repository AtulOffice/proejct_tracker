import React, { useState } from "react";
import { motion } from "framer-motion";
import PopupConfirmation from "./PopuP.Page";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaStop, FaTools } from "react-icons/fa";
import { deleteProject, updateProject } from "../utils/apiCall";
import ProjectDetailsPopup from "../utils/cardPopup";
import { useAppContext } from "../appContex";
import StartChecklistForm from "./startcheckList";
import EndChecklistForm from "./endCheklist";
import EngineerWorkStatus from "./add.work";

const CardAll = ({ project, indx }) => {
  const [deleteFlag, setDeleteflag] = useState(false);
  const [updateFlag, setUpdateflag] = useState(false);
  const [selectedProjectForPopup, setSelectedProjectForPopup] = useState(null);
  const [isDisabled, setIsdisabled] = useState(false);

  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [work, setWork] = useState(false);

  const navigate = useNavigate();
  const { setToggle } = useAppContext();

  const handleDelete = async (id, jobNumber) => {
    setIsdisabled(true);
    try {
      await deleteProject(id, jobNumber);
      setDeleteflag(false);
      setToggle((prev) => !prev);
    } catch (e) {
      console.log(e);
    } finally {
      setIsdisabled(false);
    }
  };

  const handleUpdate = (id) => {
    setIsdisabled(true);
    try {
      navigate(`/update/${id}`, { state: { fromButton: true, recordId: id } });
      setUpdateflag(false);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsdisabled(false);
    }
  };

  const handleDevelop = async (project) => {
    try {
      await updateProject(project, navigate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {start && (
        <StartChecklistForm
          project={project}
          start={start}
          onClose={() => setStart(false)}
        />
      )}
      {work && (
        <EngineerWorkStatus
          project={project}
          onClose={() => setWork(false)}
        />
      )}
      {end && (
        <EndChecklistForm
          project={project}
          end={end}
          onClose={() => setEnd(false)}
        />
      )}
      {selectedProjectForPopup && (
        <ProjectDetailsPopup
          project={selectedProjectForPopup}
          onClose={() => setSelectedProjectForPopup(null)}
        />
      )}

      {deleteFlag && (
        <PopupConfirmation
          setCancelflag={setDeleteflag}
          handleConfirm={() => handleDelete(project._id, project.jobNumber)}
          isDisabled={isDisabled}
          title="Are you sure?"
          message={`Do you really want to delete JobId ${project.jobNumber} ? This action cannot be undone.`}
          btnval="Delete"
        />
      )}
      {updateFlag && (
        <PopupConfirmation
          setCancelflag={setUpdateflag}
          deleteFlag={false}
          isDisabled={isDisabled}
          handleConfirm={() => handleUpdate(project._id)}
          title="Are you sure?"
          message={`Do you really want to update details in orderId ${project.jobNumber}`}
          btnval="Update"
        />
      )}
      <motion.div
        layout="true"
        key={indx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        onClick={() =>
          window.innerWidth < 640 && setSelectedProjectForPopup(project)
        }
        className={`group relative rounded-xl border border-transparent shadow-md hover:shadow-xl transition-all duration-300
    bg-gradient-to-br from-green-200 via-lime-100 to-emerald-100 hover:border-green-300`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center text-xs text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-full shadow-sm">
              <svg
                className="w-4 h-4 mr-1 text-indigo-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {project.jobNumber}
            </span>
            <div onClick={(e) => {
              e.stopPropagation();
              setStart(true);
            }} className="relative group ">
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
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation(); setWork(true)
              }}
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
              aria-label="Delete"
              type="button"
            >
              <FaTools className="w-5 h-5 drop-shadow" />
            </div>
            <div onClick={(e) => { e.stopPropagation(); setEnd(true) }} className="relative group ">
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
                <FaStop className="w-5 h-5 drop-shadow" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-start my-2">
            <h3 className="text-xl font-extrabold text-transparent p-2 bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 group-hover:from-pink-100 rounded-lg group-hover:via-purple-100 group-hover:to-indigo-100 transition-colors duration-200 shadow-lg truncate">
              {project.projectName.toUpperCase()}
            </h3>
          </div>

          <ul className="text-sm text-gray-700 space-y-1 mb-4 truncate">
            <div className="hidden sm:block">
              <li>
                <strong>Client:</strong> {project?.client}
              </li>
            </div>
            <li>
              <strong>End User:</strong> {project.endUser}
            </li>

            <li>
              <strong>Location:</strong> {project?.location || "Not mentioned"}
            </li>
            <li>
              <strong>Delivery Date:</strong>{" "}
              {project?.deleveryDate
                ? new Date(project.deleveryDate).toLocaleDateString()
                : "Not provided"}
            </li>
            <li>
              <strong>Service Days:</strong>{" "}
              {project?.duration !== "0" ? project?.duration : "Not provided"}
            </li>
            <div className="hidden sm:block">
              <li className="truncate">
                <strong>Work Scope:</strong>{" "}
                {project?.workScope || "Not mentioned"}
              </li>

              <>
                <li>
                  <strong>Visit Start Date:</strong>{" "}
                  {project?.visitDate
                    ? new Date(project.visitDate).toLocaleDateString()
                    : "-"}
                </li>
                <li>
                  <strong>Start Checklist:</strong>{" "}
                  {project?.StartChecklist || "Not mentioned"}
                </li>
                <li>
                  <strong>Visit End Date:</strong>{" "}
                  {project?.visitendDate
                    ? new Date(project.visitendDate).toLocaleDateString()
                    : "-"}
                </li>
                <li>
                  <strong>End Checklist:</strong>{" "}
                  {project?.EndChecklist || "Not mentioned"}
                </li>
                <li>
                  <strong>MOM SR No:</strong>{" "}
                  {project?.momsrNo?.length > 0 ? project.momsrNo : "-"}
                </li>
                <li className="flex items-center space-x-2">
                  <strong className="text-gray-700">Development:</strong>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-md ${project?.Development == "OFFICE" ||
                      project?.Development == "SITE"
                      ? "bg-green-100 text-green-700"
                      : ""
                      }`}
                  >
                    {project?.Development}
                  </span>
                </li>
                <li>
                  <strong>MOM Dates:</strong>{" "}
                  {project?.momDate?.length > 0
                    ? project.momDate
                      .map((dateStr) =>
                        new Date(dateStr).toLocaleDateString()
                      )
                      .join(", ")
                    : "-"}
                </li>
              </>
              <>
                <li className="truncate">
                  <strong>Key Notes:</strong> {project.description || "-"}
                </li>
              </>
            </div>
          </ul>
        </div>

        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-300 transition-all duration-300 pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

export default CardAll;
