import React, { useState } from "react";
import toast from "react-hot-toast";
import { EngineerAssignment } from "./engineerInpt";
import apiClient from "../api/axiosClient";
import { useDispatch } from "react-redux";
import { toggleDevMode, toggleMode } from "../redux/slices/uiSlice";

const EngineerForm = ({ setOpen, formRef, selectedProject }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [engineerData, setEngineerData] = useState([]);
  const dispatch = useDispatch()
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
        engineerData,
      };

      await apiClient.put(
        `/update/${selectedProject._id}`, finalData);
      toast.success("Data updated successfully");
      setOpen(false);
      dispatch(toggleMode())
      dispatch(toggleDevMode())
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 sm:p-0">
      <div
        ref={formRef}
        className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-2xl min-h-[60vh] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-glass"
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-center text-gray-800">
            {selectedProject?.jobNumber || "Assign Engineers"}
          </h2>

          <EngineerAssignment
            engineerData={engineerData}
            setEngineerData={setEngineerData}
          />

          <div className="flex flex-col sm:flex-row justify-end sm:space-x-2 space-y-2 sm:space-y-0 mt-6 sticky bottom-0 bg-white pt-2 sm:pt-0">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition w-full sm:w-auto"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isDisabled || engineerData.length === 0}
              className={`px-4 py-2 rounded-lg text-white transition w-full sm:w-auto ${(isDisabled || engineerData.length === 0)
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

export default EngineerForm;
