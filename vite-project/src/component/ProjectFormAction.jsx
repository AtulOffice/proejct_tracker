import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "../appContex";
import { EngineerAssignment } from "./engineerInpt";

const EngineerProjectForm = ({ setOpen, formRef, selectedProject }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [engineerData, setEngineerData] = useState([]);
  const { setToggle, setToggleDev } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    try {
      const finalData = {
        engineerName: Array.from(
          new Set([
            ...(selectedProject?.engineerName || []),
            ...(engineerData
              ?.map((eng) => eng.engineerName?.trim())
              .filter(Boolean) || []),
          ])
        ),
        // engineerData: engineerData.map((eng) => ({
        //   ...eng,
        //   assignedAt: selectedProject?.visitDate || null,
        //   endTime: selectedProject?.visitendDate || null,
        // })),
        engineerData,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/update/${selectedProject._id}`,
        finalData,
        { withCredentials: true }
      );
      toast.success("Data updated successfully");
      setToggle((prev) => !prev);
      setOpen(false);
      setToggleDev((prev) => !prev);
    } catch (e) {
      if (e.response) {
        toast.error(e.response?.data?.message || "Update failed");
      } else {
        toast.error("Something went wrong");
      }
      console.error(e);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        ref={formRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-glass"
      >
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4 text-center text-gray-800">
            {selectedProject?.jobNumber || "Assign Engineers"}
          </h2>

          <EngineerAssignment
            engineerData={engineerData}
            setEngineerData={setEngineerData}
          />

          <div className="flex justify-end space-x-2 mt-6 sticky bottom-0 bg-white pt-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isDisabled}
              className={`px-4 py-2 rounded-lg text-white transition ${
                isDisabled
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isDisabled ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerProjectForm;
