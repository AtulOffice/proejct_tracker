import React from "react";
import { InputConst } from "../utils/FieldConstant";
import { InputFiled, SelectField, TextArea } from "./subField";

const FormField = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputFiled
        {...InputConst[0]}
        value={formData.projectName}
        handleChange={handleChange}
      />

      <SelectField
        {...InputConst[28]}
        value={formData.entityType}
        handleChange={handleChange}
      />
      <InputFiled
        {...InputConst[1]}
        value={formData.duration}
        handleChange={handleChange}
      />

      <SelectField
        {...InputConst[29]}
        value={formData.status}
        handleChange={handleChange}
      />

      <InputFiled
        {...InputConst[2]}
        value={formData.actualVisitDuration}
        handleChange={handleChange}
      />

      <InputFiled
        {...InputConst[3]}
        value={formData.expenseScope}
        handleChange={handleChange}
      />

      <InputFiled
        {...InputConst[4]}
        value={formData.workScope}
        handleChange={handleChange}
      />

      <SelectField
        {...InputConst[26]}
        value={formData.supplyStatus}
        handleChange={handleChange}
      />
      <SelectField
        {...InputConst[27]}
        value={formData.soType}
        handleChange={handleChange}
      />
      <InputFiled
        {...InputConst[5]}
        value={formData.client}
        handleChange={handleChange}
      />

      <InputFiled
        {...InputConst[6]}
        value={formData.endUser}
        handleChange={handleChange}
      />

      <InputFiled
        {...InputConst[7]}
        value={formData.jobNumber}
        handleChange={handleChange}
      />

      <InputFiled
        {...InputConst[8]}
        value={formData.orderNumber}
        handleChange={handleChange}
      />

      <InputFiled
        {...InputConst[9]}
        value={formData.bill}
        handleChange={handleChange}
      />

      {formData.status !== "upcoming" && (
        <InputFiled
          {...InputConst[10]}
          value={formData.dueBill}
          handleChange={handleChange}
        />
      )}
      {formData.status !== "upcoming" && (
        <InputFiled
          {...InputConst[11]}
          value={
            Array.isArray(formData.momsrNo)
              ? formData.momsrNo.join(", ")
              : formData.momsrNo
          }
          handleChange={handleChange}
        />
      )}
      <SelectField
        {...InputConst[25]}
        value={formData.billStatus}
        handleChange={handleChange}
      />

      {(formData.status === "upcoming" ||
        formData.status === "pending" ||
        formData.status === "completed") && (
        <InputFiled
          {...InputConst[12]}
          value={formData.startDate}
          handleChange={handleChange}
        />
      )}
      {(formData.status === "upcoming" ||
        formData.status === "pending" ||
        formData.status === "completed") && (
        <InputFiled
          {...InputConst[13]}
          value={formData.endDate}
          handleChange={handleChange}
        />
      )}

      {formData.status === "completed" && (
        <InputFiled
          {...InputConst[14]}
          value={formData.actualStartDate}
          handleChange={handleChange}
        />
      )}

      {formData.status === "completed" && (
        <InputFiled
          {...InputConst[15]}
          value={formData.actualEndDate}
          handleChange={handleChange}
        />
      )}

      {(formData.status === "running" ||
        formData.status === "upcoming" ||
        formData.status === "completed") && (
        <InputFiled
          {...InputConst[16]}
          value={formData.requestDate}
          handleChange={handleChange}
        />
      )}

      {(formData.status === "running" ||
        formData.status === "upcoming" ||
        formData.status === "completed") && (
        <InputFiled
          {...InputConst[17]}
          value={formData.deleveryDate}
          handleChange={handleChange}
        />
      )}

      {formData.status === "running" && (
        <InputFiled
          {...InputConst[18]}
          value={formData.visitDate}
          handleChange={handleChange}
        />
      )}
      {formData.status === "running" && (
        <InputFiled
          {...InputConst[19]}
          value={formData.visitendDate}
          handleChange={handleChange}
        />
      )}

      {(formData.status === "running" ||
        formData.status === "pending" ||
        formData.status === "completed") && (
        <InputFiled
          {...InputConst[20]}
          value={formData.momDate}
          handleChange={handleChange}
        />
      )}

      <InputFiled
        {...InputConst[21]}
        value={formData.orderDate}
        handleChange={handleChange}
      />

      <TextArea
        {...InputConst[33]}
        handleChange={handleChange}
        value={formData.description}
      />

      <InputFiled
        {...InputConst[22]}
        value={formData.location}
        handleChange={handleChange}
      />

      {formData.status === "running" && (
        <InputFiled
          {...InputConst[23]}
          value={
            Array.isArray(formData.engineerName)
              ? formData.engineerName.join(", ")
              : formData.engineerName
          }
          handleChange={handleChange}
        />
      )}
      {formData.status === "completed" && (
        <InputFiled
          {...InputConst[24]}
          value={formData.finalMomnumber}
          handleChange={handleChange}
        />
      )}

      <SelectField
        {...InputConst[31]}
        handleChange={handleChange}
        value={formData.priority}
      />
      <SelectField
        {...InputConst[30]}
        handleChange={handleChange}
        value={formData.checklistStatus}
      />

      <SelectField
        {...InputConst[32]}
        handleChange={handleChange}
        value={formData.service}
      />
    </div>
  );
};

export default FormField;
