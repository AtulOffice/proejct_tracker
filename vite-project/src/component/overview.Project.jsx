import React from "react";
import { FaBook } from "react-icons/fa";
import { format } from "date-fns";
import { PieChart } from "react-minimal-pie-chart";
import { FaUser } from "react-icons/fa6";
import LollipopChart from "./overviewChart";
import { useAppContext } from "../appContex";

const ProjectOverview = ({ overvew, setActiveCard }) => {
  const { user } = useAppContext();
  const statusGroups = {
    upcoming: { name: "UpComing", cnt: 0 },
    running: { name: "Active", cnt: 0 },
    urgent: { name: "Urgent", cnt: 0 },
    pending: { name: "Pending", cnt: 0 },
    norequest: { name: "No Request", cnt: 0 },
  };
  const router = {
    UpComing: "three",
    Active: "ten",
    Urgent: "seven",
    Pending: "four",
    Completed: "five",
    Closed: "thirteen",
    norequest: "twelve",
    Cancelled: "eight",
    "No Request": "twelve",
  };
  const statusGroupschart = {
    complete: { name: "Completed", cnt: 0, color: "#fbbf24" },
    running: { name: "Active", cnt: 0, color: "#6366f1" },
    upcoming: { name: "Upcoming", cnt: 0, color: "#34d399" },
    pending: { name: "Pending", cnt: 0, color: "#a78bfa" },
    urgent: { name: "Urgent", cnt: 0, color: "#f87171" },
  };
  const gradients = [
    "from-orange-100 via-pink-100 to-rose-100 hover:from-orange-200 hover:via-pink-200 hover:to-rose-200",
    "from-cyan-100 via-blue-100 to-indigo-100 hover:from-cyan-200 hover:via-blue-200 hover:to-indigo-200",
    "from-emerald-100 via-teal-100 to-cyan-100 hover:from-emerald-200 hover:via-teal-200 hover:to-cyan-200",
    "from-violet-100 via-purple-100 to-fuchsia-100 hover:from-violet-200 hover:via-purple-200 hover:to-fuchsia-200",
    "from-amber-100 via-yellow-100 to-orange-100 hover:from-amber-200  hover:via-yellow-200 hover:to-orange-200",
    "from-pink-100 via-purple-100 to-blue-100 hover:from-pink-200 hover:via-purple-200 hover:to-blue-200",
  ];

  return (
    <div className={`transition-all duration-300 lg:ml-64 pt-16 min-h-screen`}>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-1">
            Welcome back, {user ? user?.username.toUpperCase() : "Admin!"}
          </p>
        </div>
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {(overvew?.statusGroups
            ? Object.entries(overvew.statusGroups)
            : Object.entries(statusGroups)
          )
            .filter(
              ([key]) => !["closed", "cancelled", "complete"].includes(key)
            )
            .map(([_, item], index) => (
              <div
                onClick={() => setActiveCard(router[item.name])}
                key={index}
                className="cursor-pointer relative overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/40 to-purple-100/30 rounded-bl-[100px] -z-10"></div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                      TOTAL
                    </p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                      <span className="inline-block animate-fadeIn">
                        {item.cnt}
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-center justify-center rounded-full p-3 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
                    <FaBook className="text-white" size={26} />
                  </div>
                </div>

                <div className="mt-5 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full width-full"></div>
                </div>

                <div className="mt-3 flex items-center">
                  <span className="ml-auto bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
        </div>

        <div className="md:hidden grid grid-cols-2 gap-4 mb-8">
          {Object.entries(overvew?.statusGroups || statusGroups)
            .filter(
              ([key]) => !["closed", "cancelled", "complete"].includes(key)
            )
            .map(([key, item], index) => (
              <div
                key={key}
                onClick={() => setActiveCard(router[item.name])}
                className={`relative overflow-hidden p-4 rounded-2xl border border-indigo-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between bg-gradient-to-br ${
                  gradients[index % gradients.length]
                }`}
              >
                <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-sm" />

                <div className="relative z-10">
                  <p className="text-[11px] text-gray-600">TOTAL</p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {item.cnt}
                  </h3>
                </div>

                <div className="relative z-10 mt-2 flex justify-between items-center">
                  <span className="text-xs font-medium text-indigo-700 bg-white/60 px-2.5 py-1 rounded-full">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              ACTIVE DEVELOPMENT PROJECTS
            </h3>
            <div className="space-y-3 sm:space-y-4 h-[280px] sm:h-70 overflow-y-auto pr-2 cursor-grab">
              {(overvew?.highPriority ? overvew.highPriority : []).map(
                (project, indx) => (
                  <div
                    className="flex items-start italic space-x-3 sm:space-x-4"
                    key={indx}
                  >
                    <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4">
                      <FaUser className="text-blue-500" size={16} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {project.JobNumber}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm truncate max-w-[220px] sm:max-w-none">
                        {project.projectName}
                      </p>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                        <span className="bg-blue-100 text-blue-600 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                          D-{project?.summary?.document}
                        </span>
                        <span className="bg-yellow-100 text-yellow-600 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                          S-{project?.summary?.scada}
                        </span>
                        <span className="bg-green-100 text-green-600 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                          L-{project?.summary?.logic}
                        </span>
                        <span className="bg-purple-100 text-purple-600 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                          T-{project?.summary?.test}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              STATUS OVERVIEW
            </h3>
            <div className="h-70 flex items-center justify-center">
              {/* <PieChart
                data={overvew?.chart ? overvew.chart : statusGroupschart}
                lineWidth={30}
                rounded
                animate
                label={({ dataEntry }) =>
                  `${dataEntry.title}: ${dataEntry.value}%`
                }
                labelStyle={{
                  fontSize: "6px",
                  fontWeight: "bold",
                  fill: "#374151",
                }}
                labelPosition={70}
                style={{ height: "220px" }}
              /> */}
              <LollipopChart
                statusGroupschart={
                  overvew?.chart ? overvew.chart : statusGroupschart
                }
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            LATEST PROJECT MODIFICATIONS
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date(Expected)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(overvew?.latestProjects ? overvew.latestProjects : []).map(
                  (project, indx) => (
                    <tr key={indx}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {project.projectName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {project.priority}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project?.endDate
                          ? format(new Date(project.endDate), "dd MMM yyyy")
                          : "NOT PROVIDED"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="text-indigo-600 hover:text-indigo-900">
                          {project.client}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
