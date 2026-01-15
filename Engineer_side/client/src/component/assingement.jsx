import React, { useState, useEffect } from "react";
import Notfound from "../utils/Notfound";
import { filterProjectsUtils } from "../utils/filterUtils";

const AssignmentPage = ({ assignments }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [timeFilter, setTimeFilter] = useState("all");
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [data, setData] = useState(assignments);
    const [debounceSearchTerm, setDebounceSearchTerm] = useState(searchTerm);
    const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        setData(assignments);
    }, [assignments]);

    useEffect(() => {
        if (!data) return;

        let filtered = data;

        if (debounceSearchTerm) {
            filtered = filtered.filter(
                (project) =>
                    project.projectName?.toLowerCase().includes(debounceSearchTerm.toLowerCase()) ||
                    project.jobNumber?.toLowerCase().includes(debounceSearchTerm.toLowerCase())
            );
        }

        const timeFiltered = filterProjectsUtils({
            data: filtered,
            timeFilter,
        });

        setFilteredProjects(timeFiltered);
    }, [timeFilter, data, debounceSearchTerm]);

    const handlePdfClick = (url, index) => {
        setSelectedPdf({ url, index });
        setPdfViewerOpen(true);
    };

    return (
        <>
            <div className="max-w-8xl min-h-[100vh] lg:ml-45 px-6 py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between my-10 px-4 lg:px-10">
                    <h2 className="text-3xl font-bold text-gray-800">
                        MOM RECORDS
                    </h2>
                    <div className="relative w-full lg:w-1/3 mt-4 lg:mt-0">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-indigo-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        <input
                            type="text"
                            className="bg-white border-2 border-gray-200 text-gray-900 rounded-xl
                       focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500
                       block w-full pl-12 p-3.5 shadow-sm"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* ✅ If data exists show table, else show Notfound */}
                {filteredProjects?.length > 0 ? (
                    <div className="overflow-x-hidden rounded-xl shadow-lg">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-900 text-white">
                                    <th className="px-6 py-4 text-left font-semibold text-white!">Project</th>
                                    <th className="px-6 py-4 text-left font-semibold text-white!">Job No</th>
                                    <th className="px-6 py-4 text-left font-semibold text-white!">Start</th>
                                    <th className="px-6 py-4 text-left font-semibold text-white!">End</th>
                                    <th className="px-6 py-4 text-center font-semibold text-white!">Duration</th>
                                    <th className="px-6 py-4 text-center font-semibold text-white!">MOM</th>
                                    <th className="px-6 py-4 text-center font-semibold text-white!">Docs</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {[...filteredProjects].reverse().map((project, idx) => (
                                    <tr
                                        key={project._id || idx}
                                        className={`
              transition-all duration-200 ease-in-out
              hover:bg-blue-50 hover:shadow-md hover:scale-[1.01]
              ${project.isFinalMom ? "bg-green-50/50" : ""}
              ${idx % 2 === 0 ? "bg-gray-50/50" : "bg-white"}
            `}
                                    >
                                        {/* PROJECT NAME */}
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 text-base">
                                                {project.projectName}
                                            </div>
                                        </td>

                                        {/* JOB NUMBER */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {project.jobNumber}
                                            </span>
                                        </td>

                                        {/* START DATE */}
                                        <td className="px-6 py-4 text-gray-700 text-sm">
                                            {project.assignedAt ? (
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    {new Date(project.assignedAt).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>

                                        {/* END DATE */}
                                        <td className="px-6 py-4 text-gray-700 text-sm">
                                            {project.endTime ? (
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    {new Date(project.endTime).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>

                                        {/* DURATION */}
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-purple-100 text-purple-800">
                                                {project.durationDays ?? "-"}{" "}
                                                {project.durationDays ? "days" : ""}
                                            </span>
                                        </td>

                                        {/* MOM STATUS */}
                                        <td className="px-6 py-4 text-center">
                                            {project.isFinalMom ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-700 bg-green-100 rounded-full border border-green-300">
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Final
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-100 rounded-full border border-amber-300">
                                                    <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Pending
                                                </span>
                                            )}
                                        </td>

                                        {/* DOCUMENTS */}
                                        <td className="px-6 py-4">
                                            {project.momDocuments?.length > 0 ? (
                                                <div className="flex justify-center gap-2 flex-wrap">
                                                    {project.momDocuments.map((url, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => handlePdfClick(url, i)}
                                                            className="group relative px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                                                            title={`View Document ${i + 1}`}
                                                        >
                                                            <span className="flex items-center gap-1.5">
                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                                Doc {i + 1}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No documents</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12">
                        <Notfound />
                    </div>
                )}



            </div>

            {pdfViewerOpen && selectedPdf && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col border border-white/20">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200/50 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-3xl">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                📄 MOM Document - PDF {selectedPdf.index + 1}
                            </h3>
                            <button
                                onClick={() => setPdfViewerOpen(false)}
                                className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold hover:scale-105 transform"
                                title="Close"
                            >
                                ✕ Close
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden p-2">
                            <iframe
                                src={selectedPdf.url}
                                className="w-full h-full border-0 rounded-2xl"
                                title="PDF Viewer"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AssignmentPage;
