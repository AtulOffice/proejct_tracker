import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../appContex";

const ENUMVAL = ["YES", "NO", "N/A"];
const PROJECT_STATUS = ["OPEN", "CLOSED"];

export default function EndChecklistForm({ project, onClose }) {
  const { user } = useAppContext()
  const [formData, setFormData] = useState({
    email: "",
    jobNumber: "",
    engineerName: "",
    customerName: "",
    endUser: "",
    site: "",
    poNumber: "",
    poDate: "",
    contactPerson: "",
    contactPersonNumber: "",
    visitStartDate: "",
    visitEndDate: "",
    momNumber: "",
    projectStatus: "",
    momSignedByCustomer: "",
    pendingPoints: "",
    customerRemarks: "",
    completedWithinEstimatedTime: false,
    facedChallenges: false,
    challengeDetails: "",
    completionDocuments: {
      asBuiltDrawings: "",
      finalLogicBackup: "",
      finalScadaBackup: "",
      expenseSettlement: "",
    },
  });

  useEffect(() => {
    if (!project?._id) return;

    const loadData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/endCheck/project/${project._id}`
        );

        const checklist = res.data?.data || null;

        if (checklist) {
          console.log("📌 Existing END checklist found — merging");

          setFormData(prev => ({
            ...prev,
            email: checklist.email || user?.email || "",
            jobNumber: checklist.jobNumber || project.jobNumber || "",
            engineerName: checklist.engineerName || user?.name || "",
            customerName: checklist.customerName || project.client || "",
            endUser: checklist.endUser || project.endUser || "",
            site: checklist.site || project.location || "",
            poNumber: checklist.poNumber || project.orderNumber || "",
            poDate: checklist.poDate
              ? checklist.poDate.split("T")[0]
              : project.orderDate
                ? new Date(project.orderDate).toISOString().split("T")[0]
                : "",

            contactPerson: checklist.contactPerson || project.ContactPersonName || "",
            contactPersonNumber:
              checklist.contactPersonNumber || project.ContactPersonNumber || "",
            visitStartDate: checklist.visitStartDate
              ? checklist.visitStartDate.split("T")[0]
              : project.visitDate
                ? new Date(project.visitDate).toISOString().split("T")[0]
                : "",

            visitEndDate: checklist.visitEndDate
              ? checklist.visitEndDate.split("T")[0]
              : "",
            momNumber: checklist.momNumber || "",
            projectStatus: checklist.projectStatus || "",
            momSignedByCustomer: checklist.momSignedByCustomer || "",

            pendingPoints: checklist.pendingPoints || "",
            customerRemarks: checklist.customerRemarks || "",
            completedWithinEstimatedTime:
              checklist.completedWithinEstimatedTime ?? false,
            facedChallenges: checklist.facedChallenges ?? false,
            challengeDetails: checklist.challengeDetails || "",

            completionDocuments: {
              asBuiltDrawings:
                checklist.completionDocuments?.asBuiltDrawings || "",
              finalLogicBackup:
                checklist.completionDocuments?.finalLogicBackup || "",
              finalScadaBackup:
                checklist.completionDocuments?.finalScadaBackup || "",
              expenseSettlement:
                checklist.completionDocuments?.expenseSettlement || "",
            },

            projectId: checklist.projectId,
            submittedBy: checklist.submittedBy
          }));

          return;
        }
        setFormData(prev => ({
          ...prev,
          email: user?.email || "",
          jobNumber: project.jobNumber || "",
          engineerName: user?.name || "",
          customerName: project.client || "",
          endUser: project.endUser || "",
          site: project.location || "",
          poNumber: project.orderNumber || "",
          poDate: project.orderDate
            ? new Date(project.orderDate).toISOString().split("T")[0]
            : "",
          contactPerson: project.ContactPersonName || "",
          contactPersonNumber: project.ContactPersonNumber || "",
          visitStartDate: project.visitDate
            ? new Date(project.visitDate).toISOString().split("T")[0]
            : "",
        }));

      } catch (error) {
        console.log("❌ Failed to load END checklist:", error);
      }
    };

    loadData();
  }, [project]);


  const handleChange = (e, section, key) => {
    const { name, value, type, checked } = e.target;

    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));
    } else if (name) {

      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [key]: value,
      }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!formData.jobNumber || !formData.engineerName || !formData.customerName) {
        toast.error("Please fill all required fields");
        return;
      }

      const bodyData = {
        ...formData,
        poDate: formData.poDate ? new Date(formData.poDate) : null,
        visitStartDate: formData.visitStartDate ? new Date(formData.visitStartDate) : null,
        visitEndDate: formData.visitEndDate ? new Date(formData.visitEndDate) : null,

        projectId: project?._id || null,
        submittedBy: user?._id || null,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/endCheck/save`,
        bodyData
      );

      toast.success(response.data?.message || "End Checklist Saved Successfully");
      console.log("✔ Response:", response.data);

      onClose();
    } catch (error) {
      console.error("❌ Submit Error:", error);
      toast.error(error.response?.data?.message || "Failed to submit checklist");
    }
  };


  const renderEnumSelect = (
    section,
    key,
    label,
    colorClass,
    options = ENUMVAL
  ) => (
    <div key={key} className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-1">
        {label.replace(/([A-Z])/g, " $1")}
      </label>
      <select
        value={section ? formData[section][key] : formData[key]}
        onChange={(e) => handleChange(e, section, key)}
        className="w-full p-2.5 rounded-lg bg-gradient-to-br from-white to-indigo-50 border border-gray-300 text-gray-700 shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  const renderInput = (field, label, type = "text") => (
    <div key={field} className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-1">
        {label.replace(/([A-Z])/g, " $1")}
      </label>
      <input
        name={field}
        value={formData[field]}
        onChange={handleChange}
        placeholder={`Enter ${label}`}
        type={type}
        className="w-full p-2.5 rounded-lg bg-gradient-to-br from-white to-indigo-50 border border-gray-300 text-gray-700 shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 scrollbar-glass">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-10 space-y-10 border border-gray-200 overflow-y-auto max-h-[90vh]">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
        <div className="text-center pb-4 border-b border-gray-200">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-indigo-600 mb-2">
            End Checklist
          </h2>
          <p className="text-gray-600 font-medium">
            Please fill in all details after project completion
          </p>
        </div>

        <Section title="Basic Information" color="from-blue-500 to-cyan-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "email",
              "jobNumber",
              "engineerName",
              "customerName",
              "endUser",
              "site",
              "poNumber",
              "poDate",
              "contactPerson",
              "contactPersonNumber",
              "visitStartDate",
              "visitEndDate",
              "momNumber",
            ].map((field) =>
              renderInput(
                field,
                field,
                field.includes("Date") ? "date" : "text"
              )
            )}
          </div>
        </Section>

        <Section title="Project Status" color="from-green-500 to-emerald-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderEnumSelect(
              null,
              "projectStatus",
              "Project Status",
              "green",
              PROJECT_STATUS
            )}
            {renderEnumSelect(
              null,
              "momSignedByCustomer",
              "MOM Signed By Customer",
              "green"
            )}
          </div>
        </Section>

        <Section
          title="Pending Points & Remarks"
          color="from-orange-500 to-amber-500"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <textarea
              name="pendingPoints"
              value={formData.pendingPoints}
              onChange={handleChange}
              placeholder="Enter Pending Points"
              className="w-full p-3 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-gray-300 text-gray-700 shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-amber-300 focus:border-amber-400 h-24"
            />
            <textarea
              name="customerRemarks"
              value={formData.customerRemarks}
              onChange={handleChange}
              placeholder="Enter Customer Remarks"
              className="w-full p-3 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-gray-300 text-gray-700 shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-amber-300 focus:border-amber-400 h-24"
            />
          </div>
        </Section>
        
        <Section
          title="Project Performance"
          color="from-purple-500 to-pink-500"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-pink-50 border border-gray-300 rounded-lg hover:shadow-md">
              <input
                type="checkbox"
                name="completedWithinEstimatedTime"
                checked={formData.completedWithinEstimatedTime}
                onChange={handleChange}
                className="accent-purple-500 w-5 h-5"
              />
              Completed Within Estimated Time
            </label>
            <label className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-pink-50 border border-gray-300 rounded-lg hover:shadow-md">
              <input
                type="checkbox"
                name="facedChallenges"
                checked={formData.facedChallenges}
                onChange={handleChange}
                className="accent-pink-500 w-5 h-5"
              />
              Faced Challenges
            </label>
          </div>

          {formData.facedChallenges && (
            <textarea
              name="challengeDetails"
              value={formData.challengeDetails}
              onChange={handleChange}
              placeholder="Describe challenges faced during project"
              className="w-full mt-4 p-3 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 border border-gray-300 text-gray-700 shadow-sm hover:shadow-md transition focus:ring-2 focus:ring-pink-300 focus:border-pink-400 h-28"
            />
          )}
        </Section>

        {/* Completion Documents */}
        <Section
          title="Completion Documents"
          color="from-indigo-500 to-violet-500"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(formData.completionDocuments).map((key) =>
              renderEnumSelect("completionDocuments", key, key, "indigo")
            )}
          </div>
        </Section>

        {/* Submit */}
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform hover:scale-[1.03]"
          >
            Submit End Checklist
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition hover:shadow-md">
      <div
        className={`bg-gradient-to-r ${color} px-5 py-3 border-b border-gray-200 text-white`}
      >
        <h3 className="text-lg font-bold tracking-wide">{title}</h3>
      </div>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
        {children}
      </div>
    </section>
  );
}
