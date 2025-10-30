import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { FaDev } from "react-icons/fa";
import PopupConfirmation from "./PopuP.Page";
import { useNavigate } from "react-router-dom";
import FootBarAll from "../utils/FootBarAll";
import { deleteProject, updateProject } from "../utils/apiCall";
import ProjectDetailsPopup from "../utils/cardPopup";
import { useAppContext } from "../appContex";
import { LuNotepadText } from "react-icons/lu";
import ProjectTimelineForm from "../utils/project.Planning";

const CardAll = ({
  project,
  indx,
  deleteButton = true,
  largeFlag = true,
  cardAllflag = false,
  editoptionflag = true,
}) => {
  const [deleteFlag, setDeleteflag] = useState(false);
  const [updateFlag, setUpdateflag] = useState(false);
  const [selectedProjectForPopup, setSelectedProjectForPopup] = useState(null);
  const [isDisabled, setIsdisabled] = useState(false);
  const [open, setOpen] = useState(false);
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
      {selectedProjectForPopup && (
        <ProjectDetailsPopup
          project={selectedProjectForPopup}
          onClose={() => setSelectedProjectForPopup(null)}
        />
      )}

      {open && (
        <ProjectTimelineForm
          project={{ ...project, JobNumber: project.jobNumber }}
          open={open}
          onClose={() => setOpen(false)}
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
    bg-gradient-to-br
    ${
      !editoptionflag
        ? project.Development === "SITE"
          ? "from-green-200 via-lime-100 to-emerald-100 hover:border-green-300"
          : project.Development === "OFFICE"
          ? "from-sky-200 via-blue-100 to-indigo-100 hover:border-blue-300"
          : "from-gray-200 via-gray-50 to-zinc-100 hover:border-gray-300"
        : "from-pink-200 via-purple-50 to-indigo-50 hover:border-indigo-300"
    }
  `}
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
            {cardAllflag &&
              (project?.Development == "OFFICE" ||
                project?.Development == "SITE") && (
                <div onClick={() => setOpen(true)} className="relative group ">
                  <button
                    className="
flex items-center justify-center
bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400
hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-500
text-white p-2 rounded-full shadow-lg
transition-all duration-200
hover:scale-110 hover:-rotate-6
ring-2 ring-transparent hover:ring-emerald-300
focus:outline-none focus:ring-4 focus:ring-emerald-400
"
                    aria-label="Update"
                    type="button"
                  >
                    <LuNotepadText className="w-5 h-5 drop-shadow" />
                  </button>
                </div>
              )}
            {cardAllflag &&
              (project?.Development == "OFFICE" ||
                project?.Development == "SITE") && (
                <div
                  onClick={() => handleDevelop(project)}
                  className="relative group "
                >
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
                    <FaDev className="w-5 h-5 drop-shadow" />
                  </button>
                </div>
              )}

            {editoptionflag && (
              <div
                onClick={() => setUpdateflag(true)}
                className="relative group "
              >
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
                  <MdEdit className="w-5 h-5 drop-shadow" />
                </button>
              </div>
            )}

            {deleteButton && (
              <div
                onClick={() => setDeleteflag(true)}
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
                <MdDeleteOutline className="w-5 h-5 drop-shadow" />
              </div>
            )}
          </div>

          <div className="flex justify-between items-start my-2">
            <h3 className="text-xl font-extrabold text-transparent p-2 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 group-hover:from-pink-300 rounded-lg group-hover:via-purple-300 group-hover:to-indigo-300 transition-colors duration-300 shadow-lg truncate">
              {project.projectName.toUpperCase()}
            </h3>
          </div>

          <ul className="text-sm text-gray-700 space-y-1 mb-4 truncate">
            <div className="hidden sm:block">
              <li>
                <strong>Client:</strong> {project?.client}
              </li>
            </div>

            {project?.endUser && largeFlag && (
              <li>
                <strong>End User:</strong> {project.endUser}
              </li>
            )}

            <li>
              <strong>Location:</strong> {project?.location || "Not mentioned"}
            </li>
            {editoptionflag && (
              <>
                <li>
                  <strong>Order Value (Lacs):</strong> ₹
                  {project?.bill
                    ? (project.bill / 100000).toFixed(2)
                    : "Not mentioned"}
                </li>

                <li>
                  <strong>Pending Bill (Lacs):</strong> ₹
                  {project?.dueBill
                    ? (project.dueBill / 100000).toFixed(2)
                    : "Not mentioned"}
                </li>

                <li>
                  <strong>Billing Status:</strong>{" "}
                  {project?.billStatus ?? "Not provided"}
                </li>
              </>
            )}
            <li>
              <strong>Order Date:</strong>{" "}
              {project?.orderDate
                ? new Date(project.orderDate).toLocaleDateString()
                : "Not provided"}
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
              {editoptionflag && (
                <li>
                  <strong>Expense Scope:</strong>{" "}
                  {project?.expenseScope || "Not provided"}
                </li>
              )}
              <li className="truncate">
                <strong>Engineer Assigned:</strong>{" "}
                {project?.engineerName?.length > 0
                  ? project.engineerName.join(", ")
                  : "-"}
              </li>
              <li className="truncate">
                <strong>Work Scope:</strong>{" "}
                {project?.workScope || "Not mentioned"}
              </li>

              {editoptionflag && (
                <>
                  <li>
                    <strong>Request Date:</strong>{" "}
                    {project?.requestDate
                      ? new Date(project.requestDate).toLocaleDateString()
                      : "-"}
                  </li>

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
                      className={`px-2 py-1 text-xs font-semibold rounded-md ${
                        project?.Development == "OFFICE" ||
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
                  <li>
                    <strong>Backup Submission:</strong>{" "}
                    {project?.BackupSubmission || "Not mentioned"}
                  </li>
                  <li>
                    <strong>Expense Submission:</strong>{" "}
                    {project?.ExpensSubmission || "Not mentioned"}
                  </li>
                </>
              )}
              {largeFlag && (
                <>
                  <li>
                    <strong>Entity Type:</strong> {project.entityType}
                  </li>
                  <li className="truncate">
                    <strong>Key Notes:</strong> {project.description || "-"}
                  </li>
                  <li>
                    <strong>SO Type:</strong> {project?.soType}
                  </li>
                </>
              )}
              <li className="truncate">
                <strong>PO No:</strong> {project?.orderNumber || "-"}
              </li>
              <li>
                <strong>Days Spent On Site:</strong>{" "}
                {project.daysspendsite || "Not mentioned"}
              </li>
              <li>
                <strong>Project Start Date:</strong>{" "}
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString()
                  : "-"}
              </li>
              <li>
                <strong>Project End Date:</strong>{" "}
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : "-"}
              </li>
              {editoptionflag && (
                <>
                  <li>
                    <strong>Final MOM Number:</strong>{" "}
                    {project?.finalMomnumber || "Not received"}
                  </li>
                  <li>
                    <strong>Actual Start Date:</strong>{" "}
                    {project?.actualStartDate
                      ? new Date(project.actualStartDate).toLocaleDateString()
                      : "-"}
                  </li>
                  <li>
                    <strong>Actual End Date:</strong>{" "}
                    {project?.actualEndDate
                      ? new Date(project.actualEndDate).toLocaleDateString()
                      : "-"}
                  </li>
                </>
              )}
            </div>
          </ul>

          {largeFlag ? (
            <FootBarAll
              one={project?.status}
              two={project?.service}
              three={project?.priority}
            />
          ) : (
            <FootBarAll
              {...(cardAllflag && { four: project?.Development })}
              one={project?.entityType}
              two={project?.priority}
              three={project?.soType}
            />
          )}
        </div>

        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-300 transition-all duration-300 pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

export default CardAll;
