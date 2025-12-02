import React from "react";
export const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-semibold text-gray-800">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      {...(type === "date" && { max: new Date().toISOString().split("T")[0] })}
      className={`
                px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                shadow-md border-2 backdrop-blur-sm
                ${
                  disabled
                    ? "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-500 border-gray-300 cursor-not-allowed"
                    : `bg-gradient-to-r from-white to-blue-50/50 text-gray-800 border-blue-300/50
                       hover:border-purple-400 hover:shadow-lg hover:shadow-purple-200/30
                       focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 
                       focus:shadow-xl focus:shadow-indigo-200/40
                       hover:scale-[1.01] focus:scale-[1.01] transform
                       placeholder:text-gray-400`
                }
            `}
    />
  </div>
);

export const SelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-semibold text-gray-800">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="
                    w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                    shadow-md border-2 backdrop-blur-sm appearance-none cursor-pointer
                    bg-gradient-to-r from-white to-blue-50/50 text-gray-800 border-blue-300/50
                    hover:border-purple-400 hover:shadow-lg hover:shadow-purple-200/30
                    focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 
                    focus:shadow-xl focus:shadow-indigo-200/40
                    hover:scale-[1.01] focus:scale-[1.01] transform
                    focus:outline-none
                "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-gray-800 py-2"
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-600 transition-transform duration-300 hover:text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
);

export const CheckboxField = ({ label, checked, onChange }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <label className="text-sm font-medium text-gray-700">{label}</label>
  </div>
);
