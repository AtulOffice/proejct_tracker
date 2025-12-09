import React, { useEffect, useState } from "react";
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
    const navigate = useNavigate();

    const emptySection = { sectionName: "", startDate: "", endDate: "", planDetails: "", engineers: [] };
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
                    `${import.meta.env.VITE_API_URL}/planningDev/fetchbyid/${planId}`
                );
                const defaultData = res.data?.data || {};

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
                                    startDate: fmt(sec.startDate),
                                    endDate: fmt(sec.endDate),
                                    planDetails: sec.planDetails || "",
                                    engineers: sec.engineers || [],
                                }))
                                : [{ ...emptySection }],
                            logic: (block.logic || []).length > 0
                                ? (block.logic || []).map(sec => ({
                                    sectionName: sec.sectionName || "",
                                    startDate: fmt(sec.startDate),
                                    endDate: fmt(sec.endDate),
                                    planDetails: sec.planDetails || "",
                                    engineers: sec.engineers || [],
                                }))
                                : [{ ...emptySection }],
                            scada: (block.scada || []).length > 0
                                ? (block.scada || []).map(sec => ({
                                    sectionName: sec.sectionName || "",
                                    startDate: fmt(sec.startDate),
                                    endDate: fmt(sec.endDate),
                                    planDetails: sec.planDetails || "",
                                    engineers: sec.engineers || [],
                                }))
                                : [{ ...emptySection }],
                            testing: (block.testing || []).length > 0
                                ? (block.testing || []).map(sec => ({
                                    sectionName: sec.sectionName || "",
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
                console.error("Error fetching planning data:", err);
            }
        };

        fetchPlanningData(project.PlanDetails);
    }, [project?.PlanDetails, toggle]);

    useEffect(() => {
        const fetchEngineerData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/engineer/getAllEngineers`
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

    const addSectionToPhase = (blockIndex, phase) => {
        setFormData((prev) => {
            const plans = prev.plans.map((p, i) => {
                if (i !== blockIndex) return p;
                return {
                    ...p,
                    [phase]: [...p[phase], { ...emptySection }],
                };
            });
            return { ...prev, plans };
        });
    };

    const removeSectionFromPhase = (blockIndex, phase, sectionIndex) => {
        setFormData((prev) => {
            const plans = prev.plans.map((p, i) => {
                if (i !== blockIndex) return p;
                const newSections = p[phase].filter((_, si) => si !== sectionIndex);
                return {
                    ...p,
                    [phase]: newSections.length > 0 ? newSections : [{ ...emptySection }],
                };
            });
            return { ...prev, plans };
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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                        startDate: sec.startDate || null,
                        endDate: sec.endDate || null,
                        planDetails: sec.planDetails || "",
                        engineers: sec.engineers || [],
                    })),
                    logic: block.logic.map(sec => ({
                        sectionName: sec.sectionName || "",
                        startDate: sec.startDate || null,
                        endDate: sec.endDate || null,
                        planDetails: sec.planDetails || "",
                        engineers: sec.engineers || [],
                    })),
                    scada: block.scada.map(sec => ({
                        sectionName: sec.sectionName || "",
                        startDate: sec.startDate || null,
                        endDate: sec.endDate || null,
                        planDetails: sec.planDetails || "",
                        engineers: sec.engineers || [],
                    })),
                    testing: block.testing.map(sec => ({
                        sectionName: sec.sectionName || "",
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

    return (
        <div className="italic w-full min-h-screen bg-gray-100 py-10 px-4">
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-5xl mx-auto border border-gray-200">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 drop-shadow-sm">
                        PROJECT TIMELINE
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
                                        <Info label="PO Received" value={project?.OrderMongoId.poReceived} />
                                        <Info label="Order Number" value={project?.OrderMongoId.orderNumber} />
                                        <Info label="Order Date" value={project?.OrderMongoId.orderDate} />
                                        <Info label="Delivery Date" value={project?.OrderMongoId.deleveryDate} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* ADD PLANNING BLOCK BUTTON */}
                {/* <div className="mb-6 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={addPlanningBlock}
                        className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition font-medium shadow-md hover:shadow-lg"
                    >
                        + Add Planning Block
                    </button>
                    <div className="text-sm text-gray-500 font-medium">Total Plannings: {formData.plans.length}</div>
                </div> */}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {formData.plans.map((block, blockIndex) => (
                        <div key={blockIndex} className="space-y-6 border-2 border-green-400 rounded-xl p-6 bg-green-50/30">
                            {/* <div className="flex items-center justify-between p-5 mb-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                                <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                                    <span className="text-2xl">📋</span>
                                    Planning Section {blockIndex + 1}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => removePlanningBlock(blockIndex)}
                                    className="px-4 py-2 rounded-lg border-2 border-red-400 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 font-medium"
                                >
                                    Remove Block
                                </button>
                            </div> */}

                            {/* For each phase */}
                            {["documents", "logic", "scada", "testing"].map((phase, phaseIndex) => {
                                const sections = block[phase] || [];

                                return (
                                    <div key={`${blockIndex}-${phase}`} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg text-white capitalize flex items-center gap-2 px-4 py-3 bg-green-600 rounded-md shadow-md">
                                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                                {phase} Phase
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => addSectionToPhase(blockIndex, phase)}
                                                className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition font-medium shadow-sm hover:shadow-md"
                                            >
                                                + Add Section
                                            </button>
                                        </div>

                                        {sections.map((section, sectionIndex) => (
                                            <div
                                                key={sectionIndex}
                                                className="p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    {/* <h4 className="font-medium text-gray-700">
                                                        Section {sectionIndex + 1}
                                                    </h4> */}
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Section Name"
                                                        value={section.sectionName}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                blockIndex,
                                                                phase,
                                                                sectionIndex,
                                                                "sectionName",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-1/3
    px-4 py-2
    rounded-xl
    border border-slate-300
    bg-white/80
    shadow-sm
    focus:outline-none
    focus:ring-2 focus:ring-blue-500/60
    focus:border-blue-500
    placeholder:text-slate-400
    text-slate-800
    transition
    duration-200
    ease-out
  "
                                                    />


                                                    {sections.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSectionFromPhase(blockIndex, phase, sectionIndex)}
                                                            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 font-medium border border-red-200 hover:border-red-500 shadow-sm hover:shadow-md"
                                                        >
                                                            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            <span>Remove</span>
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                            Start Date *
                                                        </label>
                                                        <input
                                                            type="date"
                                                            required={true}
                                                            value={section.startDate}
                                                            onChange={(e) =>
                                                                handleChange(blockIndex, phase, sectionIndex, "startDate", e.target.value)
                                                            }
                                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                            End Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={section.endDate}
                                                            onChange={(e) =>
                                                                handleChange(blockIndex, phase, sectionIndex, "endDate", e.target.value)
                                                            }
                                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                                        />
                                                    </div>
                                                </div>

                                                {phase !== "documents" && (
                                                    <div className="mt-5">
                                                        <label className="flex text-sm font-medium text-gray-700 mb-3 items-center gap-2">
                                                            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                            </svg>
                                                            Select Engineers
                                                        </label>

                                                        {section.engineers?.length > 0 && (
                                                            <div className="mb-3 flex flex-wrap gap-2">
                                                                {section.engineers.map((engId) => {
                                                                    const fullName = getEngineerName(engId);
                                                                    const shortName = truncateName(fullName);
                                                                    return (
                                                                        <span
                                                                            key={engId}
                                                                            title={fullName}
                                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-100 text-teal-800 text-sm rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-teal-200"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                            </svg>
                                                                            <span className="font-medium">{shortName}</span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeEngineer(blockIndex, phase, sectionIndex, engId)}
                                                                                className="ml-1 hover:bg-teal-200 rounded-full p-0.5 transition-colors"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                </svg>
                                                                            </button>
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                        <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 bg-white shadow-inner scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                                            {engineersList.length === 0 ? (
                                                                <div className="text-center py-8">
                                                                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                    </svg>
                                                                    <p className="text-gray-400 text-sm">No engineers available</p>
                                                                </div>
                                                            ) : (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                    {engineersList.map((engineer) => {
                                                                        const isChecked = section.engineers?.includes(engineer._id);
                                                                        const fullName = engineer.username || engineer.name || engineer.email;
                                                                        const shortName = truncateName(fullName);
                                                                        return (
                                                                            <label
                                                                                key={engineer._id}
                                                                                title={fullName}
                                                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-all duration-200 ${isChecked
                                                                                    ? "bg-teal-50 border-teal-300 shadow-sm"
                                                                                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                                                                                    }`}
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={isChecked}
                                                                                    onChange={() =>
                                                                                        handleEngineerToggle(blockIndex, phase, sectionIndex, engineer._id)
                                                                                    }
                                                                                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                                                                />
                                                                                <span className="text-sm text-gray-700">{shortName}</span>
                                                                            </label>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-4">
                                                    {/* <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Planning Notes
                                                    </label> */}
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        {phase.charAt(0).toUpperCase() + phase.slice(1)} Notes
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        placeholder={`Add notes for this ${phase} section...`}
                                                        value={section.planDetails}
                                                        onChange={(e) =>
                                                            handleChange(blockIndex, phase, sectionIndex, "planDetails", e.target.value)
                                                        }
                                                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                                    />
                                                </div>
                                            </div>
                                        ))}


                                        {phaseIndex < 3 && (
                                            <div className="flex items-center justify-center gap-3 my-8">
                                                <div className="flex-1 h-1.5 bg-gray-600 rounded-full"></div>
                                                <div className="flex gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                                </div>
                                                <div className="flex-1 h-1.5 bg-gray-600 rounded-full"></div>
                                            </div>
                                        )}





                                    </div>
                                );
                            })}

                        </div>
                    ))}

                    <div className="flex justify-center pt-4">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-lg hover:shadow-xl transform hover:scale-105"
                        >
                            create software development plan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectTimelineForm1;
