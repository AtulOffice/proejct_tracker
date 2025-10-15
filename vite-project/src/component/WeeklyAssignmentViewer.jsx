import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AssignmentsPDF from "./AssignmentsPDF";

const WeeklyAssignmentViewer = ({ open, onClose, weekData }) => {
  if (!open) return null;

  const assignmentsArray = weekData?.assignments
    ? Object.entries(weekData.assignments).map(([date, engineers]) => ({
        date,
        engineers: engineers.map(
          ({
            engineerId,
            engineerName,
            projectName,
            jobNumber,
            tasks,
            _id,
          }) => ({
            engineerId,
            engineerName,
            projectName,
            jobNumber,
            tasks,
            _id,
          })
        ),
      }))
    : [];


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white/95 p-10 rounded-3xl shadow-2xl w-[90vw] max-w-[1200px] max-h-[90vh] overflow-y-auto border border-gray-200 scrollbar-glass relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-red-500 text-3xl font-bold"
        >
          ×
        </button>
        <div className="flex justify-left mb-6">
          <PDFDownloadLink
            document={
              <AssignmentsPDF
                assignmentsArray={assignmentsArray}
                weekData={weekData}
              />
            }
            fileName={`Weekly_Assignments_${new Date(
              weekData?.weekStart
            ).toLocaleDateString()}.pdf`}
          >
            {({ loading }) => (
              <button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition">
                {loading ? "Generating PDF..." : "⬇️ Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent italic">
            📋{" "}
            {weekData?.weekStart
              ? new Date(weekData.weekStart).toLocaleDateString()
              : ""}
          </h2>
          <p className="text-sm text-gray-500 mt-2 italic">
            Updated on{" "}
            {weekData?.updatedAt
              ? new Date(weekData.updatedAt).toLocaleDateString()
              : ""}
          </p>
        </div>

        {/* Content */}
        {assignmentsArray.length > 0 ? (
          <div className="space-y-10">
            {assignmentsArray.map((day, index) => (
              <div
                key={index}
                className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-2xl font-semibold text-indigo-700 mb-5 flex items-center gap-2">
                  📅 {day.date}
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 text-base">
                    <thead className="bg-indigo-100">
                      <tr>
                        <th className="border border-gray-300 px-4 py-3 text-left">
                          Engineer
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left w-[50%]">
                          Task
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left">
                          Project
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left">
                          Job Number
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.engineers.map((eng, eIndex) => (
                        <tr
                          key={eIndex}
                          className="odd:bg-white even:bg-indigo-50 hover:bg-indigo-100 transition"
                        >
                          <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">
                            {eng.engineerName || eng.engineerId}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-700 whitespace-pre-wrap break-words">
                            {eng.tasks || "-"}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-700">
                            {eng.projectName || "-"}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-700">
                            {eng.jobNumber || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center italic text-lg">
            No saved data found.
          </p>
        )}
      </div>
    </div>
  );
};

export default WeeklyAssignmentViewer;
