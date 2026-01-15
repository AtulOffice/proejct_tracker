import React from 'react';
import { Eye, Calendar, BarChart3, Edit } from 'lucide-react';

const ProjectList = () => {
    const projects = [
        {
            sNo: 1,
            endUser: 'Tech Corp',
            client: 'PRJ-2024-01',
            bookingDate: 'Site',
            deliveryDate: '20-Oct-2023',
            action: 'View Details',
            actionType: 'view'
        },
        {
            sNo: 1,
            endUser: 'Tech Corp',
            client: 'PRJ-2024-01',
            bookingDate: 'New York',
            deliveryDate: '15-Mar-2024',
            action: 'View Details',
            actionType: 'view'
        },
        {
            sNo: 2,
            endUser: 'Tech Corp',
            client: 'National Bank',
            bookingDate: 'New York',
            deliveryDate: '',
            action: 'Edit Project',
            actionType: 'edit'
        },
        {
            sNo: 2,
            endUser: 'PRJ-L2024-02',
            client: 'Eco-Power Inc.',
            bookingDate: 'California',
            deliveryDate: '15-Apr-2024',
            action: 'Planning',
            actionType: 'calendar'
        },
        {
            sNo: 3,
            endUser: 'Green Energy',
            client: 'California',
            bookingDate: 'London',
            deliveryDate: '01-Apr-2024',
            action: 'Calendar✓',
            actionType: 'calendar'
        },
        {
            sNo: 3,
            endUser: 'Build-Fast',
            client: 'Urban Dev. Corp.',
            bookingDate: '18-Nov-2023',
            deliveryDate: '20-Apr-2024',
            action: 'Calendar✓',
            actionType: 'calendar'
        },
        {
            sNo: 4,
            endUser: 'Build-Fast',
            client: '05-Nov-2023',
            bookingDate: '18-Nov-2023',
            deliveryDate: '20-Jun-2024',
            action: 'Planning',
            actionType: 'calendar'
        },
        {
            sNo: 5,
            endUser: 'Tokyo',
            client: '01-Deb-2023',
            bookingDate: '10-Deb-2023',
            deliveryDate: '10-Jun-2024',
            action: 'View Progress',
            actionType: 'progress'
        },
        {
            sNo: 6,
            endUser: 'Health Care',
            client: 'Med-Research Lab',
            bookingDate: '10-Dec-2023',
            deliveryDate: '10',
            action: 'View Progress',
            actionType: 'progress'
        },
        {
            sNo: 5,
            endUser: 'Auto Innov.',
            client: 'Drive-Safe Tech',
            bookingDate: 'Muonich',
            deliveryDate: '17',
            action: 'Lett-Cluf3',
            actionType: 'progress'
        },
        {
            sNo: 5,
            endUser: 'Munich',
            client: 'Munich',
            bookingDate: '25-Jul',
            deliveryDate: '25-Jul',
            action: 'View Progress',
            actionType: 'progress'
        }
    ];

    const getActionIcon = (type) => {
        switch (type) {
            case 'view':
                return <Eye className="w-4 h-4" />;
            case 'edit':
                return <Edit className="w-4 h-4" />;
            case 'calendar':
                return <Calendar className="w-4 h-4" />;
            case 'progress':
                return <BarChart3 className="w-4 h-4" />;
            default:
                return <Eye className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 p-8 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-7xl w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Project List</h1>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-white">
                                <th className="px-4 py-2.5 text-left font-semibold">S. No.</th>
                                <th className="px-4 py-2.5 text-left font-semibold">Client</th>
                                <th className="px-4 py-2.5 text-left font-semibold">End User</th>
                                <th className="px-4 py-2.5 text-left font-semibold">Booking Date</th>
                                <th className="px-4 py-2.5 text-left font-semibold">Delivery Date</th>
                                <th className="px-4 py-2.5 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                                        } hover:bg-gray-50 transition-colors`}
                                >
                                    <td className="px-4 py-2 text-gray-800">{project.sNo}</td>
                                    <td className="px-4 py-2">
                                        <span className={`${project.client.startsWith('PRJ') ? 'text-blue-600 font-medium' : 'text-gray-800'
                                            }`}>
                                            {project.client}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-gray-800">{project.endUser}</td>
                                    <td className="px-4 py-2 text-gray-800">{project.bookingDate}</td>
                                    <td className="px-4 py-2 text-gray-800">{project.deliveryDate}</td>
                                    <td className="px-4 py-2">
                                        <button className="flex items-center gap-2 px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-800 text-sm">
                                            {getActionIcon(project.actionType)}
                                            <span>{project.action}</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectList;
