import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { dateFields, formval, docsVal } from "../utils/FieldConstant";
import FormField from "./inputField";
import { useAppContext } from "../appContex";
import { addProject, fetfchOrdersAllnew } from "../utils/apiCall";
import { FaFolderPlus } from "react-icons/fa6";
import NotifiNewOrd from "./NotifiNewOrd";

import { InputConst } from "../utils/FieldConstant";
import { InputFiled, SelectField, TextArea } from "./subField";
import { EngineerAssignment } from "./engineerInpt";
import DocumentsSection from "../utils/addDevDocs";

const InputForm = () => {
    const { toggle, setToggle, setToggleDev } = useAppContext();
    const [formData, setFormData] = useState(formval);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceJobnumber, setdebounceJobNumber] = useState("");
    const [engineerData, setEngineerData] = useState([]);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectData, setSelectData] = useState(null);
    const [Docs, setDocs] = useState(docsVal);
    useEffect(() => {
        if (selectData) {
            const formatDate = (date) => {
                if (!date) return "";
                return new Date(date).toISOString().split("T")[0];
            };

            setFormData((prev) => ({
                ...prev,
                OrderMongoId: selectData._id,
                entityType: selectData.entityType || prev.entityType,
                soType: selectData.soType || prev.soType,
                jobNumber: selectData.jobNumber || "",
                client: selectData.client || "",
                endUser: selectData.endUser || "",
                location: selectData.site || "",
                orderNumber: selectData.orderNumber || "",
                orderDate: formatDate(selectData.orderDate),
                technicalEmail: selectData.technicalEmail || "",
                billStatus: selectData.billingStatus || "",
                bill: selectData.netOrderValue || "",
                dueBill: selectData.netOrderValue || "",
                bookingDate: formatDate(selectData.bookingDate),
                name: selectData.name || "",
                email: selectData.email || "",
                phone: selectData.phone || "",
                orderValueSupply: selectData.orderValueSupply || 0,
                orderValueService: selectData.orderValueService || 0,
                orderValueTotal: selectData.orderValueTotal || 0,
                netOrderValue: selectData.netOrderValue || 0,
                poReceived: selectData.poReceived || "",
                deleveryDate: formatDate(selectData.deleveryDate),
                actualDeleveryDate: formatDate(selectData.actualDeleveryDate),
                amndReqrd: selectData.amndReqrd || "",
            }));
            setDocs(docsVal)
        }
    }, [selectData]);
    useEffect(() => {
        const getOrdersnew = async () => {
            try {
                const val = await fetfchOrdersAllnew();
                if (val) {
                    setData(val?.orders);
                }
            } catch (error) {
                console.error("Failed to fetch new Projects", error);
            }
        };
        getOrdersnew();
    }, [toggle]);

    useEffect(() => {
        const handelJob = setTimeout(() => {
            setdebounceJobNumber(formData.jobNumber);
        }, 10);
        return () => clearTimeout(handelJob);
    }, [formData.jobNumber]);

    useEffect(() => {
        if (debounceJobnumber.length > 2) {
            const firstChar = debounceJobnumber[0].toUpperCase();
            const secondChar = debounceJobnumber[1].toUpperCase();
            const entityMap = {
                N: "SI NOIDA",
                S: "SI DELHI",
                P: "SI PUNE",
                M: "MS DELHI",
            };

            const soTypeMap = {
                P: "PROJECT",
                A: "AMC",
                R: "SERVICE",
            };

            const updated = {};
            if (entityMap[firstChar]) {
                updated.entityType = entityMap[firstChar];
            }
            if (soTypeMap[secondChar]) {
                updated.soType = soTypeMap[secondChar];
                if (secondChar === "R") {
                    updated.service = "SERVICE";
                } else {
                    updated.service = "N/A";
                }
            }

            if (Object.keys(updated).length > 0) {
                setFormData((prev) => ({ ...prev, ...updated }));
            }
        }
    }, [debounceJobnumber]);

    useEffect(() => {
        setFormData((prevData) => {
            const newData = { ...prevData };
            dateFields.forEach((field) => {
                if (Array.isArray(prevData[field])) {
                    newData[field] = [];
                } else {
                    newData[field] = "";
                }
            });
            return newData;
        });
    }, [formData.status]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "expenseScopeside" && value === "NO") {
            setFormData((prev) => ({
                ...prev,
                expenseScopeside: value,
                companyExpense: [],
                clientExpense: [],
            }));
            return;
        }
        if (name === "companyExpense" || name === "clientExpense") {
            setFormData((prev) => {
                const prevArray = prev[name] || [];
                return {
                    ...prev,
                    [name]: checked
                        ? [...prevArray, value]
                        : prevArray.filter((v) => v !== value),
                };
            });
            return;
        }
        if (name.startsWith("Workcommission.")) {
            const [, key] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                Workcommission: {
                    ...prev.Workcommission,
                    [key]: checked,
                },
            }));
            return;
        }
        if (name.includes(".")) {
            const [parent, child] = name.split(".");

            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]:
                        ["value", "lots"].includes(child)
                            ? Number(value)
                            : value,
                },
            }));

            return;
        }
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };




    const validateDocs = (docsVal) => {
        const VALID_VALUES = ["YES", "NO", "N/A"];
        console.log(docsVal);
        return ![
            ...Object.values(docsVal.internalDocuments),
            ...Object.values(docsVal.customerDocuments),
            ...Object.values(docsVal.dispatchDocuments),
        ].every((val) => VALID_VALUES.includes(val));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateDocs(Docs)) {
            toast.error(`Please select YES, NO, or N/A for Documents}`);
            return;
        }
        setIsLoading(true);
        const {
            actualEndDate,
            startDate,
            endDate,
            actualStartDate,
            visitDate,
            visitendDate,
            deleveryDate,
            requestDate,
        } = formData;

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            toast.error("Start date must be less than end date");
            false;
            return;
        }

        if (
            actualStartDate &&
            actualEndDate &&
            new Date(actualStartDate) > new Date(actualEndDate)
        ) {
            toast.error("Actual Start date must be less than Acual end date");
            setIsLoading(false);
            return;
        }

        if (
            visitDate &&
            visitendDate &&
            new Date(visitDate) > new Date(visitendDate)
        ) {
            toast.error("Visit Start date must be less than Visit end date");
            setIsLoading(false);
            return;
        }
        try {
            await addProject({
                formData: formData,
                engineerData: engineerData,
                Docs: Docs,
            });
            setToggleDev((prev) => !prev);
            setFormData(formval);
            setDocs(docsVal);
            setToggle((prev) => !prev);
        } catch (e) {
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
                                            ["Job Number", formData.jobNumber],
                                            ["Entity Type", formData.entityType],
                                            ["SO Type", formData.soType],
                                            ["Booking Date", formData.bookingDate],
                                            ["Client Tech Name", formData.name],
                                            ["Client Tech Email", formData.technicalEmail],
                                            ["Client Tech Ph", formData.phone],
                                            ["Client", formData.client],
                                            ["End User", formData.endUser],
                                            ["Location", formData.location],
                                        ].map(([label, value], i) => (
                                            <div key={i} className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                                                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
                                                <p className="font-bold text-gray-900 text-base truncate">{value || "-"}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 💰 Order Value */}
                                <div className="bg-linear-to-br from-emerald-50 to-green-100 p-5 rounded-xl border border-emerald-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex items-center mb-4 border-b border-emerald-200 pb-3">
                                        <span className="text-2xl mr-2">💰</span>
                                        <h3 className="font-bold text-lg text-emerald-900">Order Value</h3>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            ["Supply Value", formData.orderValueSupply],
                                            ["Service Value", formData.orderValueService],
                                        ].map(([label, value], i) => (
                                            <div key={i} className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all hover:scale-105 transform">
                                                <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wide mb-2">{label}</p>
                                                <p className="font-bold text-gray-900 text-xl">₹ {value || "0"}</p>
                                            </div>
                                        ))}

                                        <div className="bg-linear-to-br from-emerald-100 to-emerald-200 p-4 rounded-lg border-2 border-emerald-400 shadow-md">
                                            <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wide mb-2">Total Value</p>
                                            <p className="font-extrabold text-emerald-900 text-xl">
                                                ₹ {formData.orderValueTotal || "0"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 📦 PO Details */}
                                <div className="bg-linear-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex items-center mb-4 border-b border-purple-200 pb-3">
                                        <span className="text-2xl mr-2">📦</span>
                                        <h3 className="font-bold text-lg text-purple-900">PO Details</h3>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {[
                                            ["Order Number", formData.orderNumber],
                                            ["Order Date", formData.orderDate],
                                            ["PO Delivery Date", formData.deleveryDate],
                                            ["Target Delivery", formData.actualDeleveryDate],
                                        ].map(([label, value], i) => (
                                            <div key={i} className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                                                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
                                                <p className="font-bold text-gray-900 text-base">{value || "-"}</p>
                                            </div>
                                        ))}

                                        {/* PO Received */}
                                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                                            <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">PO Received</p>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${formData.poReceived === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {formData.poReceived || "-"}
                                            </span>
                                        </div>

                                        {/* Amendment Required */}
                                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                                            <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">Amendment Reqrd</p>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${formData.amndReqrd === "Yes" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>
                                                {formData.amndReqrd || "-"}
                                            </span>
                                        </div>
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

                        <DocumentsSection Docs={Docs} setDocs={setDocs} />
                    </div >
                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="text-white bg-white hover:bg-indigo-200 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-8 py-3 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Submit Docs details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InputForm;
