import React, { useState } from "react";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

const ExcelDocsInput = ({ value, onChange }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    let appendedText = "";

    try {
      if (ext === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });

        appendedText = result.value
          .replace(/\.\s*/g, ".\n")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .join("\n");
      } else if (ext === "xlsx") {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        workbook.SheetNames.forEach((sheet) => {
          const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
            header: 1,
          });
          const text = rows.map((row) => row.join(" | ")).join("\n");
          appendedText += text + "\n";
        });
      } else {
        alert("Only .docx and .xlsx files are supported.");
        return;
      }

      onChange({
        target: {
          name: "workstatus",
          value: value ? `${value}\n${appendedText}` : appendedText,
        },
      });
    } catch (error) {
      alert("Error processing file: " + error.message);
    }
  };

  return (
    <div className="md:col-span-2">
      <label
        htmlFor="workstatus"
        className="block mb-2 text-sm font-medium text-white"
      >
        Work Status (Text / Drop .docx or .xlsx)
        {
          <span className="text-red-500 text-xl" style={{ color: "#ef4444" }}>
            {" "}
            *
          </span>
        }
      </label>
      <textarea
        id="workstatus"
        name="workstatus"
        value={value}
        onChange={onChange}
        onDrop={handleDrop}
        required
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`bg-white/30 border ${
          dragOver ? "border-blue-500" : "border-white/40"
        } text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-white/70 resize-none`}
        placeholder="Enter site progress details or drop a .docx/.xlsx file"
        rows={16}
        maxLength={2500}
      />
    </div>
  );
};

export default ExcelDocsInput;
