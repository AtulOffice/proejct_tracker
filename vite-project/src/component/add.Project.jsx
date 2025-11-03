import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { dateFields, formval } from "../utils/FieldConstant";
import FormField from "./inputField";
import { useAppContext } from "../appContex";
import { addProject, fetfchOrdersAllnew } from "../utils/apiCall";
import { FaFolderPlus } from "react-icons/fa6";
import NotifiNewOrd from "./NotifiNewOrd";

const InputForm = () => {
  const { toggle, setToggle, setToggleDev } = useAppContext();
  const [formData, setFormData] = useState(formval);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceJobnumber, setdebounceJobNumber] = useState("");
  const [engineerData, setEngineerData] = useState([]);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectData, setSelectData] = useState(null);

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
    }, 2000);
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
      const service = { YES: "Service Included", NO: "Service not included" };

      const updated = {};
      if (entityMap[firstChar]) {
        updated.entityType = entityMap[firstChar];
      }
      if (soTypeMap[secondChar]) {
        updated.soType = soTypeMap[secondChar];
        if (secondChar === "R") {
          updated.service = service.YES;
        } else {
          updated.service = service.NO;
        }
      }

      if (Object.keys(updated).length > 0) {
        setFormData((prev) => ({ ...prev, ...updated }));
      }
    }
  }, [debounceJobnumber]);

  useEffect(() => {
    console.log(selectData)
    console.log(formData)
  }, [selectData]);

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
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      orderDate,
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
      // { key: "startDate", value: startDate },
      // { key: "endDate", value: endDate },
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
      await addProject({ formData: formData, engineerData: engineerData });
      setToggleDev((prev) => !prev);
      setFormData(formval);
      setToggle((prev) => !prev);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const formRef = useRef(null);

  return (
    <div className="transition-all duration-300 lg:ml-64 pt-16 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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
              DETAILS
            </h2>
            <div onClick={() => setOpen(true)} className="relative group ml-4">
              <button
                className="
      flex items-center justify-center
      bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400
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
          <FormField
            formData={formData}
            handleChange={handleChange}
            setEngineerData={setEngineerData}
          />
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
