import React from 'react';

export default function ProjectCard() {
    // Sample data for demonstration
    const filteredProjects = [
        {
            _id: '1',
            projectName: 'Digital Transformation Initiative',
            jobNumber: 'JOB-2024-001',
            assignedAt: '2024-01-15',
            endTime: '2024-03-20',
            durationDays: 65,
            isFinalMom: true,
            momDocuments: [
                'doc1.pdf',
                'doc2.pdf',
                'doc3.pdf',
                'doc4.pdf'
            ]
        },
        {
            _id: '2',
            projectName: 'Cloud Migration Project',
            jobNumber: 'JOB-2024-002',
            assignedAt: '2024-02-01',
            endTime: '2024-04-15',
            durationDays: 74,
            isFinalMom: false,
            momDocuments: [
                'doc1.pdf',
                'doc2.pdf'
            ]
        },
        {
            _id: '3',
            projectName: 'Mobile App Redesign',
            jobNumber: 'JOB-2024-003',
            assignedAt: '2024-03-10',
            durationDays: 45,
            isFinalMom: false,
            momDocuments: [
                'doc1.pdf',
                'doc2.pdf',
                'doc3.pdf'
            ]
        }
    ];

    const handlePdfClick = (url, index) => {
        console.log(`Opening PDF: ${url} at index ${index}`);
    };

    const Notfound = () => (
        <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No projects found</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, idx) => (
                        <div
                            key={project._id || idx}
                            className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden hover:-translate-y-2"
                            style={{ animation: `fadeIn 0.6s ease-out ${idx * 0.1}s both` }}
                        >
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-pink-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Top accent bar */}
                            <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

                            {/* Status badge */}
                            {project.isFinalMom && (
                                <div className="absolute top-6 right-6 z-10">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-lg">
                                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-bold text-white">Completed</span>
                                    </div>
                                </div>
                            )}

                            <div className="relative p-8 space-y-6">
                                {/* Header section */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-2xl text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300 pr-12">
                                        {project.projectName}
                                    </h3>

                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-sm text-gray-700 font-semibold">{project.jobNumber}</span>
                                    </div>
                                </div>

                                {/* Timeline cards */}
                                {project.assignedAt && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200/50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs font-semibold text-blue-600 uppercase">Start</span>
                                            </div>
                                            <p className="text-sm text-gray-800 font-bold">
                                                {new Date(project.assignedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>

                                        {project.endTime ? (
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4 border border-purple-200/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs font-semibold text-purple-600 uppercase">End</span>
                                                </div>
                                                <p className="text-sm text-gray-800 font-bold">
                                                    {new Date(project.endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 border border-gray-200/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs font-semibold text-gray-600 uppercase">Ongoing</span>
                                                </div>
                                                <p className="text-sm text-gray-600 font-bold">In Progress</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Duration badge */}
                                {project.durationDays !== undefined && (
                                    <div className="flex items-center justify-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-white">{project.durationDays}</p>
                                            <p className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                                {project.durationDays === 1 ? 'Day' : 'Days'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Documents section */}
                                {project.momDocuments && project.momDocuments.length > 0 && (
                                    <div className="pt-6 border-t-2 border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium uppercase">Documents</p>
                                                    <p className="text-sm text-gray-900 font-bold">
                                                        {project.momDocuments.length} MOM {project.momDocuments.length !== 1 ? 'Files' : 'File'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2">
                                            {project.momDocuments.map((url, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handlePdfClick(url, index)}
                                                    className="group/doc relative aspect-square bg-gradient-to-br from-red-500 to-orange-600 hover:from-orange-500 hover:to-pink-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110 flex items-center justify-center"
                                                    title={`View MOM Document ${index + 1}`}
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-white group-hover/doc:scale-110 transition-transform"
                                                        fill="currentColor"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                                                    </svg>
                                                    <span className="absolute bottom-1 text-[10px] font-bold text-white">
                                                        {index + 1}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full">
                        <Notfound />
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}