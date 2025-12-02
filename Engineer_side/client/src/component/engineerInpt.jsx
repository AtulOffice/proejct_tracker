import React, { useState, useEffect, Fragment } from "react";
import { X, UserPlus } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { getavailableEngineers } from "../utils/apiCall";
import { useAppContext } from "../appContex";

export const EngineerAssignment = ({ setEngineerData, required = false }) => {
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [days, setDays] = useState("");
  const [date, setDate] = useState("");
  const [engineers, setEngineer] = useState([]);
  const [currentAssignments, setCurrentAssignments] = useState([]);

  const availableEngineers =
    Array.isArray(engineers) && Array.isArray(currentAssignments)
      ? engineers.filter(
          (eng) =>
            !currentAssignments.some(
              (assigned) => assigned.engineerId === eng.id
            )
        )
      : [];

  const handleAddEngineer = () => {
    if (!selectedEngineer || !days || parseInt(days) <= 0 || !date) return;
    const engineer = engineers.find(
      (e) => String(e.id) === String(selectedEngineer)
    );
    if (!engineer) return;
    const newAssignment = {
      engineerId: engineer.id,
      engineerName: engineer.name,
      days: parseInt(days),
      empId: engineer.empId,
      date: date,
      assignedAt: new Date(date).toISOString().split("T")[0],
      endTime: new Date(new Date(date).getTime() + days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    const updatedAssignments = [...currentAssignments, newAssignment];
    setCurrentAssignments(updatedAssignments);
    setEngineerData(updatedAssignments);
    setSelectedEngineer("");
    setDays("");
    setDate("");
  };

  const handleRemoveEngineer = (engineerId) => {
    const updatedAssignments = currentAssignments.filter(
      (eng) => eng.engineerId !== engineerId
    );
    setCurrentAssignments(updatedAssignments);
    setEngineerData(updatedAssignments);
  };

  const { toggle } = useAppContext();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const val = await getavailableEngineers();

        if (val) {
          const engineers =
            val &&
            val?.data.map((item, index) => ({
              id: item._id,
              name: item.name,
              email: item.email,
              phone: item.phone || "",
              empId: item.empId,
            }));
          setEngineer(engineers);
        }
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };
    getProjects();
  }, [toggle]);

  useEffect(() => {
    setSelectedEngineer("");
    setDays("");
    setDate("");
    setCurrentAssignments([]);
  }, [toggle]);
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-white">
        Assign Engineers
        {required && <span className="text-red-500 text-xl ml-1">*</span>}
      </label>

      <div className="bg-white/20 border border-white/40 rounded-lg p-4 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative w-full max-w-xs">
            <Listbox value={selectedEngineer} onChange={setSelectedEngineer}>
              <Listbox.Button className="w-full py-2.5 px-4 text-base  rounded-lg shadow bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white focus:outline-none transition">
                {selectedEngineer
                  ? availableEngineers.find((e) => e.id === selectedEngineer)
                      ?.name || "ENGINEER"
                  : "ENGINEER"}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-2 w-full rounded-xl bg-white shadow-lg ring-1 ring-black/10 z-20 overflow-auto max-h-60 animate-fade-in scrollbar-glass">
                {availableEngineers.map((engineer) => (
                  <Listbox.Option
                    key={engineer.id}
                    value={engineer.id}
                    as={Fragment}
                  >
                    {({ selected, active }) => (
                      <li
                        className={`cursor-pointer select-none px-4 py-3 rounded-lg transition 
          ${
            active
              ? "bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 text-indigo-700"
              : "text-gray-900"
          }
          ${selected ? "font-bold" : ""}`}
                      >
                        {engineer.name}
                        {selected && (
                          <span className="ml-2 text-indigo-600">✔</span>
                        )}
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
          <div>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value.replace(/\D/, ""))}
              min="1"
              placeholder="Days"
              className="bg-white/30 border border-white/40 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black/70"
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <div>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/30 border border-white/40 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddEngineer}
              disabled={
                !selectedEngineer || !days || parseInt(days) <= 0 || !date
              }
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
            </button>
          </div>
        </div>
      </div>
      {currentAssignments && currentAssignments.length > 0 ? (
        <div className="max-h-40 overflow-y-auto flex flex-wrap gap-2 p-1 scrollbar-glass">
          {currentAssignments.map((assignment) => (
            <div
              key={assignment.engineerId}
              className="
          flex items-center gap-2
          bg-gradient-to-r from-purple-500/70 via-pink-500/60 to-indigo-500/60
          border border-white/20
          rounded-full px-3 py-1.5 text-xs text-white
          shadow-md backdrop-blur-sm
          hover:scale-105 hover:shadow-lg transition-all duration-200 group
        "
            >
              <span className="truncate max-w-[90px] font-medium drop-shadow-sm">
                {assignment.engineerName}
              </span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/30 text-white/90 text-[11px] font-bold shadow">
                {assignment.days}d
              </span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/30 text-white/90 text-[11px]">
                {assignment.date}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveEngineer(assignment.engineerId)}
                className="
            ml-1 p-1 rounded-full bg-white/40 backdrop-blur-sm shadow hover:bg-red-500 text-red-700 hover:text-white
            flex items-center justify-center transition-colors duration-150
          "
                title="Remove"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-indigo-400/10 border border-white/30 rounded-lg p-6 text-center shadow-sm">
          <p className="text-white/80 text-sm">No engineers assigned yet</p>
        </div>
      )}
    </div>
  );
};
