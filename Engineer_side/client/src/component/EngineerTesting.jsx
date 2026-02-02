import React from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { createProgressReport, fetchPhaseTesting } from "../utils/apiCall";
import { useAppContext } from "../appContext";
import toast from "react-hot-toast";
import {
  calculateDurationInDays,
  calculateProgressDays,
  formatDateDDMMYY,
  toInputDate,
} from "../utils/timeFormatter";
import PhaseProgress from "./phaseProgress";

export default function LogicDevelopmentExecution() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [PhaseData, setPhaseData] = React.useState(null);

  const getInitialFormData = () => ({
    phaseId: "",
    SectionId: "",
    projectId: "",
    submittedBy: "",
    targetStartDate: "",
    targetEndDate: "",
    actualStartDate: "",
    actualEndDate: "",
    reportDate: new Date().toISOString().split("T")[0],
    actualProgressDay: 0,
    actualCompletionPercent: 0,
    remarks: "",
  });
  const [formData, setFormData] = React.useState(getInitialFormData);

  React.useEffect(() => {
    const PhaseTest = async () => {
      const response = await fetchPhaseTesting({ id });
      setPhaseData(response?.data);
    };
    PhaseTest();
  }, [id]);

  React.useEffect(() => {
    if (!PhaseData) return;

    setFormData((prev) => ({
      ...prev,
      projectId: PhaseData.project?._id || "",
      phaseId: PhaseData.phase?._id || "",
      targetStartDate: PhaseData.phase?.startDate || "",
      targetEndDate: PhaseData.phase?.endDate || "",
      submittedBy: user?._id || "",
      SectionId: PhaseData?.SectionId || "",
      actualCompletionPercent:
        PhaseData?.LastphaseProgress?.actualCompletionPercent,
      actualStartDate: toInputDate(
        PhaseData?.LastphaseProgress?.actualStartDate,
      ),
      actualEndDate: toInputDate(PhaseData?.LastphaseProgress?.actualEndDate),
      actualProgressDay: calculateProgressDays(
        PhaseData?.LastphaseProgress?.actualStartDate,
        PhaseData?.LastphaseProgress?.actualEndDate,
      ),
    }));
  }, [PhaseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const isCompleted =
      PhaseData?.LastphaseProgress?.actualCompletionPercent === 100;

    if (
      isCompleted &&
      (name === "actualCompletionPercent" || name === "actualStartDate")
    ) {
      return;
    }

    if (name === "actualCompletionPercent") {
      let num = Math.max(0, Math.min(100, parseInt(value, 10)));

      setFormData((prev) => {
        const endDate =
          num === 100
            ? new Date().toISOString().split("T")[0]
            : prev.actualEndDate;

        const progress = calculateProgressDays(prev.actualStartDate, endDate);
        return {
          ...prev,
          actualCompletionPercent: num,
          actualEndDate: endDate,
          actualProgressDay: progress,
        };
      });
      return;
    }

    if (name === "actualStartDate") {
      setFormData((prev) => {
        const endDate =
          prev.actualCompletionPercent === 100
            ? new Date().toISOString().split("T")[0]
            : prev.actualEndDate;

        const progress = calculateProgressDays(value, endDate);

        return {
          ...prev,
          actualStartDate: value,
          actualEndDate: endDate,
          actualProgressDay: progress,
        };
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.projectId) return "Project is required";
    if (!formData.phaseId) return "phase is required";
    if (!formData.SectionId) return "Section is required";
    if (!formData.actualStartDate) return "Actual start date is required";
    if (
      formData.actualCompletionPercent < 0 ||
      formData.actualCompletionPercent > 100
    )
      return "Completion % must be between 0 and 100";
    if (
      formData.actualCompletionPercent <
      (PhaseData?.phase?.CompletionPercentage ?? 0)
    ) {
      return `Completion percentage must be greater than or equal to the previous value (${PhaseData?.phase?.CompletionPercentage}%).`;
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const payload = {
        ...formData,
        actualProgressDay: calculateProgressDays(
          formData.actualStartDate,
          formData?.actualEndDate,
        ),
      };
      await createProgressReport(payload);
      toast.success("Progress submitted successfully");
      setFormData(getInitialFormData());
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit progress");
    }
  };
  if (!location.state?.fromProject || !id) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border-2 border-white/60 bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border-b-2 border-gray-200 p-8">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {PhaseData?.phase?.sectionName || "—"} TESTING EXECUTION
                </h2>
              </div>
              <span className="flex-shrink-0 rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100 px-5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-lg">
                {PhaseData?.phase.CompletionPercentage} %
              </span>
            </div>
          </div>
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              {/* Target Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-[2px] hover:shadow-2xl hover:shadow-rose-500/50 transition-all duration-300">
                  <div className="relative rounded-2xl bg-white p-5 h-full">
                    <div className="absolute top-0 left-0 w-16 h-16 bg-rose-200 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-4 h-4 text-rose-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                          Target Start
                        </p>
                      </div>
                      <p className="text-xl font-extrabold text-gray-900 group-hover:text-rose-600 transition-colors">
                        {formatDateDDMMYY(PhaseData?.phase?.startDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-[2px] hover:shadow-2xl hover:shadow-rose-500/50 transition-all duration-300">
                  <div className="relative rounded-2xl bg-white p-5 h-full">
                    <div className="absolute top-0 left-0 w-16 h-16 bg-rose-200 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-4 h-4 text-rose-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                          Target End
                        </p>
                      </div>
                      <p className="text-xl font-extrabold text-gray-900 group-hover:text-rose-600 transition-colors">
                        {formatDateDDMMYY(PhaseData?.phase?.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300">
                  <div className="relative rounded-2xl bg-white p-5 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 opacity-50"></div>
                    <div className="relative z-10 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <svg
                          className="w-4 h-4 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                          Duration
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="text-4xl font-black bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                          {calculateDurationInDays(
                            PhaseData?.phase?.startDate,
                            PhaseData?.phase?.endDate,
                          )}
                        </span>
                        <span className="ml-1 text-sm font-bold text-emerald-600">
                          days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <PhaseProgress phase={PhaseData} />

            {/* Actual Dates */}
            <div className="grid grid-cols-3 gap-6 items-end">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                  Actual Start Date
                </label>
                <input
                  type="date"
                  name="actualStartDate"
                  value={formData.actualStartDate}
                  max={new Date().toISOString().split("T")[0]}
                  disabled={!!PhaseData?.LastphaseProgress?.actualStartDate}
                  onChange={handleChange}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-sm transition-all
    ${PhaseData?.LastphaseProgress?.actualStartDate
                      ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "border-amber-300 bg-amber-50 text-amber-900 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    }`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                  Actual End Date
                </label>
                <input
                  className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm"
                  disabled
                  value={formData?.actualEndDate}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                  {formData.actualCompletionPercent === 100
                    ? "# of days"
                    : "current progress days"}
                </label>
                <input
                  className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-3 text-center text-sm font-semibold text-gray-600 shadow-sm"
                  disabled
                  value={formData.actualProgressDay}
                />
              </div>
            </div>

            {/* Current Progress */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                  Actual Completion %
                </label>
                <input
                  type="number"
                  name="actualCompletionPercent"
                  min={0}
                  max={100}
                  disabled={
                    PhaseData?.LastphaseProgress?.actualCompletionPercent ===
                    100
                  }
                  value={formData.actualCompletionPercent}
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()}
                  className="w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900 placeholder:text-amber-500 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all"
                  placeholder="e.g. 45"
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                PROGRESS REPORT
              </label>
              <textarea
                rows={4}
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 placeholder:text-amber-500 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all resize-none"
                placeholder="Add important notes, risks or dependencies related to this section."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                className="group relative px-10 py-5 text-white font-black text-base uppercase tracking-wider rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                  <svg
                    className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  SUBMIT PROGRESS STATUS
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
