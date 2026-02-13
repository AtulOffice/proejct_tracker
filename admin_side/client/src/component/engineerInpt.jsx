import React, { useState, useEffect, Fragment } from "react";
import { X, UserPlus } from "lucide-react";
import { Listbox } from "@headlessui/react";

import { getavailableEngineers } from "../apiCall/engineer.Api";
import { useSelector } from "react-redux";

export const EngineerAssignment = ({ setEngineerData, required = false, AssingnedEngieer = [] }) => {
  console.log(AssingnedEngieer)
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

  const { toggle } = useSelector((state) => state.ui);

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
              <Listbox.Button className="w-full py-2.5 px-4 text-base  rounded-lg shadow bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 text-white focus:outline-none transition">
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
          ${active
                            ? "bg-linear-to-r from-pink-100 via-purple-100 to-indigo-100 text-indigo-700"
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
          bg-linear-to-r from-purple-500/70 via-pink-500/60 to-indigo-500/60
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
        <div className="bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-indigo-600/20 border border-white/20 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-h-[500px] overflow-y-auto relative">
          {/* Shimmer background animation */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {AssingnedEngieer?.length > 0 ? (
            <div className="space-y-4 relative z-10">
              {/* <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-3 sticky top-0 bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-indigo-500/30 backdrop-blur-md py-3 px-4 rounded-xl border border-white/20 shadow-lg">
                <svg className="w-6 h-6 text-purple-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Assigned Engineers ({AssingnedEngieer.length})
              </h3> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2">
                {AssingnedEngieer.map((eng, index) => (
                  <div
                    key={eng.empId || index}
                    className="bg-white border border-slate-700 hover:border-indigo-400/40 rounded-xl p-4 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-semibold text-sm">
                          {eng.empId?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {eng.name || "Engineer"}
                          </p>
                          <p className="text-slate-400 text-xs font-mono">
                            ID: {eng.empId}
                          </p>
                        </div>
                      </div>

                      <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-md border border-indigo-400/20">
                        {eng.durationDays} days
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700 text-xs">
                      <div>
                        <p className="text-slate-400">Start</p>
                        <p className="text-white font-medium">
                          {new Date(eng.assignedAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">End</p>
                        <p className="text-white font-medium">
                          {new Date(eng.endTime).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                ))}
              </div>

            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="relative">
                <svg className="w-20 h-20 text-white/10 drop-shadow-2xl animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 4 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30 animate-ping"></div>
              </div>
              <p className="text-white/70 text-lg font-medium mt-4 drop-shadow-md">No engineers assigned yet</p>
              <p className="text-white/40 text-sm mt-2 backdrop-blur-sm px-4 py-2 bg-white/5 rounded-lg border border-white/10">Engineers will appear here once assigned</p>
            </div>
          )}
        </div>


      )}
    </div>
  );
};
