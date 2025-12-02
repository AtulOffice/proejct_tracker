import React, { useEffect, useState } from "react";
import { Upload, FileText, Trash2, Save, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useAppContext } from "../appContex";
import toast from "react-hot-toast"

const EngineerMom = ({ setActiveCard, isEdit = false, }) => {

  const formval = {
    jobNumber: "",
    engineerName: "",
    projectId: "",
    isFinalMom: false,
    projectName: "",
    pendingPoint: "",
    isLeavingSite: false,
    finalMomSrNo: "",
    momSrNo: "",
    siteStartDate: "",
    location: "",
    siteEndDate: "",
    StartChecklist: "",
    EndChecklist: "",
    workStatus: "",
    momDocuments: [],
    assignmentDetails: null,
  }
  const { user } = useAppContext()
  const [data, setData] = useState()
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [formData, setFormData] = useState(formval);


  useEffect(() => {
    if (!formData.jobNumber) {
      setFormData(formval)
      return;
    }
    const selectedProject = data?.lastFiveAssignments?.find(
      (item) => item.jobNumber === formData.jobNumber
    );

    if (selectedProject) {
      setFormData((prev) => ({
        ...prev,
        assignmentDetails: {
          ...selectedProject,
          projectId: selectedProject?.projectId?._id
        },
        engineerName: user?.name,
        projectId: selectedProject.projectId?._id || "",
        projectName: selectedProject.projectId?.projectName || "",
        siteStartDate: selectedProject.assignedAt
          ? new Date(selectedProject.assignedAt).toISOString().split("T")[0]
          : "",
        siteEndDate: selectedProject.endTime
          ? new Date(selectedProject.endTime).toISOString().split("T")[0]
          : "",
        location: selectedProject.projectId?.location,
        StartChecklist: selectedProject.projectId?.StartChecklist,
        EndChecklist: selectedProject.projectId?.EndChecklist,
        workStatus: selectedProject.isFinalMom
          ? "YES"
          : selectedProject.isMom
            ? "NO"
            : "N/A",
      }));
    }
  }, [formData.jobNumber, data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/engineerside/fetchAllEngineersProject/${user?._id}`, { withCredentials: true })
        setData(response?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user?._id) fetchData();
  }, []);




  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jobNumber || !formData.projectId) {
      toast.error("Please select a Job Number before submitting MOM.");
      return;
    }
    if (
      !formData.siteStartDate ||
      !formData.siteEndDate ||
      new Date(formData.siteStartDate) > new Date(formData.siteEndDate)
    ) {
      toast.error("Please enter valid Site Start and End Dates (Start must be before End).");
      return;
    }

    try {
      const payload = {
        ...formData,
        engineerId: user?._id,
        momDocuments: formData.momDocuments.map((doc) => ({
          name: doc.name,
          type: doc.type,
          size: doc.size,
          data: doc.data,
        })),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/engineerside/saveMomoRelatedProject/${user?._id}`,
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );


      if (response.data.success) {
        toast.success("MOM saved successfully!");
        setFormData(formval);
        setActiveCard("two")
      } else {
        toast.error(response.data.message || "Failed to save MOM.");
      }
    } catch (error) {
      console.error("Error saving MOM:", error);
      toast.error("Server error while saving MOM. Please try again.", {
        duration: 4000,
      });
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    files.forEach((file) => {
      if (file.size <= 4 * 1024 * 1024) {
        setUploadProgress(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          const newDoc = {
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size,
            data: event.target.result,
          };
          setFormData((prev) => ({
            ...prev,
            momDocuments: [...prev.momDocuments, newDoc],
          }));
          setTimeout(() => setUploadProgress(null), 500);
        };
        reader.readAsDataURL(file);
      } else alert(`File ${file.name} exceeds 4MB limit.`);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeDocument = (id) =>
    setFormData((prev) => ({
      ...prev,
      momDocuments: prev.momDocuments.filter((doc) => doc.id !== id),
    }));

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      Submitted: "bg-emerald-100 text-emerald-700 border-emerald-300",
      Pending: "bg-amber-100 text-amber-700 border-amber-300",
      "Not Applicable": "bg-gray-100 text-gray-600 border-gray-300",
    };
    return colors[status] || "bg-gray-50 text-gray-600 border-gray-300";
  };

  return (
    <div className="lg:ml-64 pt-20 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/30 to-indigo-50 p-8">

      <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isEdit ? "Edit Minutes of Meeting" : "Minutes of Meeting"}
            </h1>
            <p className="text-indigo-100 text-sm">
              {isEdit ? "Update meeting minutes details" : "Submit meeting minutes of work"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Number <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.jobNumber || ""}
                onChange={(e) => handleChange("jobNumber", e.target.value)}
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

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Engineer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter engineer name"
                value={formData.engineerName}
                onChange={(e) => handleChange("engineerName", e.target.value)}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
             focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
             transition-all duration-200 outline-none bg-gray-100 
             text-gray-700 cursor-not-allowed opacity-80 
             group-hover:border-gray-300"
              />

            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                value={formData.projectName}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
               focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
               transition-all duration-200 outline-none 
               bg-gray-100 text-gray-700 cursor-not-allowed opacity-80
               group-hover:border-gray-300"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Site Location
              </label>
              <input
                type="text"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
               focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
               transition-all duration-200 outline-none 
               bg-gray-100 text-gray-700 cursor-not-allowed opacity-80
               group-hover:border-gray-300"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Final MOM
              </label>
              <div className="relative">
                <select
                  value={formData.isFinalMom ? "YES" : "NO"}
                  onChange={(e) =>
                    handleChange("isFinalMom", e.target.value === "YES")
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
                           focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
                           transition-all duration-200 outline-none bg-gray-50 
                           group-hover:border-gray-300 appearance-none cursor-pointer"
                >
                  <option value="NO">NO</option>
                  <option value="YES">YES</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            {formData?.isFinalMom && <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Final MOM Sr No
              </label>
              <input
                type="text"
                placeholder="Enter final MOM serial number"
                value={formData.finalMomSrNo}
                onChange={(e) => handleChange("finalMomSrNo", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
                         focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
                         transition-all duration-200 outline-none bg-gray-50 
                         group-hover:border-gray-300"
              />
            </div>}
            <div className="group md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                MOM Sr No
              </label>
              <input
                type="text"
                placeholder="Enter MOM serial number"
                value={formData.momSrNo}
                onChange={(e) => handleChange("momSrNo", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
                         focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
                         transition-all duration-200 outline-none bg-gray-50 
                         group-hover:border-gray-300"
              />
            </div>

            {/* Leaving Site Checkbox */}
            <div className="group md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.isLeavingSite}
                    onChange={(e) => handleChange("isLeavingSite", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-200 rounded-full peer 
                                peer-focus:ring-4 peer-focus:ring-indigo-100
                                peer-checked:bg-indigo-600 transition-all duration-200">
                  </div>
                  <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full 
                                transition-all duration-200 peer-checked:translate-x-6
                                shadow-md">
                  </div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">
                    Leaving Site
                  </span>
                  <p className="text-xs text-gray-500">
                    Check this if the engineer is leaving the site
                  </p>
                </div>
              </label>
            </div>

            {/* Conditionally Rendered Fields - Only show when NOT Final MOM */}
            {!formData.isFinalMom && (
              <>

                <div className="group md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pending Point
                  </label>
                  <textarea
                    placeholder="Enter pending points or notes"
                    value={formData.pendingPoint}
                    onChange={(e) => handleChange("pendingPoint", e.target.value)}
                    rows="10"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
                             focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
                             transition-all duration-200 outline-none bg-gray-50 
                             group-hover:border-gray-300 resize-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Site Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">Site Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Site Start Date
              </label>
              <input
                type="date"
                value={formData.siteStartDate}
                onChange={(e) => handleChange("siteStartDate", e.target.value)}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
               focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
               transition-all duration-200 outline-none 
               bg-gray-100 text-gray-700 cursor-not-allowed opacity-80
               group-hover:border-gray-300"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Site End Date
              </label>
              <input
                type="date"
                value={formData.siteEndDate}
                onChange={(e) => handleChange("siteEndDate", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
                         focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
                         transition-all duration-200 outline-none bg-gray-50 
                         group-hover:border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Checklist & Work Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">Checklist & Work Status</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { field: "StartChecklist", label: "Start Checklist" },
              { field: "EndChecklist", label: "End Checklist" },
              { field: "workStatus", label: "Work Status" },
            ].map(({ field, label }, i) => (
              <div key={i} className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {label}
                </label>
                <div className="relative">
                  <select
                    value={formData[field]}
                    disabled
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl
              focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 
              transition-all duration-200 outline-none 
              bg-gray-100 text-gray-700
              cursor-not-allowed opacity-70
              appearance-none  /* ✅ hides default arrow */
              [&::-ms-expand]:hidden /* ✅ hides arrow in IE/Edge */
              ${formData[field] ? getStatusColor(formData[field]) : 'bg-gray-50 border-gray-200'}`}
                  >
                    <option value="YES">✓ Submitted</option>
                    <option value="NO">⏳ Pending</option>
                    <option value="N/A">— Not Applicable</option>
                  </select>


                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOM Documents Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">MOM Documents</h2>
          </div>

          {/* Enhanced Upload Area with Drag & Drop */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                     ${isDragging
                ? 'border-indigo-500 bg-indigo-50 scale-105'
                : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-indigo-400'}`}
          >
            <div className={`transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
              <div className="mx-auto h-20 w-20 mb-6 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 
                            flex items-center justify-center shadow-lg">
                <Upload className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {isDragging ? "Drop files here" : "Upload your documents"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Drag and drop files or click to browse
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Supports: PDF, DOC, DOCX, JPG, PNG (max 4MB each)
              </p>
              <label className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-3 
                              rounded-xl cursor-pointer hover:shadow-2xl hover:scale-105 transform 
                              transition-all duration-200 inline-flex items-center gap-3 font-semibold">
                <Upload size={18} />
                Choose Files
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Upload Progress Indicator */}
          {uploadProgress && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              <span className="text-sm text-indigo-700 font-medium">Uploading {uploadProgress}...</span>
            </div>
          )}

          {/* Uploaded Documents List */}
          {formData.momDocuments.length > 0 && (
            <div className="space-y-3 mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Uploaded Documents ({formData.momDocuments.length})
                </h3>
              </div>
              {formData.momDocuments.map((doc, index) => (
                <div
                  key={doc.id}
                  className="group flex items-center justify-between p-4 border-2 border-gray-200 
                           rounded-xl bg-gradient-to-r from-gray-50 to-white hover:border-indigo-300 
                           hover:shadow-md transition-all duration-200 animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 
                                    flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(doc.size)}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Uploaded
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(doc.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 
                             rounded-lg transition-all duration-200 group-hover:scale-110"
                    title="Remove document"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Centered Save Button at Bottom - Sticky */}
        <div className="sticky bottom-0 bg-white rounded-2xl shadow-2xl p-1 border-t-4 border-indigo-500">
          <div className="flex flex-col items-center justify-center text-center">

            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-12 py-2 
                       rounded-xl hover:shadow-2xl hover:scale-105 transform 
                       transition-all duration-200 flex items-center gap-3 font-bold text-lg"
            >
              <Save size={22} />
              {isEdit ? "Update MOM" : "Save MOM"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default EngineerMom;
