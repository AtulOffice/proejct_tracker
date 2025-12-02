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
            <strong>Expense Scope:</strong>{" "}
            {project?.expenseScope || "Not provided"}
          </li>

          <li>
            <strong>Work Scope:</strong> {project?.workScope || "Not mentioned"}
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

          <li>
            <strong>Backup Submission:</strong>{" "}
            {project?.BackupSubmission || "Not mentioned"}
          </li>
          <li>
            <strong>Expense Submission:</strong>{" "}
            {project?.ExpensSubmission || "Not mentioned"}
          </li>
          <li>
            <strong>Final MOM Number:</strong>{" "}
            {project?.finalMomnumber || "Not received"}
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
