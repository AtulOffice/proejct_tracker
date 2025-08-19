import React, { useState } from "react";
import { motion } from "framer-motion";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { statusSave } from "../utils/apiCall.Dev";
import toast from "react-hot-toast";
import { useAppContext } from "../appContex";
import { CheckboxField, InputField, SelectField } from "../utils/dev.add";
import { documentRows, logicRows, projectRows, screenRows, testingRows } from "../utils/dev.context";



const ProjectdevlopForm = () => {
    const nevigate = useNavigate()
    const { jobnumber } = useParams();
    const { setToggleDev } = useAppContext();



    const [formData, setFormData] = useState({
        document: {
            rows: documentRows(),
        },
        screen: {
            rows: screenRows()
        },
        logic: {
            rows: logicRows()
        },
        testing: {
            rows: testingRows()
        },
        project: {
            rows: projectRows()
        }
    });
    const handleDocumentRowChange = (rowIndex, newRowData) => {
        const updatedRow = {
            ...newRowData,
            daysConsumed: calculateConsumedDays(newRowData.startDate, newRowData.endDate)
        };
        setFormData(prev => ({
            ...prev,
            document: {
                ...prev.document,
                rows: prev.document.rows.map((row, index) =>
                    index === rowIndex ? updatedRow : row
                )
            }
        }));
    };


    const handleScreenRowChange = (rowIndex, newRowData) => {
        const updatedRow = {
            ...newRowData,
            daysConsumed: calculateConsumedDays(newRowData.startDate, newRowData.endDate)
        };
        setFormData(prev => ({
            ...prev,
            screen: {
                ...prev.screen,
                rows: prev.screen.rows.map((row, index) =>
                    index === rowIndex ? updatedRow : row
                )
            }
        }));
    };

    const handleLogicRowChange = (rowIndex, newRowData) => {
        const updatedRow = {
            ...newRowData,
            daysConsumed: calculateConsumedDays(newRowData.startDate, newRowData.endDate)
        };
        setFormData(prev => ({
            ...prev,
            logic: {
                ...prev.logic,
                rows: prev.logic.rows.map((row, index) =>
                    index === rowIndex ? updatedRow : row
                )
            }
        }));
    };


    const handleTestingRowChange = (rowIndex, newRowData) => {
        const updatedRow = {
            ...newRowData,
            daysConsumed: calculateConsumedDays(newRowData.startDate, newRowData.endDate)
        };
        setFormData(prev => ({
            ...prev,
            testing: {
                ...prev.testing,
                rows: prev.testing.rows.map((row, index) =>
                    index === rowIndex ? updatedRow : row
                )
            }
        }));
    };

    const handleProjectRowChange = (rowIndex, newRowData) => {
        const updatedRow = {
            ...newRowData,
            daysConsumed: calculateConsumedDays(newRowData.startDate, newRowData.endDate)
        };
        setFormData(prev => ({
            ...prev,
            project: {
                ...prev.logic,
                rows: prev.project.rows.map((row, index) =>
                    index === rowIndex ? updatedRow : row
                )
            }
        }));
    };

    const calculateConsumedDays = (startDate, endDate) => {
        if (!startDate || !endDate) return "0";

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end) || end < start) return "0";

        const diffMs = end - start;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;

        return diffDays.toString();
    };


    const mapFrontendToBackend = (formData) => {
        const backend = {
            status: formData.project.rows[0]?.completed || false,
            JobNumber: jobnumber || "",
            startDate: formData.project.rows[0]?.startDate || "",
            endDate: formData.project.rows[0]?.endDate || "",
            DaysConsumed: formData.project.rows[0]?.daysConsumed || "0",

            fileReading: toBackendObj(formData.document.rows[0]),
            pId: toBackendObj(formData.document.rows[1]),
            systemConfig: toBackendObj(formData.document.rows[2]),
            generalArrangement: toBackendObj(formData.document.rows[3]),
            powerWiring: toBackendObj(formData.document.rows[4]),
            moduleWiring: toBackendObj(formData.document.rows[5]),
            ioList: toBackendObj(formData.document.rows[6]),

            alarm: toBackendBoolObj(formData.screen.rows[1]),
            scadaScreen: [
                {
                    title: formData.screen.rows[0]?.title || "SCADA Screen",
                    scadastartDate: formData.screen.rows[0]?.startDate || "",
                    scadaendDate: formData.screen.rows[0]?.endDate || "",
                    scadaconsumedDays: formData.screen.rows[0]?.daysConsumed || "0",
                    status: formData.screen.rows[0]?.completed || false,
                }
            ],
            Trend: toBackendBoolObj(formData.screen.rows[2]),
            dataLog: toBackendBoolObj(formData.screen.rows[3]),


            aiMapping: toBackendBoolObj(formData.logic.rows[0]),
            aoMapping: toBackendBoolObj(formData.logic.rows[1]),
            diMapping: toBackendBoolObj(formData.logic.rows[2]),
            doMapping: toBackendBoolObj(formData.logic.rows[3]),
            oprationalLogic: toBackendBoolObj(formData.logic.rows[4]),
            moduleStatus: toBackendBoolObj(formData.logic.rows[5]),
            redundencyStatus: toBackendBoolObj(formData.logic.rows[6]),

            rangeSet: toBackendObj(formData.testing.rows[0]),
            ioTesting: toBackendObj(formData.testing.rows[1]),
            alarmTest: toBackendObj(formData.testing.rows[2]),
            trendsTest: toBackendObj(formData.testing.rows[3]),
            operationLogic: toBackendObj(formData.testing.rows[4]),
            moduleStatusTest: toBackendObj(formData.testing.rows[5]),
            dlrStatusTest: toBackendObj(formData.testing.rows[6]),
            redundencyStatusTest: toBackendObj(formData.testing.rows[7]),
            // summary: {}
        };

        return backend;
    };

    const toBackendObj = (row) => ({
        ...(row?.Reqiredval && { requireMent: row.Reqiredval }),
        ...(row?.title && { title: row.title }),
        startDate: row?.startDate || "",
        endDate: row?.endDate || "",
        consumedDays: row?.daysConsumed || "0",
        status: row?.completed || false,
    });


    const toBackendBoolObj = (row) => ({
        startDate: row?.startDate || "",
        ...(row?.title && { title: row.title }),
        endDate: row?.endDate || "",
        consumedDays: row?.daysConsumed || "0",
        status: row?.completed || false
    });





    const validateFormData = (formData) => {
        let isValid = true;

        const checkRow = (row, isProject = false, isTime = true) => {
            if (!row) return true;

            const { startDate, endDate, daysConsumed, completed } = row;

            if (isProject && !startDate) {
                isValid = false;
                return false;
            }

            if (isTime && (startDate && endDate && new Date(endDate) < new Date(startDate))) {
                isValid = false;
                return false;
            }

            if (isTime && completed) {
                if (!startDate || !endDate || !daysConsumed || daysConsumed === "0") {
                    isValid = false;
                    return false;
                }
            }

            return true;
        };

        checkRow(formData.project.rows?.[0], true);
        formData.document.rows.forEach(row => checkRow(row));
        formData.screen.rows.forEach(row => checkRow(row));
        formData.logic.rows.forEach(row => checkRow(row));
        formData.testing.rows.forEach(row => checkRow(row, false, false));
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateFormData(formData);
        if (!isValid) {
            toast.error("⚠️ Please check the form: some required fields are missing, start date is after end date, or Project Start Date is missing.");
            return;
        }

        try {
            const data = mapFrontendToBackend(formData, true, jobnumber);
            const response = await statusSave(data);
            if (response?.success) {
                setFormData({
                    document: { rows: documentRows() },
                    screen: { rows: screenRows() },
                    logic: { rows: logicRows() },
                    testing: { rows: testingRows() },
                    project: { rows: projectRows() }
                });

                console.log("Form submitted successfully: status ", response.success);
                nevigate(`/page`);
                setToggleDev(prev => !prev);
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



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text drop-shadow-sm">
                        PROJECT DEVELOPMENT STATUS
                    </h1>

                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* DOCUMENT SECTION */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl shadow-lg overflow-hidden border border-red-200"
                    >
                        <div className="bg-gradient-to-r from-blue-200 to-indigo-400 p-6 flex items-center space-x-3">
                            <span className="text-2xl">📄</span>
                            <h2 className="text-xl font-bold text-white">DOCUMENTS</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-800">
                                <div className="flex items-center">📋 Task Title</div>
                                <div className="flex items-center">✅ Required Status</div>
                                <div className="flex items-center">📅 Start Date</div>
                                <div className="flex items-center">🏁 End Date</div>
                                <div className="flex items-center">⏱️ Days Consumed</div>
                                <div className="flex items-center justify-center">🎯 Status</div>
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
                                                handleDocumentRowChange(i, { ...row, Reqiredval: e.target.value })
                                            }
                                            options={[
                                                { value: "YES", label: "✅ YES" },
                                                { value: "NO", label: "❌ NO" },
                                                { value: "N/A", label: "➖ N/A" },
                                            ]}
                                        />
                                        <div className={`${row.Reqiredval === "N/A" ? "invisible h-0" : ""}`}>
                                            <InputField
                                                type="date"
                                                value={row.startDate}
                                                onChange={(e) =>
                                                    handleDocumentRowChange(i, { ...row, startDate: e.target.value })
                                                }
                                            />

                                        </div>
                                        <div
                                            className={`${!row.completed || row.Reqiredval === "N/A" ? "invisible h-0" : ""
                                                }`}
                                        >
                                            <InputField
                                                type="date"
                                                value={row.endDate}

                                                onChange={(e) =>
                                                    handleDocumentRowChange(i, { ...row, endDate: e.target.value })
                                                }
                                                disabled={!row.completed}
                                            />
                                        </div>
                                        <div
                                            className={`${!row.completed || row.Reqiredval === "N/A" ? "invisible h-0" : ""
                                                }`}
                                        >
                                            <InputField
                                                type="number"
                                                value={row.daysConsumed}
                                                onChange={(e) =>
                                                    handleDocumentRowChange(i, {
                                                        ...row,
                                                        daysConsumed: e.target.value,
                                                    })
                                                }
                                                placeholder="0"
                                                disabled={!row.completed}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div
                                                className={`bg-white rounded-lg p-2 border border-gray-200 shadow-sm ${row.Reqiredval === "N/A" ? "invisible h-0" : ""
                                                    }`}
                                            >
                                                <CheckboxField
                                                    label="Complete"
                                                    checked={row.completed}
                                                    onChange={(e) =>
                                                        handleDocumentRowChange(i, {
                                                            ...row,
                                                            completed: e.target.checked,
                                                            ...(e.target.checked ? {} : { endDate: "", daysConsumed: "" }),
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div
                                                className={`${!row.completed || row.Reqiredval === "N/A" ? "invisible h-0" : ""
                                                    }`}
                                            >
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

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl shadow-lg overflow-hidden border border-red-200"
                    >
                        <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-6">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🖥️</span>
                                <h2 className="text-xl font-bold text-white">Screen</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-800">
                                <div className="flex items-center">📋 Task Title</div>
                                <div className="flex items-center">📅 Start Date</div>
                                <div className="flex items-center">🏁 End Date</div>
                                <div className="flex items-center">⏱️ Days Consumed</div>
                                <div className="flex items-center justify-center">🎯 Status</div>
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
                                                handleScreenRowChange(i, { ...row, startDate: e.target.value })
                                            }
                                        />
                                        <div
                                            className={`${!row.completed ? "invisible h-0" : ""
                                                }`}
                                        >
                                            <InputField
                                                type="date"
                                                value={row.endDate}
                                                onChange={(e) =>
                                                    handleScreenRowChange(i, { ...row, endDate: e.target.value })
                                                }
                                                disabled={!row.completed}
                                            />
                                        </div>
                                        <div
                                            className={`${!row.completed ? "invisible h-0" : ""
                                                }`}
                                        >
                                            <InputField
                                                type="number"
                                                value={row.daysConsumed}
                                                onChange={(e) =>
                                                    handleScreenRowChange(i, {
                                                        ...row,
                                                        daysConsumed: e.target.value,
                                                    })
                                                }
                                                placeholder="0"
                                                disabled={!row.completed}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div
                                                className={`bg-white rounded-lg p-2 border border-gray-200 shadow-sm`}
                                            >
                                                <CheckboxField
                                                    label="Complete"
                                                    checked={row.completed}
                                                    onChange={(e) =>
                                                        handleScreenRowChange(i, {
                                                            ...row,
                                                            completed: e.target.checked,
                                                            ...(e.target.checked ? {} : { endDate: "", daysConsumed: "" }),
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div
                                                className={`${!row.completed ? "invisible h-0" : ""
                                                    }`}
                                            >
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

                    {/* LOGIC SECTION */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl shadow-lg overflow-hidden border border-red-200"
                    >
                        <div className="bg-gradient-to-r from-blue-200 to-indigo-400 p-6 flex items-center space-x-3">
                            <span className="text-2xl">📄</span>
                            <h2 className="text-xl font-bold text-white">LOGIC</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-800">
                                <div className="flex items-center">📋 Task Title</div>
                                <div className="flex items-center">📅 Start Date</div>
                                <div className="flex items-center">🏁 End Date</div>
                                <div className="flex items-center">⏱️ Days Consumed</div>
                                <div className="flex items-center justify-center">🎯 Status</div>
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
                                                handleLogicRowChange(i, { ...row, startDate: e.target.value })
                                            }
                                        />

                                        <div
                                            className={`${!row.completed ? "invisible h-0" : ""
                                                }`}
                                        >
                                            <InputField
                                                type="date"
                                                value={row.endDate}
                                                onChange={(e) =>
                                                    handleLogicRowChange(i, { ...row, endDate: e.target.value })
                                                }
                                                disabled={!row.completed}
                                            />
                                        </div>
                                        <div
                                            className={`${!row.completed ? "invisible h-0" : ""
                                                }`}
                                        >
                                            <InputField
                                                type="number"
                                                value={row.daysConsumed}
                                                onChange={(e) =>
                                                    handleLogicRowChange(i, {
                                                        ...row,
                                                        daysConsumed: e.target.value,
                                                    })
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
                                                        handleLogicRowChange(i, {
                                                            ...row,
                                                            completed: e.target.checked,
                                                            ...(e.target.checked ? {} : { endDate: "", daysConsumed: "" }),
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


                    {/* TESTING SECTION */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl shadow-lg overflow-hidden border border-red-200"
                    >
                        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-6">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🧪</span>
                                <h2 className="text-xl font-bold text-white">Testing</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm font-semibold text-blue-800">
                                <div className="flex items-center">📋 Test Task</div>
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
                                                        handleTestingRowChange(i, {
                                                            ...row,
                                                            completed: e.target.checked,
                                                            ...(e.target.checked ? {} : { endDate: "", daysConsumed: "" }),
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className={`${!row.completed ? "invisible h-0" : "w-full"}`}>
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
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

                    {/* the project details */}
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
                                <div className="flex items-center justify-center">🎯 Status</div>
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
                                            {jobnumber}
                                        </span>
                                        <InputField
                                            type="date"
                                            value={row.startDate}
                                            onChange={(e) =>
                                                handleProjectRowChange(i, { ...row, startDate: e.target.value })
                                            }
                                        />

                                        <div
                                            className={`${!row.completed ? "invisible h-0" : ""
                                                }`}
                                        >
                                            <InputField
                                                type="date"
                                                value={row.endDate}
                                                onChange={(e) =>
                                                    handleProjectRowChange(i, { ...row, endDate: e.target.value })
                                                }
                                                disabled={!row.completed}
                                            />
                                        </div>
                                        <div
                                            className={`${!row.completed ? "invisible h-0" : ""
                                                }`}
                                        >
                                            <InputField
                                                type="number"
                                                value={row.daysConsumed}
                                                onChange={(e) =>
                                                    handleProjectRowChange(i, {
                                                        ...row,
                                                        daysConsumed: e.target.value,
                                                    })
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
                                                        handleProjectRowChange(i, {
                                                            ...row,
                                                            completed: e.target.checked,
                                                            ...(e.target.checked ? {} : { endDate: "", daysConsumed: "" }),
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

                    < div className="flex justify-center pt-8" >
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                        >
                            SAVE
                        </button>
                    </div >
                </form >

                < div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4" >
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Document</span>
                            <span className="text-lg">📄</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{formData.document.rows.filter(row => row.completed).length}/7</div>
                        <div className="text-sm text-gray-500">{Math.round((formData.document.rows.filter(row => row.completed).length / 7) * 100)}% Complete</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Screen</span>
                            <span className="text-lg">🖥️</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{formData.screen.rows.filter(row => row.completed).length}/7</div>
                        <div className="text-sm text-gray-500">{Math.round((formData.screen.rows.filter(row => row.completed).length / 7) * 100)}% Complete</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Logic</span>
                            <span className="text-lg">⚡</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{formData.logic.rows.filter(row => row.completed).length}/7</div>
                        <div className="text-sm text-gray-500">{Math.round((formData.logic.rows.filter(row => row.completed).length / 7) * 100)}% Complete</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Testing</span>
                            <span className="text-lg">🧪</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{formData.testing.rows.filter(row => row.completed).length}/8</div>
                        <div className="text-sm text-gray-500">{Math.round((formData.testing.rows.filter(row => row.completed).length / 8) * 100)}% Complete</div>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default ProjectdevlopForm;
