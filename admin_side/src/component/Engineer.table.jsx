import React, { useState, useRef, useEffect } from "react";
import { Trash2, Edit3, UserPlus } from "lucide-react";
import EngineerManagementForm from "./EngineerFormAction.jsx";
import { useAppContext } from "../appContex.jsx";
import {
  deleteEngineer,
  EditAllEngineers,
  saveAllEngineers,
} from "../utils/apiCall.jsx";
import toast from "react-hot-toast";
import PopupConfirmation from "./PopuP.Page.jsx";
import AssignmentModal from "./RecentProjectEng.jsx";

const EngineerTable = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showData, setShowData] = useState();
  const formRef = useRef(null);
  const { setToggle } = useAppContext();
  const [deleteFlag, setDeleteflag] = useState(false);
  const [id, setId] = useState(null);

  const [engineersdata, setEngineersdata] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    manualOverride: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setEngineersdata((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setSaveOpen(false);
        setEditOpen(false);
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (e, project) => {
    e.stopPropagation();
    setSaveOpen(false);
    setEngineersdata((prev) => ({
      ...prev,
      name: project.name,
      email: project.email,
      phone: project.phone,
      id: project._id,
      empId: project?.empId,
      manualOverride: project?.manualOverride ? project.manualOverride : false,
    }));
    setEditOpen(true);
  };

  const handleAddNew = () => {
    setEngineersdata((prev) => ({
      ...prev,
      name: "",
      email: "",
      phone: "",
      empId: "",
      manualOverride: false,
    }));
    setEditOpen(false);
    setSaveOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteEngineer(id);
      setDeleteflag(false);
      toast.success("data deleted successfully");
      setToggle((prev) => !prev);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "something whent wrong")
      }
      console.error("Failed to delete project", error);
    }
  };

  const handleNewAdd = async (e, data) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const response = await saveAllEngineers(data);
      toast.success("data saved successfully");
      setToggle((prev) => !prev);
      setSaveOpen(false);
      setEditOpen(false);
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data.message || "something went wrong");
      }
      console.log("error while saving the engineer details", error);
    }
  };

  const handleOldEdit = async (e, data) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const response = await EditAllEngineers(data.id, {
        email: data.email,
        name: data.name,
        phone: data.phone,
        empId: data.empId,
        manualOverride: data.manualOverride,
      });
      toast.success("data update successfully");
      setToggle((prev) => !prev);
      setSaveOpen(false);
      setEditOpen(false);
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data.message);
      }
      console.log("some error occured", error.response);
    }
  };

  return (
    <div className="relative col-span-full w-full overflow-hidden rounded-2xl shadow-2xl bg-linear-to-b from-white via-blue-50 to-blue-100 border border-blue-200 p-4">
      {deleteFlag && (
        <PopupConfirmation
          setCancelflag={setDeleteflag}
          handleConfirm={handleDelete}
          title="Are you sure?"
          message={`Do you really want to delete ? This action cannot be undone.`}
          btnval="Delete"
        />
      )}
      {open && (
        <AssignmentModal
          open={open}
          onClose={() => setOpen(false)}
          assignments={showData?.assignments || []}
        />

      )}

      {(saveOpen || editOpen) && (
        <EngineerManagementForm
          setOpen={saveOpen ? setSaveOpen : setEditOpen}
          handleChange={handleChange}
          engineersdata={engineersdata}
          formRef={formRef}
          handleSubmit={saveOpen ? handleNewAdd : handleOldEdit}
          isEditExtra={saveOpen ? false : true}
        />
      )}

      <div className="bg-linear-to-r from-purple-600 via-pink-500 to-pink-600 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 rounded-xl">
        <h2 className="text-xl font-bold text-white tracking-wide">
          ENGINEER MANAGEMENT
        </h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-white text-purple-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <UserPlus size={20} />
          <span>Add New Engineer</span>
        </button>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto hidden md:block mt-4">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md ">
                <th className="w-1/5 px-6 py-4 text-left text-sm font-bold tracking-wide uppercase">
                  Engineer Name
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-bold tracking-wide uppercase">
                  Available
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-bold tracking-wide uppercase">
                  Email
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-bold tracking-wide uppercase">
                  Phone
                </th>
                <th className="w-40 px-6 py-4 text-center text-sm font-bold tracking-wide uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {data.map((project, indx) => (
                <tr
                  key={indx}
                  className={`hover:bg-blue-50/80 transition-colors duration-150 ${indx % 2 === 0
                    ? "bg-linear-to-r from-white via-blue-50/30 to-white"
                    : "bg-linear-to-r from-white via-blue-100/40 to-white"
                    }`}
                >
                  <td className="px-6 py-4">
                    <div
                      onClick={() => {
                        if (project && project?.assignments?.length > 0) {
                          setOpen(true);
                          setShowData(project);
                        } else {
                          toast("No available projects for this engineer.", {
                            icon: "👏",
                            style: {
                              borderRadius: "10px",
                              background: "#333",
                              color: "#fff",
                            },
                          });
                        }
                      }}

                      className="text-base font-semibold text-blue-900 truncate cursor-pointer"
                      title={project.name}
                    >
                      {project.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm transition whitespace-nowrap ${!project.isAssigned
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-red-100 text-red-700 border-red-300"
                        }`}
                    >
                      {project.isAssigned ? "No" : "Yes"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-700 truncate">
                    {project?.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-700 truncate">
                    {project?.phone}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => handleEdit(e, project)}
                        className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        title="Edit Engineer"
                      >
                        <Edit3 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setDeleteflag(true);
                          setId(project._id);
                        }}
                        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        title="Delete Engineer"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <NoDataFound />
      )
      }
      <div className="md:hidden mt-4 space-y-4">
        {data.map((project) => (
          <div
            key={project._id}
            className="bg-linear-to-br from-blue-50 via-white to-indigo-50 shadow-xl rounded-xl p-4 border border-blue-200 transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-2 gap-2">
              <div
                className="text-lg font-bold text-indigo-700 truncate max-w-[70%]"
                title={project.name}
              >
                {project.name}
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 border rounded-full font-semibold text-xs ${!project.isAssigned
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-red-100 text-red-700 border-red-300"
                  }`}
              >
                {project.isAssigned ? "No" : "Yes"}
              </span>
            </div>

            <div className="pt-2 text-blue-800 text-sm">
              <div className="mb-2">
                <span className="font-medium text-indigo-600">Email:</span>
                <span className="ml-2 truncate">{project?.email}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-indigo-600">Phone:</span>
                <span className="ml-2 truncate">
                  {project?.phone ? project.phone : "not available"}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={(e) => handleEdit(e, project)}
                  className="flex-1 flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Edit3 size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setDeleteflag(true);
                    setId(project._id);
                  }}
                  className="flex-1 flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};

export default EngineerTable;
