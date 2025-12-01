import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdDeleteOutline, MdEdit, MdLocationOn } from "react-icons/md";
import PopupConfirmation from "./PopuP.Page";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../appContex";
import { LuNotepadText } from "react-icons/lu";
import { FaHome } from "react-icons/fa";

const Description = ({ one, two, three, HomeStatus }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200">
        {one}
      </span>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200">
        {two}
      </span>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200">
        {three} days
      </span>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200 flex items-center gap-1">
        {HomeStatus === "OFFICE" ? (
          <>
            <FaHome className="text-indigo-700 text-sm" />
          </>
        ) : (
          <>
            <MdLocationOn className="text-pink-700 text-sm" />
          </>
        )}
      </span>
    </div>
  );
};

const ProgressBar = ({
  label,
  value = 0,
  colorFrom,
  colorVia,
  colorTo,
  icon,
}) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="flex items-center text-sm font-semibold text-gray-700">
        {icon && <span className="mr-2 text-lg">{icon}</span>}
        {label}
      </span>
    </div>

    <div className="relative w-full h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden shadow-inner border border-gray-300">
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: `${value || 0}%`, opacity: 1 }}
        transition={{
          duration: 1.2,
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className={`absolute top-0 left-0 h-5 rounded-full
          bg-gradient-to-r ${colorFrom} ${colorVia ? colorVia : ""} ${colorTo}
          shadow-lg relative overflow-hidden
        `}
        style={{ width: `${value || 0}%` }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full"></div>
      </motion.div>

      {value > 5 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {value}%
          </span>
        </motion.div>
      )}
    </div>

    <div className="flex justify-between items-center mt-1">
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`w-2 h-1 rounded-full transition-all duration-300 ${
              index < Math.ceil((value || 0) / 20)
                ? `bg-gradient-to-r ${colorFrom} ${colorTo} shadow-sm`
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-600 font-medium">
        {value >= 100
          ? "Complete"
          : value >= 75
          ? "Almost Done"
          : value >= 50
          ? "In Progress"
          : value >= 25
          ? "Getting Started"
          : "Not Started"}
      </span>
    </div>
  </div>
);

const CardStatus = ({ project, indx }) => {
  const [deleteFlag, setDeleteflag] = useState(false);
  const [updateFlag, setUpdateflag] = useState(false);
  const [isDisabled, setIsdisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setToggle, setToggleDev } = useAppContext();

  const handleDelete = async (id, jobNumber) => {
    setIsdisabled(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/projectDev/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(`JobId ${jobNumber} deleted successfully`);
      setDeleteflag(false);
      setToggleDev((prev) => !prev);
      setToggle((prev) => !prev);
    } catch (e) {
      if (e.response) {
        toast.error(e.response?.data?.message);
      } else {
        toast.error("something went wrong");
      }
      console.log(e);
    } finally {
      setIsdisabled(false);
    }
  };

  const handleUpdateToggle = async (project) => {
    setIsdisabled(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/projectDev/existancecheck/${
          project.JobNumber
        }?check=${true}`,
        { withCredentials: true }
      );
      const exists = res?.data?.exists;
      if (!exists) {
        toast.error(res?.data?.message || "Project status does not exist");
      } else {
        setUpdateflag(true);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsdisabled(false);
    }
  };

  const handleUpdate = (project) => {
    setIsdisabled(true);
    try {
      navigate(`/develop/${project?.JobNumber}`, {
        state: { fromButton: true, recordId: project._id },
      });
      setUpdateflag(false);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsdisabled(false);
    }
  };

  return (
    <div>
      {open && (
        <ProjectTimelineForm
          project={project}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
      {deleteFlag && (
        <PopupConfirmation
          setCancelflag={setDeleteflag}
          handleConfirm={() => handleDelete(project._id, project.JobNumber)}
          isDisabled={isDisabled}
          title="Are you sure?"
          message={`Do you really want to delete Job Id ${project.JobNumber} ? This action cannot be undone.`}
          btnval="Delete"
        />
      )}
      {updateFlag && (
        <PopupConfirmation
          setCancelflag={setUpdateflag}
          isDisabled={isDisabled}
          deleteFlag={false}
          handleConfirm={() => handleUpdate(project)}
          title="Are you sure?"
          message={`Do you really want to update details in Job Id ${project.JobNumber}`}
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
        className="group relative rounded-xl bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-300 border border-transparent hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        <div className="p-6">
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center text-xs text-gray-700 bg-white/80 backdrop-blur-sm border border-white/60 px-2 py-1 rounded-full shadow-sm">
              <svg
                className="w-4 h-4 mr-1 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {project.JobNumber}
            </span>

            <div
              onClick={() => handleUpdateToggle(project)}
              className="relative group "
            >
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
                <MdEdit className="w-5 h-5 drop-shadow" />
              </button>
            </div>
          </div>

          <ul className="text-sm text-gray-800 space-y-1 mb-4">
            {project.orderDate && (
              <li>
                <strong className="text-gray-900">Order Date:</strong>{" "}
                {new Date(project.orderDate).toLocaleDateString() || ""}
              </li>
            )}
            {project.deleveryDate && (
              <li>
                <strong className="text-gray-900">Delivery Date:</strong>{" "}
                {new Date(project.deleveryDate).toLocaleDateString() || ""}
              </li>
            )}
            {project?.expenseScope && (
              <li>
                <strong className="text-gray-900">Expense scope:</strong>{" "}
                {project?.expenseScope}
              </li>
            )}

            {project.status === "completed" &&
              project.finalMomnumber &&
              project?.actualStartDate &&
              project?.actualEndDate && (
                <>
                  <li>
                    <strong className="text-gray-900">Final MOM Number:</strong>{" "}
                    {project.finalMomnumber || "not recieved"}
                  </li>
                  <li>
                    <strong className="text-gray-900">
                      Actual Start Date:
                    </strong>{" "}
                    {new Date(project.actualStartDate).toLocaleDateString()}
                  </li>
                  <li>
                    <strong className="text-gray-900">Actual End Date: </strong>
                    {new Date(project?.actualEndDate).toLocaleDateString()}
                  </li>
                </>
              )}
          </ul>

          <div className="mb-6 bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/40 shadow-lg">
            <ProgressBar
              label="Documents Progress"
              value={project.summary?.document || 0}
              colorFrom="from-blue-500"
              colorVia="via-indigo-400"
              colorTo="to-purple-400"
              icon="🎨"
            />
            <ProgressBar
              label="Scada Progress"
              value={project.summary?.scada || 0}
              colorFrom="from-emerald-500"
              colorVia="via-teal-400"
              colorTo="to-cyan-400"
              icon="⚡"
            />
            <ProgressBar
              label="Logic Progress"
              value={project.summary?.logic || 0}
              colorFrom="from-orange-500"
              colorVia="via-amber-400"
              colorTo="to-yellow-400"
              icon="🚀"
            />
            <ProgressBar
              label="Testing Progress"
              value={project.summary?.test || 0}
              colorFrom="from-green-500"
              colorVia="via-emerald-400"
              colorTo="to-teal-400"
              icon="🧪"
            />
          </div>

          <Description
            HomeStatus={project.devScope}
            one={project?.startDate || "N/A"}
            two={project?.endDate || "N/A"}
            three={project?.DaysConsumed || 0}
          />
        </div>
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-purple-300 transition-all duration-300 pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

export default CardStatus;
