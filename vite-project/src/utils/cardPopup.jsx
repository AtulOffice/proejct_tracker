import React from "react";

const ProjectDetailsPopup = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div
        className="
          bg-white rounded-2xl shadow-2xl 
          w-full 
          max-w-md sm:max-w-2xl lg:max-w-3xl 
          max-h-[90vh] 
          overflow-y-auto 
          p-4 sm:p-6
          scrollbar-glass
        "
      >
        <h2 className="text-lg sm:text-2xl font-bold text-center mb-4 text-gray-800">
          {project.projectName || "Project Details"}
        </h2>

        <ul className="text-sm sm:text-base text-gray-700 space-y-2 mb-4">
          <li>
            <strong>Client:</strong> {project?.client}
          </li>
          {project?.endUser && (
            <li>
              <strong>End User:</strong> {project.endUser}
            </li>
          )}
          <li>
            <strong>Location:</strong> {project?.location || "Not mentioned"}
          </li>
          <li>
            <strong>Order Value (lacs):</strong> ₹
            {project?.bill ?? "Not mentioned"}
          </li>
          <li>
            <strong>Pending Bill (lacs):</strong> ₹
            {project?.dueBill ?? "Not mentioned"}
          </li>
          <li>
            <strong>Billing Status:</strong>{" "}
            {project?.billStatus ?? "Not provided"}
          </li>
          <li>
            <strong>Order Date:</strong>{" "}
            {project?.orderDate
              ? new Date(project.orderDate).toLocaleDateString()
              : "Not provided"}
          </li>
          <li>
            <strong>Delivery Date:</strong>{" "}
            {project?.deleveryDate
              ? new Date(project.deleveryDate).toLocaleDateString()
              : "Not provided"}
          </li>
          <li>
            <strong>Service Days:</strong>{" "}
            {project?.duration !== "0" ? project?.duration : "Not provided"}
          </li>

          {/* Additional fields */}
          <li>
            <strong>Expense Scope:</strong>{" "}
            {project?.expenseScope || "Not provided"}
          </li>
          <li>
            <strong>Engineer Assigned:</strong>{" "}
            {project?.engineerName?.join(", ") || "-"}
          </li>
          <li>
            <strong>Work Scope:</strong> {project?.workScope || "Not mentioned"}
          </li>
          <li>
            <strong>Request Date:</strong>{" "}
            {project?.requestDate
              ? new Date(project.requestDate).toLocaleDateString()
              : "-"}
          </li>
          <li>
            <strong>Visit Start Date:</strong>{" "}
            {project?.visitDate
              ? new Date(project.visitDate).toLocaleDateString()
              : "-"}
          </li>
          <li>
            <strong>Start Checklist:</strong>{" "}
            {project?.StartChecklist || "Not mentioned"}
          </li>
          <li>
            <strong>Visit End Date:</strong>{" "}
            {project?.visitendDate
              ? new Date(project.visitendDate).toLocaleDateString()
              : "-"}
          </li>
          <li>
            <strong>End Checklist:</strong>{" "}
            {project?.EndChecklist || "Not mentioned"}
          </li>
          <li>
            <strong>MOM SR No:</strong> {project?.momsrNo || "-"}
          </li>
          <li className="flex items-center space-x-2">
            <strong>Development:</strong>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-md ${
                project?.Development
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {project?.Development ? "YES" : "NO"}
            </span>
          </li>
          <li>
            <strong>MOM Dates:</strong>{" "}
            {project?.momDate?.length > 0
              ? project.momDate
                  .map((d) => new Date(d).toLocaleDateString())
                  .join(", ")
              : "-"}
          </li>
          <li>
            <strong>Backup Submission:</strong>{" "}
            {project?.BackupSubmission || "Not mentioned"}
          </li>
          <li>
            <strong>Expense Submission:</strong>{" "}
            {project?.ExpensSubmission || "Not mentioned"}
          </li>
          <li>
            <strong>Entity Type:</strong> {project?.entityType || "-"}
          </li>
          <li>
            <strong>Key Notes:</strong> {project?.description || "-"}
          </li>
          <li>
            <strong>SO Type:</strong> {project?.soType || "-"}
          </li>
          <li>
            <strong>PO No:</strong> {project?.orderNumber || "-"}
          </li>
          <li>
            <strong>Days Spent On Site:</strong>{" "}
            {project?.daysspendsite || "Not mentioned"}
          </li>
          <li>
            <strong>Project Start Date:</strong>{" "}
            {project?.startDate
              ? new Date(project.startDate).toLocaleDateString()
              : "-"}
          </li>
          <li>
            <strong>Project End Date:</strong>{" "}
            {project?.endDate
              ? new Date(project.endDate).toLocaleDateString()
              : "-"}
          </li>
          <li>
            <strong>Final MOM Number:</strong>{" "}
            {project?.finalMomnumber || "Not received"}
          </li>
          <li>
            <strong>Actual Start Date:</strong>{" "}
            {project?.actualStartDate
              ? new Date(project.actualStartDate).toLocaleDateString()
              : "-"}
          </li>
          <li>
            <strong>Actual End Date:</strong>{" "}
            {project?.actualEndDate
              ? new Date(project.actualEndDate).toLocaleDateString()
              : "-"}
          </li>
        </ul>

        <div className="flex justify-center sticky bottom-0 bg-transparent py-2">
          <button
            onClick={onClose}
            className="bg-transparent border border-blue-600 text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPopup;
