import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { dateFields, docsVal } from "../utils/FieldConstant";
import FormField from "./inputField";
import { useAppContext } from "../appContex";
import { addProject, fetfchOrdersAllnew } from "../utils/apiCall";
import { FaFolderPlus } from "react-icons/fa6";
import NotifiNewOrd from "./NotifiNewOrd";


export const formval = {
  projectName: "",
  jobNumber: "",
  entityType: "SI DELHI",
  soType: "PROJECT",
  bookingDate: "",
  client: "",
  endUser: "",
  location: "",
  // concerningSalesManager:"",
  name: "",
  email: "",
  phone: "",

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
  billStatus: "N/A",
  visitDate: "",
  visitendDate: "",
  momDate: "",
  momsrNo: "",
  orderNumber: "",
  poReceived: "",
  daysspendsite: "",
  startDate: "",
  endDate: "",
  duration: "",

  expenseScope: "",
  supplyStatus: "DISPATCHED",
  requestDate: "",
  StartChecklist: "N/A",
  EndChecklist: "N/A",
  actualVisitDuration: "",
  ContactPersonNumber: "",
  ContactPersonName: "",
  ExpensSubmission: "N/A",
  BackupSubmission: "N/A",
  technicalEmail: "",
  isMailSent: "NO",
  isDevlopmentApproved: "NO",
  DevelopmentSetcion: "",
  OrderMongoId: "",
  orderValueSupply: "",
  orderValueService: "",
  orderValueTotal: "",
  porecieved: "",
  orderDate: "",
  deleveryDate: "",
  actualDeleveryDate: "",
  amndReqrd: "",
};

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
        projectName: selectData.client || "",
        endUser: selectData.endUser || "",
        location: selectData.site || "",
        orderNumber: selectData.orderNumber || "",
        orderDate: formatDate(selectData.orderDate),
        technicalEmail: selectData.technicalEmail || "",
        billStatus: selectData.billingStatus || "",
        bill: selectData.orderValueTotal || "",
        dueBill: selectData.orderValueTotal || "",
        bookingDate: formatDate(selectData.bookingDate),
        name: selectData.name || "",
        email: selectData.email || "",
        phone: selectData.phone || "",
        orderValueSupply: selectData.orderValueSupply || 0,
        orderValueService: selectData.orderValueService || 0,
        orderValueTotal: selectData.orderValueTotal || 0,

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
      }
      if (Object.keys(updated).length > 0) {
        setFormData((prev) => ({ ...prev, ...updated }));
      }
    }
  }, [debounceJobnumber]);

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
              SERVICE DETAILS
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
          <FormField
            Docs={Docs}
            setDocs={setDocs}
            selectData={selectData}
            formData={formData}
            handleChange={handleChange}
            setEngineerData={setEngineerData}
          />
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="text-white bg-white hover:bg-indigo-200 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-8 py-3 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Submit service details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
