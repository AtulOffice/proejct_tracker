import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { MdDeleteOutline, MdEdit } from "react-icons/md";
import PopupConfirmation from "./PopuP.Page";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../appContex";
import FootBarAll from "../utils/FootBarAll";

const CardAll = ({
  project,
  indx,
  fetchProjects,
  deleteButton = true,
  shortFlag = true,
}) => {
  const { setToggle } = useAppContext();
  const [deleteFlag, setDeleteflag] = useState(false);
  const [updateFlag, setUpdateflag] = useState(false);
  const [isDisabled, setIsdisabled] = useState(false);
  const [updateId, setUpdateid] = useState();
  const navigate = useNavigate();

  const handleDelete = async (id, jobNumber) => {
    setIsdisabled(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/delete/${id}`);
      toast.success(`JobId ${jobNumber} deleted successfully`);
      setDeleteflag(false);
      setToggle((prev) => !prev);
      fetchProjects(true);
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

  const handleUpdate = (id) => {
    setIsdisabled(true);
    try {
      navigate(`/update/${id}`);
      setUpdateflag(false);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsdisabled(false);
    }
  };

  return (
    <div>
      {deleteFlag && (
        <PopupConfirmation
          setCancelflag={setDeleteflag}
          handleConfirm={() => handleDelete(project._id, project.jobNumber)}
          updateId={updateId}
          setUpdateid={setUpdateid}
          isDisabled={isDisabled}
          title="Are you sure?"
          message={`Do you really want to delete JobId ${project.jobNumber} ? This action cannot be undone.`}
          btnval="Delete"
        />
      )}
      {updateFlag && (
        <PopupConfirmation
          setCancelflag={setUpdateflag}
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
        className="group relative rounded-xl bg-gradient-to-br from-pink-200 via-purple-50 to-indigo-50 border border-transparent hover:border-indigo-300 shadow-md hover:shadow-xl transition-all duration-300 "
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
            <h3 className="text-xl font-extrabold text-transparent p-2 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 group-hover:from-pink-300 rounded-lg group-hover:via-purple-300 group-hover:to-indigo-300 transition-colors duration-300 shadow-lg">
              {project.projectName.toUpperCase()}
            </h3>
          </div>

          <ul className="text-sm text-gray-700 space-y-1 mb-4">
            <li>
              <strong>Project Name:</strong> {project.projectName}
            </li>
            {project.engineerName.length > 0 && (
              <li>
                <strong>Engineer Name:</strong>
                {project.engineerName.join(", ")}
              </li>
            )}
            {shortFlag && (
              <li>
                <strong>Entity Type:</strong> {project.entityType}
              </li>
            )}
            {project.status === "completed" &&
              project.finalMomnumber &&
              project?.actualStartDate &&
              project?.actualEndDate && (
                <>
                  <li>
                    <strong>Final MOM Number:</strong>{" "}
                    {project.finalMomnumber || "not recieved"}
                  </li>

                  <li>
                    <strong>Actual Start Date:</strong>{" "}
                    {new Date(project.actualStartDate).toLocaleDateString()}
                  </li>
                  <li>
                    <strong>Actual End Date: </strong>
                    {new Date(project?.actualEndDate).toLocaleDateString()}
                  </li>
                </>
              )}
            {shortFlag && (
              <li>
                <strong>SO Type:</strong> {project?.soType}
              </li>
            )}
            <li>
              <strong>Client:</strong> {project?.client}
            </li>
            {project?.orderNumber && (
              <li>
                <strong>Po No:</strong> {project?.orderNumber}
              </li>
            )}
            <li>
              <strong>Bill:(lacs)</strong> ₹{project?.bill ?? "not mentioned"}
            </li>
            <li>
              <strong>Due Bill(lacs):</strong> ₹
              {project?.dueBill ?? "not mentioned"}
            </li>
            <li>
              <strong>Bill Notice:</strong> {project?.billStatus}
            </li>
            {project?.visitDate &&
              project?.visitendDate(
                <>
                  <li>
                    <strong>Visit Date:</strong>{" "}
                    {new Date(project.visitDate).toLocaleDateString() || ""}
                  </li>

                  <li>
                    <strong>Visit End Date:</strong>{" "}
                    {new Date(project.visitendDate).toLocaleDateString() || ""}
                  </li>
                </>
              )}
            {project?.momDate?.length > 0 && (
              <li>
                <strong>MOM Dates:</strong>{" "}
                {project.momDate
                  .map((dateStr) => new Date(dateStr).toLocaleDateString())
                  .join(", ")}
              </li>
            )}

            {project?.momsrNo.length > 0 && (
              <li>
                <strong>MOM SR No:</strong> {project.momsrNo}
              </li>
            )}
            {project?.endUser && shortFlag && (
              <li>
                <strong>End User:</strong> {project.endUser}
              </li>
            )}
            {project.orderDate && (
              <li>
                <strong>Order Date:</strong>{" "}
                {new Date(project.orderDate).toLocaleDateString() || ""}
              </li>
            )}
            <li>
              <strong>Days Spent On Site:</strong>{" "}
              {project.daysspendsite || "not mentioned"}
            </li>
            {project?.startDate && project?.endDate && (
              <>
                <li>
                  <strong>project Start Date:</strong>{" "}
                  {new Date(project.startDate).toLocaleDateString() || ""}
                </li>
                <li>
                  <strong>Project End Date:</strong>{" "}
                  {new Date(project.endDate).toLocaleDateString() || ""}
                </li>
              </>
            )}
            <li>
              <strong>Location:</strong> {project?.location || "not mentioned"}
            </li>
            {project.description !== "N/A" && shortFlag && (
              <li>
                <strong>Remarks:</strong> {project.description || ""}
              </li>
            )}
            {project?.duration !== "0" && (
              <li>
                <strong>Duration:</strong>{" "}
                {project?.duration || "not mentioned"}
              </li>
            )}
          </ul>
          {shortFlag ? (
            <FootBarAll
              one={project?.status}
              two={project?.service}
              three={project?.priority}
            />
          ) : (
            <FootBarAll
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
