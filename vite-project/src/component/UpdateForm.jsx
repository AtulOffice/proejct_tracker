import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UpdateConst } from "../utils/FieldConstant";
import { InputFiled, SelectField, TextArea } from "./subField";
import { useAppContext } from "../appContex";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSkeleton from "../utils/loaderForm";

const UpdateForm = () => {
  const { id } = useParams();

  const { fetchProjects, fullData, setToggle } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (fullData && fullData.length > 0) {
      const projectData = fullData.find((item) => item._id === id);
      if (projectData) {
        setFormData(projectData);
      }
      setIsLoading(false);
    }
  }, [fullData, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "momsrNo" || name === "engineerName"
          ? value
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item !== "")
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const {
      startDate,
      endDate,
      actualEndDate,
      actualStartDate,
      visitDate,
      visitendDate,
      deleveryDate,
      requestDate,
      orderDate,
    } = formData;

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      toast.error("Start date must be less than end date");
      setIsLoading(false);
      return;
    }

    if (
      actualStartDate &&
      actualEndDate &&
      new Date(actualStartDate) >= new Date(actualEndDate)
    ) {
      toast.error("Actual Start date must be less than Acual end date");
      setIsLoading(false);
      return;
    }

    if (
      visitDate &&
      visitendDate &&
      new Date(visitDate) >= new Date(visitendDate)
    ) {
      toast.error("Visit Start date must be less than Visit end date");
      setIsLoading(false);
      return;
    }
    if (
      requestDate &&
      deleveryDate &&
      new Date(requestDate) >= new Date(deleveryDate)
    ) {
      toast.error("requested date must be less than delivery date");
      setIsLoading(false);
      return;
    }

    const dateFields = [
      { key: "startDate", value: startDate },
      { key: "endDate", value: endDate },
      { key: "actualStartDate", value: actualStartDate },
      { key: "actualEndDate", value: actualEndDate },
      { key: "visitDate", value: visitDate },
      { key: "visitendDate", value: visitendDate },
      { key: "deleveryDate", value: deleveryDate },
      { key: "requestDate", value: requestDate },
    ];

    if (orderDate) {
      for (const { key, value } of dateFields) {
        if (value && new Date(orderDate) >= new Date(value)) {
          toast.error(`Order date must be less than ${key}`);
          setIsLoading(false);
          return;
        }
      }
    }
    try {
      const finalData = {
        ...formData,
        engineerName:
          typeof formData.engineerName === "string"
            ? formData.engineerName
                .split(",")
                .map((name) => name.trim())
                .filter((name) => name.length > 0)
            : formData.engineerName,
      };

      await axios.put(`http://localhost:8000/api/v1/update/${id}`, finalData);
      toast.success("Data updated successfully");
      fetchProjects(true);
      setToggle((prev) => !prev);
      navigate("/page");
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
  const handleMomDateChange = (newDate) => {
    setFormData((prev) => {
      const updatedDates = [...(prev.momDate || [])];
      updatedDates.push(newDate);
      return { ...prev, momDate: updatedDates };
    });
  };
  const handleChangeEngineerName = (value) => {
    setFormData((prev) => ({
      ...prev,
      engineerName: value,
    }));
  };

  if (!formData) {
    return <LoadingSkeleton />;
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
              {...UpdateConst[0]}
              value={formData.projectName}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[28]}
              value={formData.entityType}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[1]}
              value={formData.duration}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[29]}
              value={formData.status}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[2]}
              value={formData.actualVisitDuration}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[3]}
              value={formData.expenseScope}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[4]}
              value={formData.workScope}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[26]}
              value={formData.supplyStatus}
              handleChange={handleChange}
            />
            <SelectField
              {...UpdateConst[27]}
              value={formData.soType}
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
              {...UpdateConst[7]}
              value={formData.jobNumber}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[8]}
              value={formData.orderNumber}
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
            <InputFiled
              {...UpdateConst[11]}
              value={
                Array.isArray(formData.momsrNo)
                  ? formData.momsrNo.join(", ")
                  : formData.momsrNo
              }
              handleChange={handleChange}
            />

            <SelectField
              {...UpdateConst[25]}
              value={formData.billStatus}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[12]}
              value={formData.startDate}
              handleChange={handleChange}
            />

            <InputFiled
              {...UpdateConst[13]}
              value={formData.endDate}
              handleChange={handleChange}
            />

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
            <InputFiled
              {...UpdateConst[16]}
              value={formData.requestDate}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[17]}
              value={formData.deleveryDate}
              handleChange={handleChange}
            />

            <InputFiled
              {...UpdateConst[18]}
              value={formData.visitDate}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[19]}
              value={formData.visitendDate}
              handleChange={handleChange}
            />
            <InputFiled
              {...UpdateConst[20]}
              value={formData.momDate?.[formData.momDate.length - 1] || ""}
              handleChange={(e) => handleMomDateChange(e.target.value)}
            />

            <InputFiled
              {...UpdateConst[21]}
              value={formData.orderDate}
              handleChange={handleChange}
            />
            <TextArea
              {...UpdateConst[33]}
              handleChange={handleChange}
              value={formData.description}
            />
            <InputFiled
              {...UpdateConst[22]}
              value={formData.location}
              handleChange={handleChange}
            />
            {formData.status === "running" && (
              <InputFiled
                {...UpdateConst[23]}
                value={
                  typeof formData.engineerName === "string"
                    ? formData.engineerName
                    : formData.engineerName.join(", ")
                }
                handleChange={(e) => {
                  handleChangeEngineerName(e.target.value);
                }}
              />
            )}

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
              {...UpdateConst[30]}
              handleChange={handleChange}
              value={formData.checklistStatus}
            />
            <SelectField
              {...UpdateConst[32]}
              handleChange={handleChange}
              value={formData.service}
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
