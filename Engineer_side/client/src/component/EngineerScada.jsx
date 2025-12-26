import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProgressReport, fetchPhaseScada } from "../utils/apiCall";
import { useAppContext } from "../appContex";
import toast from "react-hot-toast";

export default function LogicDevelopmentExecution() {
    const { id } = useParams()
    const navigate = useNavigate();
    const { user } = useAppContext();
    const [scadaPhaseData, setscadaPhaseData] = React.useState(null);
    const logicval = {
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
    }
    const [formData, setFormData] = React.useState(logicval);
    React.useEffect(() => {
        const PhaseLogic = async () => {
            const response = await fetchPhaseScada({ id })
            setscadaPhaseData(response?.data);
        }
        PhaseLogic()
    }, [])

    React.useEffect(() => {
        if (!scadaPhaseData) return;

        setFormData((prev) => ({
            ...prev,
            projectId: scadaPhaseData.project?._id || "",
            phaseId: scadaPhaseData.phase?._id || "",
            targetStartDate: scadaPhaseData.phase?.startDate || "",
            targetEndDate: scadaPhaseData.phase?.endDate || "",
            submittedBy: user?._id || "",
            SectionId: scadaPhaseData?.SectionId || "",
        }));
    }, [scadaPhaseData]);

    const formatDate = (
        date,
        locale = "en-IN",
        fallback = "—"
    ) => {
        if (!date) return fallback;

        const parsedDate = new Date(date);

        if (isNaN(parsedDate)) return fallback;

        return parsedDate.toLocaleDateString(locale);
    }

    const calculateDurationInDays = (startDate, endDate, fallback = "—") => {
        if (!startDate || !endDate) return fallback;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) return fallback;

        const diffMs = end - start;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return diffDays >= 0 ? diffDays : fallback;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "actualCompletionPercent") {
            if (value === "") {
                setFormData((prev) => ({
                    ...prev,
                    actualCompletionPercent: "",
                    actualEndDate: "",
                }));
                return;
            }
            let num = parseInt(value, 10);
            if (isNaN(num)) return;
            num = Math.max(0, Math.min(100, num));
            setFormData((prev) => ({
                ...prev,
                actualCompletionPercent: num,
                actualEndDate:
                    num === 100
                        ? new Date().toISOString().split("T")[0]
                        : "",
            }));
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
        if (formData.actualCompletionPercent < 0 || formData.actualCompletionPercent > 100)
            return "Completion % must be between 0 and 100";
        return null;
    };

    const calculateProgressDays = (startDate) => {
        if (!startDate) return 0;
        const start = new Date(startDate);
        const today = new Date();
        const diff = Math.ceil(
            (today - start) / (1000 * 60 * 60 * 24)
        );
        return diff > 0 ? diff : 0;
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
                actualProgressDay: calculateProgressDays(formData.actualStartDate)
            };

            const response = await createProgressReport(payload);
            toast.success("Progress submitted successfully");
            setFormData(logicval);
            navigate("/")
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit progress");
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-8 px-4">
            <div className="mx-auto max-w-6xl">
                <div className="relative overflow-hidden rounded-3xl border-2 border-white/60 bg-white shadow-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border-b-2 border-gray-200 p-8">
                        <div className="flex items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    SCADA DEVELOPMENT EXECUTION
                                </h2>

                            </div>

                            <span className="flex-shrink-0 rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100 px-5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-lg">
                                In Progress
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">

                        <div className="space-y-6">
                            {/* Section Name & Dev Scope */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300">
                                    <div className="relative rounded-2xl bg-white p-5 h-full backdrop-blur-xl">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-indigo-100 rounded-lg">
                                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5">
                                                    Section Name
                                                </p>
                                                <p className="text-base font-bold text-gray-900">
                                                    {scadaPhaseData?.phase?.sectionName || "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 p-[2px] hover:shadow-2xl hover:shadow-slate-500/50 transition-all duration-300">
                                    <div className="relative rounded-2xl bg-white p-5 h-full">
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-200 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                                    DevScope Note
                                                </p>
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    {scadaPhaseData?.project?.devScope || "—"}
                                                    {/* {scadaPhaseData?.project?.service || "—"} */}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Assigned To */}
                            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-[2px] hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300">
                                <div className="relative rounded-2xl bg-white p-5 backdrop-blur-xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 bg-purple-100 rounded-lg">
                                                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                </svg>
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                                                Assigned To
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">

                                            {scadaPhaseData?.engineers?.length > 0 ? (
                                                scadaPhaseData?.engineers?.map((user, index) => (
                                                    <a
                                                        key={index}
                                                        href={`mailto:${user.email}`}
                                                        className="group/badge inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-sm text-purple-700 hover:from-purple-100 hover:to-pink-100 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                                                    >
                                                        <svg className="w-4 h-4 mr-2 group-hover/badge:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                        {user.email}
                                                    </a>
                                                ))
                                            ) : (
                                                <span className="text-gray-500">No assigned engineers</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Target Dates */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-[2px] hover:shadow-2xl hover:shadow-rose-500/50 transition-all duration-300">
                                    <div className="relative rounded-2xl bg-white p-5 h-full">
                                        <div className="absolute top-0 left-0 w-16 h-16 bg-rose-200 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                                                    Target Start
                                                </p>
                                            </div>
                                            <p className="text-xl font-extrabold text-gray-900 group-hover:text-rose-600 transition-colors">

                                                {formatDate(scadaPhaseData?.phase?.startDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-[2px] hover:shadow-2xl hover:shadow-rose-500/50 transition-all duration-300">
                                    <div className="relative rounded-2xl bg-white p-5 h-full">
                                        <div className="absolute top-0 left-0 w-16 h-16 bg-rose-200 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                                                    Target End
                                                </p>
                                            </div>
                                            <p className="text-xl font-extrabold text-gray-900 group-hover:text-rose-600 transition-colors">
                                                {formatDate(scadaPhaseData?.phase?.endDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300">
                                    <div className="relative rounded-2xl bg-white p-5 h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 opacity-50"></div>
                                        <div className="relative z-10 text-center">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                                                    Duration
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <span className="text-4xl font-black bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                                                    {calculateDurationInDays(scadaPhaseData?.phase?.startDate, scadaPhaseData?.phase?.endDate)}
                                                </span>
                                                <span className="ml-1 text-sm font-bold text-emerald-600">days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                        {/* Target Progress */}
                        <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-lg">
                            <label className="mb-4 block text-base font-bold uppercase tracking-wide text-emerald-700">
                                Target Progress (Day)
                            </label>

                            <div className="inline-flex rounded-xl border-2 border-emerald-300 bg-white/80 backdrop-blur-sm px-4 py-4 shadow-lg">
                                <div className="flex items-center gap-2 text-xs">
                                    {Array.from({ length: 25 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-black text-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-3 flex gap-2 text-xs font-semibold text-emerald-700">
                                {Array.from({ length: 26 }).map((_, i) => (
                                    <div key={i} className="w-8 text-center">
                                        {Math.round(((i + 1) / 26) * 100)}%
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actual Dates */}
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
                                    onChange={(e) => {
                                        handleChange(e);
                                        setFormData((prev) => ({
                                            ...prev,
                                            actualProgressDay: calculateProgressDays(e.target.value),
                                        }));
                                    }}
                                    className="w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Actual End Date
                                </label>
                                <input
                                    className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm"
                                    disabled
                                    value={
                                        formData.actualCompletionPercent === 100
                                            ? new Date().toISOString().split("T")[0]
                                            : ""
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    # of days
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
                                    Current Date
                                </label>
                                <input
                                    className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm"
                                    disabled
                                    value={new Date().toLocaleDateString("en-IN")}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Actual Progress Day
                                </label>
                                <input
                                    className="w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm"
                                    disabled
                                    value={formData.actualProgressDay}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                                    Actual Completion %
                                </label>
                                <input
                                    type="number"
                                    name="actualCompletionPercent"
                                    min={0}
                                    max={100}
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
                                Remarks
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
