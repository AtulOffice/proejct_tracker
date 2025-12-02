import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getStatus, statusSave } from "../utils/apiCall.Dev";
import toast from "react-hot-toast";
import { useAppContext } from "../appContex";
import { CheckboxField, InputField, SelectField } from "../utils/dev.add";
import {
  documentRows,
  logicRows,
  projectRows,
  screenRows,
  testingRows,
} from "../utils/dev.context";
import { mapFrontendToBackend } from "../utils/frontToback";
import { validateFormData } from "../utils/validator";
import { ProgressBar } from "../utils/progressBar";
import {
  handleDocumentRowChange,
  handleLogicRowChange,
  handleProjectRowChange,
  handleScreenRowChange,
  handleTestingRowChange,
} from "../utils/handeler.dev";
import { mapBackendToFrontend } from "../utils/backTofront";

const ProjectdevlopForm = () => {
  const nevigate = useNavigate();
  const location = useLocation();
  const { jobnumber } = useParams();
  const { setToggleDev, user } = useAppContext();

  const [plans, setPlans] = useState(null);
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendData = await getStatus(jobnumber);
        const frontendData = mapBackendToFrontend(backendData?.data);
        backendData?.data && setFormData(frontendData);
        backendData?.data?.PlanDetails &&
          setPlans(backendData?.data?.PlanDetails);
        toast.success("Data fetched successfully!");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateFormData(formData);
    if (!isValid) {
      toast.error("⚠️ Please check the form: some fields are missing");
      return;
    }

    try {
      const data = mapFrontendToBackend(formData, jobnumber);

      const response = await statusSave({ data });
      if (response?.success) {
        setFormData({
          document: { rows: documentRows() },
          screen: { rows: screenRows() },
          logic: { rows: logicRows() },
          testing: { rows: testingRows() },
          project: { rows: projectRows() },
        });

        response?.success && nevigate(`/page`);
        setToggleDev((prev) => !prev);
        toast.success("Data saved successfully!");
      }
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error.data.message || "❌ Failed to save project status");
      } else {
        toast.error("❌ Unexpected error. Please try again.");
      }
      console.error("Error submitting form:", error);
    }
  };

  if (!location.state?.fromButton) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          <h1 className="truncate text-4xl md:text-5xl font-black mb-4 text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text drop-shadow-sm">
            {formData.project.rows[0]?.projectName
              ? formData.project.rows[0]?.projectName?.toUpperCase()
              : "PROJECT DEVELOPMENT STATUS"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {user?.role === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl shadow-lg overflow-hidden border border-red-200"
            >
              <div className="bg-gradient-to-r from-blue-200 to-indigo-400 p-6 flex justify-between items-center rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📄</span>
                  <h2 className="text-xl font-bold text-white">DOCUMENTS</h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-white text-sm">
                  <div>
                    <span className="font-semibold">Start:</span>{" "}
                    {plans?.documents?.startDate
                      ? new Date(plans.documents.startDate).toLocaleDateString()
                      : "—"}
                  </div>
                  <div>
                    <span className="font-semibold">End:</span>{" "}
                    {plans?.documents?.endDate
                      ? new Date(plans.documents.endDate).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="hidden md:grid grid-cols-6 gap-4 mb-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-800">
                  <div className="flex items-center">📋 Task Title</div>
                  <div className="flex items-center">✅ Required Status</div>
                  <div className="flex items-center">📅 Start Date</div>
                  <div className="flex items-center">🏁 End Date</div>
                  <div className="flex items-center">⏱️ Days Consumed</div>
                  <div className="flex items-center justify-center">
                    🎯 Status
                  </div>
                </div>
                <div className="space-y-3">
                  {formData.document.rows.map((row, i) => (
                    <motion.div
                      key={`document-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="grid grid-cols-1 md:grid-cols-6 gap-4 p-5 bg-gradient-to-r from-white to-blue-50/30 rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200 group"
                    >
                      <span className="text-sm font-semibold text-gray-800 bg-blue-200 px-3 py-2 rounded-lg border border-blue-100">
                        {row.title || `Task ${i + 1}`}
                      </span>
                      <SelectField
                        value={row.Reqiredval || "YES"}
                        onChange={(e) =>
                          handleDocumentRowChange(
                            i,
                            { ...row, Reqiredval: e.target.value },
                            setFormData
                          )
                        }
                        options={[
                          { value: "YES", label: "✅ YES" },
                          { value: "NO", label: "❌ NO" },
                          { value: "N/A", label: "➖ N/A" },
                        ]}
                      />
                      <div
                        className={`${
                          row.Reqiredval === "N/A" ? "invisible h-0" : ""
                        }`}
                      >
                        <InputField
                          type="date"
                          value={row.startDate}
                          onChange={(e) =>
                            handleDocumentRowChange(
                              i,
                              { ...row, startDate: e.target.value },
                              setFormData
                            )
                          }
                        />
                      </div>
                      <div
                        className={`${
                          !row.completed || row.Reqiredval === "N/A"
                            ? "invisible h-0"
                            : ""
                        }`}
                      >
                        <InputField
                          type="date"
                          value={row.endDate}
                          onChange={(e) =>
                            handleDocumentRowChange(
                              i,
                              { ...row, endDate: e.target.value },
                              setFormData
                            )
                          }
                          disabled={!row.completed}
                        />
                      </div>
                      <div
                        className={`${
                          !row.completed || row.Reqiredval === "N/A"
                            ? "invisible h-0"
                            : ""
                        }`}
                      >
                        <InputField
                          type="number"
                          value={row.daysConsumed}
                          onChange={(e) =>
                            handleDocumentRowChange(
                              i,
                              {
                                ...row,
                                daysConsumed: e.target.value,
                              },
                              setFormData
                            )
                          }
                          placeholder="0"
                          disabled={!row.completed}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <div
                          className={`bg-white rounded-lg p-2 border border-gray-200 shadow-sm ${
                            row.Reqiredval === "N/A" ? "invisible h-0" : ""
                          }`}
                        >
                          <CheckboxField
                            label="Complete"
                            checked={row.completed}
                            onChange={(e) =>
                              handleDocumentRowChange(
                                i,
                                {
                                  ...row,
                                  completed: e.target.checked,
                                  ...(e.target.checked
                                    ? {}
                                    : { endDate: "", daysConsumed: "" }),
                                },
                                setFormData
                              )
                            }
                          />
                        </div>
                        <div
                          className={`${
                            !row.completed || row.Reqiredval === "N/A"
                              ? "invisible h-0"
                              : ""
                          }`}
                        >
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                row.completed
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500 w-full"
                                  : "bg-gradient-to-r from-blue-300 to-blue-400 w-1/5"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl shadow-lg overflow-hidden border border-red-200"
          >
            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-6 flex justify-between items-center rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🖥️</span>
                <h2 className="text-xl font-bold text-white">Screen</h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-white text-sm">
                <div>
                  <span className="font-semibold">Start:</span>{" "}
                  {plans?.scada?.startDate
                    ? new Date(plans?.scada?.startDate).toLocaleDateString()
                    : "—"}
                </div>
                <div>
                  <span className="font-semibold">End:</span>{" "}
                  {plans?.scada?.endDate
                    ? new Date(plans.scada.endDate).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="hidden md:grid grid-cols-5 gap-4 mb-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-800">
                <div className="flex items-center">📋 Task Title</div>
                <div className="flex items-center">📅 Start Date</div>
                <div className="flex items-center">🏁 End Date</div>
                <div className="flex items-center">⏱️ Days Consumed</div>
                <div className="flex items-center justify-center">
                  🎯 Status
                </div>
              </div>
              <div className="space-y-3">
                {formData.screen.rows.map((row, i) => (
                  <motion.div
                    key={`document-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 bg-gradient-to-r from-white to-blue-50/30 rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200 group"
                  >
                    <span className="text-sm font-semibold text-gray-800 bg-blue-200 px-3 py-2 rounded-lg border border-blue-100">
                      {row.title || `Task ${i + 1}`}
                    </span>
                    <InputField
                      type="date"
                      value={row.startDate}
                      onChange={(e) =>
                        handleScreenRowChange(
                          i,
                          { ...row, startDate: e.target.value },
                          setFormData
                        )
                      }
                    />
                    <div className={`${!row.completed ? "invisible h-0" : ""}`}>
                      <InputField
                        type="date"
                        value={row.endDate}
                        onChange={(e) =>
                          handleScreenRowChange(
                            i,
                            { ...row, endDate: e.target.value },
                            setFormData
                          )
                        }
                        disabled={!row.completed}
                      />
                    </div>
                    <div className={`${!row.completed ? "invisible h-0" : ""}`}>
                      <InputField
                        type="number"
                        value={row.daysConsumed}
                        onChange={(e) =>
                          handleScreenRowChange(
                            i,
                            {
                              ...row,
                              daysConsumed: e.target.value,
                            },
                            setFormData
                          )
                        }
                        placeholder="0"
                        disabled={!row.completed}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                        <CheckboxField
                          label="Complete"
                          checked={row.completed}
                          onChange={(e) =>
                            handleScreenRowChange(
                              i,
                              {
                                ...row,
                                completed: e.target.checked,
                                ...(e.target.checked
                                  ? {}
                                  : { endDate: "", daysConsumed: "" }),
                              },
                              setFormData
                            )
                          }
                        />
                      </div>
                      <div
                        className={`${!row.completed ? "invisible h-0" : ""}`}
                      >
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              row.completed
                                ? "bg-gradient-to-r from-green-400 to-emerald-500 w-full"
                                : "bg-gradient-to-r from-blue-300 to-blue-400 w-1/5"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* LOGIC SECTION */}
          {user?.role === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl shadow-lg overflow-hidden border border-red-200"
            >
              <div className="bg-gradient-to-r from-blue-200 to-indigo-400 p-6 flex justify-between items-center rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📄</span>
                  <h2 className="text-xl font-bold text-white">Logic</h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-white text-sm">
                  <div>
                    <span className="font-semibold">Start:</span>{" "}
                    {plans?.logic?.startDate
                      ? new Date(plans.logic.startDate).toLocaleDateString()
                      : "—"}
                  </div>
                  <div>
                    <span className="font-semibold">End:</span>{" "}
                    {plans?.logic?.endDate
                      ? new Date(plans.logic.endDate).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="hidden md:grid grid-cols-5 gap-4 mb-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-800">
                  <div className="flex items-center">📋 Task Title</div>
                  <div className="flex items-center">📅 Start Date</div>
                  <div className="flex items-center">🏁 End Date</div>
                  <div className="flex items-center">⏱️ Days Consumed</div>
                  <div className="flex items-center justify-center">
                    🎯 Status
                  </div>
                </div>
                <div className="space-y-3">
                  {formData.logic.rows.map((row, i) => (
                    <motion.div
                      key={`logic-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 bg-gradient-to-r from-white to-blue-50/30 rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200 group"
                    >
                      <span className="text-sm font-semibold text-gray-800 bg-blue-200 px-3 py-2 rounded-lg border border-blue-100">
                        {row.title || `Task ${i + 1}`}
                      </span>
                      <InputField
                        type="date"
                        value={row.startDate}
                        onChange={(e) =>
                          handleLogicRowChange(
                            i,
                            { ...row, startDate: e.target.value },
                            setFormData
                          )
                        }
                      />

                      <div
                        className={`${!row.completed ? "invisible h-0" : ""}`}
                      >
                        <InputField
                          type="date"
                          value={row.endDate}
                          onChange={(e) =>
                            handleLogicRowChange(
                              i,
                              { ...row, endDate: e.target.value },
                              setFormData
                            )
                          }
                          disabled={!row.completed}
                        />
                      </div>
                      <div
                        className={`${!row.completed ? "invisible h-0" : ""}`}
                      >
                        <InputField
                          type="number"
                          value={row.daysConsumed}
                          onChange={(e) =>
                            handleLogicRowChange(
                              i,
                              {
                                ...row,
                                daysConsumed: e.target.value,
                              },
                              setFormData
                            )
                          }
                          placeholder="0"
                          disabled={!row.completed}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                          <CheckboxField
                            label="Complete"
                            checked={row.completed}
                            onChange={(e) =>
                              handleLogicRowChange(
                                i,
                                {
                                  ...row,
                                  completed: e.target.checked,
                                  ...(e.target.checked
                                    ? {}
                                    : { endDate: "", daysConsumed: "" }),
                                },
                                setFormData
                              )
                            }
                          />
                        </div>
                        <div
                          className={`${!row.completed ? "invisible h-0" : ""}`}
                        >
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                row.completed
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500 w-full"
                                  : "bg-gradient-to-r from-blue-300 to-blue-400 w-1/5"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TESTING SECTION */}
          {user?.role === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl shadow-lg overflow-hidden border border-red-200"
            >
              <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-6 flex justify-between items-center rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🧪</span>
                  <h2 className="text-xl font-bold text-white">Testing</h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-white text-sm">
                  <div>
                    <span className="font-semibold">Start:</span>{" "}
                    {plans?.testing?.startDate
                      ? new Date(plans.testing.startDate).toLocaleDateString()
                      : "—"}
                  </div>
                  <div>
                    <span className="font-semibold">End:</span>{" "}
                    {plans?.testing?.endDate
                      ? new Date(plans.testing.endDate).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="hidden md:flex justify-between items-center mb-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-800">
                  <div className="flex items-center">📋 Task Title</div>
                  <div className="flex items-center">🎯 Status</div>
                </div>

                <div className="space-y-3">
                  {formData.testing.rows.map((row, i) => (
                    <motion.div
                      key={`testing-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex justify-between items-center p-5 bg-gradient-to-r from-white to-blue-50/30 rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200 group"
                    >
                      <span className="text-sm font-semibold text-gray-800 bg-blue-200 px-3 py-2 rounded-lg border border-blue-100">
                        {row.title || `Task ${i + 1}`}
                      </span>
                      <div className="flex flex-col items-end gap-3">
                        <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                          <CheckboxField
                            label="Complete"
                            checked={row.completed}
                            onChange={(e) =>
                              handleTestingRowChange(
                                i,
                                {
                                  ...row,
                                  completed: e.target.checked,
                                  ...(e.target.checked
                                    ? {}
                                    : { endDate: "", daysConsumed: "" }),
                                },
                                setFormData
                              )
                            }
                          />
                        </div>
                        <div
                          className={`${
                            !row.completed ? "invisible h-0" : "w-full"
                          }`}
                        >
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                row.completed
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500 w-full"
                                  : "bg-gradient-to-r from-blue-300 to-blue-400 w-1/5"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* the project details */}
          {user?.role === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl shadow-lg overflow-hidden border border-red-200"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-800">
                  <div className="flex items-center">📋 Job Number</div>
                  <div className="flex items-center">📅 Start Date</div>
                  <div className="flex items-center">🏁 End Date</div>
                  <div className="flex items-center">⏱️ Days Consumed</div>
                  <div className="flex items-center justify-center">
                    🎯 Status
                  </div>
                </div>
                <div className="space-y-3">
                  {formData.project.rows.map((row, i) => (
                    <motion.div
                      key={`logic-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 bg-gradient-to-r from-white to-blue-50/30 rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200 group"
                    >
                      <span className="text-sm font-semibold text-gray-800 bg-blue-200 px-3 py-2 rounded-lg border border-blue-100">
                        {row.JobNumber || ""}
                      </span>
                      <InputField
                        type="date"
                        value={row.startDate}
                        onChange={(e) =>
                          handleProjectRowChange(
                            i,
                            { ...row, startDate: e.target.value },
                            setFormData
                          )
                        }
                      />

                      <div
                        className={`${!row.completed ? "invisible h-0" : ""}`}
                      >
                        <InputField
                          type="date"
                          value={row.endDate}
                          onChange={(e) =>
                            handleProjectRowChange(
                              i,
                              { ...row, endDate: e.target.value },
                              setFormData
                            )
                          }
                          disabled={!row.completed}
                        />
                      </div>
                      <div
                        className={`${!row.completed ? "invisible h-0" : ""}`}
                      >
                        <InputField
                          type="number"
                          value={row.daysConsumed}
                          onChange={(e) =>
                            handleProjectRowChange(
                              i,
                              {
                                ...row,
                                daysConsumed: e.target.value,
                              },
                              setFormData
                            )
                          }
                          placeholder="0"
                          disabled={!row.completed}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                          <CheckboxField
                            label="Complete"
                            checked={row.completed}
                            onChange={(e) =>
                              handleProjectRowChange(
                                i,
                                {
                                  ...row,
                                  completed: e.target.checked,
                                  ...(e.target.checked
                                    ? {}
                                    : { endDate: "", daysConsumed: "" }),
                                },
                                setFormData
                              )
                            }
                          />
                        </div>

                        <div
                          className={`${!row.completed ? "invisible h-0" : ""}`}
                        >
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                row.completed
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500 w-full"
                                  : "bg-gradient-to-r from-blue-300 to-blue-400 w-1/5"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              SAVE
            </button>
          </div>
        </form>
        <ProgressBar formData={formData} />
      </div>
    </div>
  );
};

export default ProjectdevlopForm;
