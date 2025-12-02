import React from "react";

const EngineerProjectForm = ({
  setOpen,
  formRef,
  engineersdata,
  handleChange,
  handleSubmit,
  isEditExtra,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div ref={formRef} className="bg-white p-6 rounded-2xl shadow-xl w-96">
        <form className="space-y-4">
          <input
            type="text"
            name="empId"
            value={engineersdata.empId}
            style={{ textTransform: "uppercase" }}
            onChange={handleChange}
            placeholder="ENGINEER EMPLOYEE CODE"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="name"
            style={{ textTransform: "uppercase" }}
            value={engineersdata.name}
            onChange={handleChange}
            placeholder="ENGINEER NAME"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="email"
            placeholder="EMAIL"
            value={engineersdata.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="phone"
            placeholder="PHONE"
            value={engineersdata.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {isEditExtra && (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 via-white to-blue-100 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
              <label className="text-base font-semibold text-blue-700 tracking-wide">
                Are you manually changing the availability of the engineer?
              </label>
              <input
                type="checkbox"
                name="manualOverride"
                checked={engineersdata.manualOverride}
                onChange={handleChange}
                className="w-6 h-6 transition-all duration-200"
              />
            </div>
          )}

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
              onClick={(e) => handleSubmit(e, engineersdata)}
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
