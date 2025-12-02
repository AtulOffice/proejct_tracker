import React from "react";
import { FaBook } from "react-icons/fa";
import { format } from "date-fns";
import { FaUser } from "react-icons/fa6";
import LollipopChart from "./overviewChart";
import { useAppContext } from "../appContex";
import UnderDevelopment from "./underdevelopment";

const ProjectOverview = ({ overvew, setActiveCard }) => {
  const { user } = useAppContext();
  const statusGroups = {
    startcheck: { name: "START", cnt: overvew?.totalStartChecklist || 0 },
    workstatus: { name: "WORK", cnt: overvew?.totalWorkStatus || 0 },
    endcheck: { name: "END", cnt: overvew?.totalEndChecklist || 0 },
  };
  // set and future made
  const router = {
    START: "zero",
    WORK: "zero",
    END: "zero",
  };

  const gradients = [
    "from-rose-400 via-fuchsia-500 to-purple-600 hover:from-rose-500 hover:via-fuchsia-600 hover:to-purple-700",
    "from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-500 hover:via-sky-600 hover:to-blue-700",
    "from-emerald-400 via-teal-500 to-cyan-600 hover:from-emerald-500 hover:via-teal-600 hover:to-cyan-700",
    "from-violet-400 via-purple-500 to-fuchsia-600 hover:from-violet-500 hover:via-purple-600 hover:to-fuchsia-700",
    "from-amber-400 via-orange-500 to-red-600 hover:from-amber-500 hover:via-orange-600 hover:to-red-700",
    "from-pink-400 via-rose-500 to-orange-600 hover:from-pink-500 hover:via-rose-600 hover:to-orange-700",
  ];

  const cardColors = [
    { bg: "from-purple-500 to-pink-600", icon: "from-purple-600 to-pink-700", badge: "bg-purple-100 text-purple-700" },
    { bg: "from-cyan-500 to-blue-600", icon: "from-cyan-600 to-blue-700", badge: "bg-cyan-100 text-cyan-700" },
    { bg: "from-emerald-500 to-teal-600", icon: "from-emerald-600 to-teal-700", badge: "bg-emerald-100 text-emerald-700" },
  ];


  return (
    <div className={`transition-all duration-300 lg:ml-64 pt-16 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100`}>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-2">
            Welcome back, <span className="font-semibold text-purple-600">{user ? user?.name.toUpperCase() : "ENGINEER"}</span>
          </p>
        </div>

        {/* Desktop Cards */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(statusGroups).map(([key, item], index) => (
            <div
              key={index}
              onClick={() => setActiveCard(router[item.name])}
              className="cursor-pointer group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-2xl hover:translate-y-[-4px]"
            >
              {/* Gradient Background Blob */}
              <div
                className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${cardColors[index % cardColors.length].bg
                  } opacity-10 rounded-bl-[120px] group-hover:opacity-20 transition-opacity duration-300`}
              />

              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    TOTAL
                  </p>
                  <h3 className="text-4xl font-black text-gray-800 mt-2">
                    <span className="inline-block animate-fadeIn">
                      {item.cnt}
                    </span>
                  </h3>
                </div>

                <div
                  className={`flex items-center justify-center rounded-2xl p-4 bg-gradient-to-br ${cardColors[index % cardColors.length].icon
                    } shadow-xl group-hover:scale-110 transition-transform duration-300`}
                >
                  <FaBook className="text-white" size={28} />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${cardColors[index % cardColors.length].bg
                    } rounded-full w-full transform origin-left group-hover:scale-x-105 transition-transform duration-300`}
                />
              </div>

              {/* Badge */}
              <div className="mt-4 flex items-center justify-end">
                <span
                  className={`${cardColors[index % cardColors.length].badge} text-xs font-bold px-3 py-1.5 rounded-full`}
                >
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Mobile Cards */}
        <div className="md:hidden grid grid-cols-2 gap-4 mb-8">
          {Object.entries(statusGroups).map(([key, item], index) => (
            <div
              key={key}
              onClick={() => setActiveCard(router[item.name])}
              className={`group relative overflow-hidden p-5 rounded-2xl border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between bg-gradient-to-br ${gradients[index % gradients.length]
                }`}
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

              <div className="relative z-10">
                <p className="text-xs font-bold text-white/90">TOTAL</p>
                <h3 className="text-3xl font-black text-white mt-1 drop-shadow-lg">
                  {item.cnt}
                </h3>
              </div>

              <div className="relative z-10 mt-3">
                <span className="text-xs font-bold text-white bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              PROEJECT INCLUDE DEVELOPMENT
            </h3>
            <div className="space-y-4 h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
              {(overvew?.projectIncludeDev ? overvew.projectIncludeDev : []).map(
                (project, indx) => (
                  <div
                    className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group"
                    key={indx}
                  >
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FaUser className="text-white" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-bold text-base">
                        {project.JobNumber}
                      </p>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                        {project.projectName}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          D-{project?.summary?.document}
                        </span>
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          S-{project?.summary?.scada}
                        </span>
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          L-{project?.summary?.logic}
                        </span>
                        <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          T-{project?.summary?.test}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
              STATUS OVERVIEW
            </h3>
            {/*  */}
            {/* for future view */}
          </div>
        </div>

        {/* Recent Projects Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            LAST 3 PROJECTS ASSIGNED FOR YOU
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    JobNumber
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Assigned_At
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Client
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {(overvew?.latestProjects || []).map((project, indx) => (
                  <tr key={indx} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {project.projectName}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700">
                        {project.jobNumber}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700">
                        {project?.location || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {project.assignedAt
                        ? format(new Date(project.assignedAt), "dd MMM yyyy")
                        : "NOT PROVIDED"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {project.endUser || "N/A"}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
