import axios from "axios";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-xs">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-8 w-120 max-w-md  border-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
      >
        <div className="min-h-[320px]">
          {getCurrentPageLines().map((line, index) => (
            <p key={index} className={`text-base mb-2 ${getEmojiColor(line)}`}>
              {line}
            </p>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-900 font-semibold transition shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkStatusModal;
