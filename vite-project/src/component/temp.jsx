import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { saveWeeklyAssment } from "../utils/apiCall";
import { engineerWeek } from "../utils/engineerWeek";

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
    const data = {
      weekStart,
      engineers,
      tasksByDate,
    };
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
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg font-sans font-medium">
                <table className="w-full border-collapse text-[15px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500/80 to-indigo-500/90 text-white">
                      <th className="border-none px-4 py-4 text-left sticky left-0 bg-gradient-to-r from-blue-400/70 to-indigo-400/60 z-10 text-xl font-bold rounded-tl-2xl">
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
                        className={`transition ${
                          engIdx % 2 ? "bg-gray-50/60" : "bg-white/90"
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
                              className="group bg-gradient-to-br from-pink-300 to-red-500 hover:from-red-600 hover:to-red-700 text-white w-8 h-8 rounded-lg flex items-center justify-center text-lg transition active:scale-95 shadow hover:shadow-xl"
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
                  className="font-sans bg-gradient-to-r from-blue-100 to-indigo-600 hover:from-indigo-600 hover:to-blue-100 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
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

// import React from "react";
// import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// // === Styles ===
// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "#ffffff",
//     padding: 20,
//     fontFamily: "Helvetica",
//     fontSize: 9,
//   },
//   title: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 15,
//     fontWeight: "bold",
//     color: "#1e40af",
//   },
//   tableContainer: {
//     border: "1 solid #cbd5e1",
//     borderRadius: 4,
//     overflow: "hidden",
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#e0e7ff",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottom: "1 solid #e5e7eb",
//   },
//   headerCell: {
//     flex: 1,
//     textAlign: "center",
//     paddingVertical: 6,
//     paddingHorizontal: 4,
//     fontWeight: "bold",
//     borderRight: "1 solid #cbd5e1",
//   },
//   engineerCell: {
//     flex: 1,
//     paddingVertical: 6,
//     paddingHorizontal: 4,
//     fontWeight: "bold",
//     backgroundColor: "#eef2ff",
//     borderRight: "1 solid #cbd5e1",
//   },
//   dayCell: {
//     flex: 1,
//     paddingVertical: 6,
//     paddingHorizontal: 4,
//     textAlign: "center",
//     wordWrap: "break-word",
//     borderRight: "1 solid #e5e7eb",
//   },
//   footer: {
//     marginTop: 10,
//     fontSize: 8,
//     textAlign: "center",
//     color: "#6b7280",
//   },
// });

// // === Helper: Generate Week Days ===
// const getWeekDaysFromMonday = (weekStart) => {
//   const start = new Date(weekStart);
//   const day = start.getDay();
//   const monday = new Date(start);
//   monday.setDate(start.getDate() - ((day + 6) % 7));

//   const weekdays = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   return weekdays.map((weekday, i) => {
//     const d = new Date(monday);
//     d.setDate(monday.getDate() + i);
//     const dateLabel = d.toLocaleDateString("en-GB").split("/").join("-");
//     return `${weekday}\n${dateLabel}`; // Two-line header
//   });
// };

// // === Helper: Extract Unique Engineers & Days ===
// const prepareTableData = (assignmentsArray) => {
//   const days = assignmentsArray.map((d) => d.date);
//   const engineerMap = {};

//   assignmentsArray.forEach((dayData) => {
//     dayData.engineers.forEach((eng) => {
//       const name = eng.engineerName || eng.engineerId || "Unknown";
//       if (!engineerMap[name]) engineerMap[name] = {};
//       engineerMap[name][dayData.date] = eng.projectName
//         ? `${eng.projectName} (${eng.jobNumber || "-"})`
//         : eng.tasks || "-";
//     });
//   });

//   const engineers = Object.keys(engineerMap);
//   return { days, engineers, engineerMap };
// };

// // === Main PDF Document ===
// const AssignmentsPDF = ({ assignmentsArray, weekData }) => {
//   const { days, engineers, engineerMap } = prepareTableData(assignmentsArray);
//   const weekDays = getWeekDaysFromMonday(weekData?.weekStart);

//   return (
//     <Document>
//       <Page size="A4" orientation="landscape" style={styles.page}>
//         {/* Title */}
//         <Text style={styles.title}>
//           Weekly Assignments —{" "}
//           {weekData?.weekStart
//             ? new Date(weekData.weekStart).toLocaleDateString("en-GB")
//             : ""}
//         </Text>

//         {/* Table */}
//         <View style={styles.tableContainer}>
//           {/* Header Row */}
//           {/* Header Row */}
//           <View style={styles.tableHeader}>
//             <Text style={[styles.headerCell, { flex: 1.2 }]}>Engineer</Text>
//             {weekDays.map((dayStr, idx) => {
//               const [weekday, date] = dayStr.split("\n"); // split weekday and date
//               return (
//                 <View
//                   key={idx}
//                   style={[
//                     {
//                       flex: 1,
//                       borderRight:
//                         idx === weekDays.length - 1
//                           ? "none"
//                           : "1 solid #cbd5e1",
//                       alignItems: "center",
//                     },
//                   ]}
//                 >
//                   <Text style={{ fontWeight: "bold" }}>{weekday}</Text>
//                   <Text>{date}</Text>
//                 </View>
//               );
//             })}
//           </View>

//           {/* Engineer Rows */}
//           {engineers.map((eng, eIdx) => (
//             <View key={eIdx} style={styles.tableRow}>
//               <Text style={[styles.engineerCell, { flex: 1.2 }]}>{eng}</Text>
//               {days.map((day, dIdx) => (
//                 <Text
//                   key={dIdx}
//                   style={[
//                     styles.dayCell,
//                     { flex: 1 }, // same as header
//                     dIdx === days.length - 1 ? { borderRight: "none" } : {},
//                   ]}
//                 >
//                   {engineerMap[eng][day] || "-"}
//                 </Text>
//               ))}
//             </View>
//           ))}
//         </View>

//         {/* Footer */}
//         <Text style={styles.footer}>
//           Generated on {new Date().toLocaleDateString("en-GB")}
//         </Text>
//       </Page>
//     </Document>
//   );
// };

// export default AssignmentsPDF;
