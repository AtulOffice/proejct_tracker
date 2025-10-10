import React, { useRef, useEffect } from "react";

const EngineerProjectForm = ({ setOpen, formRef, selectedProject }) => {
  console.log(selectedProject);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div ref={formRef} className="bg-white p-6 rounded-2xl shadow-xl w-96">
        <h2 className="text-lg font-bold mb-4">
          {selectedProject?.jobNumber || ""}
        </h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Engineer Name"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="duration"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="work Scope"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EngineerProjectForm;
