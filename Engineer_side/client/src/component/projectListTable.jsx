import axios from "axios";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { fetchbyProjectbyId } from "../utils/apiCall";
import toast from "react-hot-toast";
import ProjectDetailsPopup from "../utils/cardPopup";

const ProjectTableAll = ({ data }) => {
  const [selectedProjectForPopup, setSelectedProjectForPopup] = useState(null);
  const navigate = useNavigate();
  const handleUpdate = (id) => {
    try {
      navigate(`/update/${id}`, {
        state: { fromButton: true, recordId: id },
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const hadleOpenPopup = async (id) => {
    try {
      const val = await fetchbyProjectbyId(id);
      if (val) {
        setSelectedProjectForPopup(val);
      }
      toast.success("Project details fetched successfully");
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data.message || "An error occurred");
      }
      console.log("Error fetching project details:", error);
    }
  };

  return (
    <div className="relative h-full col-span-full w-full italic overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-b from-white via-blue-50 to-blue-100 border border-blue-200">
      {selectedProjectForPopup && (
        <ProjectDetailsPopup
          project={selectedProjectForPopup}
          onClose={() => setSelectedProjectForPopup(null)}
        />
      )}
      <div className="overflow-x-auto hidden md:block">
        <div className="max-h-[690px] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 via-pink-500 to-pink-600 text-white shadow-lg">
                <th className="w-1/5 px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                  Project Name
                </th>
                <th className="w-32 px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                  Status
                </th>
                <th className="w-32 px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                  Job ID
                </th>
                <th className="w-32 px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                  Delivery
                </th>
                <th className="w-32 px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                  Visit
                </th>
                <th className="w-1/5 px-6 py-5 text-left text-base font-bold tracking-wide uppercase">
                  ALL Engineer List
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {data.map((project, indx) => (
                <tr
                  key={indx}
                  className={`hover:bg-blue-50/60 transition-colors duration-150 ${
                    indx % 2 === 0
                      ? "bg-gradient-to-r from-white via-blue-50 to-white"
                      : "bg-gradient-to-r from-white via-blue-100 to-white"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div
                      className="text-base font-medium hover:cursor-pointer text-blue-900 truncate"
                      title={project.projectName}
                      onClick={() => hadleOpenPopup(project?._id)}
                    >
                      {project.projectName}
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => handleUpdate(project?._id)}
                  >
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm transition whitespace-nowrap`}
                    >
                      <span className="ml-2">{project.status}</span>
                    </span>
                  </td>
                  <td
                    onClick={() => handleUpdate(project?._id)}
                    className="px-6 py-4 text-base font-semibold text-blue-700 whitespace-nowrap cursor-pointer"
                  >
                    {project.jobNumber}
                  </td>
                  <td className="px-6 py-4 text-base text-blue-700 whitespace-nowrap">
                    {project.deleveryDate}
                  </td>
                  <td className="px-6 py-4 text-base text-blue-700 whitespace-nowrap">
                    {project.visitDate}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-[12px] text-blue-900 break-words max-w-xs"
                      title={project.engineerName || "Not assigned"}
                    >
                      {project.engineerName.join(" , ") || "—"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4 p-2">
        {data.map((project, indx) => (
          <div
            onClick={() => hadleOpenPopup(project?._id)}
            key={indx}
            className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg rounded-xl p-4 border border-blue-200 transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="text-base font-bold text-indigo-700 truncate max-w-[70%]"
                title={project.projectName}
              >
                {project.projectName}
              </div>
              <span
                onClick={() => handleUpdate(project?._id)}
                className="inline-flex items-center px-2 py-1 border border-indigo-300 rounded-full font-semibold text-[11px] bg-indigo-100 text-indigo-700 shadow-sm"
                title={project.status}
              >
                {project.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-blue-800">
              <div>
                <span className="font-medium text-indigo-600">Job ID:</span>
                <span className="ml-2 font-semibold ">{project.jobNumber}</span>
              </div>
              <div>
                <span className="font-medium text-indigo-600">Delivery:</span>
                <span className="ml-2">{project.deleveryDate}</span>
              </div>
              <div>
                <span className="font-medium text-indigo-600">Visit:</span>
                <span className="ml-2">{project.visitDate}</span>
              </div>
              <div>
                <span className="font-medium text-indigo-600">Engineer:</span>
                <span
                  className="ml-2 truncate block max-w-xs"
                  title={project.engineerName || "Not assigned"}
                >
                  {project.engineerName.join(" , ") || "—"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 Footer Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 px-6 py-5 border-t border-blue-100 mt-4">
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <p className="text-base text-blue-700">
            Showing{" "}
            <span className="font-bold text-blue-800">{data.length}</span>{" "}
            project{data.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectTableAll;
