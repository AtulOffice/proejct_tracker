import React, { useRef, useEffect, useState } from 'react';

const AssignmentModal = ({ open, onClose, assignments }) => {
    const formRef = useRef(null);
    const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                // onClose();
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, onClose]);

    const handlePdfClick = (url, index) => {
        setSelectedPdf({ url, index });
        setPdfViewerOpen(true);
    };

    const handleDownload = () => {
        if (selectedPdf) {
            const link = document.createElement('a');
            link.href = selectedPdf.url;
            link.download = `MOM_Document_${selectedPdf.index + 1}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-sm transition-all duration-300 p-6">
                <div
                    ref={formRef}
                    className="bg-white bg-opacity-90 p-10 md:p-12 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-200 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 drop-shadow-sm">
                            Recent Project Assignments
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                            aria-label="Close modal"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignments
                            ?.slice()
                            .reverse()
                            .map((project) => (
                                <div
                                    key={project._id}
                                    className="group bg-gradient-to-r from-green-100 via-blue-50 to-white rounded-xl py-6 px-6 shadow-md hover:shadow-xl transition-all border border-gray-100 hover:bg-blue-50"
                                >
                                    <h3 className="font-semibold text-xl md:text-2xl text-gray-800 group-hover:text-blue-600 mb-3">
                                        {project.projectName}
                                    </h3>
                                    <p className="text-base text-gray-500 group-hover:text-gray-700 mb-4">
                                        {project.jobNumber}
                                    </p>

                                    {/* MOM Documents Section */}
                                    {project.momDocuments && project.momDocuments.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-sm font-medium text-gray-600 mb-3">
                                                MOM Documents ({project.momDocuments.length})
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {project.momDocuments.map((url, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handlePdfClick(url, index)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-red-800 hover:bg-red-900 rounded-lg transition-colors shadow-md hover:shadow-lg"
                                                        title={`View PDF ${index + 1}`}
                                                    >
                                                        {/* White PDF Icon */}
                                                        <svg
                                                            className="w-5 h-5 text-white"
                                                            fill="currentColor"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                                                            <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                                                        </svg>
                                                        <span className="text-xs font-semibold text-white">
                                                            PDF {index + 1}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* PDF Viewer Modal */}
            {pdfViewerOpen && selectedPdf && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
                        {/* Header with Close and Download buttons */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                            <h3 className="text-lg font-semibold text-gray-800">
                                MOM-{selectedPdf.index + 1}
                            </h3>
                            <div className="flex gap-2">
                                {/* <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md"
                                    title="Download PDF"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span className="font-medium">Download</span>
                                </button> */}
                                <button
                                    onClick={() => setPdfViewerOpen(false)}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-md"
                                    title="Close"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* PDF Content */}
                        <div className="flex-1 overflow-hidden">
                            <iframe
                                src={selectedPdf.url}
                                className="w-full h-full border-0"
                                title="PDF Viewer"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AssignmentModal;
