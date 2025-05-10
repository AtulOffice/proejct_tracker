import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { dateFields, formval } from "../utils/FieldConstant";
import FormField from "./inputField";

const InputForm = () => {
  const [formData, setFormData] = useState(formval);
  const [isLoading, setIsLoading] = useState(false);

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
    console.log({
      ...formData,
      momDate: formData.momDate ? [formData.momDate] : [],
    });

    try {
      await axios.post("http://localhost:8000/api/v1/save", {
        ...formData,
        momDate: formData.momDate ? [formData.momDate] : [],
      });
      toast.success("Data saved successfully");

      setFormData(formval);
    } catch (e) {
      if (e.response) {
        toast.error(e.response?.data?.message);
      }else{
        toast.error("something went wrong")
      }
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="transition-all duration-300 lg:ml-64 pt-16 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mt-6 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-6xl border border-white/30">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white drop-shadow-md">
          PROJECT DETAILS
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField formData={formData} handleChange={handleChange} />
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-8 py-3 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
