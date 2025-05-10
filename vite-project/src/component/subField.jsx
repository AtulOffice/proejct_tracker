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
}) => {
  const handleKeyDown = (e) => {
    if (type === "number" && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
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
        className="block mb-2 text-sm font-medium text-white"
      >
        {title}
        {required && (
          <span className="text-red-500 text-xl" style={{ color: "#ef4444" }}>
            {" "}
            *
          </span>
        )}
      </label>

      <input
        type={type}
        id={id}
        name={name}
        readOnly={readOnly}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        className="bg-white/30 border border-white/40 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black/70"
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
}) => {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block mb-2 text-sm font-medium text-white"
      >
        {title}
        {required && (
          <span className="text-red-500 text-xl" style={{ color: "#ef4444" }}>
            {" "}
            *
          </span>
        )}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
        className="bg-white/30 border border-white/40 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {options.map((item, index) => {
          return (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          );
        })}
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
    <div className="md:col-span-2">
      <label
        htmlFor={htmlFor}
        className="block mb-2 text-sm font-medium text-white"
      >
        {title}
        {required && (
          <span className="text-red-500 text-xl" style={{ color: "#ef4444" }}>
            {" "}
            *
          </span>
        )}
      </label>
      <textarea
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        rows={rows}
        required={required}
        maxLength={maxLength}
        className="bg-white/30 border border-white/40 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black/70 resize-none"
        placeholder={placeholder}
      />
    </div>
  );
};
