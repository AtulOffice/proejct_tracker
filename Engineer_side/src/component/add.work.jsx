import React, { useEffect, useState } from "react";
import { X, Briefcase, Calendar, MapPin, Users, FileText } from "lucide-react";
import { useAppContext } from "../appContex";
import toast from "react-hot-toast";
import axios from "axios";

const EngineerWorkStatus = ({ project, onClose }) => {
  const [loading, setLoading] = useState(false)
  const { user } = useAppContext()
  const userformval = {
    workstatus: "",
    currentEngineerName: "",
    projectName: "",
    statusStartDate: "",
    statusEndDate: "",
    jobNumber: "",
    orderNumber: "",
    location: "",
    // this is old data
    soType: "PROJECT",
    EndChecklist: "N/A",
    StartChecklist: "N/A",
    ExpensSubmission: "N/A",
    BackupSubmission: "N/A",
    engineerName: [],
  };

  const [formData, setFormData] = useState(userformval);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, jobNumber: project?.jobNumber || "", orderNumber: project?.orderNumber || "", projectName: project?.projectName || "", location: project?.location || "" }))
  }, [project])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.statusStartDate) > new Date(formData.statusEndDate)) {
      toast.error("Start date must be before end date");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        submittedBy: user?._id,
        ProjectId: project?._id,
        currentEngineerName: user?.name,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/worksts/save`,
        payload,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Work status submitted successfully!");
        setFormData({
          statusStartDate: "",
          statusEndDate: "",
          WorkStatus: "",
          StartChecklist: "",
          EndChecklist: "",
          jobNumber: "",
          projectName: "",
          location: "",
        });
        onClose()
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


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              Project Work Status
            </h2>
          </div>
          <p className="text-purple-100 text-sm ml-14">
            Document your project progress and milestones
          </p>
        </div>

        {/* Form Content - Scrollable */}
        <div className="overflow-y-auto px-8 py-8 flex-1">
          <div className="space-y-8">
            {/* Project Information Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Project Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Job Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobNumber"
                    value={formData.jobNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter job number"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Order Number
                  </label>
                  <input
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter order number"
                  />
                </div>


                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter project name"
                  />
                </div>
                {/* 
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    SO Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="soType"
                    value={formData.soType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="PROJECT">PROJECT</option>
                    <option value="SERVICE">SERVICE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div> */}

                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter location"
                  />
                </div>
              </div>
            </div>

            {/* Checklist Section */}
            {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Checklist Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Start Checklist
                  </label>
                  <select
                    name="StartChecklist"
                    value={formData.StartChecklist}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="N/A">N/A</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    End Checklist
                  </label>
                  <select
                    name="EndChecklist"
                    value={formData.EndChecklist}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="N/A">N/A</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Expense Submission
                  </label>
                  <select
                    name="ExpensSubmission"
                    value={formData.ExpensSubmission}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="N/A">N/A</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Backup Submission
                  </label>
                  <select
                    name="BackupSubmission"
                    value={formData.BackupSubmission}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="N/A">N/A</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div> */}

            {/* Engineer Details Section */}
            {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Engineer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Current Engineer Name
                  </label>
                  <input
                    type="text"
                    name="currentEngineerName"
                    value={formData.currentEngineerName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter current engineer name"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    All Engineers
                  </label>
                  <input
                    type="text"
                    name="engineerName"
                    value={formData.engineerName.join(", ")}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter engineer names"
                  />
                </div>
              </div>
            </div> */}

            {/* Date Range Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Work Duration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="statusStartDate"
                    value={formData.statusStartDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    To <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="statusEndDate"
                    value={formData.statusEndDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Work Status Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Work Status Details
              </label>
              <textarea
                name="workstatus"
                value={formData.workstatus}
                onChange={handleChange}
                rows="20"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                placeholder="Enter detailed work status..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmit}
                className="px-12 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              >
                Submit Work Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerWorkStatus;
