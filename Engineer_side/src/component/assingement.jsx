import React, { useState, useEffect } from "react";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";
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

    if (!assignments || assignments.length === 0) {
        return <LoadingSkeltionAll />;
    }

    return (
        <>
            <div className="max-w-8xl min-h-[140vh] lg:ml-60 px-6 py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm">
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


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project, idx) => (
                            <div
                                key={project._id || idx}
                                className="group relative backdrop-blur-lg bg-white/50 rounded-2xl p-6 shadow-xl border border-white/30 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 ease-out hover:bg-white/70 animate-fade-in"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-bl-full rounded-tr-2xl -z-10"></div>

                                <h3 className="font-bold text-2xl md:text-3xl text-gray-800 group-hover:text-purple-600 mb-3 transition-colors duration-300 truncate">
                                    {project.projectName}
                                </h3>

                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-2xl">📋</span>
                                    <p className="text-base text-gray-600 font-semibold">
                                        {project.jobNumber}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between gap-4 mb-4">
                                    {project.assignedAt && (
                                        <div className="flex-1 p-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl border border-blue-200/50">
                                            <div className="space-y-2">

                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="font-medium">Start: {new Date(project.assignedAt).toLocaleDateString()}</span>
                                                </div>

                                                {project.endTime && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="font-medium">End: {new Date(project.endTime).toLocaleDateString()}</span>
                                                    </div>
                                                )}

                                                {project.durationDays !== undefined && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                        <span className="font-medium">Duration: {project.durationDays} {project.durationDays === 1 ? 'day' : 'days'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}


                                    {project.isFinalMom && (
                                        <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 group flex-shrink-0">
                                            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    )}
                                </div>

                                {project.momDocuments && project.momDocuments.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-300/50">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                                        <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">Documents</span>
                                            </div>
                                            <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-bold rounded-full">
                                                {project.momDocuments.length}
                                            </span>
                                        </div>


                                        <div className="flex flex-wrap gap-3">
                                            {project.momDocuments.map((url, index) => (
                                                <div key={index} className="relative group">

                                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>

                                                    <button
                                                        onClick={() => handlePdfClick(url, index)}
                                                        className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-500 via-red-600 to-orange-600 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 transform group"
                                                        title={`View MOM Document ${index + 1}`}
                                                    >

                                                        <svg
                                                            className="w-7 h-7 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                                                            fill="currentColor"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                                                            <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                                                        </svg>

                                                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-white text-red-600 text-xs font-black rounded-full border-2 border-red-500 shadow-lg">
                                                            {index + 1}
                                                        </span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}


                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <Notfound />
                        </div>
                    )}
                </div>
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

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default AssignmentPage;
