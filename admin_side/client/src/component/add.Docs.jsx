import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { docsVal } from "../utils/FieldConstant";
import { useAppContext } from "../appContex";
import { fetchProjectsAllnewDocs } from "../utils/apiCall";
import { FaFolderPlus } from "react-icons/fa6";
import NotifiNewOrd from "./NotifiNewOrd";
import { InputConst } from "../utils/FieldConstant";
import { InputFiled, SelectField } from "./subField";
import DocumentsSection from "../utils/addDevDocs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InputForm = () => {
    const { toggle, setToggle, setToggleDev } = useAppContext();
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        jobNumber: "",
        swname: "",
        swtechnicalEmail: "",
        swphone: "",
        isMailSent: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectData, setSelectData] = useState(null);
    const [Docs, setDocs] = useState(docsVal);
    useEffect(() => {
        if (selectData) {
            setFormData((prev) => ({
                ...prev,
                jobNumber: selectData.jobNumber || "",
                swname: selectData?.OrderMongoId?.name || "",
                swtechnicalEmail: selectData.OrderMongoId?.technicalEmail || "",
                swphone: selectData.OrderMongoId?.phone || "",
            }));
            setDocs(docsVal)
        }
    }, [selectData]);

    useEffect(() => {
        const getProjectDocsnew = async () => {
            try {
                const val = await fetchProjectsAllnewDocs();
                if (val) {
                    setData(val?.docsProjects);
                }
            } catch (error) {
                console.error("Failed to fetch new Projects", error);
            }
        };
        getProjectDocsnew();
    }, [toggle]);

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toISOString().split("T")[0];
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        if (!name.includes(".")) {
            setFormData(prev => ({
                ...prev,
                [name]: finalValue,
            }));
            return;
        }

        const keys = name.split(".");
        setFormData(prev => {
            const newData = { ...prev };
            let current = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!isNaN(key)) {
                    const index = Number(key);
                    current[keys[i - 1]][index] = {
                        ...current[keys[i - 1]][index],
                    };
                    current = current[keys[i - 1]][index];
                    continue;
                }

                current[key] = { ...current[key] };
                current = current[key];
            }
            const lastKey = keys[keys.length - 1];
            current[lastKey] = finalValue;

            return newData;
        });
    };


    const validateDocs = (docsVal) => {
        const VALID_VALUES = ["YES", "NO", "N/A"];
        const invalid = [];
        const scan = (obj) => {
            if (!obj) return;
            if (typeof obj === "object" && "value" in obj) {
                if (!VALID_VALUES.includes(obj.value)) {
                    invalid.push(obj);
                }
            }
            if (Array.isArray(obj)) {
                obj.forEach((item) => scan(item));
            } else if (typeof obj === "object") {
                Object.values(obj).forEach((val) => scan(val));
            }
        };
        scan(docsVal);
        return invalid.length > 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateDocs(Docs)) {
            toast.error(`Please select YES, NO, or N/A for Documents}`);
            return;
        }
        setIsLoading(true);

        try {
            const finalData = {
                ...formData,
                ...Docs,
            };
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/updateDocs/${selectData._id}`,
                finalData,
                { withCredentials: true }
            );
            toast.success("Data updated successfully");
            setFormData({
                jobNumber: "",
                swname: "",
                swtechnicalEmail: "",
                swphone: "",
                isMailSent: ""
            });
            setDocs(docsVal);
            setSelectData(null)
            setToggle((prev) => !prev);
            setToggleDev((prev) => !prev);
            navigate("/page", {
                replace: true,
            });
        } catch (e) {
            toast.error("error while save docs")
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <div className="transition-all duration-300 lg:ml-64 pt-16 min-h-screen bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="mt-6 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-6xl border border-white/30">
                <div className="flex flex-col w-full">
                    {open && (
                        <NotifiNewOrd
                            setOpen={setOpen}
                            data={data}
                            setSelectData={setSelectData}
                        />
                    )}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-extrabold text-white drop-shadow-md flex-1 text-center">
                            DOCS DETAILS
                        </h2>
                        <div onClick={() => setOpen(true)} className="relative group ml-4">
                            <button
                                className="
      flex items-center justify-center
      bg-linear-to-tr from-emerald-500 via-teal-400 to-cyan-400
      hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-500
      text-white p-2 rounded-full shadow-lg
      transition-all duration-200
      hover:scale-110 hover:-rotate-6
      ring-2 ring-transparent hover:ring-emerald-300
      focus:outline-none focus:ring-4 focus:ring-emerald-400
    "
                                aria-label="New Project"
                                type="button"
                            >
                                <FaFolderPlus className="w-5 h-5 drop-shadow" />

                                {data.length > 0 && (
                                    <span
                                        className="
          absolute -top-1.5 -right-1.5
          bg-red-600 text-white text-xs font-bold
          rounded-full px-1.5 py-0.5
          animate-pulse shadow-md
        "
                                    >
                                        {data.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-6">
                        {selectData?.jobNumber && (
                            <>
                                {/* 📋 Basic Order Information */}
                                <div className="bg-linear-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex items-center mb-4 border-b border-indigo-200 pb-3">
                                        <span className="text-2xl mr-2">📋</span>
                                        <h3 className="font-bold text-lg text-indigo-900">Basic Order Information</h3>
                                    </div>


                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {[
                                            ["Job Number", selectData.jobNumber],
                                            ["Entity Type", selectData.entityType],
                                            ["SO Type", selectData.soType],
                                            ["Booking Date", formatDate(selectData.OrderMongoId?.bookingDate)],
                                            ["Client Name", selectData.client],
                                            ["End User", selectData.OrderMongoId?.endUser],
                                            ["Site Location", selectData.OrderMongoId?.site],
                                            ["SIEPL Acct. Mgr. Email ", selectData.OrderMongoId?.concerningSalesManager],
                                            ["Client Tech Person Name", selectData.OrderMongoId?.name],
                                            ["Client Tech Person Email", selectData.OrderMongoId?.technicalEmail],
                                            ["Client Tech Person Ph", selectData.OrderMongoId?.phone],
                                            ["Target Delevery Date", formatDate(selectData.OrderMongoId?.actualDeleveryDate)],

                                        ].map(([label, value], i) => (
                                            <div key={i} className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                                                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
                                                <p className="font-bold text-gray-900 text-base truncate">{value || "-"}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-linear-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex items-center mb-4 border-b border-indigo-200 pb-3">
                                        <span className="text-2xl mr-2">📋</span>
                                        <h3 className="font-bold text-lg text-indigo-900">Development Information</h3>
                                    </div>


                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {[
                                            ["Priority", selectData.priority],
                                            ["Scope", selectData.service],
                                            ["Development Section", selectData.Development],
                                            selectData.LogicPlace !== "" && ["Logic dev Place", selectData.LogicPlace],
                                            selectData.ScadaPlace !== "" && ["Scada dev Place", selectData.ScadaPlace],
                                            [
                                                "Commsioning Scope",
                                                [
                                                    selectData.Workcommission?.commissioning && "Commiss",
                                                    selectData.Workcommission?.erection && "Erect",
                                                    selectData.Workcommission?.instrumentation && "Instru"
                                                ].filter(Boolean).join(", ")
                                            ],
                                            selectData.LinkedOrderNumber !== "" && [
                                                "Linked Order Number",
                                                selectData.LinkedOrderNumber
                                            ]
                                        ]
                                            .filter(Boolean)
                                            .map(([label, value], i) => (
                                                <div
                                                    key={i}
                                                    className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all"
                                                >
                                                    <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">
                                                        {label}
                                                    </p>
                                                    <p className="font-bold text-gray-900 text-base truncate">
                                                        {value || "-"}
                                                    </p>
                                                </div>
                                            ))}

                                    </div>
                                </div>

                                {/* ✏️ Divider */}
                                <div className="relative my-12">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <div className="bg-linear-to-r from-orange-500 to-red-500 px-6 py-3 rounded-full shadow-lg">
                                            <div className="flex items-center gap-3 text-white">
                                                <span className="text-2xl">✏️</span>
                                                <p className="font-bold text-lg">Fillup Mode Starts Below</p>
                                                <span className="text-2xl">📝</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className={`${selectData
                            ? ""
                            : "opacity-50 cursor-not-allowed pointer-events-none"
                            }`}>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <InputFiled
                                    {...InputConst[66]}
                                    value={formData.swname}
                                    handleChange={handleChange}
                                />
                                <InputFiled
                                    {...InputConst[67]}
                                    value={formData.swtechnicalEmail}
                                    handleChange={handleChange}
                                />
                                <InputFiled
                                    {...InputConst[68]}
                                    value={formData.swphone}
                                    handleChange={handleChange}
                                />
                                <SelectField
                                    {...InputConst[42]}
                                    value={formData.isMailSent}
                                    handleChange={handleChange}
                                />
                            </div>
                            <DocumentsSection Docs={Docs} setDocs={setDocs} /></div>
                    </div >
                    <div className={`${selectData
                        ? ""
                        : "opacity-50 cursor-not-allowed pointer-events-none"
                        }`}>

                        <div className="flex justify-center mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="text-white bg-white hover:bg-indigo-200 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-8 py-3 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Save Docs details
                            </button>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default InputForm;
