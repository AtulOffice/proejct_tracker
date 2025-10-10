import React, { useState, useRef, useEffect } from "react";
import { Trash2, Edit3, UserPlus } from "lucide-react";
import EngineerForm from "./EngineerFormAction.jsx";
import { useAppContext } from "../appContex.jsx";
import {
  deleteEngineer,
  EditAllEngineers,
  saveAllEngineers,
} from "../utils/apiCall.jsx";
import toast from "react-hot-toast";

const EngineerTable = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showData, setShowData] = useState();
  const formRef = useRef(null);
  const { setToggle } = useAppContext();

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

  const handleDelete = async (e, project) => {
    e.stopPropagation();
    try {
      await deleteEngineer(project._id);
      toast.success("data deleted successfully");
      setToggle((prev) => !prev);
    } catch (error) {
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
        toast.error(error.response.data.message);
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

  console.log(showData?.assignments);
  return (
    <div className="relative col-span-full w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-b from-white via-blue-50 to-blue-100 border border-blue-200">
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/60 to-gray-900/40 backdrop-blur-sm transition-all duration-300">
          <div
            ref={formRef}
            className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl w-[380px] max-h-[70vh] overflow-y-auto border border-gray-200 scrollbar-glass"
          >
            <h2 className="text-xl font-bold mb-6 text-gray-800 text-center drop-shadow-sm">
              Recent Project Assignments
            </h2>
            {showData?.assignments &&
              showData.assignments
                ?.slice()
                .reverse()
                .map((project) => (
                  <div
                    key={project._id}
                    className="group bg-gradient-to-r from-green-100 via-blue-50 to-white rounded-xl mb-4 py-3 px-4 shadow hover:shadow-xl transition-shadow border-b border-gray-100 hover:bg-blue-50"
                  >
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600">
                      {project.projectName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-700">
                      {project.jobNumber}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      )}

      {(saveOpen || editOpen) && (
        <EngineerForm
          setOpen={saveOpen ? setSaveOpen : setEditOpen}
          handleChange={handleChange}
          engineersdata={engineersdata}
          formRef={formRef}
          handleSubmit={saveOpen ? handleNewAdd : handleOldEdit}
          isEditExtra={saveOpen ? false : true}
        />
      )}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-pink-600 px-6 py-4 flex justify-between items-center">
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
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
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
                  className={`hover:bg-blue-50/80 transition-colors duration-150 ${
                    indx % 2 === 0
                      ? "bg-gradient-to-r from-white via-blue-50/30 to-white"
                      : "bg-gradient-to-r from-white via-blue-100/40 to-white"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div
                      onClick={() => {
                        setOpen(true), setShowData(project);
                      }}
                      className="text-base font-semibold text-blue-900 truncate cursor-pointer"
                      title={project.name}
                    >
                      {project.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm transition whitespace-nowrap ${
                        !project.isAssigned
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
                        onClick={(e) => handleDelete(e, project)}
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
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-12 shadow-lg border border-blue-200 max-w-md text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full opacity-30 animate-pulse"></div>
            <div
              className="absolute bottom-0 left-0 w-24 h-24 bg-purple-300 rounded-full opacity-30 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div className="relative mb-6 animate-bounce">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-blue-900 mb-3 animate-fade-in">
              No Engineers Found
            </h3>
          </div>
          <style jsx>{`
            @keyframes fade-in {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in {
              animation: fade-in 0.6s ease-out forwards;
              opacity: 0;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default EngineerTable;
