import React from "react";
import { InputConst } from "../utils/FieldConstant";
import { InputFiled, SelectField, TextArea } from "./subField";
import { EngineerAssignment } from "./engineerInpt";
import DocumentsSection from "../utils/addDevDocs";

const FormField = ({
  formData,
  handleChange,
  setEngineerData,
  selectData,
  Docs,
  setDocs,
}) => {
  return (
    <>
      <div className="space-y-6">
        {/* 📋 Basic Project Information */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-300 shadow-sm">
          <h3 className="font-bold text-lg text-indigo-800 mb-4">
            📋 Basic Project Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputFiled
              {...InputConst[7]}
              isEditable={true}
              value={formData.jobNumber}
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
              // isEditable={!!selectData?.soType}
              value={formData.soType}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[45]}
              isEditable={!!selectData?.bookingDate}
              value={formData.bookingDate}
              handleChange={handleChange}
            />

            <InputFiled
              {...InputConst[46]}
              isEditable={!!selectData?.name}
              value={formData.name}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[47]}
              isEditable={!!selectData?.email}
              value={formData.email}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[48]}
              isEditable={!!selectData?.phone}
              value={formData.phone}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[49]}
              isEditable={true}
              value={formData.orderValueSupply}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[50]}
              isEditable={true}
              value={formData.orderValueService}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[51]}
              isEditable={!!selectData?.orderValueTotal}
              value={formData.orderValueTotal}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[52]}
              isEditable={!!selectData?.netOrderValue}
              value={formData.netOrderValue}
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
              {...InputConst[8]}
              isEditable={!!selectData?.orderNumber}
              value={formData.orderNumber}
              handleChange={handleChange}
            />

            <SelectField
              {...InputConst[31]}
              handleChange={handleChange}
              value={formData.priority}
            />

            <InputFiled
              {...InputConst[41]}
              value={formData.technicalEmail}
              handleChange={handleChange}
            />
          </div>
        </div>
        {/* order details */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-300 shadow-sm">
          <h3 className="font-bold text-lg text-indigo-800 mb-4">
            📋 Order value
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <InputFiled
              {...InputConst[49]}
              isEditable={true}
              value={formData.orderValueSupply}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[50]}
              isEditable={true}
              value={formData.orderValueService}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[51]}
              isEditable={!!selectData?.orderValueTotal}
              value={formData.orderValueTotal}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[52]}
              isEditable={!!selectData?.netOrderValue}
              value={formData.netOrderValue}
              handleChange={handleChange}
            />

          </div>
        </div>

        {/* po details */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-300 shadow-sm">
          <h3 className="font-bold text-lg text-indigo-800 mb-4">
            📋 Po details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            <SelectField
              {...InputConst[57]}
              isEditable={!!selectData?.poReceived}
              value={formData.poReceived}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[53]}
              isEditable={!!selectData?.orderNumber}
              value={formData.orderNumber}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[54]}
              isEditable={!!selectData?.orderDate}
              value={formData.orderDate}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[55]}
              isEditable={!!selectData?.deleveryDate}
              value={formData.deleveryDate}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[56]}
              isEditable={!!selectData?.actualDeleveryDate}
              value={formData.actualDeleveryDate}
              handleChange={handleChange}
            />
            <SelectField
              {...InputConst[58]}
              isEditable={!!selectData?.amndReqrd}
              value={formData.amndReqrd}
              handleChange={handleChange}
            />
          </div>
        </div>

        {/* 👥 Client & Contact Details */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-purple-300 shadow-sm">
          <h3 className="font-bold text-lg text-purple-800 mb-4">
            👥 Client & Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">



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
          </div>
        </div>

        {/* 💰 Billing Information */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-green-300 shadow-sm">
          <h3 className="font-bold text-lg text-green-800 mb-4">
            💰 Billing Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputFiled
              {...InputConst[9]}
              value={formData.bill}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[10]}
              value={formData.dueBill}
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
          </div>
        </div>

        {/* 📅 Timeline & Scheduling */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-blue-300 shadow-sm">
          <h3 className="font-bold text-lg text-blue-800 mb-4">
            📅 Timeline & Scheduling
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {...InputConst[1]}
              value={formData.duration}
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
                <InputFiled
                  {...InputConst[19]}
                  value={formData.visitendDate}
                  handleChange={handleChange}
                />
              </>
            )}

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
              <>
                <InputFiled
                  {...InputConst[15]}
                  value={formData.actualEndDate}
                  handleChange={handleChange}
                />
                <InputFiled
                  {...InputConst[39]}
                  value={formData.daysspendsite}
                  handleChange={handleChange}
                />
                <InputFiled
                  {...InputConst[2]}
                  value={formData.actualVisitDuration}
                  handleChange={handleChange}
                />
              </>
            )}
          </div>
        </div>

        {/* service details */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-green-300 shadow-sm">
          <h3 className="font-bold text-lg text-green-800 mb-4">
            💰 Service Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              {...InputConst[32]}
              handleChange={handleChange}
              value={formData.service}
            />
          </div>
        </div>

        {/* 👷 Project Status & Engineer Assignment */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-orange-300 shadow-sm">
          <h3 className="font-bold text-lg text-orange-800 mb-4">
            👷 Project Status & Engineer Assignment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              {...InputConst[29]}
              value={formData.status}
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

            {(formData.status === "running" || formData.status === "upcoming") && (
              <EngineerAssignment setEngineerData={setEngineerData} />
            )}
          </div>
        </div>

        {/* 🔧 Development & Technical */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-cyan-300 shadow-sm">
          <h3 className="font-bold text-lg text-cyan-800 mb-4">
            🔧 Development & Technical
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              {...InputConst[40]}
              value={formData.Development}
              handleChange={handleChange}
            />

            <SelectField
              {...InputConst[42]}
              value={formData.isMailSent}
              handleChange={handleChange}
            />

            {(formData?.Development === "OFFICE" ||
              formData?.Development === "SITE") && (
                <>
                  <SelectField
                    {...InputConst[43]}
                    value={formData.isDevlopmentApproved}
                    handleChange={handleChange}
                  />
                  <SelectField
                    {...InputConst[44]}
                    value={formData.DevelopmentSetcion}
                    handleChange={handleChange}
                  />
                </>
              )}
          </div>
        </div>

        {/* ✅ Checklists & Submissions */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-pink-300 shadow-sm">
          <h3 className="font-bold text-lg text-pink-800 mb-4">
            ✅ Checklists & Submissions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {(formData.status === "completed" ||
              formData.status === "cancelled" ||
              formData.status === "closed") && (
                <>
                  <SelectField
                    {...InputConst[34]}
                    handleChange={handleChange}
                    value={formData.EndChecklist}
                  />
                  <SelectField
                    {...InputConst[37]}
                    handleChange={handleChange}
                    value={formData.BackupSubmission}
                  />
                  <SelectField
                    {...InputConst[38]}
                    handleChange={handleChange}
                    value={formData.ExpensSubmission}
                  />
                </>
              )}
          </div>
        </div>

        {/* 📝 MOM & Documentation */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-yellow-300 shadow-sm">
          <h3 className="font-bold text-lg text-yellow-800 mb-4">
            📝 MOM & Documentation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <InputFiled
              {...InputConst[11]}
              value={formData.momsrNo}
              handleChange={handleChange}
            />
            <InputFiled
              {...InputConst[20]}
              value={formData.momDate}
              handleChange={handleChange}
            />
            {(formData.status === "completed" || formData.status === "closed") && (
              <>
                <InputFiled
                  {...InputConst[24]}
                  value={formData.finalMomnumber}
                  handleChange={handleChange}
                />
              </>
            )}
          </div>
        </div>

        {/* 📄 Work Scope & Description */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-red-300 shadow-sm">
          <h3 className="font-bold text-lg text-red-800 mb-4">
            📄 Work Scope & Description
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <TextArea
              {...InputConst[4]}
              value={formData.workScope}
              handleChange={handleChange}
            />
            <TextArea
              {...InputConst[33]}
              handleChange={handleChange}
              value={formData.description}
            />
          </div>
        </div>

        {/* 📎 Documents */}
        <DocumentsSection Docs={Docs} setDocs={setDocs} />
      </div >
    </>

  );
};

export default FormField;
