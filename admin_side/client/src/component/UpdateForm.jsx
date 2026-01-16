import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { docsVal, formval, InputConst } from "../utils/FieldConstant";
import { InputFiled, SelectField, TextArea } from "./subField";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import LoadingSkeleton from "../utils/loaderForm";
import { EngineerAssignment } from "./engineerInpt";
import DocumentsSection from "../utils/addDevDocs";
import apiClient from "../api/axiosClient";
import { useDispatch } from "react-redux";
import { toggleDevMode, toggleMode } from "../redux/slices/uiSlice";

const UpdateForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    swname: "",
    swtechnicalEmail: "",
    swphone: "",
    status: "",
    service: "",
    priority: "",
    Development: "",
    LogicPlace: "",
    ScadaPlace: "",
    devScope: "",
    CommisinionPO: "",
    LinkedOrderNumber: "",
    Workcommission: {
      commissioning: false,
      erection: false,
      instrumentation: false,
    },
    commScope: "",
    serviceDaysMention: "",
    SrvsdaysInLots: {
      lots: 0,
      value: 0,
      unit: "DAYS"
    },
    servicedayrate: 0,
    expenseScopeside: "",
    companyExpense: [],
    clientExpense: [],

    engineerName: "",
    finalMomnumber: "",
    actualStartDate: "",
    actualEndDate: "",
    bill: "",
    dueBill: "",
    billStatus: "",
    visitDate: "",
    visitendDate: "",
    momDate: "",
    momsrNo: "",
    daysspendsite: "",
    startDate: "",
    endDate: "",
    duration: "",
    expenseScope: "",
    supplyStatus: "",
    requestDate: "",
    StartChecklist: "",
    EndChecklist: "",
    actualVisitDuration: "",
    ContactPersonNumber: "",
    ContactPersonName: "",
    ExpensSubmission: "",
    BackupSubmission: "",
    isMailSent: "",
    isDevlopmentApproved: "",
    DevelopmentSetcion: "",
  });
  const navigate = useNavigate();
  const [engineerData, setEngineerData] = useState([]);
  const [orderDetails, setOrderDetails] = useState()
  const [Docs, setDocs] = useState(docsVal);

  useEffect(() => {
    const fetchByid = async () => {
      try {
        const res = await apiClient.get(`/fetch/${id}`);
        if (res?.data?.data) {
          const { OrderMongoId, ...otherData } = res.data.data;
          setOrderDetails(OrderMongoId)
          setFormData((prev) => ({ ...prev, ...otherData }));
          setDocs((prev) => ({
            ...prev,
            CustomerDevDocuments: otherData?.CustomerDevDocuments,
            SIEVPLDevDocuments: otherData?.SIEVPLDevDocuments,
            swDevDocumentsforFat: otherData?.swDevDocumentsforFat,
            inspectionDocuments: otherData?.inspectionDocuments,
            dispatchDocuments: otherData?.dispatchDocuments,
            PostCommisionDocuments: otherData?.PostCommisionDocuments,
            SIEVPLDevDocumentsRemarks: otherData?.SIEVPLDevDocumentsRemarks,
            CustomerDevDocumentsRemarks: otherData?.CustomerDevDocumentsRemarks,
            lotval: otherData?.lotval,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    if (id) fetchByid();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "CommisinionPO") {
      setFormData(prev => ({
        ...prev,
        CommisinionPO: value,
        ...(value === "NO" && {
          Workcommission: {
            commissioning: false,
            erection: false,
            instrumentation: false
          }
        })
      }));
      return;
    }
    if (name === "serviceDaysMention") {
      setFormData(prev => ({
        ...prev,
        serviceDaysMention: value,
        ...(value === "NO" && {
          SrvsdaysInLots: { lots: 0, value: 0, unit: "DAYS" },
          servicedayrate: 0
        })
      }));
      return;
    }
    if (name === "expenseScopeside") {
      setFormData(prev => ({
        ...prev,
        expenseScopeside: value,
        ...(value === "NO" && {
          companyExpense: [],
          clientExpense: []
        })
      }));
      return;
    }
    if (name === "status") {
      setFormData(prev => ({
        ...prev,
        status: value,
        ...(value !== "running" && {
          engineerName: [],
          engineerData: []
        })
      }));
      return;
    }
    if (name === "Development") {
      setFormData(prev => ({
        ...prev,
        Development: value,
        ...(value === "LOGIC" && { ScadaPlace: "" }),
        ...(value === "SCADA" && { LogicPlace: "" }),
        ...((value === "" || value === "N/A") && {
          LogicPlace: "",
          ScadaPlace: "",
          isDevlopmentApproved: "NO"
        })
      }));
      return;
    }
    if (name === "service") {
      setFormData(prev => ({
        ...prev,
        service: value,
        ...(value !== "COMMISSIONING" && {
          CommisinionPO: "",
          Workcommission: {
            commissioning: false,
            erection: false,
            instrumentation: false
          }
        })
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

  const handleMomDateChange = (newDate) => {
    setFormData((prev) => {
      const updatedDates = [...(prev.momDate || [])];
      updatedDates.push(newDate);
      return { ...prev, momDate: updatedDates };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const {
      actualEndDate,
      actualStartDate,
      visitDate,
      visitendDate,
    } = formData;

    if (
      actualStartDate &&
      actualEndDate &&
      new Date(actualStartDate) > new Date(actualEndDate)
    ) {
      toast.error("Actual Start date must be less than Actual end date");
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
      const finalData = {
        ...formData,
        engineerName: Array.from(
          new Set([
            ...(formData.engineerName || []),
            ...(engineerData
              ?.map((eng) => eng.engineerName?.trim())
              .filter(Boolean) || []),
          ])
        ),
        momsrNo:
          typeof formData.momsrNo === "string"
            ? formData.momsrNo
              .split(",")
              .map((name) => name.trim())
              .filter((name) => name.length > 0)
            : formData.momsrNo,
        engineerData,
        ...Docs,
      };

      await apiClient.put(`/update/${id}`, finalData);
      toast.success("Data updated successfully");
      setFormData(formval);
      setDocs(docsVal);
      dispatch(toggleMode())
      dispatch(toggleDevMode())
      navigate("/page", {
        replace: true,
      });
    } catch (e) {
      if (e.response) {
        toast.error(e.response?.data?.message);
      } else {
        toast.error("something went wrong");
      }
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) {
    return <LoadingSkeleton />;
  }

  if (!location.state?.fromButton) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="transition-all duration-300 pt-16 min-h-screen bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mt-6 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-6xl border border-white/30">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-900 drop-shadow-md">
          {orderDetails?.client.toUpperCase()}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-linear-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4 border-b border-indigo-200 pb-3">
              <span className="text-2xl mr-2">📋</span>
              <h3 className="font-bold text-lg text-indigo-900">Basic Order Information</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                ["Job Number", orderDetails?.jobNumber],
                ["Entity Type", orderDetails?.entityType],
                ["SO Type", orderDetails?.soType],
                ["Booking Date", orderDetails?.bookingDate],
                ["Client Name", orderDetails?.client],
                ["End User", orderDetails?.endUser],
                ["Site Location", orderDetails?.site],
                ["SIEPL Acct. Mgr. Email ", orderDetails?.concerningSalesManager?.name],
                ["Client Tech Person Name", orderDetails?.name],
                ["Client Tech Person Email", orderDetails?.technicalEmail],
                ["Client Tech Person Ph", orderDetails?.phone],
              ].map(([label, value], i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                  <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
                  <p className="font-bold text-gray-900 text-base truncate">{value || "-"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-linear-to-br from-emerald-50 to-green-100 p-5 rounded-xl border border-emerald-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4 border-b border-emerald-200 pb-3">
              <span className="text-2xl mr-2">💰</span>
              <h3 className="font-bold text-lg text-emerald-900">Order Value</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ["Supply Value", orderDetails?.orderValueSupply],
                ["Service Value", orderDetails?.orderValueService],
              ].map(([label, value], i) => (
                <div key={i} className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all hover:scale-105 transform">
                  <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wide mb-2">{label}</p>
                  <p className="font-bold text-gray-900 text-xl">₹ {value || "0"}</p>
                </div>
              ))}

              <div className="bg-linear-to-br from-emerald-100 to-emerald-200 p-4 rounded-lg border-2 border-emerald-400 shadow-md">
                <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wide mb-2">Total Value</p>
                <p className="font-extrabold text-emerald-900 text-xl">
                  ₹ {orderDetails?.orderValueTotal || "0"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4 border-b border-purple-200 pb-3">
              <span className="text-2xl mr-2">📦</span>
              <h3 className="font-bold text-lg text-purple-900">PO Details</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">PO Received</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${orderDetails?.poReceived === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {orderDetails?.poReceived || "-"}
                </span>
              </div>

              {[
                ["Order Number", orderDetails?.orderNumber],
                ["Order Date", orderDetails?.orderDate],
                ["PO Delivery Date", orderDetails?.deleveryDate],
              ].map(([label, value], i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                  <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
                  <p className="font-bold text-gray-900 text-base">{value || "-"}</p>
                </div>
              ))}

              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">Amendment Reqrd</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${orderDetails?.amndReqrd === "Yes" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>
                  {orderDetails?.amndReqrd || "-"}
                </span>
              </div>
            </div>
          </div>

          {[["Target Delivery", orderDetails?.actualDeleveryDate],
          ].map(([label, value], i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
              <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
              <p className="font-bold text-gray-900 text-base">{value || "-"}</p>
            </div>
          ))}

          {/* service details */}
          <div className="bg-indigo-50 p-6 rounded-lg border-2 border-green-300 shadow-sm">
            <h3 className="font-bold text-lg  mb-4">
              💰 Scope Details Regarding -{formData?.soType || ""}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* <SelectField
                        {...InputConst[29]}
                        handleChange={handleChange}
                        value={formData.status}
                      /> */}

              <SelectField
                {...InputConst[32]}
                handleChange={handleChange}
                value={formData.service}
              />


              {["DEV", "DEVCOM", "COMMISSIONING"].includes(formData.service) && <SelectField
                {...InputConst[31]}
                handleChange={handleChange}
                value={formData.priority}
              />}

            </div>
          </div>

          {/* 🔧 Development & Technical */}
          {
            ["DEV", "DEVCOM"].includes(formData.service) && <div className="bg-indigo-50 p-6 rounded-lg border-2 border-cyan-300 shadow-sm">
              <h3 className="font-bold text-lg text-cyan-800 mb-4">
                🔧 Development & Technical
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  {...InputConst[40]}
                  value={formData.Development}
                  handleChange={handleChange}
                />
                {["BOTH", "LOGIC"].includes(formData.Development) && (
                  <SelectField
                    {...InputConst[59]}
                    value={formData.LogicPlace}
                    handleChange={handleChange}
                  />
                )}

                {["BOTH", "SCADA"].includes(formData.Development) && (
                  <SelectField
                    {...InputConst[60]}
                    value={formData.ScadaPlace}
                    handleChange={handleChange}
                  />
                )}
              </div>
              {
                ["BOTH", "LOGIC", "SCADA"].includes(formData.Development) &&
                <div className="pt-5">
                  <TextArea
                    {...InputConst[4]}
                    value={formData.devScope}
                    handleChange={handleChange}
                  />
                </div>
              }
            </div>
          }

          {/* this is the commisioning scope */}

          {
            ["COMMISSIONING", "DEVCOM"].includes(formData.service) && <div className="bg-indigo-50 p-6 rounded-lg border-2 border-green-300 shadow-sm">

              <h3 className="font-bold text-lg text-green-800 mb-4">
                📝 Commissioning
              </h3>

              {/* Select PO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <SelectField
                  {...InputConst[61]}
                  value={formData.CommisinionPO}
                  handleChange={handleChange}
                />

                {
                  formData?.CommisinionPO === "SEPERATE" && <InputFiled
                    {...InputConst[65]}
                    value={formData.LinkedOrderNumber}
                    handleChange={handleChange}
                  />
                }
              </div>

              {/* Show service scope only if YES */}
              {formData?.CommisinionPO === "YES" && (
                <>
                  <div className="mt-6">
                    <h4 className="font-semibold text-green-700 mb-3">Commisioning Includes</h4>

                    <div className="flex flex-wrap gap-4">

                      {/* Supervision of Commissioning */}
                      <label className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:shadow-sm transition">
                        <input
                          type="checkbox"
                          name="Workcommission.commissioning"
                          checked={formData?.Workcommission?.commissioning}
                          onChange={handleChange}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <span className="text-gray-800 font-medium text-sm">
                          Supervision of Commissioning
                        </span>
                      </label>

                      {/* Erection */}
                      <label className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:shadow-sm transition">
                        <input
                          type="checkbox"
                          name="Workcommission.erection"
                          checked={formData?.Workcommission?.erection}
                          onChange={handleChange}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <span className="text-gray-800 font-medium text-sm">
                          Erection
                        </span>
                      </label>

                      {/* Instrumentation */}
                      <label className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:shadow-sm transition">
                        <input
                          type="checkbox"
                          name="Workcommission.instrumentation"
                          checked={formData?.Workcommission?.instrumentation}
                          onChange={handleChange}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <span className="text-gray-800 font-medium text-sm">
                          Instrumentation
                        </span>
                      </label>

                    </div>
                  </div>
                  <div className="pt-5">
                    <TextArea
                      {...InputConst[33]}
                      handleChange={handleChange}
                      value={formData.commScope}
                    />
                  </div>
                </>
              )}
            </div>
          }

          {/* lots and man days info */}
          {(formData?.CommisinionPO === "YES") && (
            <div className="bg-indigo-50 p-6 rounded-lg border-2 border-green-300 shadow-sm">
              <h3 className="font-bold text-lg  mb-4">
                💰 Service days details
              </h3>

              <SelectField
                {...InputConst[63]}
                value={formData.serviceDaysMention}
                handleChange={handleChange}
              />
              {formData?.serviceDaysMention === "YES" && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Service Days in Lots
                  </label>

                  <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden">

                    <div className="h-8 w-px bg-gray-200"></div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Of Lots */}
                        <div>
                          <label className="text-xs text-gray-600 font-medium">Of Lots</label>
                          <input
                            type="number"
                            name="SrvsdaysInLots.lots"
                            value={formData.SrvsdaysInLots?.lots || ""}
                            onChange={handleChange}
                            required={true}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none"
                            placeholder="0"
                            min="0"
                          />
                        </div>

                        {/* Of Days */}
                        <div>
                          <label className="text-xs text-gray-600 font-medium">Of Days</label>
                          <input
                            type="number"
                            name="SrvsdaysInLots.value"
                            value={formData.SrvsdaysInLots?.value || ""}
                            onChange={handleChange}
                            required={true}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none"
                            placeholder="0"
                            min="0"
                          />
                        </div>

                        {/* Unit Selector */}
                        <div>
                          <label className="text-xs text-gray-600 font-medium">Unit</label>
                          <div className="relative">
                            <select
                              name="SrvsdaysInLots.unit"
                              value={formData.SrvsdaysInLots?.unit || "DAYS"}
                              onChange={handleChange}
                              required={true}
                              className="w-full appearance-none px-4 py-3 border-2 border-gray-200 rounded-xl outline-none cursor-pointer"
                            >
                              <option value="DAYS">Days</option>
                              <option value="MAN-DAYS">Man-Days</option>
                            </select>

                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  <InputFiled
                    {...InputConst[64]}
                    value={formData.servicedayrate}
                    handleChange={handleChange}
                  />
                </div>
              </div>}
            </div>
          )}

          {
            ["DEV", "DEVCOM", "COMMISSIONING"].includes(formData.service) && <>


              {formData?.CommisinionPO === "YES" && <div className="bg-indigo-50 p-6 rounded-lg border-2 border-green-300 shadow-sm">

                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  <h2 className="text-lg font-bold text-green-800">
                    📝 Expenses
                  </h2>
                </div>

                <div className="mb-6">
                  <SelectField
                    {...InputConst[62]}
                    value={formData.expenseScopeside}
                    handleChange={handleChange}
                  />
                </div>
                {
                  formData?.expenseScopeside === "YES" &&
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="bg-white/90 p-6 rounded-2xl border-2 border-blue-200 shadow-sm">
                      <h3 className="text-base font-bold text-blue-700 mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                        SIEPL Scope
                      </h3>
                      <div className="space-y-3">

                        <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                          <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                            Travel
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="companyExpense"
                              value="travel"
                              checked={formData.companyExpense?.includes('travel')}
                              onChange={handleChange}
                              className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                            />
                            <svg
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </label>

                        {/* Accommodation */}
                        <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                          <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                            Accommodation
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="companyExpense"
                              value="accommodation"
                              checked={formData.companyExpense?.includes('accommodation')}
                              onChange={handleChange}
                              className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                            />
                            <svg
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </label>

                        {/* Food */}
                        <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                          <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                            Food
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="companyExpense"
                              value="food"
                              checked={formData.companyExpense?.includes('food')}
                              onChange={handleChange}
                              className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                            />
                            <svg
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </label>

                        {/* Conveyance */}
                        <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                          <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                            Conveyance
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="companyExpense"
                              value="conveyance"
                              checked={formData.companyExpense?.includes('conveyance')}
                              onChange={handleChange}
                              className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                            />
                            <svg
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </label>

                        {/* no expenses */}
                        <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                          <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                            NO EXPENSES
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="companyExpense"
                              value="no_expenses"
                              checked={formData.companyExpense?.includes('no_expenses')}
                              onChange={handleChange}
                              className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                            />
                            <svg
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </label>

                      </div>
                    </div>

                    {/* Client Side */}
                    <div className="bg-white/90 p-6 rounded-2xl border-2 border-green-200 shadow-sm">
                      <h3 className="text-base font-bold text-green-700 mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        Cutomer Scope
                      </h3>
                      <div className="space-y-3">
                        {/* Travel */}
                        <label className="group flex items-center justify-between p-3 bg-green-50/50 border border-green-100 rounded-xl cursor-pointer hover:bg-green-100/60 hover:border-green-300 hover:shadow-md transition-all duration-200">
                          <span className="font-medium text-gray-800 text-sm group-hover:text-green-700 transition-colors">
                            Travel
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="clientExpense"
                              value="travel"
                              checked={formData.clientExpense?.includes('travel')}
                              onChange={handleChange}
                              className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-green-500 checked:to-green-600 checked:border-green-600 hover:border-green-400 focus:ring-2 focus:ring-green-200"
                            />
                            <svg
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </label>

                        {/* Accommodation */}
                        <label className="group flex items-center justify-between p-3 bg-green-50/50 border border-green-100 rounded-xl cursor-pointer hover:bg-green-100/60 hover:border-green-300 hover:shadow-md transition-all duration-200">
                          <span className="font-medium text-gray-800 text-sm group-hover:text-green-700 transition-colors">
                            Accommodation
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="clientExpense"
                              value="accommodation"
                              checked={formData.clientExpense?.includes('accommodation')}
                              onChange={handleChange}
                              className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-green-500 checked:to-green-600 checked:border-green-600 hover:border-green-400 focus:ring-2 focus:ring-green-200"
                            />
                            <svg
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </label>

                        {/* Food */}
                        <label className="group flex items-center justify-between p-3 bg-green-50/50 border border-green-100 rounded-xl cursor-pointer hover:bg-green-100/60 hover:border-green-300 hover:shadow-md transition-all duration-200">
                          <span className="font-medium text-gray-800 text-sm group-hover:text-green-700 transition-colors">
                            Food
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="clientExpense"
                              value="food"
                              checked={formData.clientExpense?.includes('food')}
                              onChange={handleChange}
                              className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-green-500 checked:to-green-600 checked:border-green-600 hover:border-green-400 focus:ring-2 focus:ring-green-200"
                            />
                            <svg
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </label>

                        {/* Conveyance */}
                        <label className="group flex items-center justify-between p-3 bg-green-50/50 border border-green-100 rounded-xl cursor-pointer hover:bg-green-100/60 hover:border-green-300 hover:shadow-md transition-all duration-200">
                          <span className="font-medium text-gray-800 text-sm group-hover:text-green-700 transition-colors">
                            Conveyance
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="clientExpense"
                              value="conveyance"
                              checked={formData.clientExpense?.includes('conveyance')}
                              onChange={handleChange}
                              className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-green-500 checked:to-green-600 checked:border-green-600 hover:border-green-400 focus:ring-2 focus:ring-green-200"
                            />
                            <svg
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </label>

                        {/* no expenses */}

                        <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                          <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                            NO EXPENSES
                          </span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="clientExpense"
                              value="no_expenses"
                              checked={formData.clientExpense?.includes('no_expenses')}
                              onChange={handleChange}
                              className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-green-500 checked:to-green-600 checked:border-green-600 hover:border-green-400 focus:ring-2 focus:ring-green-200"
                            />
                            <svg
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                }
              </div>}
            </>
          }

          <div className="bg-indigo-50 p-6 rounded-lg border-2 border-blue-300 shadow-sm">
            <h3 className="font-bold text-lg text-blue-800 mb-4">
              📅 Timeline & Scheduling
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputFiled
                {...InputConst[16]}
                required={false}
                value={formData.requestDate}
                handleChange={handleChange}
              />



              <InputFiled
                {...InputConst[18]}
                required={false}
                value={formData.visitDate}
                handleChange={handleChange}
              />
              <InputFiled
                {...InputConst[19]}
                required={false}
                value={formData.visitendDate}
                handleChange={handleChange}
              />

              <InputFiled
                {...InputConst[14]}
                required={false}
                value={formData.actualStartDate}
                handleChange={handleChange}
              />


              <InputFiled
                {...InputConst[15]}
                required={false}
                value={formData.actualEndDate}
                handleChange={handleChange}
              />
              <InputFiled
                {...InputConst[39]}
                required={false}
                value={formData.daysspendsite}
                handleChange={handleChange}
              />
              <InputFiled
                {...InputConst[2]}
                required={false}
                value={formData.actualVisitDuration}
                handleChange={handleChange}
              />

            </div>
          </div>


          {/* 👷 Project Status & Engineer Assignment */}
          <div className="bg-indigo-50 p-6 rounded-lg border-2 border-orange-300 shadow-sm">
            <h3 className="font-bold text-lg text-orange-800 mb-4">
              👷 Project Status & Engineer Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                {...InputConst[29]}
                value={formData.status}
                handleChange={handleChange}
              />
              <SelectField
                {...InputConst[26]}
                value={formData.supplyStatus}
                handleChange={handleChange}
              />

              {(formData.status === "running") && (
                <EngineerAssignment setEngineerData={setEngineerData} />
              )}
            </div>
          </div>

          {/* 🔧 Development & Technical */}
          <div className="bg-indigo-50 p-6 rounded-lg border-2 border-cyan-300 shadow-sm">
            <h3 className="font-bold text-lg text-cyan-800 mb-4">
              🔧 Development & Technical Track
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {!["", "N/A"].includes(formData?.Development) && (
                <SelectField
                  {...InputConst[43]}
                  value={formData.isDevlopmentApproved}
                  handleChange={handleChange}
                />
              )}
            </div>
          </div>

          {/* ✅ Checklists & Submissions */}
          <div className="bg-indigo-50 p-6 rounded-lg border-2 border-pink-300 shadow-sm">
            <h3 className="font-bold text-lg text-pink-800 mb-4">
              ✅ Checklists & Submissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                {...InputConst[30]}
                handleChange={handleChange}
                value={formData.StartChecklist}
              />
              <SelectField
                {...InputConst[34]}
                handleChange={handleChange}
                value={formData.EndChecklist}
              />
              <SelectField
                {...InputConst[37]}
                handleChange={handleChange}
                value={formData.BackupSubmission}
              />
              <SelectField
                {...InputConst[38]}
                handleChange={handleChange}
                value={formData.ExpensSubmission}
              />

            </div>
          </div>

          {/* 📝 MOM & Documentation */}
          <div className="bg-indigo-50 p-6 rounded-lg border-2 border-yellow-300 shadow-sm">
            <h3 className="font-bold text-lg text-yellow-800 mb-4">
              📝 MOM & Documentation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <InputFiled
                {...InputConst[11]}
                value={formData.momsrNo}
                handleChange={handleChange}
              />
              <InputFiled
                {...InputConst[20]}
                value={formData.momDate}
                handleChange={handleChange}
              />
              <InputFiled
                {...InputConst[24]}
                required={false}
                value={formData.finalMomnumber}
                handleChange={handleChange}
              />

            </div>
          </div>


          {/* <DocumentsSection Docs={Docs} setDocs={setDocs} isDisable={true} /> */}

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-8 py-3 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Update
            </button>
          </div>
        </form>
      </div >
    </div >


  );
};

export default UpdateForm;
