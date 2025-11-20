import React from "react";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  TrendingUp,
} from "lucide-react";

const ProjectDetailsPopup = ({ project, onClose }) => {
  if (!project) return null;

  // Data sections for better organization
  const sections = [
    {
      title: "Project Overview",
      icon: <Briefcase className="w-5 h-5" />,
      color: "blue",
      fields: [
        { label: "Client", value: project?.client },
        { label: "End User", value: project?.endUser, optional: true },
        {
          label: "Location",
          value: project?.location || "Not mentioned",
          icon: <MapPin className="w-4 h-4" />,
        },
        { label: "Entity Type", value: project?.entityType || "-" },
        { label: "SO Type", value: project?.soType || "-" },
        { label: "PO No", value: project?.orderNumber || "-" },
        {
          label: "Key Notes",
          value: project?.description || "-",
          fullWidth: true,
        },
      ],
    },
    {
      title: "Financial Details",
      icon: <DollarSign className="w-5 h-5" />,
      color: "green",
      fields: [
        {
          label: "Order Value",
          value: project?.bill
            ? `₹${(project.bill / 100000).toFixed(2)} Lacs`
            : "Not mentioned",
        },
        {
          label: "Pending Bill",
          value: project?.dueBill
            ? `₹${(project.dueBill / 100000).toFixed(2)} Lacs`
            : "Not mentioned",
          highlight: project?.dueBill > 0,
        },
        {
          label: "Billing Status",
          value: project?.billStatus ?? "Not provided",
          badge: true,
        },
      ],
    },
    {
      title: "Timeline & Duration",
      icon: <Calendar className="w-5 h-5" />,
      color: "purple",
      fields: [
        {
          label: "Order Date",
          value: project?.orderDate
            ? new Date(project.orderDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Not provided",
        },
        {
          label: "Delivery Date",
          value: project?.deleveryDate
            ? new Date(project.deleveryDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Not provided",
        },
        {
          label: "Service Days",
          value: project?.duration !== "0" ? project?.duration : "Not provided",
        },
        {
          label: "Project Start",
          value: project?.startDate
            ? new Date(project.startDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
        },
        {
          label: "Project End",
          value: project?.endDate
            ? new Date(project.endDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
        },
        {
          label: "Days on Site",
          value: project?.daysspendsite || "Not mentioned",
        },
      ],
    },
    {
      title: "Team & Work",
      icon: <Users className="w-5 h-5" />,
      color: "orange",
      fields: [
        {
          label: "Engineers Assigned",
          value: project?.engineerName?.join(", ") || "-",
          fullWidth: true,
        },
        {
          label: "Work Scope",
          value: project?.workScope || "Not mentioned",
          fullWidth: true,
        },
        { label: "Expense Scope", value: project?.expenseScope || "-" },
      ],
    },
    {
      title: "Visit & Checklist",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "indigo",
      fields: [
        {
          label: "Request Date",
          value: project?.requestDate
            ? new Date(project.requestDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
        },
        {
          label: "Visit Start",
          value: project?.visitDate
            ? new Date(project.visitDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
        },
        {
          label: "Visit End",
          value: project?.visitendDate
            ? new Date(project.visitendDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
        },
        {
          label: "Actual Start",
          value: project?.actualStartDate
            ? new Date(project.actualStartDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
        },
        {
          label: "Actual End",
          value: project?.actualEndDate
            ? new Date(project.actualEndDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
        },
        {
          label: "Start Checklist",
          value: project?.StartChecklist || "Not mentioned",
        },
        {
          label: "End Checklist",
          value: project?.EndChecklist || "Not mentioned",
        },
      ],
    },
    {
      title: "Documentation",
      icon: <FileText className="w-5 h-5" />,
      color: "teal",
      fields: [
        { label: "MOM SR No", value: project?.momsrNo || "-" },
        {
          label: "MOM Dates",
          value:
            project?.momDate?.length > 0
              ? project.momDate
                  .map((d) =>
                    new Date(d).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  )
                  .join(", ")
              : "-",
          fullWidth: true,
        },
        {
          label: "Final MOM Number",
          value: project?.finalMomnumber || "Not received",
        },
        {
          label: "Development",
          value: project?.Development ? "YES" : "NO",
          isDevelopment: true,
        },
        {
          label: "Backup Submission",
          value: project?.BackupSubmission || "Not mentioned",
        },
        {
          label: "Expense Submission",
          value: project?.ExpensSubmission || "Not mentioned",
        },
      ],
    },
  ];

  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    indigo: "from-indigo-500 to-indigo-600",
    teal: "from-teal-500 to-teal-600",
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="
          bg-linear-to-br from-white to-gray-50
          rounded-3xl shadow-2xl 
          w-full 
          max-w-md sm:max-w-3xl lg:max-w-5xl 
          max-h-[92vh] 
          overflow-hidden
          flex flex-col
          animate-slideUp
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Description removed */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {project.projectName || "Project Details"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 hover:rotate-90"
          >
            <XCircle className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Section Header */}
              <div
                className={`bg-linear-to-r ${
                  colorMap[section.color]
                } text-white px-4 py-3 flex items-center gap-2`}
              >
                {section.icon}
                <h3 className="text-base sm:text-lg font-semibold">
                  {section.title}
                </h3>
              </div>

              {/* Section Content */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.fields
                  .filter((field) => !field.optional || field.value)
                  .map((field, fieldIdx) => (
                    <div
                      key={fieldIdx}
                      className={`${
                        field.fullWidth ? "sm:col-span-2" : ""
                      } group`}
                    >
                      <div className="flex items-start gap-2">
                        {field.icon && (
                          <div className="text-gray-400 mt-1">{field.icon}</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            {field.label}
                          </p>
                          {field.isDevelopment ? (
                            <span
                              className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                                project?.Development
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                              }`}
                            >
                              {project?.Development ? (
                                <CheckCircle className="w-4 h-4 mr-1" />
                              ) : (
                                <XCircle className="w-4 h-4 mr-1" />
                              )}
                              {field.value}
                            </span>
                          ) : field.badge ? (
                            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                              {field.value}
                            </span>
                          ) : (
                            <p
                              className={`text-sm sm:text-base font-medium ${
                                field.highlight
                                  ? "text-orange-600"
                                  : "text-gray-800"
                              } ${
                                field.fullWidth
                                  ? "whitespace-normal"
                                  : "truncate group-hover:text-clip group-hover:whitespace-normal"
                              } transition-all`}
                            >
                              {field.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {/* <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Close
          </button>
        </div> */}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default ProjectDetailsPopup;
