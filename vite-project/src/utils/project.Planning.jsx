import React, { useEffect, useState } from "react";
import { useAppContext } from "../appContex";
import toast from "react-hot-toast";
import axios from "axios";

const ProjectTimelineForm = ({ open, onClose, project }) => {
  const { user } = useAppContext();

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
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/planningDev/fetchbyid/${id}`
        );
        const defaultData = res.data?.data || {};
        defaultData?.upatedBy?.username &&
          setName(defaultData.upatedBy.username);

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
  }, [project?.PlanDetails]);

  useEffect(() => {
    const fetchEngineerData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/engineer/getAllEngineers`
        );
        setEngineersList(res.data?.engineers || res.data?.data || []);
      } catch (err) {
        console.error("Error fetching engineer data:", err);
        toast.error("Failed to load engineers");
      }
    };

    fetchEngineerData();
  }, []);

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
    console.log({
      ...formData,
      projectId: project._id,
      JobNumber: project.JobNumber,
      useId: user?._id,
    });
    return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/planningDev/save`,
        {
          ...formData,
          projectId: project._id,
          JobNumber: project.JobNumber,
          useId: user?._id,
        },
        { withCredentials: true }
      );
      toast.success("Plan saved successfully");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-sm p-4">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {["documents", "logic", "scada", "testing"].map((phase) => {
            const key = phase.toLowerCase();
            return (
              <div
                key={phase}
                className="p-5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-4 capitalize flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  {phase} Phase
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
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
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
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
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 text-sm rounded-full shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer border border-teal-200"
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
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                                  isChecked
                                    ? "bg-teal-50 border-teal-300 shadow-sm"
                                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                                }`}
                              >
                                <div className="relative flex-shrink-0">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() =>
                                      handleEngineerToggle(key, engineer._id)
                                    }
                                    className="peer sr-only"
                                  />
                                  <div
                                    className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                                      isChecked
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
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      isChecked ? "bg-teal-100" : "bg-gray-100"
                                    }`}
                                  >
                                    <svg
                                      className={`w-5 h-5 ${
                                        isChecked
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
                                    className={`text-sm font-medium ${
                                      isChecked
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
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transition-all font-medium"
            >
              Save Timeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectTimelineForm;
