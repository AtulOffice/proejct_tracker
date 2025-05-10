import React, { useMemo } from "react";
import { FaBook } from "react-icons/fa";
import { format } from "date-fns";
import { PieChart } from "react-minimal-pie-chart";
import { FaUser } from "react-icons/fa6";
import { useAppContext } from "../appContex";

const ProjectOverview = () => {
  const { fullData } = useAppContext();

  const sortedProjects = useMemo(() => {
    if (!fullData || !Array.isArray(fullData)) return [];
    return [...fullData]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(0, 3);
  }, [fullData]);

  const HighestPrioritiesCustomer = useMemo(() => {
    if (!fullData || !Array.isArray(fullData)) return [];
    return [...fullData]
      .filter((item) => item.priority === "high")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(0, 3);
  }, [fullData]);

  const isWithinNext7Days = (dateString) => {
    const inputDate = new Date(dateString);
    const today = new Date();
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffInMs = inputDate - today;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays >= 0 && diffInDays <= 7;
  };

  const projects = useMemo(() => {
    const statusGroups = {
      upcomming: { name: "UpComming Projects", cnt: 0 },
      running: { name: "Active Projects", cnt: 0 },
      urgent: { name: "Urgent Projects", cnt: 0 },
      pending: { name: "Pending Projects", cnt: 0 },
      complete: { name: "Completed Projects", cnt: 0 },
    };
    if (fullData) {
      fullData.forEach((project) => {
        const { status, startDate } = project;
        if (status === "completed") statusGroups.complete.cnt += 1;
        if (status === "running") statusGroups.running.cnt += 1;
        if (status === "upcoming") statusGroups.upcomming.cnt += 1;
        if (status === "pending") statusGroups.pending.cnt += 1;
        if (startDate) {
          if (isWithinNext7Days(startDate)) statusGroups.urgent.cnt += 1;
        }
      });
    }
    return statusGroups;
  }, [fullData]);

  const chartData = useMemo(() => {
    const statusGroups = {
      complete: { name: "Completed", cnt: 0, color: "#fbbf24" },
      running: { name: "Active", cnt: 0, color: "#6366f1" },
      upcomming: { name: "Upcoming", cnt: 0, color: "#34d399" },
      pending: { name: "Pending", cnt: 0, color: "#a78bfa" },
      urgent: { name: "Urgent", cnt: 0, color: "#f87171" },
    };

    if (fullData) {
      fullData.forEach((project) => {
        const { status, startDate } = project;
        if (status === "completed") statusGroups.complete.cnt += 1;
        if (status === "running") statusGroups.running.cnt += 1;
        if (status === "upcoming") statusGroups.upcomming.cnt += 1;
        if (status === "pending") statusGroups.pending.cnt += 1;
        if (startDate) {
          if (isWithinNext7Days(startDate)) statusGroups.urgent.cnt += 1;
        }
      });
    }

    const total = Object.values(statusGroups).reduce(
      (acc, curr) => acc + curr.cnt,
      0
    );
    return Object.values(statusGroups)
      .filter((item) => item.cnt > 0)
      .map((item) => ({
        title: item.name,
        value: total ? Math.round((item.cnt / total) * 100) : 0,
        color: item.color,
      }));
  }, [fullData]);

  return (
    <div className={`transition-all duration-300 lg:ml-64 pt-16 min-h-screen`}>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-1">Welcome back, Admin!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {Object.values(projects).map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]"
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
                <div className="flex items-center text-green-500 font-medium">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>

                <span className="ml-auto bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Top 3 with Hight Priority Customer
            </h3>
            <div className="space-y-4">
              {HighestPrioritiesCustomer.map((project, indx) => (
                <div className="flex items-start" key={indx}>
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <FaUser className="text-blue-500" size={18} />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">
                      {project.client}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {project.projectName}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {" "}
                      {project?.endDate
                        ? format(new Date(project.endDate), "dd MMM yyyy")
                        : "PROJECT COMPLETION DATE NOT PROVIDED"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Status Overview
            </h3>
            <div className="h-64 flex items-center justify-center">
              <PieChart
                data={chartData}
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
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Projects
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
                {sortedProjects.map((project, indx) => (
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
