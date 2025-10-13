import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const WeeklyAssignmentForm = () => {
  const [weekStart, setWeekStart] = useState("");
  const [engineers, setEngineers] = useState([
    {
      engineerId: "E1",
      engineerName: "REEMA",
      projectName: "",
      scadaOrlogic: false,
      jobNumber: "",
    },
    {
      engineerId: "E2",
      engineerName: "AKASH",
      projectName: "",
      scadaOrlogic: false,
      jobNumber: "",
    },
    {
      engineerId: "E3",
      engineerName: "VISHAL",
      projectName: "",
      scadaOrlogic: false,
      jobNumber: "",
    },
    {
      engineerId: "E4",
      engineerName: "MAHIMA",
      projectName: "",
      scadaOrlogic: false,
      jobNumber: "",
    },
    {
      engineerId: "E5",
      engineerName: "SAPANA",
      projectName: "",
      scadaOrlogic: false,
      jobNumber: "",
    },
    {
      engineerId: "E6",
      engineerName: "BABITA",
      projectName: "",
      scadaOrlogic: false,
      jobNumber: "",
    },
  ]);
  const [tasksByDate, setTasksByDate] = useState({});
  const [newEngineerName, setNewEngineerName] = useState("");

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const day = selectedDate.getDay();

    if (day !== 1) {
      toast.error("Please select a Monday only!");
      setWeekStart("");
      return;
    }

    setWeekStart(e.target.value);
  };

  useEffect(() => {
    if (!weekStart) return;
    const startDate = new Date(weekStart);
    const tempTasks = {};
    days.forEach((day, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      tempTasks[date.toISOString().split("T")[0]] = {};
      engineers.forEach((eng) => {
        if (!tempTasks[date.toISOString().split("T")[0]][eng.engineerId]) {
          tempTasks[date.toISOString().split("T")[0]][eng.engineerId] = [""];
        }
      });
    });
    setTasksByDate(tempTasks);
  }, [weekStart, engineers]);

  const handleTaskChange = (date, engineerId, value, idx) => {
    const temp = { ...tasksByDate };
    temp[date][engineerId][idx] = value;
    setTasksByDate(temp);
  };

  const addTaskRow = (date, engineerId) => {
    const temp = { ...tasksByDate };
    temp[date][engineerId].push("");
    setTasksByDate(temp);
  };

  const removeTaskRow = (date, engineerId, idx) => {
    const temp = { ...tasksByDate };
    if (temp[date][engineerId].length > 1) {
      temp[date][engineerId].splice(idx, 1);
      setTasksByDate(temp);
    }
  };

  const addEngineer = () => {
    if (!newEngineerName.trim()) {
      toast.error("please enter the  name then click add button");
      return;
    }

    const newEngineerId = `E${engineers.length + 1}`;
    const newEngineer = {
      engineerId: newEngineerId,
      engineerName: newEngineerName,
    };

    setEngineers([...engineers, newEngineer]);

    if (weekStart && Object.keys(tasksByDate).length > 0) {
      const temp = { ...tasksByDate };
      Object.keys(temp).forEach((date) => {
        temp[date][newEngineerId] = [""];
      });
      setTasksByDate(temp);
    }
    // Reset form
    setNewEngineerName("");
  };

  const removeEngineer = (engineerId) => {
    if (engineers.length === 1) {
      toast.error("Cannot remove the last engineer");
      return;
    }

    setEngineers(engineers.filter((eng) => eng.engineerId !== engineerId));

    // Remove tasks for this engineer
    const temp = { ...tasksByDate };
    Object.keys(temp).forEach((date) => {
      delete temp[date][engineerId];
    });
    setTasksByDate(temp);
  };

  const handleSubmit = async () => {
    const data = {
      weekStart,
      engineers,
      tasksByDate,
    };
    console.log("Weekly assignments saved successfully", data );
  };

  return (
    <div className="min-h-screen ml-60 pt-20 bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 pl-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 via-yellow-400 via-green-400 via-blue-400 via-purple-500 to-red-500 px-8 py-6 rounded-lg">
            <h2 className="text-3xl font-bold italic inline-block bg-gradient-to-r from-pink-500 via-yellow-400 via-green-400 via-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent">
              WEEKLY ASSIGNMENT PLANNER
            </h2>
          </div>

          <div className="p-8">
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <label className="text-lg font-semibold text-gray-700 block mb-3">
                📅 Select Week Start (Monday)
              </label>
              <input
                type="date"
                value={weekStart}
                onChange={handleDateChange}
                className="w-full md:w-auto border-2 border-blue-300 px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                👤 Add New Engineer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={newEngineerName}
                  onChange={(e) => setNewEngineerName(e.target.value)}
                  placeholder="Engineer Name *"
                  className="border-2 border-green-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
                <button
                  onClick={addEngineer}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-sm hover:shadow-md"
                >
                  ➕ Add Engineer
                </button>
              </div>
            </div>

            {weekStart && (
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-200 to-indigo-600 text-white">
                      <th className="border g-gradient-to-r from-blue-200 to-indigo-600 px-4 py-4 text-white font-semibold text-left sticky left-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-10">
                        Engineer
                      </th>
                      {Object.keys(tasksByDate).map((date) => (
                        <th
                          key={date}
                          className="border border-blue-500 px-4 py-4 text-white font-semibold min-w-[200px]"
                        >
                          <div className="text-center">
                            <div className="text-sm font-normal text-blue-100">
                              {new Date(date).toLocaleDateString("en-GB", {
                                weekday: "short",
                              })}
                            </div>
                            <div className="text-lg">
                              {new Date(date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {engineers.map((eng, engIdx) => (
                      <tr
                        key={eng.engineerId}
                        className={engIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td
                          className="border border-gray-300 px-4 py-4 font-semibold text-gray-800 sticky left-0 z-10"
                          style={{
                            backgroundColor:
                              engIdx % 2 === 0 ? "white" : "#f9fafb",
                          }}
                        >
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-semibold">
                                  {eng.engineerName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {eng.projectName}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeEngineer(eng.engineerId)}
                              className="group relative bg-gradient-to-br from-red-100 to-red-500 hover:from-red-600 hover:to-red-700 text-white w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center text-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                              title="Remove engineer"
                            >
                              <span className="group-hover:rotate-90 transition-transform duration-200">
                                ×
                              </span>
                            </button>
                          </div>
                        </td>
                        {Object.keys(tasksByDate).map((date) => (
                          <td
                            key={date}
                            className="border border-gray-300 px-3 py-3 align-top"
                          >
                            <div className="space-y-2">
                              {tasksByDate[date][eng.engineerId]?.map(
                                (task, idx) => (
                                  <div
                                    key={idx}
                                    className="flex gap-2 items-start w-full"
                                  >
                                    <textarea
                                      value={task}
                                      onChange={(e) =>
                                        handleTaskChange(
                                          date,
                                          eng.engineerId,
                                          e.target.value,
                                          idx
                                        )
                                      }
                                      className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
                                      placeholder="Enter task..."
                                      rows={4}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {weekStart && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                  💾 Save Weekly Assignments
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyAssignmentForm;
