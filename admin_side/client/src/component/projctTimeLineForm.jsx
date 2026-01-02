import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../appContex";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    documentRows,
    logicRows,
    projectRows,
    screenRows,
    testingRows,
} from "../utils/dev.context";
import { mapFrontendToBackend } from "../utils/frontToback";

const ProjectTimelineForm1 = () => {
    const { id } = useParams();
    const { user } = useAppContext();
    const [collOpen, setCollOpen] = useState(false);
    const [project, setProject] = useState();
    const [loading, setLoading] = useState();
    const { toggle, setToggle } = useAppContext();
    const [isPlan, setIsPlan] = useState(false)
    const navigate = useNavigate();

    const emptySection = {
        sectionName: "", sectionStartDate: "", sectionEndDate: "", startDate: "", endDate: "", planDetails: "", engineers: []
    };
    const [formData, setFormData] = useState({
        plans: [
            {
                documents: [{ ...emptySection }],
                logic: [{ ...emptySection }],
                scada: [{ ...emptySection }],
                testing: [{ ...emptySection }],
            },
        ],
    });

    const [name, setName] = useState("");
    const [engineersList, setEngineersList] = useState([]);
    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/ProjectsfetchdevbyId/${id}`,
                    { withCredentials: true }
                );
                setProject(res.data?.data || null);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load project");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);


    useEffect(() => {
        if (!formData || !formData.plans) return;

        let combined = new Set();

        formData.plans.forEach((block) => {
            ["logic", "scada", "testing"].forEach((phase) => {
                block[phase]?.forEach((sec) => {
                    sec.engineers?.forEach((eng) => combined.add(eng));
                });
            });
        });

        const finalEngineers = Array.from(combined);
        const alreadyMatching = formData.plans.every((block) =>
            block.documents.every(
                (sec) => JSON.stringify(sec.engineers) === JSON.stringify(finalEngineers)
            )
        );

        if (alreadyMatching) return;

        setFormData((prev) => {
            const updatedPlans = prev.plans.map((block) => ({
                ...block,
                documents: block.documents.map((sec) => ({
                    ...sec,
                    engineers: finalEngineers,
                })),
            }));

            return { ...prev, plans: updatedPlans };
        });
    }, [
        JSON.stringify(
            formData.plans.map((block) => ({
                logic: block.logic,
                scada: block.scada,
                testing: block.testing,
            }))
        )
    ]);




    useEffect(() => {
        if (!project?.PlanDetails) return;

        const fetchPlanningData = async (planId) => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/planningDev/fetchbyid/${planId}`, { withCredentials: true }
                );
                const defaultData = res.data?.data || {};
                if (defaultData && defaultData.plans) setIsPlan(true);

                if (defaultData?.updatedBy?.username) {
                    setName(defaultData.updatedBy.username);
                }

                if (Array.isArray(defaultData.plans) && defaultData.plans.length > 0) {
                    const formattedPlans = defaultData.plans.map((block) => {
                        const fmt = (v) => (v ? new Date(v).toISOString().split("T")[0] : "");

                        return {
                            documents: (block.documents || []).length > 0
                                ? (block.documents || []).map(sec => ({
                                    sectionName: sec.sectionName || "",
                                    sectionStartDate: fmt(sec.sectionStartDate),
                                    sectionEndDate: fmt(sec.sectionEndDate),
                                    startDate: fmt(sec.startDate),
                                    endDate: fmt(sec.endDate),
                                    planDetails: sec.planDetails || "",
                                    engineers: sec.engineers || [],
                                }))
                                : [{ ...emptySection }],
                            logic: (block.logic || []).length > 0
                                ? (block.logic || []).map(sec => ({
                                    sectionName: sec.sectionName || "",
                                    sectionStartDate: fmt(sec.sectionStartDate),
                                    sectionEndDate: fmt(sec.sectionEndDate),
                                    startDate: fmt(sec.startDate),
                                    endDate: fmt(sec.endDate),
                                    planDetails: sec.planDetails || "",
                                    engineers: sec.engineers || [],
                                }))
                                : [{ ...emptySection }],
                            scada: (block.scada || []).length > 0
                                ? (block.scada || []).map(sec => ({
                                    sectionName: sec.sectionName || "",
                                    sectionStartDate: fmt(sec.sectionStartDate),
                                    sectionEndDate: fmt(sec.sectionEndDate),
                                    startDate: fmt(sec.startDate),
                                    endDate: fmt(sec.endDate),
                                    planDetails: sec.planDetails || "",
                                    engineers: sec.engineers || [],
                                }))
                                : [{ ...emptySection }],
                            testing: (block.testing || []).length > 0
                                ? (block.testing || []).map(sec => ({
                                    sectionName: sec.sectionName || "",
                                    sectionStartDate: fmt(sec.sectionStartDate),
                                    sectionEndDate: fmt(sec.sectionEndDate),
                                    startDate: fmt(sec.startDate),
                                    endDate: fmt(sec.endDate),
                                    planDetails: sec.planDetails || "",
                                    engineers: sec.engineers || [],
                                }))
                                : [{ ...emptySection }],
                        };
                    });

                    setFormData({ plans: formattedPlans });
                } else {
                    setFormData({
                        plans: [
                            {
                                documents: [{ ...emptySection }],
                                logic: [{ ...emptySection }],
                                scada: [{ ...emptySection }],
                                testing: [{ ...emptySection }],
                            },
                        ],
                    });
                }
            } catch (err) {
                setIsPlan(false)
                console.error("Error fetching planning data:", err);
            }
        };

        fetchPlanningData(project.PlanDetails);
    }, [project?.PlanDetails, toggle]);

    useEffect(() => {
        const fetchEngineerData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/engineer/getAllEngineers`, { withCredentials: true }
                );
                setEngineersList(res.data?.engineers || res.data?.data || []);
            } catch (err) {
                console.error("Error fetching engineer data:", err);
                toast.error("Failed to load engineers");
            }
        };

        fetchEngineerData();
    }, [toggle]);

    const addPlanningBlock = () => {
        setFormData((prev) => ({
            ...prev,
            plans: [
                ...prev.plans,
                {
                    documents: [{ ...emptySection }],
                    logic: [{ ...emptySection }],
                    scada: [{ ...emptySection }],
                    testing: [{ ...emptySection }],
                },
            ],
        }));
    };

    const removePlanningBlock = (index) => {
        setFormData((prev) => {
            const plans = prev.plans.filter((_, i) => i !== index);
            return {
                ...prev,
                plans: plans.length > 0 ? plans : [
                    {
                        documents: [{ ...emptySection }],
                        logic: [{ ...emptySection }],
                        scada: [{ ...emptySection }],
                        testing: [{ ...emptySection }],
                    }
                ]
            };
        });
    };

    const handleChange = (blockIndex, phase, sectionIndex, field, value) => {
        setFormData((prev) => {
            const plans = prev.plans.map((p, i) => {
                if (i !== blockIndex) return p;
                return {
                    ...p,
                    [phase]: p[phase].map((sec, si) => {
                        if (si !== sectionIndex) return sec;
                        return {
                            ...sec,
                            [field]: value,
                        };
                    }),
                };
            });
            return { ...prev, plans };
        });
    };


    const handleCommonSectionChange = (blockIndex, field, value) => {
        setFormData((prev) => {
            const plans = prev.plans.map((block, i) => {
                if (i !== blockIndex) return block;

                const updatePhase = (phase) =>
                    block[phase].map((sec, idx) =>
                        idx === 0
                            ? { ...sec, [field]: value }
                            : sec
                    );

                return {
                    ...block,
                    documents: updatePhase("documents"),
                    logic: updatePhase("logic"),
                    scada: updatePhase("scada"),
                    testing: updatePhase("testing"),
                };
            });

            return { ...prev, plans };
        });
    };


    const handleEngineerToggle = (blockIndex, phase, sectionIndex, engineerId) => {
        setFormData((prev) => {
            const plans = prev.plans.map((p, i) => {
                if (i !== blockIndex) return p;
                return {
                    ...p,
                    [phase]: p[phase].map((sec, si) => {
                        if (si !== sectionIndex) return sec;
                        const currentEngineers = sec.engineers || [];
                        const isSelected = currentEngineers.includes(engineerId);
                        return {
                            ...sec,
                            engineers: isSelected
                                ? currentEngineers.filter((id) => id !== engineerId)
                                : [...currentEngineers, engineerId],
                        };
                    }),
                };
            });
            return { ...prev, plans };
        });
    };

    const removeEngineer = (blockIndex, phase, sectionIndex, engineerId) => {
        setFormData((prev) => {
            const plans = prev.plans.map((p, i) => {
                if (i !== blockIndex) return p;
                return {
                    ...p,
                    [phase]: p[phase].map((sec, si) => {
                        if (si !== sectionIndex) return sec;
                        return {
                            ...sec,
                            engineers: (sec.engineers || []).filter((id) => id !== engineerId),
                        };
                    }),
                };
            });
            return { ...prev, plans };
        });
    };

    const getEngineerName = (engineerId) => {
        const engineer = engineersList.find((e) => e._id === engineerId);
        return engineer?.username || engineer?.name || engineer?.email || "Unknown";
    };

    const truncateName = (name) => {
        return name.slice(0, 10);
    };


    const validateForm = () => {
        for (let b = 0; b < formData.plans.length; b++) {
            const block = formData.plans[b];
            const section = block.documents[0];

            if (!section.sectionName.trim()) {
                toast.error(`Section name is required (SECTION- ${b + 1})`);
                return false;
            }

            if (!section.sectionStartDate || !section.sectionEndDate) {
                toast.error(`Section start & end dates are required (SECTION- ${b + 1})`);
                return false;
            }

            if (new Date(section.sectionEndDate) < new Date(section.sectionStartDate)) {
                toast.error(`Section end date cannot be before start date (SECTION- ${b + 1})`);
                return false;
            }

            for (const phase of ["documents", "scada", "logic", "testing"]) {
                const sec = block[phase][0];

                if (!sec.startDate || !sec.endDate) {
                    toast.error(
                        `${phase.toUpperCase()} start & end dates are required (SECTION- ${b + 1})`
                    );
                    return false;
                }

                if (new Date(sec.endDate) < new Date(sec.startDate)) {
                    toast.error(
                        `${phase.toUpperCase()} end date cannot be before start date (SECTION- ${b + 1})`
                    );
                    return false;
                }

                if (
                    new Date(sec.startDate) < new Date(section.sectionStartDate) ||
                    new Date(sec.endDate) > new Date(section.sectionEndDate)
                ) {
                    toast.error(
                        `${phase.toUpperCase()} dates must be inside section dates (SECTION- ${b + 1})`
                    );
                    return false;
                }
                if (
                    phase !== "documents" &&
                    (!sec.engineers || sec.engineers.length === 0)
                ) {
                    toast.error(
                        `Select at least one engineer for ${phase.toUpperCase()} (SECTION- ${b + 1})`
                    );
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formDevbackData = mapFrontendToBackend(
                {
                    document: { rows: documentRows() },
                    screen: { rows: screenRows() },
                    logic: { rows: logicRows() },
                    testing: { rows: testingRows() },
                    project: { rows: projectRows() },
                },
                project?.jobNumber
            );
            const payload = {
                plans: formData.plans.map((block) => ({
                    documents: block.documents.map(sec => ({
                        sectionName: sec.sectionName || "",
                        sectionStartDate: sec.sectionStartDate || "",
                        sectionEndDate: sec.sectionEndDate || "",
                        startDate: sec.startDate || null,
                        endDate: sec.endDate || null,
                        planDetails: sec.planDetails || "",
                        engineers: sec.engineers || [],
                    })),
                    logic: block.logic.map(sec => ({
                        sectionName: sec.sectionName || "",
                        sectionStartDate: sec.sectionStartDate || "",
                        sectionEndDate: sec.sectionEndDate || "",
                        startDate: sec.startDate || null,
                        endDate: sec.endDate || null,
                        planDetails: sec.planDetails || "",
                        engineers: sec.engineers || [],
                    })),
                    scada: block.scada.map(sec => ({
                        sectionName: sec.sectionName || "",
                        sectionStartDate: sec.sectionStartDate || "",
                        sectionEndDate: sec.sectionEndDate || "",
                        startDate: sec.startDate || null,
                        endDate: sec.endDate || null,
                        planDetails: sec.planDetails || "",
                        engineers: sec.engineers || [],
                    })),
                    testing: block.testing.map(sec => ({
                        sectionName: sec.sectionName || "",
                        sectionStartDate: sec.sectionStartDate || "",
                        sectionEndDate: sec.sectionEndDate || "",
                        startDate: sec.startDate || null,
                        endDate: sec.endDate || null,
                        planDetails: sec.planDetails || "",
                        engineers: sec.engineers || [],
                    })),
                })),
                formDevbackData,
                projectId: project?._id,
                userId: user?._id,
            };

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/planningDev/save`,
                payload,
                { withCredentials: true }
            );

            toast.success(res.data?.message || "Plan saved successfully");
            navigate("/page");

            setFormData({
                plans: [
                    {
                        documents: [{ ...emptySection }],
                        logic: [{ ...emptySection }],
                        scada: [{ ...emptySection }],
                        testing: [{ ...emptySection }],
                    },
                ],
            });

            setToggle((prev) => !prev);
        } catch (err) {
            console.error(err);
            if (err?.response?.data?.message) {
                toast.error(err.response.data.message || "Something went wrong");
            } else {
                toast.error("Failed to save plan");
            }
        }
    };

    if (!project) return null;

    const SERVICE_LABELS = {
        DEV: "Development",
        DEVCOM: "Development + Commissioning",
        COMMISSIONING: "Commissioning",
        AMC: "AMC",
        SERVICE: "Service",
        SEPERATE: "Separate",
        "": "",
        "N/A": "N/A",
    };

    const Info = ({ label, value }) => {
        return (
            <div className="group bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                <dt className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-indigo-600 transition-colors"></span>
                    {label}
                </dt>
                <dd className="text-base font-semibold text-gray-900 truncate">
                    {value || <span className="text-gray-400 font-normal italic">Not specified</span>}
                </dd>
            </div>
        );
    };

    const getPhasePosition = (phaseStart, phaseEnd, sectionStart, sectionEnd) => {
        if (!phaseStart || !phaseEnd || !sectionStart || !sectionEnd) {
            return { left: "0%", width: "0%" };
        }

        const sStart = new Date(sectionStart);
        const sEnd = new Date(sectionEnd);
        const pStart = new Date(phaseStart);
        const pEnd = new Date(phaseEnd);

        const total = sEnd - sStart;

        let left = ((pStart - sStart) / total) * 100;
        let width = ((pEnd - pStart) / total) * 100;

        left = Math.max(0, Math.min(left, 100));
        width = Math.max(0, Math.min(width, 100 - left));

        return { left: `${left}%`, width: `${width}%` };
    };

    const EngineerSelector = ({
        phase,
        blockIndex,
        block,
        engineersList,
        handleEngineerToggle,
        removeEngineer,
        getEngineerName,
    }) => {
        const sec = block?.[phase]?.[0] || { engineers: [] };

        const [search, setSearch] = useState("");
        const [open, setOpen] = useState(false);

        const wrapperRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (e) => {
                if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                    setOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        const normalizedSearch = search.trim().toLowerCase();

        const filteredEngineers = engineersList.filter((eng) => {
            if (!normalizedSearch) return true;

            const text = [eng.username, eng.name, eng.email]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return text.includes(normalizedSearch);
        });

        return (
            <div
                ref={wrapperRef}
                className="p-6 bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-sm mb-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-green-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>

                    <h4 className="font-bold text-lg text-gray-800">
                        {phase.toUpperCase()} <span className="text-green-700">Engineers</span>
                    </h4>

                    {sec.engineers.length > 0 && (
                        <span className="ml-auto px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                            {sec.engineers.length} Selected
                        </span>
                    )}
                </div>
                <div className="relative mb-4">
                    <input
                        type="text"
                        name="engineer-search"
                        autoComplete="new-password"
                        spellCheck={false}
                        placeholder="Search engineers..."
                        value={search}
                        onFocus={() => setOpen(true)}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {open && (
                    <div className="mb-4 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                        {filteredEngineers.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No engineers found
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredEngineers.map((eng) => {
                                    const name = eng.username || eng.name || eng.email || "Unknown";
                                    const checked = sec.engineers.includes(eng._id);

                                    return (
                                        <label
                                            key={eng._id}
                                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition
                      ${checked ? "bg-green-50" : "hover:bg-gray-50"}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() =>
                                                    handleEngineerToggle(blockIndex, phase, 0, eng._id)
                                                }
                                                className="w-4 h-4 text-green-600 rounded"
                                            />
                                            <span
                                                className={`flex-1 text-sm ${checked
                                                    ? "text-green-800 font-medium"
                                                    : "text-gray-700"
                                                    }`}
                                            >
                                                {name}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
                {sec.engineers.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                            Selected Engineers
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {sec.engineers.map((eid) => (
                                <span
                                    key={eid}
                                    className="px-4 py-2 rounded-full bg-green-100 border border-green-200
                           text-green-800 text-sm font-medium flex items-center gap-2"
                                >
                                    {getEngineerName(eid)}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeEngineer(blockIndex, phase, 0, eid)
                                        }
                                        className="w-5 h-5 flex items-center justify-center rounded-full
                             bg-red-100 text-red-600 hover:bg-red-200"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="italic w-full min-h-screen bg-gray-100 py-10 px-4">
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-5xl mx-auto border border-gray-200">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 drop-shadow-sm">
                        PROJECT TIMELINE FORM
                    </h2>
                    {name && (
                        <p className="text-sm text-gray-500 mt-2">
                            Last updated by{" "}
                            <span className="font-medium text-gray-700">
                                {name.toUpperCase() || "—"}
                            </span>
                        </p>
                    )}
                </div>

                {/* Project Info Collapsible */}
                <div className="w-full mb-6">
                    <button
                        onClick={() => setCollOpen(!collOpen)}
                        className="w-full bg-gray-300 p-3 rounded-lg flex justify-between items-center hover:bg-gray-400 transition"
                    >
                        <span className="text-lg font-medium">
                            {collOpen ? "Hide" : "Show"} Order Details
                        </span>
                        <span className="text-xl">{collOpen ? "▲" : "▼"}</span>
                    </button>
                    {collOpen && (
                        <div className="space-y-6 mb-6">
                            <div className="relative bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-indigo-200/30 to-purple-200/30 rounded-bl-full blur-2xl"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-xl text-indigo-900">
                                            Basic Project Information
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Info label="Job Number" value={project.jobNumber} />
                                        <Info label="Entity Type" value={project?.OrderMongoId.entityType} />
                                        <Info label="SO Type" value={project?.OrderMongoId.soType} />
                                        <Info label="Booking Date" value={project?.OrderMongoId.bookingDate} />
                                        <Info label="Client" value={project?.OrderMongoId.client} />
                                        <Info label="End User" value={project?.OrderMongoId.endUser} />
                                        <Info label="Location" value={project?.OrderMongoId.site} />
                                        <Info label="Accournt manager Email" value={project?.OrderMongoId.concerningSalesManager} />
                                        <Info label="Technical Name" value={project?.OrderMongoId.name} />
                                        <Info label="Technical Email" value={project?.OrderMongoId.technicalEmail} />
                                        <Info label="Technical Phone" value={project?.OrderMongoId.phone} />
                                    </div>
                                </div>
                            </div>

                            <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-xl text-blue-900">
                                            Order Value
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Info label="Order Value (Supply)" value={project?.OrderMongoId.orderValueSupply} />
                                        <Info label="Order Value (Service)" value={project?.OrderMongoId.orderValueService} />
                                        <Info label="Order Value (Total)" value={project?.OrderMongoId.orderValueTotal} />
                                    </div>
                                </div>
                            </div>

                            <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-xl text-blue-900">
                                            PO Details
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Info label="PO Received" value={project?.OrderMongoId.poReceived} />
                                        <Info label="Order Number" value={project?.OrderMongoId.orderNumber} />
                                        <Info label="Order Date" value={project?.OrderMongoId.orderDate} />
                                        <Info label="Delivery Date" value={project?.OrderMongoId.deleveryDate} />
                                        <Info label="Actual Delivery Date" value={project?.OrderMongoId.actualDeleveryDate} />
                                        <Info label="Amendment Required" value={project?.OrderMongoId.amndReqrd} />
                                    </div>
                                </div>
                            </div>

                            <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-xl text-blue-900">
                                            Service Details
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Info label="Service Type" value={SERVICE_LABELS[project?.service] || project?.service} />
                                    </div>
                                </div>
                            </div>

                            <div className="relative bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-cyan-200/30 rounded-bl-full blur-2xl"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-xl text-blue-900">
                                            Development Scope
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Info label="Scada/Logic" value={project?.Development} />
                                        <Info label="Logic development Place" value={project?.LogicPlace} />
                                        <Info label="Scada devvelopment Place" value={project?.ScadaPlace} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* ADD PLANNING BLOCK BUTTON */}
                <div className="mb-6 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={addPlanningBlock}
                        className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition font-medium shadow-md hover:shadow-lg"
                    >
                        + Add Planning Block
                    </button>
                    <div className="text-sm text-gray-500 font-medium">Total Plannings: {formData.plans.length}</div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10 max-w-7xl mx-auto">
                    {formData.plans.map((block, blockIndex) => (
                        <div
                            key={blockIndex}
                            className="relative space-y-6 border-2 border-green-300 rounded-2xl p-8 bg-linear-to-br from-green-50/50 via-white to-emerald-50/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                            {/* Decorative corner accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-400/10 to-transparent rounded-bl-full"></div>

                            {/* Block Header */}

                            <div className="flex items-center justify-between p-6 mb-6 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-2xl">📋</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">
                                            Planning Section {blockIndex + 1}
                                        </h2>
                                    </div>
                                </div>
                                {blockIndex !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removePlanningBlock(blockIndex)}
                                        className="group px-5 py-2.5 rounded-xl bg-white border-2 border-red-300 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Remove Block</span>
                                    </button>
                                )}
                            </div>


                            {/* Main Content Panel */}
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">

                                {/* Section Details Card */}
                                <div className="mb-8 p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                    {/* <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className="font-bold text-lg text-gray-800">Section Information</h3>
                                    </div> */}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        {/* Section Name */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                Section Name
                                            </label>
                                            <input
                                                type="text"
                                                value={block.documents[0].sectionName || ""}
                                                onChange={(e) =>
                                                    handleCommonSectionChange(
                                                        blockIndex,
                                                        "sectionName",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., Phase 1 Development"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400"
                                            />
                                        </div>

                                        {/* Section Start Date */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={block.documents[0].sectionStartDate || ""}
                                                onChange={(e) =>
                                                    handleCommonSectionChange(
                                                        blockIndex,
                                                        "sectionStartDate",
                                                        e.target.value
                                                    )
                                                }

                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400"
                                            />
                                        </div>

                                        {/* Section End Date */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                </svg>
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={block.documents[0].sectionEndDate || ""}
                                                onChange={(e) =>
                                                    handleCommonSectionChange(
                                                        blockIndex,
                                                        "sectionEndDate",
                                                        e.target.value
                                                    )
                                                }

                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>


                                {/* Phase Timeline Table */}
                                <div className="mb-8">
                                    {/* <div className="flex items-center gap-2 mb-5">
                                        <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-xl text-gray-800">Phase Timeline</h3>
                                    </div> */}

                                    {/* Table Container with better styling */}
                                    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                        {/* Table Header */}
                                        <div className="grid grid-cols-5 gap-4 p-4 bg-linear-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                            <div className="font-bold text-sm text-gray-700 uppercase tracking-wide">Phase</div>
                                            <div className="font-bold text-sm text-gray-700 uppercase tracking-wide">Start Date</div>
                                            <div className="font-bold text-sm text-gray-700 uppercase tracking-wide">End Date</div>
                                            <div className="col-span-2 font-bold text-sm text-gray-700 uppercase tracking-wide">Progress</div>
                                        </div>

                                        {/* Table Rows */}
                                        <div className="divide-y divide-gray-100">
                                            {["documents", "scada", "logic", "testing"].map((phase, idx) => {
                                                const sec = block[phase][0];
                                                const phaseIcons = {
                                                    documents: "📄",
                                                    scada: "⚡",
                                                    logic: "🧠",
                                                    testing: "🔬"
                                                };
                                                return (
                                                    <div
                                                        key={phase}
                                                        className={`grid grid-cols-5 gap-4 p-4 items-center hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                            }`}
                                                    >
                                                        {/* Phase Name */}
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">{phaseIcons[phase]}</span>
                                                            <span className="font-semibold text-gray-800 capitalize">
                                                                {phase}
                                                            </span>
                                                        </div>

                                                        {/* Start Date */}
                                                        <input
                                                            type="date"
                                                            value={sec.startDate}
                                                            onChange={(e) =>
                                                                handleChange(blockIndex, phase, 0, "startDate", e.target.value)
                                                            }
                                                            className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm shadow-sm hover:border-gray-400"
                                                        />

                                                        {/* End Date */}
                                                        <input
                                                            type="date"
                                                            value={sec.endDate}
                                                            onChange={(e) =>
                                                                handleChange(blockIndex, phase, 0, "endDate", e.target.value)
                                                            }
                                                            className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm shadow-sm hover:border-gray-400"
                                                        />

                                                        {/* Progress Bar */}
                                                        <div className="col-span-2 flex flex-col gap-1">

                                                            {/* DATE LABELS */}
                                                            <div className="flex justify-between text-xs text-gray-600">
                                                                <span>{block.documents[0].sectionStartDate || "Start"}</span>
                                                                <span>{block.documents[0].sectionEndDate || "End"}</span>
                                                            </div>

                                                            {/* MAIN MASTER TIMELINE BAR */}
                                                            <div className="relative h-4 bg-gray-300 rounded-full overflow-hidden shadow-inner">

                                                                {/* FILLED MAIN BAR (SECTION PROGRESS BASED ON TODAY) */}
                                                                <div
                                                                    className="absolute h-full w-full bg-green-500/40 rounded-full"
                                                                ></div>

                                                                {/* FLOATING PHASE BAR */}
                                                                {(() => {
                                                                    const { left, width } = getPhasePosition(
                                                                        sec.startDate,
                                                                        sec.endDate,
                                                                        block.documents[0].sectionStartDate,
                                                                        block.documents[0].sectionEndDate
                                                                    );
                                                                    return (
                                                                        <div
                                                                            className="absolute h-full bg-indigo-500 rounded-full opacity-90"
                                                                            style={{ left, width }}
                                                                        ></div>
                                                                    );
                                                                })()}

                                                            </div>

                                                            {/* FLOAT LABEL */}
                                                            <div className="text-[10px] text-gray-700 text-center font-medium">
                                                                {sec.startDate || "Start"} → {sec.endDate || "End"}
                                                            </div>

                                                        </div>


                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Engineer Selectors */}
                                <div className="space-y-6 mb-8">
                                    {/* <div className="flex items-center gap-2 mb-2">
                                        <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-xl text-gray-800">Team Assignments</h3>
                                    </div> */}



                                    <EngineerSelector
                                        phase="logic"
                                        blockIndex={blockIndex}
                                        block={block}
                                        engineersList={engineersList}
                                        handleEngineerToggle={handleEngineerToggle}
                                        removeEngineer={removeEngineer}
                                        getEngineerName={getEngineerName}
                                    />
                                    <EngineerSelector
                                        phase="scada"
                                        blockIndex={blockIndex}
                                        block={block}
                                        engineersList={engineersList}
                                        handleEngineerToggle={handleEngineerToggle}
                                        removeEngineer={removeEngineer}
                                        getEngineerName={getEngineerName}
                                    />

                                    <EngineerSelector
                                        phase="testing"
                                        blockIndex={blockIndex}
                                        block={block}
                                        engineersList={engineersList}
                                        handleEngineerToggle={handleEngineerToggle}
                                        removeEngineer={removeEngineer}
                                        getEngineerName={getEngineerName}
                                    />
                                </div>

                                {/* Notes Section */}
                                <div className="p-6 bg-linear-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Section Notes
                                    </label>
                                    <textarea
                                        value={block.documents[0].planDetails || ""}
                                        onChange={(e) =>
                                            handleCommonSectionChange(blockIndex, "planDetails", e.target.value)
                                        }
                                        placeholder="Add detailed notes, comments, or important information about this planning section..."
                                        className="w-full p-4 border border-amber-300 rounded-xl h-32 resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm hover:border-amber-400 bg-white"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Submit Button */}
                    <div className="flex justify-center pt-8 pb-4">
                        {!project?.PlanDetails && <button
                            type="submit"
                            className="group relative px-12 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg overflow-hidden transform hover:scale-105 active:scale-95"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                                <span>{isPlan ? "Update" : "Create"} Software Development Plan</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </button>}
                    </div>

                </form>

            </div>
        </div>
    );
};

export default ProjectTimelineForm1;
