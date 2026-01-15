import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { engineerWeek } from "../utils/engineerWeek";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { saveWeeklyAssment } from "../apiCall/assesMent.Api";
import apiClient from "../api/axiosClient";

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
  const [engineers, setEngineers] = useState(engineerWeek);
  const [tasksByDate, setTasksByDate] = useState({});
  const [newEngineerName, setNewEngineerName] = useState("");

  const handleDateChange = (date) => {
    if (!date) return;
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const day = utcDate.getUTCDay();
    if (day !== 1) {
      toast.error("Please select a Monday only!");
      setWeekStart(null);
      return;
    }
    setWeekStart(utcDate);
  };

  const FetchData = async (weekStart) => {
    try {
      const res = await apiClient.get(`/devrecord/fetch?weekStart=${weekStart}`);
      toast.success("Existing tasks loaded");
      return res?.data?.data?.assignments || {};
    } catch (e) {
      if (e.response) {
        toast.success(
          e.response?.data?.message + " " + "please enter new tasks details"
        );
      }
      console.error("Error fetching existing tasks:", e);
      return {};
    }
  };

  useEffect(() => {
    if (!weekStart) return;
    const fetchTasks = async () => {
      const fetchval = await FetchData(weekStart);
      const startDate = new Date(weekStart);
      const tempTasks = {};

      days.forEach((day, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        const dateKey = date.toISOString().split("T")[0];

        tempTasks[dateKey] = {};

        engineers.forEach((eng) => {
          const dayAssignments = fetchval?.[day] || [];
          const existingTaskObj = dayAssignments.find(
            (a) => a.engineerId === eng.engineerId
          );

          tempTasks[dateKey][eng.engineerId] = [
            existingTaskObj ? existingTaskObj.tasks : "",
          ];
        });
      });
      setTasksByDate(tempTasks);
    };
    fetchTasks();
  }, [weekStart, engineers]);
  const handleTaskChange = (date, engineerId, value, idx) => {
    const temp = { ...tasksByDate };
    temp[date][engineerId][idx] = value;
    setTasksByDate(temp);
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
    setNewEngineerName("");
  };

  const removeEngineer = (engineerId) => {
    if (engineers.length === 1) {
      toast.error("Cannot remove the last engineer");
      return;
    }

    setEngineers(engineers.filter((eng) => eng.engineerId !== engineerId));

    const temp = { ...tasksByDate };
    Object.keys(temp).forEach((date) => {
      delete temp[date][engineerId];
    });
    setTasksByDate(temp);
  };

  const handleSubmit = async () => {
    try {
      const response = await saveWeeklyAssment({
        weekStart,
        engineers,
        tasksByDate,
      });
      toast.success(response?.message || "operation success");
      setWeekStart("");
      setNewEngineerName("");
      const clearedTasks = { ...tasksByDate };
      Object.keys(clearedTasks).forEach((date) => {
        Object.keys(clearedTasks[date]).forEach((engId) => {
          clearedTasks[date][engId] = [""];
        });
      });
      setTasksByDate(clearedTasks);
    } catch (e) {
      if (e.response) {
        toast.error(e.response?.data?.message);
      }
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen lg:ml-40 pt-20 bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4 pl-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 rounded-lg bg-[linear-gradient(to_right,#ec4899,#facc15,#4ade80,#60a5fa,#a855f7,#ef4444)]">
            <h2 className="text-3xl font-bold italic bg-clip-text text-transparent bg-[linear-gradient(to_right,#ec4899,#facc15,#4ade80,#60a5fa,#a855f7,#ef4444)]">
              WEEKLY ASSIGNMENT PLANNER
            </h2>
          </div>

          <div className="p-8">
            <div className="mb-8 bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <label className="text-lg font-semibold text-gray-700 block mb-3">
                📅 Select Week Start (Monday)
              </label>
              <DatePicker
                selected={weekStart}
                onChange={handleDateChange}
                placeholderText="Select Monday"
                customInput={
                  <button className="px-4 py-2 border rounded-lg bg-blue-500 text-white">
                    Select Date
                  </button>
                }
                dateFormat="MM-dd-yyyy"
                filterDate={(date) => date.getDay() === 1}
              />
            </div>

            <div className="mb-8 bg-linear-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
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
                  className="bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-sm hover:shadow-md"
                >
                  ➕ Add Engineer
                </button>
              </div>
            </div>

            {weekStart && (
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg font-sans font-medium">
                <table className="w-full border-collapse text-[15px]">
                  <thead>
                    <tr className="bg-linear-to-r from-blue-500/80 to-indigo-500/90 text-white">
                      <th className="border-none px-4 py-4 text-left sticky left-0 bg-linear-to-r from-blue-400/70 to-indigo-400/60 z-10 text-xl font-bold rounded-tl-2xl">
                        Engineer
                      </th>
                      {Object.keys(tasksByDate).map((date) => (
                        <th
                          key={date}
                          className="border-none px-4 py-4 min-w-[200px] text-center"
                        >
                          <div>
                            <span className="block text-xs text-indigo-100 font-normal mb-1">
                              {new Date(date).toLocaleDateString("en-GB", {
                                weekday: "short",
                              })}
                            </span>
                            <span className="block text-lg tracking-wider">
                              {new Date(date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {engineers.map((eng, engIdx) => (
                      <tr
                        key={eng.engineerId}
                        className={`transition ${engIdx % 2 ? "bg-gray-50/60" : "bg-white/90"
                          } hover:bg-indigo-50`}
                      >
                        <td
                          className="sticky left-0 z-10 px-4 py-5 bg-white/80 border-none"
                          style={{
                            borderRadius: engIdx === 0 ? "0 0 0 12px" : "0",
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="font-semibold text-indigo-900 text-base">
                                {eng.engineerName}
                              </div>
                              <div className="text-xs text-indigo-400 italic">
                                {eng.projectName}
                              </div>
                            </div>
                            <button
                              onClick={() => removeEngineer(eng.engineerId)}
                              className="group bg-linear-to-br from-pink-300 to-red-500 hover:from-red-600 hover:to-red-700 text-white w-8 h-8 rounded-lg flex items-center justify-center text-lg transition active:scale-95 shadow hover:shadow-xl"
                              title="Remove engineer"
                            >
                              <span className="group-hover:rotate-90 duration-200 transition-transform">
                                ×
                              </span>
                            </button>
                          </div>
                        </td>
                        {Object.keys(tasksByDate).map((date) => (
                          <td
                            key={date}
                            className="px-3 py-3 align-top border-none"
                            style={{ background: "rgba(248,250,252,0.7)" }}
                          >
                            <div className="space-y-2">
                              {(tasksByDate[date][eng.engineerId] || []).map(
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
                                      className="flex-1 border border-indigo-200 px-3 py-2 rounded-xl text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-indigo-400 resize-none shadow-sm hover:shadow-lg transition"
                                      placeholder="Enter task..."
                                      rows={3}
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
                  className="font-sans bg-linear-to-r from-blue-100 to-indigo-600 hover:from-indigo-600 hover:to-blue-100 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                  💾 SAVE
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
