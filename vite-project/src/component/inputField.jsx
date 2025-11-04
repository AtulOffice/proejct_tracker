import React from "react";
import { InputConst } from "../utils/FieldConstant";
import { InputFiled, SelectField, TextArea } from "./subField";
import { EngineerAssignment } from "./engineerInpt";
import PopupDocuments from "../utils/addDevPopup";

const FormField = ({ formData, handleChange, setEngineerData, selectData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* {
        true && <PopupDocuments
          open={true}
          onClose={() => setShowPopup(false)}
        // onSave={(docs) => setFormData((prev) => ({ ...prev, documents: docs }))}
        />
      } */}
      <InputFiled
        {...InputConst[7]}
        isEditable={!!selectData?.jobNumber}
        value={formData.jobNumber}
        handleChange={handleChange}
      />

      <InputFiled
        {...InputConst[8]}
        isEditable={!!selectData?.orderNumber}
        value={formData.orderNumber}
        handleChange={handleChange}
      />
      <SelectField
        {...InputConst[28]}
        value={formData.entityType}
        isEditable={!!selectData?.entityType}
        handleChange={handleChange}
      />
      <SelectField
        {...InputConst[27]}
        isEditable={!!selectData?.soType}
        value={formData.soType}
        handleChange={handleChange}
      />

      <InputFiled
        {...InputConst[5]}
        isEditable={!!selectData?.client}
        value={formData.client}
        handleChange={handleChange}
      />
      <InputFiled
        {...InputConst[6]}
        isEditable={!!selectData?.endUser}
        value={formData.endUser}
        handleChange={handleChange}
      />
      <InputFiled
        {...InputConst[22]}
        isEditable={!!selectData?.site}
        value={formData.location}
        handleChange={handleChange}
      />
      <InputFiled
        {...InputConst[21]}
        isEditable={!!selectData?.orderDate}
        value={formData.orderDate}
        handleChange={handleChange}
      />
      <InputFiled
        {...InputConst[17]}
        isEditable={!!selectData?.deleveryDate}
        value={formData.deleveryDate}
        handleChange={handleChange}
      />
      <InputFiled
        {...InputConst[9]}
        isEditable={!!selectData?.netOrderValue}
        value={formData.bill}
        handleChange={handleChange}
      />
      <InputFiled
        {...InputConst[10]}
        value={formData.dueBill}
        handleChange={handleChange}
      />
      <InputFiled
        {...InputConst[41]}
        value={formData.technicalEmail}
        handleChange={handleChange}
      />
      <SelectField
        {...InputConst[29]}
        value={formData.status}
        handleChange={handleChange}
      />
      <SelectField
        {...InputConst[25]}
        value={formData.billStatus}
        handleChange={handleChange}
      />
      <InputFiled
        {...InputConst[3]}
        value={formData.expenseScope}
        handleChange={handleChange}
      />
      <InputFiled
        {...InputConst[1]}
        value={formData.duration}
        handleChange={handleChange}
      />
      <TextArea
        {...InputConst[4]}
        value={formData.workScope}
        handleChange={handleChange}
      />

      {formData.status === "pending" && (
        <InputFiled
          {...InputConst[16]}
          value={formData.requestDate}
          handleChange={handleChange}
        />
      )}
      {(formData.status === "running" || formData.status === "upcoming") && (
        <>
          <InputFiled
            {...InputConst[18]}
            value={formData.visitDate}
            handleChange={handleChange}
          />
          {(formData.status === "running" ||
            formData.status === "upcoming" ||
            formData.status === "completed" ||
            formData.status === "cancelled" ||
            formData.status === "closed") && (
              <SelectField
                {...InputConst[30]}
                handleChange={handleChange}
                value={formData.StartChecklist}
              />
            )}
          <InputFiled
            {...InputConst[19]}
            value={formData.visitendDate}
            handleChange={handleChange}
          />
          {(formData.status === "completed" ||
            formData.status === "cancelled" ||
            formData.status === "closed") && (
              <SelectField
                {...InputConst[34]}
                handleChange={handleChange}
                value={formData.EndChecklist}
              />
            )}
        </>
      )}
      {(formData.status === "completed" || formData.status === "closed") && (
        <InputFiled
          {...InputConst[11]}
          value={formData.momsrNo}
          handleChange={handleChange}
        />
      )}
      {(formData.status === "completed" || formData.status === "closed") && (
        <InputFiled
          {...InputConst[20]}
          value={formData.momDate}
          handleChange={handleChange}
        />
      )}
      {(formData.status === "running" ||
        formData.status === "pending" ||
        formData.status === "completed" ||
        1) && (
          <>
            {(formData.status === "completed" ||
              formData.status === "cancelled" ||
              formData.status === "closed") && (
                <SelectField
                  {...InputConst[37]}
                  handleChange={handleChange}
                  value={formData.BackupSubmission}
                />
              )}
            {(formData.status === "completed" ||
              formData.status === "cancelled" ||
              formData.status === "closed") && (
                <SelectField
                  {...InputConst[38]}
                  handleChange={handleChange}
                  value={formData.ExpensSubmission}
                />
              )}
          </>
        )}
      {(formData.status === "completed" || formData.status === "closed") && (
        <InputFiled
          {...InputConst[39]}
          value={formData.daysspendsite}
          handleChange={handleChange}
        />
      )}
      {(formData.status === "completed" ||
        formData.status === "cancelled" ||
        formData.status === "closed") && (
          <InputFiled
            {...InputConst[2]}
            value={formData.actualVisitDuration}
            handleChange={handleChange}
          />
        )}

      <SelectField
        {...InputConst[40]}
        value={formData.Development}
        handleChange={handleChange}
      />

      <SelectField
        {...InputConst[26]}
        value={formData.supplyStatus}
        handleChange={handleChange}
      />
      {/* {formData.status === "upcoming" && (
        <InputFiled
          {...InputConst[12]}
          value={formData.startDate}
          handleChange={handleChange}
        />
      )}
      {formData.status === "upcoming" && (
        <InputFiled
          {...InputConst[13]}
          value={formData.endDate}
          handleChange={handleChange}
        />
      )} */}
      {(formData.status === "closed" ||
        formData.status === "completed" ||
        formData.status === "running") && (
          <InputFiled
            {...InputConst[14]}
            value={formData.actualStartDate}
            handleChange={handleChange}
          />
        )}
      {(formData.status === "completed" || formData.status === "closed") && (
        <InputFiled
          {...InputConst[15]}
          value={formData.actualEndDate}
          handleChange={handleChange}
        />
      )}
      <div className="md:col-span-2">
        <TextArea
          {...InputConst[33]}
          handleChange={handleChange}
          value={formData.description}
        />
      </div>

      {(formData.status === "running" || formData.status === "upcoming") && (
        // <InputFiled
        //   {...InputConst[23]}
        //   value={formData.engineerName}
        //   handleChange={handleChange}
        // />
        <EngineerAssignment setEngineerData={setEngineerData} />
      )}
      {(formData.status === "completed" || formData.status === "closed") && (
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
        {...InputConst[32]}
        handleChange={handleChange}
        value={formData.service}
      />
      {(formData.status === "pending" || formData.status === "upcoming") && (
        <>
          <InputFiled
            {...InputConst[35]}
            value={formData.ContactPersonName}
            handleChange={handleChange}
          />
          <InputFiled
            {...InputConst[36]}
            value={formData.ContactPersonNumber}
            handleChange={handleChange}
          />
        </>
      )}
      <SelectField
        {...InputConst[42]}
        value={formData.isMailSent}
        handleChange={handleChange}
      />
      {
        (formData?.Development === "OFFICE" || formData?.Development === "SITE") && (
          <SelectField
            {...InputConst[43]}
            value={formData.isDevlopmentApproved}
            handleChange={handleChange}
          />
        )
      }
    </div>
  );
};

export default FormField;
