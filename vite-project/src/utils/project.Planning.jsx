import React, { useEffect, useState } from "react";
import { useAppContext } from "../appContex";
import toast from "react-hot-toast";
import axios from "axios";

const ProjectTimelineForm = ({ open, onClose, project }) => {
  const { user } = useAppContext();

  const [formData, setFormData] = useState({
    documents: { startDate: "", endDate: "", planDetails: "" },
    logic: { startDate: "", endDate: "", planDetails: "" },
    scada: { startDate: "", endDate: "", planDetails: "" },
    testing: { startDate: "", endDate: "", planDetails: "" },
  });

  const [name, setName] = useState("");

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

  const handleChange = (phase, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      toast.success("plan saved");
      onClose();
      setFormData({
        documents: { startDate: "", endDate: "", planDetails: "" },
        logic: { startDate: "", endDate: "", planDetails: "" },
        scada: { startDate: "", endDate: "", planDetails: "" },
        testing: { startDate: "", endDate: "", planDetails: "" },
      });
    } catch (e) {
      if (e?.response?.message) {
        toast.error(e.response?.message || "somthing went wrong");
      }
      console.log(e);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md max-h-[80vh] overflow-y-auto border border-gray-200 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 transition-all duration-300 scrollbar-glass">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 drop-shadow-sm">
            PROJET TIMELINE
          </h2>
          {name && (
            <p className="text-sm text-gray-500 mt-1">
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
                className="p-4 bg-gray-50 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition"
              >
                <h3 className="font-semibold text-gray-700 mb-3">
                  {phase} Phase
                </h3>

                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData[key].startDate}
                    onChange={(e) =>
                      handleChange(key, "startDate", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData[key].endDate}
                    onChange={(e) =>
                      handleChange(key, "endDate", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Planning
                  </label>
                  <textarea
                    rows={2}
                    placeholder={`Add important notes for ${phase} phase`}
                    value={formData[key].planDetails}
                    onChange={(e) =>
                      handleChange(key, "planDetails", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            );
          })}

          {/* Buttons */}
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
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
