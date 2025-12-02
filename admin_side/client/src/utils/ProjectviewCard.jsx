import React from "react";

export const ProjectDetailsCard = ({ project }) => {


  if (!project) return null;

  return (
    <>
      <div className="relative w-full flex items-center justify-center my-10">
        <div className="absolute inset-x-0 h-[3px] bg-linear-to-r from-transparent via-indigo-500 to-transparent rounded-full shadow-lg" />
        <span className="relative px-6 py-1.5 text-base sm:text-lg font-extrabold tracking-wider text-indigo-800 uppercase bg-linear-to-r from-white via-white to-white border-2 border-indigo-400 rounded-full shadow-md">
          Project Overview
        </span>
      </div>

      <section className="mb-8">
        <SectionHeader
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          title="Project Overview"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
          <EnhancedInfoRow label="Project Name" value={project?.projectName} />
          <EnhancedInfoRow label="Client" value={project?.client} />
          <EnhancedInfoRow label="End User" value={project?.endUser} />
          <EnhancedInfoRow label="Location" value={project?.location} />
          <EnhancedInfoRow label="Order Number" value={project?.orderNumber} />
          <EnhancedInfoRow label="Job Number" value={project?.jobNumber} />
          <EnhancedInfoRow label="Entity Type" value={project?.entityType} />
          <EnhancedInfoRow label="SO Type" value={project?.soType} />
          <EnhancedInfoRow
            label="Technical Email"
            value={project?.technicalEmail}
          />
          <EnhancedInfoRow
            label="Contact Person"
            value={project?.ContactPersonName}
          />
          <EnhancedInfoRow
            label="Contact Number"
            value={project?.ContactPersonNumber}
          />
          {project?.description && (
            <EnhancedInfoRow
              label="Description"
              value={project?.description}
              fullWidth
            />
          )}
        </div>
      </section>

      {/* Financial Overview */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-linear-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Financial Details</h3>
          <div className="flex-1 h-px bg-linear-to-r from-green-200 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FinancialCard
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            label="Total Bill Amount"
            value={project?.bill ? (project.bill / 100000).toFixed(2) : "0.00"}
            linear="from-blue-500 to-blue-600"
            bglinear="from-blue-50 to-blue-100"
            borderColor="border-blue-200"
          />
          <FinancialCard
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            label="Pending Bill Amount"
            value={
              project?.dueBill ? (project.dueBill / 100000).toFixed(2) : "0.00"
            }
            linear="from-orange-500 to-amber-600"
            bglinear="from-orange-50 to-amber-100"
            borderColor="border-orange-200"
          />
          <FinancialCard
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            label="Billing Status"
            value={project?.billStatus || "N/A"}
            isBadge={true}
            linear="from-green-500 to-emerald-600"
            bglinear="from-green-50 to-emerald-100"
            borderColor="border-green-200"
          />
        </div>
      </section>

      {/* Status & Priority */}
      <section className="mb-8">
        <SectionHeader
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="Status & Priority"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <EnhancedStatusCard
            label="Project Status"
            value={project?.status}
            colorClass={getProjectStatusColor(project?.status)}
          />
          <EnhancedStatusCard
            label="Priority"
            value={project?.priority}
            colorClass={getPriorityColor(project?.priority)}
          />
          <EnhancedStatusCard
            label="Supply Status"
            value={project?.supplyStatus}
            colorClass={
              project?.supplyStatus === "DISPATCHED"
                ? "bg-green-500 text-white"
                : "bg-orange-500 text-white"
            }
          />
          <EnhancedStatusCard
            label="Mail Status"
            value={project?.isMailSent === "YES" ? "Sent" : "Not Sent"}
            colorClass={
              project?.isMailSent === "YES"
                ? "bg-green-500 text-white"
                : "bg-gray-500 text-white"
            }
          />
        </div>
      </section>

      {/* Timeline & Dates */}
      <section className="mb-8">
        <SectionHeader
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          title="Timeline & Dates"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
          <EnhancedInfoRow
            label="Order Date"
            value={
              project?.orderDate
                ? new Date(project.orderDate).toLocaleDateString()
                : null
            }
          />
          <EnhancedInfoRow
            label="Delivery Date"
            value={
              project?.deleveryDate
                ? new Date(project.deleveryDate).toLocaleDateString()
                : null
            }
          />
          <EnhancedInfoRow label="Duration" value={project?.duration} />
          <EnhancedInfoRow
            label="Start Date"
            value={
              project?.startDate
                ? new Date(project.startDate).toLocaleDateString()
                : null
            }
          />
          <EnhancedInfoRow
            label="End Date"
            value={
              project?.endDate
                ? new Date(project.endDate).toLocaleDateString()
                : null
            }
          />
          <EnhancedInfoRow
            label="Visit Start Date"
            value={
              project?.visitDate
                ? new Date(project.visitDate).toLocaleDateString()
                : null
            }
          />
          <EnhancedInfoRow
            label="Visit End Date"
            value={
              project?.visitendDate
                ? new Date(project.visitendDate).toLocaleDateString()
                : null
            }
          />
          <EnhancedInfoRow
            label="Actual Start Date"
            value={
              project?.actualStartDate
                ? new Date(project.actualStartDate).toLocaleDateString()
                : null
            }
          />
          <EnhancedInfoRow
            label="Actual End Date"
            value={
              project?.actualEndDate
                ? new Date(project.actualEndDate).toLocaleDateString()
                : null
            }
          />
          <EnhancedInfoRow
            label="Days Spent on Site"
            value={project?.daysspendsite}
          />
          <EnhancedInfoRow
            label="Actual Visit Duration"
            value={project?.actualVisitDuration}
          />
        </div>
      </section>

      {/* Engineering & Development */}
      <section className="mb-8">
        <SectionHeader
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
          title="Engineering & Development"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
          <EnhancedInfoRow
            label="Assigned Engineers"
            value={project?.engineerName?.join(", ") || "-"}
            fullWidth={project?.engineerName?.length > 2}
          />
          <EnhancedInfoRow
            label="Development Engineers"
            value={project?.developmentEngineer?.join(", ") || "-"}
            fullWidth={project?.developmentEngineer?.length > 2}
          />
          <EnhancedInfoRow label="Development" value={project?.Development} />
          <EnhancedInfoRow
            label="Development Section"
            value={project?.DevelopmentSetcion}
          />
          <EnhancedInfoRow
            label="Development Approved"
            value={project?.isDevlopmentApproved}
          />
          <EnhancedInfoRow label="Service" value={project?.service} />
          <EnhancedInfoRow
            label="Work Scope"
            value={project?.workScope}
            fullWidth
          />
          <EnhancedInfoRow
            label="Expense Scope"
            value={project?.expenseScope}
            fullWidth
          />
        </div>
      </section>

      {/* Checklists & Submissions */}
      <section className="mb-8">
        <SectionHeader
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          }
          title="Checklists & Submissions"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
          <EnhancedInfoRow
            label="Start Checklist"
            value={project?.StartChecklist}
          />
          <EnhancedInfoRow
            label="End Checklist"
            value={project?.EndChecklist}
          />
          <EnhancedInfoRow
            label="Backup Submission"
            value={project?.BackupSubmission}
          />
          <EnhancedInfoRow
            label="Expense Submission"
            value={project?.ExpensSubmission}
          />
          <EnhancedInfoRow
            label="MOM SR No"
            value={project?.momsrNo?.join(", ") || "-"}
          />
          <EnhancedInfoRow
            label="Final MOM Number"
            value={project?.finalMomnumber || "Not received"}
          />
          <EnhancedInfoRow
            label="MOM Dates"
            value={
              project?.momDate?.length > 0 && project?.momDate[0]
                ? project.momDate
                  .map((d) => new Date(d).toLocaleDateString())
                  .join(", ")
                : "-"
            }
            fullWidth
          />
        </div>
      </section>

      {/* Document Status */}
      <section className="mb-8">
        <SectionHeader
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          }
          title="Document Status"
        />

        <div className="space-y-6">
          {project?.CustomerDevDocuments && (
            <DocumentSection
              title="Customer Development Documents"
              documents={project.CustomerDevDocuments}
              linearFrom="from-blue-500"
              linearTo="to-cyan-500"
            />
          )}
          {project?.SIEVPLDevDocuments && (
            <DocumentSection
              title="SIEVPL Development Documents"
              documents={project.SIEVPLDevDocuments}
              linearFrom="from-purple-500"
              linearTo="to-pink-500"
            />
          )}
          {project?.swDevDocumentsforFat && (
            <DocumentSection
              title="Software Development for FAT"
              documents={project.swDevDocumentsforFat}
              linearFrom="from-green-500"
              linearTo="to-emerald-500"
            />
          )}
          {project?.inspectionDocuments && (
            <DocumentSection
              title="Inspection Documents"
              documents={project.inspectionDocuments}
              linearFrom="from-orange-500"
              linearTo="to-amber-500"
            />
          )}

          {project?.dispatchDocuments && (
            <DocumentSection
              title="Dispatch Documents"
              documents={project.dispatchDocuments}
              linearFrom="from-teal-500"
              linearTo="to-blue-500"
            />
          )}

          {project?.PostCommisionDocuments && (
            <DocumentSection
              title="Post Commission Documents"
              documents={project.PostCommisionDocuments}
              linearFrom="from-red-500"
              linearTo="to-yellow-500"
            />
          )}

        </div>

      </section>
    </>
  );
};

// Document Section Component
const DocumentSection = ({ title, documents, linearFrom, linearTo }) => {
  const extractStatus = (doc) => {
    if (!doc) return "N/A";

    // Case 1: array → dispatchDocuments
    if (Array.isArray(doc)) {
      return doc.map((d) => d?.value || "N/A").join(", ");
    }

    // Case 2: object with { value }
    if (typeof doc === "object" && "value" in doc) {
      return doc.value || "N/A";
    }

    // Case 3: otherDocument (nested)
    if (typeof doc === "object" && "otherDocument" in doc) {
      return doc.otherDocument?.value || "N/A";
    }

    // Case 4: fallback
    return String(doc ?? "N/A");
  };

  return (
    <div className={`relative bg-linear-to-br ${linearFrom} ${linearTo} p-6 rounded-2xl shadow-xl`}>
      <h4 className="relative text-base font-bold text-white mb-4 flex items-center gap-2">
        {title}
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.entries(documents).map(([key, doc]) => (
          <DocumentBadge
            key={key}
            label={formatDocumentLabel(key)}
            status={extractStatus(doc)}
          />
        ))}
      </div>
    </div>
  );
};

// Document Badge Component
const DocumentBadge = ({ label, status }) => {
  const normalized = String(status ?? "").trim().toUpperCase();
  const getStatusColor = () => {
    switch (normalized) {
      case "YES":
        return "bg-green-100 text-green-700 border-green-300";
      case "NO":
        return "bg-red-100 text-red-700 border-red-300";
      case "N/A":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg border-2 border-white/50 hover:scale-105 transition-all duration-200">
      <p className="text-xs font-medium text-gray-600 mb-1.5 truncate">
        {label}
      </p>
      <span
        className={`inline-flex px-2 py-1 text-xs font-bold rounded-md border ${getStatusColor()}`}
      >
        {status || "N/A"}
      </span>
    </div>
  );
};

// Format document label (camelCase to Title Case)
const formatDocumentLabel = (str) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

const FinancialCard = ({
  icon,
  label,
  value,
  linear,
  bglinear,
  borderColor,
  isBadge = false,
}) => (
  <div
    className={`group relative bg-linear-to-br ${bglinear} p-6 rounded-2xl border-2 ${borderColor} shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
    <div
      className={`relative inline-flex p-3 rounded-xl bg-linear-to-r ${linear} text-white mb-3 shadow-lg`}
    >
      {icon}
    </div>
    <p className="relative text-xs font-medium text-gray-600 mb-2">{label}</p>
    {isBadge ? (
      <span
        className={`relative inline-flex px-4 py-2 text-base font-bold rounded-lg bg-linear-to-r ${linear} text-white shadow-md`}
      >
        {value}
      </span>
    ) : (
      <p
        className={`relative text-3xl font-bold bg-linear-to-r ${linear} bg-clip-text text-transparent`}
      >
        ₹{value}
        <span className="text-base font-normal ml-1.5 text-gray-600">Lacs</span>
      </p>
    )}
  </div>
);

// Enhanced Section Header
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-md">
      {React.cloneElement(icon, { className: "w-5 h-5 text-white" })}
    </div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <div className="flex-1 h-px bg-linear-to-r from-blue-200 via-indigo-200 to-transparent"></div>
  </div>
);

// Enhanced Info Row Component
const EnhancedInfoRow = ({ label, value, fullWidth = false }) => (
  <div className={`group ${fullWidth ? "col-span-full" : ""}`}>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
      <span className="w-1 h-1 rounded-full bg-blue-500"></span>
      {label}
    </p>
    <p className="text-sm text-gray-900 font-semibold group-hover:text-blue-600 transition-colors">
      {value || (
        <span className="text-gray-400 italic font-normal">Not provided</span>
      )}
    </p>
  </div>
);

// Enhanced Status Card Component
const EnhancedStatusCard = ({ label, value, colorClass }) => (
  <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
      {label}
    </p>
    <div
      className={`inline-flex px-5 py-2.5 text-sm font-bold rounded-xl shadow-lg ${colorClass} transform group-hover:scale-105 transition-all duration-200 uppercase`}
    >
      {value || "N/A"}
    </div>
  </div>
);

// Status Color Functions
const getProjectStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-500 text-white";
    case "in-progress":
    case "ongoing":
      return "bg-blue-500 text-white";
    case "upcoming":
      return "bg-yellow-500 text-white";
    case "on-hold":
      return "bg-orange-500 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
    case "urgent":
      return "bg-red-500 text-white";
    case "medium":
      return "bg-orange-500 text-white";
    case "low":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};
