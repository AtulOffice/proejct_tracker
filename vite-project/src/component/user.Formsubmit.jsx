import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../appContex";
import toast from "react-hot-toast";
import useDebounce from "../utils/useDebounce";
import { formval, UserSideConst } from "../utils/FieldConstant";
import { InputFiled, SelectField } from "./subField";
import ExcelDocsInput from "../utils/Excelimport";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const InputForm = () => {
  const userformval = {
    workstatus: "",
    currentEngineerName: "",
    projectName: "",
    engineerName: [],
    soType: "PROJECT",
    statusStartDate: "",
    statusEndDate: "",
    jobNumber: "",
    orderNumber: "",
    location: "",
    // client: "",
    // visitDate: "",
    // entityType: "SI DELHI",
    // visitendDate: "",
    // momDate: "",
    // momsrNo: [],
    // endUser: "",
    // orderDate: "",
    // daysspendsite: "",
    // startDate: "",
    // endDate: "",
    // duration: "",
  };
  const { fullData } = useAppContext();
  const [formData, setFormData] = useState(userformval);
  const [isDataFound, setIsDataFound] = useState(false);

  const debouncedJobNumber = useDebounce(formData.jobNumber, 2000);
  const lastFetchedRef = useRef("");

  useEffect(() => {
    const jobNumber = debouncedJobNumber?.toLowerCase();
    if (debouncedJobNumber === "") {
      setIsDataFound(false);
    }
    if (!jobNumber || lastFetchedRef.current === jobNumber) return;

    const filteredData = fullData.find(
      (item) =>
        item.jobNumber?.toLowerCase() === jobNumber.toLowerCase() &&
        item.status === "running"
    );

    if (filteredData) {
      setIsDataFound(true);
      toast.success("Data fetched successfully");
      lastFetchedRef.current = jobNumber;
      setFormData((prev) => ({
        ...prev,
        workstatus: filteredData.workstatus,
        projectName: filteredData.projectName,
        engineerName: filteredData.engineerName,
        entityType: filteredData.entityType,
        soType: filteredData.soType,
        location: filteredData.location,
        orderNumber: filteredData?.orderNumber,
      }));
    } else {
      setIsDataFound(false);
      toast.error(
        "Either the job number is invalid or the project is not in running status"
      );
      setFormData((prev) => ({ ...userformval, jobNumber: prev.jobNumber }));
      lastFetchedRef.current = "";
    }
  }, [debouncedJobNumber, fullData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.statusStartDate) > new Date(formData.statusEndDate)) {
      toast.error("the status start date must be less than then end date");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/worksts/save",
        formData
      );
      setIsDataFound(false);
      lastFetchedRef.current = "";
      setFormData(userformval);
      toast.success("Work Status saved successfully");
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Something went wrong while submitting.");
      }
    }
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  console.log(isDataFound);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-500 to-pink-200 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-4xl border border-white/30">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white drop-shadow-md">
          PROJECT WORK STATUS BY ENGINEER SIDE
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputFiled
                {...UserSideConst[4]}
                value={formData.jobNumber}
                handleChange={handleChange}
              />
            </div>
            <AnimatePresence>
              {isDataFound && (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {formData.orderNumber && (
                    <InputFiled
                      {...UserSideConst[5]}
                      value={formData.orderNumber}
                      handleChange={handleChange}
                    />
                  )}

                  <InputFiled
                    {...UserSideConst[0]}
                    value={formData.projectName}
                    handleChange={handleChange}
                  />
                  <SelectField
                    {...UserSideConst[17]}
                    value={formData.soType}
                    handleChange={handleChange}
                  />
                  <InputFiled
                    {...UserSideConst[12]}
                    value={formData.location}
                    handleChange={handleChange}
                  />
                  <InputFiled
                    {...UserSideConst[20]}
                    value={formData.currentEngineerName}
                    handleChange={handleChange}
                  />

                  <div className="md:col-span-2">
                    <InputFiled
                      {...UserSideConst[13]}
                      value={formData.engineerName.join(", ")}
                      handleChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="statusStartDate"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      From
                      {
                        <span
                          className="text-red-500 text-xl"
                          style={{ color: "#ef4444" }}
                        >
                          {" "}
                          *
                        </span>
                      }
                    </label>
                    <input
                      type="date"
                      id="statusStartDate"
                      name="statusStartDate"
                      value={formData.statusStartDate}
                      onChange={handleChange}
                      required
                      className="bg-white/30 border border-white/40 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="statusEndDate"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      To
                      {
                        <span
                          className="text-red-500 text-xl"
                          style={{ color: "#ef4444" }}
                        >
                          {" "}
                          *
                        </span>
                      }
                    </label>
                    <input
                      type="date"
                      id="statusEndDate"
                      name="statusEndDate"
                      required
                      value={formData.statusEndDate}
                      onChange={handleChange}
                      className="bg-white/30 border border-white/40 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>

                  <ExcelDocsInput
                    value={formData.workstatus}
                    onChange={handleChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className={
                isDataFound
                  ? "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-8 py-3 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  : "hidden"
              }
              disabled={!isDataFound}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
