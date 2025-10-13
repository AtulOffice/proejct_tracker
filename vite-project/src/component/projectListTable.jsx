import React from "react";

import { useNavigate } from "react-router-dom";

const ProjectTableAll = ({ data }) => {
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

  return (
    <div className="relative h-full col-span-full w-full italic overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-b from-white via-blue-50 to-blue-100 border border-blue-200">
      <div className="overflow-x-auto">
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
                      className="text-base font-medium text-blue-900 truncate"
                      title={project.projectName}
                    >
                      {project.projectName}
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => handleUpdate(project?._id)}
                  >
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full  text-xs font-bold border shadow-sm transition whitespace-nowrap`}
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

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 px-6 py-5 border-t border-blue-100">
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
