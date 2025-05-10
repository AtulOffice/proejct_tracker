import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdDeleteOutline } from "react-icons/md";
import PopupConfirmation from "./PopuP.Page";
import axios from "axios";
import toast from "react-hot-toast";
import WorkStatusModal from "./workPopup";

const CardWorkStatus = ({ project, indx, setToggle }) => {
  const [deleteFlag, setDeleteflag] = useState(false);
  const [isDisabled, setIsdisabled] = useState(false);
  const [updateId, setUpdateid] = useState();
  const [details, setDetails] = useState(false);

  const formattedDate = (date) => {
    const validDate = new Date(date);
    const dateval = validDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return dateval;
  };

  const handleDelete = async (id) => {
    setIsdisabled(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/worksts/delete/${id}`);
      toast.success(`Work Status deleted successfully`);
      setDeleteflag(false);
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

  return (
    <div
      onClick={(e) => setDetails((prev) => !prev)}
      className="cursor-pointer"
    >
      {details && (
        <WorkStatusModal
          workStatus={project?.WorkStatus}
          onClose={() => setDetails((prev) => !prev)}
        />
      )}
      {deleteFlag && (
        <PopupConfirmation
          setCancelflag={setDeleteflag}
          handleConfirm={() => handleDelete(project._id)}
          updateId={updateId}
          setUpdateid={setUpdateid}
          isDisabled={isDisabled}
          title="Are you sure?"
          message={`Do you really want to delete Worksatatus related to ${project.jobNumber} jobnumber? This action cannot be undone.`}
          btnval="Delete"
        />
      )}

      <motion.div
        layout="true"
        key={indx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="group relative rounded-xl bg-gradient-to-br from-blue-200 via-purple-50 to-indigo-50 border border-transparent hover:border-indigo-300 shadow-md hover:shadow-xl transition-all duration-300 "
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
            <div
              onClick={(e) => {
                e.stopPropagation();
                setDeleteflag(true);
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
              <MdDeleteOutline className="w-5 h-5 drop-shadow" />
            </div>
          </div>

          <div className="flex justify-between items-start my-2">
            <h3 className="text-xl font-extrabold text-transparent p-2 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 group-hover:from-pink-300 rounded-lg group-hover:via-purple-300 group-hover:to-indigo-300 transition-colors duration-300 shadow-lg">
              {project.projectName.toUpperCase()}
            </h3>
          </div>

          <ul className="text-sm text-gray-700 space-y-1 mb-4">
            <li>
              <strong>Project Name:</strong> {project.projectName}
            </li>
            {project.EngineerName && (
              <li>
                <strong>Engineer Name:</strong>
                {project.EngineerName}
              </li>
            )}
            {
              <li>
                <strong>Entity Type:</strong> {project.entityType}
              </li>
            }
            <>
              <li>
                <strong>from</strong>{" "}
                {new Date(project.fromDate).toLocaleDateString()}
              </li>
              <li>
                <strong>to: </strong>
                {new Date(project?.toDate).toLocaleDateString()}
              </li>
            </>
            <li>
              <strong>Location:</strong> {project?.location || "not mentioned"}
            </li>
          </ul>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200">
              {project.soType}
            </span>
            {project.createdAt && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200">
                {formattedDate(project.createdAt)}
              </span>
            )}
          </div>
        </div>

        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-indigo-300 transition-all duration-300 pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

export default CardWorkStatus;
