import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  documentRows,
  logicRows,
  projectRows,
  screenRows,
  testingRows,
} from "../utils/dev.context";
import { mapFrontendToBackend } from "../utils/frontToback";
import apiClient from "../api/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "../redux/slices/uiSlice";

const ProjectTimelineForm = ({ open, onClose, project }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth);
  const { toggle } = useSelector((state) => state.ui);

  const [collOpen, setCollOpen] = useState(false);
  const [formData, setFormData] = useState({
    documents: { startDate: "", endDate: "", planDetails: "", engineers: [] },
    logic: { startDate: "", endDate: "", planDetails: "", engineers: [] },
    scada: { startDate: "", endDate: "", planDetails: "", engineers: [] },
    testing: { startDate: "", endDate: "", planDetails: "", engineers: [] },
  });

  const [name, setName] = useState("");
  const [engineersList, setEngineersList] = useState([]);

  useEffect(() => {
    const fetchPlanningData = async (id) => {
      try {
        const res = await apiClient.get(`/planningDev/fetchbyid/${id}`);
        const defaultData = res.data?.data || {};
        defaultData?.updatedBy?.username &&
          setName(defaultData.updatedBy.username);

        setFormData(() => {
          const updated = {};
          ["documents", "logic", "scada", "testing"].forEach((p) => {
            const key = p.toLowerCase();
            const formatDate = (dateStr) => {
              if (!dateStr) return "";
              const d = new Date(dateStr);
              return d.toISOString().split("T")[0];
            };

            updated[key] = {
              startDate: formatDate(defaultData[key]?.startDate),
              endDate: formatDate(defaultData[key]?.endDate),
              planDetails: defaultData[key]?.planDetails || "",
              engineers: defaultData[key]?.engineers || [],
            };
          });
          return updated;
        });
      } catch (err) {
        console.error("Error fetching planning data:", err);
      }
    };

    if (project?.PlanDetails) fetchPlanningData(project?.PlanDetails);
  }, [project?.PlanDetails, toggle]);

  useEffect(() => {
    const fetchEngineerData = async () => {
      try {
        const res = await apiClient.get(`/engineer/getAllEngineers`);
        setEngineersList(res.data?.engineers || res.data?.data || []);
      } catch (err) {
        console.error("Error fetching engineer data:", err);
        toast.error("Failed to load engineers");
      }
    };

    fetchEngineerData();
  }, [toggle]);

  const handleChange = (phase, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        [field]: value,
      },
    }));
  };

  const handleEngineerToggle = (phase, engineerId) => {
    setFormData((prev) => {
      const currentEngineers = prev[phase].engineers || [];
      const isSelected = currentEngineers.includes(engineerId);

      return {
        ...prev,
        [phase]: {
          ...prev[phase],
          engineers: isSelected
            ? currentEngineers.filter((id) => id !== engineerId)
            : [...currentEngineers, engineerId],
        },
      };
    });
  };

  const removeEngineer = (phase, engineerId) => {
    setFormData((prev) => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        engineers: prev[phase].engineers.filter((id) => id !== engineerId),
      },
    }));
  };

  const getEngineerName = (engineerId) => {
    const engineer = engineersList.find((e) => e._id === engineerId);
    return engineer?.username || engineer?.name || engineer?.email || "Unknown";
  };

  const truncateName = (name) => {
    return name.slice(0, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDevbackData = mapFrontendToBackend({
        document: {
          rows: documentRows(),
        },
        screen: {
          rows: screenRows(),
        },
        logic: {
          rows: logicRows(),
        },
        testing: {
          rows: testingRows(),
        },
        project: {
          rows: projectRows(),
        },
      }, project?.jobNumber)
      const res = await apiClient.post(`/planningDev/save`, {
        ...formData,
        formDevbackData,
        projectId: project?._id,
        useId: user?._id,
      },
      );
      toast.success(res.data?.message || "Plan saved successfully");
      onClose();
      setFormData({
        documents: {
          startDate: "",
          endDate: "",
          planDetails: "",
          engineers: [],
        },
        logic: { startDate: "", endDate: "", planDetails: "", engineers: [] },
        scada: { startDate: "", endDate: "", planDetails: "", engineers: [] },
        testing: { startDate: "", endDate: "", planDetails: "", engineers: [] },
      });
      dispatch(toggleMode())
    } catch (e) {
      if (e?.response?.data?.message) {
        toast.error(e.response.data.message || "Something went wrong");
      } else {
        toast.error("Failed to save plan");
      }
      console.log(e);
    }
  };

  useEffect(() => {
    const combinedEngineers = Array.from(
      new Set([
        ...(formData.logic.engineers || []),
        ...(formData.scada.engineers || []),
        ...(formData.testing.engineers || []),
      ])
    );
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        engineers: combinedEngineers,
      },
    }));
  }, [
    formData.logic.engineers,
    formData.scada.engineers,
    formData.testing.engineers,
  ]);

  if (!open) return null;

  const SERVICE_LABELS = {
    DEV: "Development",
    DEVCOM: "Development + Commissioning",
    COMMISSIONING: "Commissioning",
    AMC: "AMC",
    SERVICE: "Service",
    SEPERATE: "Separate",
    "": "",
    "N/A": "N/A",
  };


  const Info = ({ label, value }) => {
    return (
      <div className="group bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
        <dt className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-indigo-600 transition-colors"></span>
          {label}
        </dt>
        <dd className="text-base font-semibold text-gray-900 truncate">
          {value || <span className="text-gray-400 font-normal italic">Not specified</span>}
        </dd>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-black/60 to-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 transition-all duration-300 scrollbar-glass">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 drop-shadow-sm">
            PROJECT TIMELINE
          </h2>
          {name && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated by{" "}
              <span className="font-medium text-gray-700">
                {name.toUpperCase() || "—"}
              </span>
            </p>
          )}
        </div>



        <div className="w-full mb-6">
          <button
            onClick={() => setCollOpen(!collOpen)}
            className="w-full bg-gray-300 p-3 rounded-lg flex justify-between items-center"
          >
            <span className="text-lg font-medium">
              {collOpen ? "Hide" : "Show"} Order
            </span>
            <span className="text-xl">{collOpen ? "▲" : "▼"}</span>
          </button>
          {collOpen && (
            <div className="space-y-6 mb-6">
              <div className="relative bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-indigo-200/30 to-purple-200/30 rounded-bl-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-indigo-900">
                      Basic Project Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Job Number" value={project.jobNumber} />
                    <Info label="Entity Type" value={project?.OrderMongoId.entityType} />
                    <Info label="SO Type" value={project?.OrderMongoId.soType} />
                    <Info label="Booking Date" value={project?.OrderMongoId.bookingDate} />
                    <Info label="Client" value={project?.OrderMongoId.client} />
                    <Info label="End User" value={project?.OrderMongoId.endUser} />
                    <Info label="Location" value={project?.OrderMongoId.site} />
                    <Info label="Accournt manager Email" value={project?.OrderMongoId.concerningSalesManager?.name} />
                    <Info label="Technical Name" value={project?.OrderMongoId.name} />
                    <Info label="Technical Email" value={project?.OrderMongoId.technicalEmail} />
                    <Info label="Technical Phone" value={project?.OrderMongoId.phone} />
                  </div>
                </div>
              </div>


              <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-blue-900">
                      Order Value
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Order Value (Supply)" value={project?.OrderMongoId.orderValueSupply} />
                    <Info label="Order Value (Service)" value={project?.OrderMongoId.orderValueService} />
                    <Info label="Order Value (Total)" value={project?.OrderMongoId.orderValueTotal} />
                  </div>
                </div>
              </div>
              <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-blue-900">
                      PO Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="PO Received" value={project?.OrderMongoId.poReceived} />
                    <Info label="Order Number" value={project?.OrderMongoId.orderNumber} />
                    <Info label="Order Date" value={project?.OrderMongoId.orderDate} />
                    <Info label="Delivery Date" value={project?.OrderMongoId.deleveryDate} />
                    <Info label="Actual Delivery Date" value={project?.OrderMongoId.actualDeleveryDate} />
                    <Info label="Amendment Required" value={project?.OrderMongoId.amndReqrd} />
                  </div>
                </div>
              </div>

              <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-blue-900">
                      Service Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Service Type" value={SERVICE_LABELS[project?.service] || project?.service} />
                  </div>
                </div>
              </div>

              <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-blue-900">
                      Development Scope
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="PO Received" value={project?.OrderMongoId.poReceived} />
                    <Info label="Order Number" value={project?.OrderMongoId.orderNumber} />
                    <Info label="Order Date" value={project?.OrderMongoId.orderDate} />
                    <Info label="Delivery Date" value={project?.OrderMongoId.deleveryDate} />
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {["documents", "logic", "scada", "testing"].map((phase) => {
            const key = phase.toLowerCase();
            return (
              <div
                key={phase}
                className="p-5 bg-linear-to-br from-gray-50 to-gray-100/50 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-4 capitalize flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  {phase} Phase
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required={true}
                      value={formData[key].startDate}
                      onChange={(e) =>
                        handleChange(key, "startDate", e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      // required={true}
                      value={formData[key].endDate}
                      onChange={(e) =>
                        handleChange(key, "endDate", e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {phase !== "documents" && (
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700 mb-3  items-center gap-2">
                      <svg
                        className="w-5 h-5 text-teal-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      Select Engineers
                    </label>

                    {formData[key].engineers?.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {formData[key].engineers.map((engId) => {
                          const fullName = getEngineerName(engId);
                          const shortName = truncateName(fullName);
                          return (
                            <span
                              key={engId}
                              title={fullName}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-teal-100 to-cyan-100 text-teal-800 text-sm rounded-full shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer border border-teal-200"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium">{shortName}</span>
                              <button
                                type="button"
                                onClick={() => removeEngineer(key, engId)}
                                className="ml-1 hover:bg-teal-200 rounded-full p-0.5 transition-colors"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Engineer List with Styled Checkboxes */}
                    <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 bg-white shadow-inner">
                      {engineersList.length === 0 ? (
                        <div className="text-center py-8">
                          <svg
                            className="w-12 h-12 text-gray-300 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <p className="text-sm text-gray-400">
                            No engineers available
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {engineersList.map((engineer) => {
                            const isChecked = formData[key].engineers?.includes(
                              engineer._id
                            );
                            const fullName =
                              engineer.username ||
                              engineer.name ||
                              engineer.email;
                            const shortName = truncateName(fullName);
                            return (
                              <label
                                key={engineer._id}
                                title={fullName}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${isChecked
                                  ? "bg-teal-50 border-teal-300 shadow-sm"
                                  : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                                  }`}
                              >
                                <div className="relative shrink-0">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() =>
                                      handleEngineerToggle(key, engineer._id)
                                    }
                                    className="peer sr-only"
                                  />
                                  <div
                                    className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${isChecked
                                      ? "bg-teal-400 border-teal-400"
                                      : "bg-white border-gray-300"
                                      }`}
                                  >
                                    {isChecked && (
                                      <svg
                                        className="w-3.5 h-3.5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={3}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isChecked ? "bg-teal-100" : "bg-gray-100"
                                      }`}
                                  >
                                    <svg
                                      className={`w-5 h-5 ${isChecked
                                        ? "text-teal-600"
                                        : "text-gray-500"
                                        }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <span
                                    className={`text-sm font-medium ${isChecked
                                      ? "text-teal-700"
                                      : "text-gray-700"
                                      }`}
                                  >
                                    {shortName}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Planning Details */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Planning Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Add important notes for ${phase} phase...`}
                    value={formData[key].planDetails}
                    onChange={(e) =>
                      handleChange(key, "planDetails", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            );
          })}

          {/* Buttons */}
          <div className="pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transition-all font-medium"
            >
              create software development plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectTimelineForm;
