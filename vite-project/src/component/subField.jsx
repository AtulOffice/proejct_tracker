import React from "react";

export const InputFiled = ({
  htmlFor,
  title,
  type,
  id,
  name,
  value,
  handleChange,
  placeholder,
  required,
  readOnly = false,
  isEditable = false,
}) => {
  const handleKeyDown = (e) => {
    if (type === "number" && (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "-")) {
      e.preventDefault();
    }
  };

  const handleWheel = (e) => {
    if (type === "number") {
      e.target.blur();
    }
  };

  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {title}
        {required && (
          <span className="text-red-500 text-xl ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        id={id}
        name={name}
        readOnly={readOnly || isEditable}
        value={value ?? ""}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        className={`w-full px-4 py-2.5 border-2 rounded-lg font-medium transition-all duration-200 ${isEditable
            ? "border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
            : "border-purple-200 bg-gradient-to-br from-pink-50 to-purple-50 hover:border-purple-300 focus:ring-2 focus:ring-pink-400 focus:border-pink-500 placeholder-gray-400"
          }`}
        placeholder={placeholder}
        required={required}
      />
    </div>

  );

};

export const SelectField = ({
  htmlFor,
  title,
  id,
  name,
  value,
  handleChange,
  options,
  required,
  isEditable = false,
}) => {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {title}
        {required && (
          <span className="text-red-500 text-xl ml-1">*</span>
        )}
      </label>

      <select
        id={id}
        name={name}
        value={value ?? ""}
        onChange={handleChange}
        required={required}
        disabled={isEditable}
        className={`w-full px-4 py-2.5 border-2 rounded-lg font-medium transition-all duration-200 ${isEditable
            ? "border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
            : "border-purple-200 bg-gradient-to-br from-blue-50 to-purple-50 hover:border-purple-300 focus:ring-2 focus:ring-pink-400 focus:border-pink-500"
          }`}
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );

};

export const TextArea = ({
  value,
  title,
  id,
  name,
  htmlFor,
  maxLength,
  rows,
  placeholder,
  handleChange,
  required,
}) => {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {title}
        {required && (
          <span className="text-red-500 text-xl ml-1">*</span>
        )}
      </label>
      <textarea
        type="text"
        id={id}
        name={name}
        value={value ?? ""}
        onChange={handleChange}
        rows={rows}
        required={required}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 border-2 rounded-lg font-medium transition-all duration-200 resize-none border-purple-200 bg-gradient-to-br from-indigo-50 to-purple-50 hover:border-purple-300 focus:ring-2 focus:ring-pink-400 focus:border-pink-500 placeholder-gray-400 text-gray-900"
        placeholder={placeholder}
      />
    </div>


  );
};
