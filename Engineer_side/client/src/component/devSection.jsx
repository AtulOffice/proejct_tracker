import React from "react";
import { motion } from "framer-motion";
import { CheckboxField, InputField, SelectField } from "../utils/dev.add";

export const Section = ({
    title,
    icon,
    gradient,
    columns,
    rows,
    onRowChange,
    sectionKey,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl shadow-lg overflow-hidden border border-red-200"
        >
            <div className={`p-6 flex items-center space-x-3 ${gradient}`}>
                <span className="text-2xl">{icon}</span>
                <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-800">
                    {columns.map((col, i) => (
                        <div key={i} className="flex items-center justify-center md:justify-start">
                            {col}
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    {rows.map((row, i) => (
                        <motion.div
                            key={`${sectionKey}-${i}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-6 gap-4 p-5 bg-gradient-to-r from-white to-blue-50/30 rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200 group"
                        >

                            <span className="text-sm font-semibold text-gray-800 bg-blue-200 px-3 py-2 rounded-lg border border-blue-100">
                                {row.title || `Task ${i + 1}`}
                            </span>

                            {title === "DOCUMENTS" && (
                                <SelectField
                                    value={row.Reqiredval || "YES"}
                                    onChange={(e) =>
                                        onRowChange(i, { ...row, Reqiredval: e.target.value })
                                    }
                                    options={[
                                        { value: "YES", label: "✅ YES" },
                                        { value: "NO", label: "❌ NO" },
                                        { value: "N/A", label: "➖ N/A" },
                                    ]}
                                />
                            )}

                            <InputField
                                type="date"
                                value={row.startDate}
                                onChange={(e) =>
                                    onRowChange(i, { ...row, startDate: e.target.value })
                                }
                            />

                            <div className={`${!row.completed ? "invisible h-0" : ""}`}>
                                <InputField
                                    type="date"
                                    value={row.endDate}
                                    onChange={(e) =>
                                        onRowChange(i, { ...row, endDate: e.target.value })
                                    }
                                    disabled={!row.completed}
                                />
                            </div>

                            <div className={`${!row.completed ? "invisible h-0" : ""}`}>
                                <InputField
                                    type="number"
                                    value={row.daysConsumed}
                                    onChange={(e) =>
                                        onRowChange(i, { ...row, daysConsumed: e.target.value })
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
                                            onRowChange(i, {
                                                ...row,
                                                completed: e.target.checked,
                                                ...(e.target.checked
                                                    ? {}
                                                    : { endDate: "", daysConsumed: "" }),
                                            })
                                        }
                                    />
                                </div>
                                <div className={`${!row.completed ? "invisible h-0" : ""}`}>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${row.completed
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
    );
};
