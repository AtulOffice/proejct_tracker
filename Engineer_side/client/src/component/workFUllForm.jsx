import React, { useEffect, useState } from "react";
import { X, Briefcase, Calendar, MapPin, Users, FileText } from "lucide-react";
import axios from "axios";
import { useAppContext } from "../appContex";
import toast from "react-hot-toast";
import ExcelDocsInput from "../utils/Excelimport";

const EngineerWorkStatusFull = () => {
    const { user } = useAppContext()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const userformval = {
        workstatus: "",
        currentEngineerName: "",
        projectName: "",
        engineerName: [],
        soType: "PROJECT",
        statusStartDate: "",
        statusEndDate: "",
        jobNumber: "",
        orderNumber: "",
        location: "",
        EndChecklist: "N/A",
        StartChecklist: "N/A",
        ExpensSubmission: "N/A",
        BackupSubmission: "N/A",
        ProjectId: "",
        submittedBy: ""
    };

    const [formData, setFormData] = useState(userformval);

    useEffect(() => {
        if (!formData.jobNumber) {
            setFormData(userformval)
            return;
        }
        const selectedProject = data?.lastFiveAssignments?.find(
            (item) => item.jobNumber === formData.jobNumber
        );
        if (selectedProject) {
            setFormData((prev) => ({
                ...prev,
                submittedBy: user?._id,
                ProjectId: selectedProject.projectId?._id,
                currentEngineerName: user?.name,
                projectName: selectedProject.projectId?.projectName || "",
                location: selectedProject.projectId?.location,
                StartChecklist: selectedProject.projectId?.StartChecklist,
                EndChecklist: selectedProject.projectId?.EndChecklist,
            }));
        }
    }, [formData.jobNumber, data]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/engineerside/fetchAllProject/${user?._id}`, { withCredentials: true })
                setData(response?.data)
                console.log(response?.data?.lastFiveAssignments)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (user?._id) fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(formData.statusStartDate) > new Date(formData.statusEndDate)) {
            toast.error("Start date must be before end date");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/worksts/save`,
                formData,
                { withCredentials: true }
            );
            if (response.data.success) {
                toast.success("Work status submitted successfully!");
                setFormData(userformval);
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Submit Error:", error);
            toast.error(error.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (eOrName, value) => {
        // Case 1: Normal event (input/select/textarea OR ExcelDocsInput)
        if (eOrName?.target) {
            const { name, value, type, checked } = eOrName.target;
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
            return;
        }

        // Case 2: Manual call handleChange("key", value)
        if (typeof eOrName === "string") {
            setFormData((prev) => ({
                ...prev,
                [eOrName]: value,
            }));
        }
    };


    return (
        <div className="lg:ml-64 pt-20 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/30 to-indigo-50 p-8">

            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-10 py-6 shadow-md rounded-xl flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                        Project Work Status
                    </h2>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-7xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* Project Information */}
                    <div className="bg-white rounded-xl p-6 shadow border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            Project Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job Number */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Job Number <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="jobNumber"
                                    value={formData.jobNumber || ""}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
             focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
             transition-all duration-200 outline-none bg-gray-50 
             group-hover:border-gray-300 appearance-none cursor-pointer"
                                >
                                    <option value="">Select Job Number</option>

                                    {data?.lastFiveAssignments?.map((item, index) => (
                                        <option key={index} value={item.jobNumber}>
                                            {item.jobNumber}—{item.projectId?.projectName
                                                ? item.projectId.projectName.slice(0, 15) +
                                                (item.projectId.projectName.length > 15 ? "..." : "")
                                                : "Unnamed Project"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Order Number */}
                            {formData.orderNumber && (
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                                        Order Number
                                    </label>
                                    <input
                                        type="text"
                                        name="orderNumber"
                                        value={formData.orderNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                                    />
                                </div>
                            )}

                            {/* Project Name */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="projectName"
                                    value={formData.projectName}
                                    onChange={handleChange}
                                    placeholder="enter projet name"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                                    required
                                />
                            </div>


                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    placeholder="enter site location"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>


                    {/* Date Section */}
                    <div className="bg-white rounded-xl p-6 shadow border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            Work Duration
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* From */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    From <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="statusStartDate"
                                    value={formData.statusStartDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                                    required
                                />
                            </div>

                            {/* To */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    To <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="statusEndDate"
                                    value={formData.statusEndDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Work Status Notes */}
                    {/* <div className="bg-white rounded-xl p-6 shadow border border-slate-200">
                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                            Work Status Details
                        </label>
                        <textarea
                            name="workstatus"
                            value={formData.workstatus}
                            onChange={handleChange}
                            rows="12"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg resize-none"
                            placeholder="Enter detailed work status..."
                        />
                    </div> */}

                    <div className="bg-white rounded-xl p-6 shadow border border-slate-200">
                        <label className="block mb-2 text-sm font-semibold text-slate-700">
                            Work Status Details <span className="text-red-500">*</span>
                        </label>

                        <ExcelDocsInput
                            value={formData.workstatus}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>


                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-12 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition"
                        >
                            Submit Work Status
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default EngineerWorkStatusFull;
