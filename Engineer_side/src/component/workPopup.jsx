import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const WorkStatusModal = ({ workStatus, onClose }) => {
  const [lines, setLines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    if (workStatus) {
      const allLines = workStatus
        .split("\n")
        .filter((line) => line.trim() !== "");
      setLines(allLines);
      setTotalPages(Math.ceil(allLines.length / itemsPerPage));
    }
  }, [workStatus]);

  const getCurrentPageLines = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return lines.slice(startIndex, startIndex + itemsPerPage);
  };

  const goToNextPage = (e) => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = (e) => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getEmojiColor = (line) => {
    if (line.includes("✅")) return "text-green-600";
    if (line.includes("🟡")) return "text-yellow-500";
    if (line.includes("🔴")) return "text-red-500";
    if (line.match(/^\d+\./)) return "font-bold text-lg mt-3";
    if (
      line.startsWith("Project:") ||
      line.startsWith("Location:") ||
      line.startsWith("Reporting Date:") ||
      line.startsWith("Project Manager:")
    )
      return "text-gray-700";
    if (line.startsWith("Overall Progress:"))
      return "font-semibold text-blue-600 mt-3";
    if (line.startsWith("Remarks:")) return "italic text-gray-600 mt-1";
    if (lines.indexOf(line) === 0) return "text-xl font-bold text-red-600 mb-2";
    return "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-xs p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] border-gradient-to-r from-pink-500 via-red-500 to-yellow-500 flex flex-col"
      >
        <div className="p-6 pb-0 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Work Status</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            {getCurrentPageLines().map((line, index) => (
              <p
                key={index}
                className={`text-base break-words ${getEmojiColor(line)}`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
        <div className="p-6 pt-4 border-t bg-gray-50 rounded-b-3xl flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-600 hover:to-pink-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-900 font-semibold transition shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkStatusModal;
