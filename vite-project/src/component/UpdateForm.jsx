import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UpdateConst } from "../utils/FieldConstant";
import { InputFiled, SelectField, TextArea } from "./subField";
import { useAppContext } from "../appContex";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import LoadingSkeleton from "../utils/loaderForm";
import { EngineerAssignment } from "./engineerInpt";

const UpdateForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const { setToggle, setToggleDev } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState();
  const navigate = useNavigate();
  const [engineerData, setEngineerData] = useState([]);

  useEffect(() => {
    const fetchByid = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/fetch/${id}`,
          { withCredentials: true }
        );

        if (res?.data?.data) {
          const dateFields = [
            "actualStartDate",
            "actualEndDate",
            "visitDate",
            "visitendDate",
            "momDate",
            "orderDate",
            "startDate",
            "deleveryDate",
            "requestDate",
            "createdAt",
            "updatedAt",
          ];

          const formattedData = { ...res.data.data };

          dateFields.forEach(field => {
            const value = formattedData[field];
            if (value) {
              const date = new Date(value);
              if (!isNaN(date)) {
                formattedData[field] = date.toISOString().split("T")[0]; // ✅ for <input type="date">
              } else {
                formattedData[field] = "";
              }
            } else {
              formattedData[field] = "";
            }
          });

          setFormData(formattedData);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    if (id) fetchByid();
  }, [id]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
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
      deleveryDate,
      requestDate,
      orderDate,
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
    // if (
    //   requestDate &&
    //   deleveryDate &&
    //   new Date(requestDate) >= new Date(deleveryDate)
    // ) {
    //   toast.error("requested date must be less than delivery date");
    //   setIsLoading(false);
    //   return;
    // }

    const dateFields = [
      { key: "actualStartDate", value: actualStartDate },
      { key: "actualEndDate", value: actualEndDate },
      { key: "visitDate", value: visitDate },
      { key: "visitendDate", value: visitendDate },
      { key: "deleveryDate", value: deleveryDate },
      { key: "requestDate", value: requestDate },
    ];

    // if (orderDate) {
    //   for (const { key, value } of dateFields) {
    //     if (value && new Date(orderDate) >= new Date(value)) {
    //       toast.error(`Order date must be less than ${key}`);
    //       setIsLoading(false);
    //       return;
    //     }
    //   }
    // }
    try {
      const finalData = {
        ...formData,
        // engineerName:
        //   typeof formData.engineerName === "string"
        //     ? formData.engineerName
        //         .split(",")
        //         .map((name) => name.trim())
        //         .filter((name) => name.length > 0)
        //     : formData.engineerName,

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
        // engineerData: engineerData.map((eng) => ({
        //   ...eng,
        //   assignedAt: formData?.visitDate,
        //   endTime: formData?.visitendDate,
        // })),
        engineerData,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/update/${id}`,
        finalData,
        { withCredentials: true }
      );
      toast.success("Data updated successfully");
      setToggle((prev) => !prev);
      setToggleDev((prev) => !prev);
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
    <div className="transition-all duration-300  pt-16 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mt-6 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-6xl border border-white/30">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white drop-shadow-md">
          {formData?.projectName.toUpperCase()}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputFiled
              {...UpdateConst[7]}
              value={formData.jobNumber}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[8]}
              value={formData.orderNumber}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[28]}
              value={formData.entityType}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[27]}
              value={formData.soType}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[29]}
              value={formData.status}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[5]}
              value={formData.client}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[6]}
              value={formData.endUser}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[22]}
              value={formData.location}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[9]}
              value={formData.bill}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[10]}
              value={formData.dueBill}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[25]}
              value={formData.billStatus}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[21]}
              value={formData.orderDate}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[17]}
              value={formData.deleveryDate}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[3]}
              value={formData.expenseScope}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[1]}
              value={formData.duration}
              handleChange={handleChange}
            />
            <TextArea
              {...UpdateConst[4]}
              value={formData.workScope}
              handleChange={handleChange}
            />
            {/* <InputFiled
              {...UpdateConst[23]}
              value={formData.engineerName}
              handleChange={handleChange}
            /> */}

            <div className="flex flex-col mb-3">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                All Assigned Engineers List
              </label>
              <div className="h-[20vh] border border-gray-300 rounded-md px-2 py-1 bg-gradient-to-r from-blue-50 to-white text-gray-800 text-sm font-medium shadow-sm overflow-y-auto">
                {formData?.engineerName?.length
                  ? formData.engineerName.join(", ")
                  : "No engineer assigned"}
              </div>
            </div>

            <EngineerAssignment setEngineerData={setEngineerData} />

            <InputFiled
              {...UpdateConst[16]}
              value={formData.requestDate}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[18]}
              value={formData.visitDate}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[30]}
              handleChange={handleChange}
              value={formData.StartChecklist}
            />
            <InputFiled
              {...UpdateConst[19]}
              value={formData.visitendDate}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[34]}
              handleChange={handleChange}
              value={formData.EndChecklist}
            />
            <InputFiled
              {...UpdateConst[11]}
              value={formData.momsrNo}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[20]}
              value={
                formData.momDate.length >= 0
                  ? formData.momDate[formData.momDate.length - 1]
                  : ""
              }
              handleChange={(e) => handleMomDateChange(e.target.value)}
            />
            <SelectField
              {...UpdateConst[37]}
              handleChange={handleChange}
              value={formData.BackupSubmission}
            />
            <SelectField
              {...UpdateConst[38]}
              handleChange={handleChange}
              value={formData.ExpensSubmission}
            />
            <InputFiled
              {...UpdateConst[39]}
              value={formData.daysspendsite}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[2]}
              value={formData.actualVisitDuration}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[40]}
              value={formData.Development}
              handleChange={handleChange}
            />

            <SelectField
              {...UpdateConst[26]}
              value={formData.supplyStatus}
              handleChange={handleChange}
            />
            {/* <InputFiled
              {...UpdateConst[12]}
              value={formData.startDate}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[13]}
              value={formData.endDate}
              handleChange={handleChange}
            /> */}
            <InputFiled
              {...UpdateConst[14]}
              value={formData.actualStartDate}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[15]}
              value={formData.actualEndDate}
              handleChange={handleChange}
            />
            <div className="md:col-span-2">
              <TextArea
                {...UpdateConst[33]}
                handleChange={handleChange}
                value={formData.description}
              />
            </div>
            <InputFiled
              {...UpdateConst[24]}
              value={formData.finalMomnumber}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[31]}
              handleChange={handleChange}
              value={formData.priority}
            />
            <SelectField
              {...UpdateConst[32]}
              handleChange={handleChange}
              value={formData.service}
            />
            <InputFiled
              {...UpdateConst[35]}
              value={formData.ContactPersonName}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[36]}
              value={formData.ContactPersonNumber}
              handleChange={handleChange}
            />
          </div>
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
      </div>
    </div>
  );
};

export default UpdateForm;
