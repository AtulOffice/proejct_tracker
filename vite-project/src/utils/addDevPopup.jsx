import React, { useState } from "react";
import { CheckCircle, FileText, Package, Users } from "lucide-react";

const ENUMVAL = ["YES", "NO", "N/A"];

const FIELD_LABELS = {
    internalDocuments: {
        panelGA: "Panel GA",
        wiringDiagram: "Wiring Diagram",
        ioList: "I/O List",
        systemConfiguration: "System Configuration",
        cableSchedule: "Cable Schedule",
        logicSchedule: "Logic Schedule",
        logicBackup: "Logic Backup",
        scada: "SCADA",
    },
    customerDocuments: {
        pAndIDs: "P&IDs",
        controlPhilosophy: "Control Philosophy",
        anyOther: "Any Other",
    },
    dispatchDocuments: {
        packingList: "Packing List",
        deliveryChallan: "Delivery Challan",
        anyOther: "Any Other",
    },
};

export default function DocumentChecklist() {
    const [form, setForm] = useState({
        internalDocuments: {
            panelGA: "",
            wiringDiagram: "",
            ioList: "",
            systemConfiguration: "",
            cableSchedule: "",
            logicSchedule: "",
            logicBackup: "",
            scada: "",
        },
        customerDocuments: {
            pAndIDs: "",
            controlPhilosophy: "",
            anyOther: "",
        },
        dispatchDocuments: {
            packingList: "",
            deliveryChallan: "",
            anyOther: "",
        },
    });

    const calculateProgress = () => {
        const allFields = [
            ...Object.values(form.internalDocuments),
            ...Object.values(form.customerDocuments),
            ...Object.values(form.dispatchDocuments),
        ];
        const filled = allFields.filter(Boolean).length;
        return Math.round((filled / allFields.length) * 100);
    };

    const getSectionProgress = (section) => {
        const fields = Object.values(form[section]);
        const filled = fields.filter(Boolean).length;
        return { filled, total: fields.length };
    };

    const handleChange = (section, field, value) => {
        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const renderRadioGroup = (section, field, label) => {
        const value = form[section][field];
        return (
            <div
                key={`${section}-${field}`}
                className="group flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg mb-2 border border-gray-200 transition-all duration-200"
            >
                <label className="text-sm font-medium text-gray-700 tracking-wide flex items-center gap-2">
                    {value && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {label}
                </label>
                <div className="flex gap-2">
                    {ENUMVAL.map((val) => (
                        <label
                            key={val}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-200 ${form[section][field] === val
                                ? val === "YES"
                                    ? "bg-green-500 text-white shadow-md"
                                    : val === "NO"
                                        ? "bg-red-500 text-white shadow-md"
                                        : "bg-amber-500 text-white shadow-md"
                                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            <input
                                type="radio"
                                name={`${section}-${field}`}
                                value={val}
                                checked={form[section][field] === val}
                                onChange={() => handleChange(section, field, val)}
                                className="sr-only"
                            />
                            {val}
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    const renderSection = (title, sectionKey, icon) => {
        const { filled, total } = getSectionProgress(sectionKey);
        const progress = Math.round((filled / total) * 100);

        return (
            <section className="mb-6 bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {icon}
                        <h3 className="text-gray-800 font-bold text-base">{title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">
                            {filled}/{total}
                        </span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
                {Object.keys(form[sectionKey]).map((field) =>
                    renderRadioGroup(sectionKey, field, FIELD_LABELS[sectionKey][field])
                )}
            </section>
        );
    };

    const progress = calculateProgress();

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <header className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-xl">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <FileText className="w-7 h-7" />
                    DocumentS Recieved
                </h2>
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">Overall Progress</span>
                        <span className="text-sm font-bold text-white">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-blue-900/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-500 shadow-lg"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </header>

            <div className="p-6">
                {renderSection(
                    "Internal Design Documents",
                    "internalDocuments",
                    <FileText className="w-5 h-5 text-blue-500" />
                )}
                {renderSection(
                    "Customer Documents",
                    "customerDocuments",
                    <Users className="w-5 h-5 text-purple-500" />
                )}
                {renderSection(
                    "Dispatch Documents",
                    "dispatchDocuments",
                    <Package className="w-5 h-5 text-amber-500" />
                )}
            </div>

            <footer className="bg-gray-50 p-4 border-t border-gray-200 rounded-b-xl">
                <p className="text-sm text-gray-600">
                    {progress === 100 ? (
                        <span className="text-green-600 font-semibold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            All documents verified!
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                            Fill in all fields to complete the checklist
                        </span>
                    )}
                </p>
            </footer>
        </div>
    );
}