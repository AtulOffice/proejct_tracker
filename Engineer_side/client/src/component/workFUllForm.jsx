import React, { useEffect, useState } from "react";
import { X, Briefcase, Calendar, MapPin, Users, FileText } from "lucide-react";
import { useAppContext } from "../appContext";
import toast from "react-hot-toast";
import ExcelDocsInput from "../utils/Excelimport";
import { getLatestworkSubmission } from "../utils/apiCall";
import apiClient from "../api/axiosClient";

const EngineerWorkStatusFull = () => {
    const userformval = {
        progressPercent: 0,
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

    const { user } = useAppContext()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [lastWork, setLastWork] = useState([])
    const [formData, setFormData] = useState(userformval);




    useEffect(() => {
        const fetchLatestWork = async () => {
            try {
                const res = await getLatestworkSubmission();
                setLastWork(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchLatestWork();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get(`/engineerside/fetchAllProject/${user?._id}`)
                setData(response?.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (user?._id) fetchData();
    }, []);

    useEffect(() => {
        if (!formData.jobNumber) {
            setFormData(userformval);
            return;
        }

        const assignment = data?.lastFiveAssignments?.find(
            a => a.jobNumber === formData.jobNumber
        );
        if (!assignment) return;

        const project = assignment.projectId;
        const percent =
            lastWork?.find(
                w => w.projectId?.toString() === project?._id?.toString()
            )?.progressPercent ?? 0;

        setFormData(prev => ({
            ...prev,
            submittedBy: user?._id,
            ProjectId: project?._id,
            currentEngineerName: user?.name,
            projectName: project?.projectName || "",
            location: project?.location,
            StartChecklist: project?.StartChecklist,
            EndChecklist: project?.EndChecklist,
            progressPercent: percent,
        }));
    }, [formData.jobNumber, data, lastWork, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(formData.statusStartDate) > new Date(formData.statusEndDate)) {
            toast.error("Start date must be before end date");
            return;
        }
        const previousPercent =
            lastWork?.find(
                item =>
                    item.projectId?.toString() === formData?.ProjectId?.toString()
            )?.progressPercent ?? 0;


        if (formData.progressPercent < previousPercent) {
            toast.error(
                `Progress cannot be less than previous value (${previousPercent}%)`
            );
            return;
        }

        try {
            setLoading(true);

            const response = await apiClient.post(`/worksts/save`, formData);
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

    const handleChange = (eOrName, manualValue) => {
        if (eOrName?.target) {
            const { name, value, type, checked } = eOrName.target;

            let finalValue = type === "checkbox" ? checked : value;

            if (name === "progressPercent") {
                let num = Math.max(0, Math.min(100, parseInt(value, 10)));

                setFormData((prev) => {
                    return {
                        ...prev,
                        progressPercent: num,

                    };
                });
                return;
            }

            setFormData((prev) => ({
                ...prev,
                [name]: finalValue,
            }));
            return;
        }


        if (typeof eOrName === "string") {
            setFormData((prev) => ({
                ...prev,
                [eOrName]: manualValue,
            }));
        }
    };


    return (
        <div className="lg:ml-64 pt-20 min-h-screen bg-linear-to-br from-indigo-50 via-purple-50/30 to-indigo-50 p-8">

            <div className="bg-linear-to-r from-purple-600 via-pink-600 to-rose-600 px-10 py-6 shadow-md rounded-xl flex justify-between items-center mb-8">
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
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Completion Percent <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="progressPercent"
                                    value={formData.progressPercent ?? 0}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onWheel={(e) => e.target.blur()}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                                    required
                                />
                            </div>

                        </div>
                    </div>

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
                            className="px-12 py-3.5 bg-linear-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition"
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
