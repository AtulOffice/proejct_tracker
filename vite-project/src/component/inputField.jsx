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
        {selectData?.jobNumber && <>
          {/* 📋 Basic Project Information */}
          < div className="bg-linear-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4 border-b border-indigo-200 pb-3">
              <span className="text-2xl mr-2">📋</span>
              <h3 className="font-bold text-lg text-indigo-900">Basic Order Information</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">Job Number</p>
                <p className="font-bold text-gray-900 text-base">{formData.jobNumber || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">Entity Type</p>
                <p className="font-bold text-gray-900 text-base">{formData.entityType || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">SO Type</p>
                <p className="font-bold text-gray-900 text-base">{formData.soType || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">Booking Date</p>
                <p className="font-bold text-gray-900 text-base">{formData.bookingDate || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">Client Tech Name</p>
                <p className="font-bold text-gray-900 text-base">{formData.name || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">Client Tech Email</p>
                <p className="font-bold text-gray-900 text-sm truncate">{formData?.technicalEmail || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1"> Client Tech Ph</p>
                <p className="font-bold text-gray-900 text-base">{formData.phone || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">Client</p>
                <p className="font-bold text-gray-900 text-base">{formData.client || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">End User</p>
                <p className="font-bold text-gray-900 text-base">{formData.endUser || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all">
                <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wide mb-1">Location</p>
                <p className="font-bold text-gray-900 text-base">{formData.location || '-'}</p>
              </div>
            </div>
          </div>

          {/* 💰 Order Value */}
          <div className="bg-linear-to-br from-emerald-50 to-green-100 p-5 rounded-xl border border-emerald-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4 border-b border-emerald-200 pb-3">
              <span className="text-2xl mr-2">💰</span>
              <h3 className="font-bold text-lg text-emerald-900">Order Value</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all hover:scale-105 transform">
                <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wide mb-2">Supply Value</p>
                <p className="font-bold text-gray-900 text-xl">₹ {formData.orderValueSupply || '0'}</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all hover:scale-105 transform">
                <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wide mb-2">Service Value</p>
                <p className="font-bold text-gray-900 text-xl">₹ {formData.orderValueService || '0'}</p>
              </div>
              <div className="bg-linear-to-br from-emerald-100 to-emerald-200 p-4 rounded-lg border-2 border-emerald-400 shadow-md">
                <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wide mb-2">Total Value</p>
                <p className="font-extrabold text-emerald-900 text-xl">₹ {formData.orderValueTotal || '0'}</p>
              </div>

            </div>
          </div>

          {/* 📦 PO Details */}
          <div className="bg-linear-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4 border-b border-purple-200 pb-3">
              <span className="text-2xl mr-2">📦</span>
              <h3 className="font-bold text-lg text-purple-900">PO Details</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">PO Received</p>
                <p className="font-bold text-gray-900 text-base">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${formData.poReceived === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {formData.poReceived || '-'}
                  </span>
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">Order Number</p>
                <p className="font-bold text-gray-900 text-base">{formData.orderNumber || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">Order Date</p>
                <p className="font-bold text-gray-900 text-base">{formData.orderDate || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">PO Delivery Date</p>
                <p className="font-bold text-gray-900 text-base">{formData.deleveryDate || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">Target Delivery</p>
                <p className="font-bold text-gray-900 text-base">{formData.actualDeleveryDate || '-'}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-all">
                <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-1">Amendment Reqrd</p>
                <p className="font-bold text-gray-900 text-base">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${formData.amndReqrd === 'Yes' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {formData.amndReqrd || '-'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-linear-to-r from-orange-500 to-red-500 px-6 py-3 rounded-full shadow-lg">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-2xl">✏️</span>
                  <div className="text-center">
                    <p className="font-bold text-lg">Fillup Mode Starts Below</p>

                  </div>
                  <span className="text-2xl">📝</span>
                </div>
              </div>
            </div>
          </div>
        </>}






        {/* service details */}
        <div className="bg-indigo-50 p-6 rounded-lg border-2 border-green-300 shadow-sm">
          <h3 className="font-bold text-lg  mb-4">
            💰 Scope Details Regarding -{formData.soType}
          </h3>
          {/* SERVICE + SERVICE DAYS MENTION → SIDE BY SIDE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <SelectField
              {...InputConst[32]}
              handleChange={handleChange}
              value={formData.service}
            />


            {["DEV", "DEVCOM", "COMMISSIONING"].includes(formData.service) && <SelectField
              {...InputConst[31]}
              handleChange={handleChange}
              value={formData.priority}
            />}

          </div>
        </div>

        {/* 🔧 Development & Technical */}
        {
          ["DEV", "DEVCOM"].includes(formData.service) && <div className="bg-indigo-50 p-6 rounded-lg border-2 border-cyan-300 shadow-sm">
            <h3 className="font-bold text-lg text-cyan-800 mb-4">
              🔧 Development & Technical
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                {...InputConst[40]}
                value={formData.Development}
                handleChange={handleChange}
              />
              {["BOTH", "LOGIC"].includes(formData.Development) && (
                <SelectField
                  {...InputConst[59]}
                  value={formData.LogicPlace}
                  handleChange={handleChange}
                />
              )}

              {["BOTH", "SCADA"].includes(formData.Development) && (
                <SelectField
                  {...InputConst[60]}
                  value={formData.ScadaPlace}
                  handleChange={handleChange}
                />
              )}



              {/* <SelectField
                {...InputConst[42]}
                value={formData.isMailSent}
                handleChange={handleChange}
              />

              {!["", "N/A"].includes(formData?.Development) && (
                <>
                  <SelectField
                    {...InputConst[43]}
                    value={formData.isDevlopmentApproved}
                    handleChange={handleChange}
                  />
                </>
              )} */}
            </div>
            {
              ["BOTH", "LOGIC", "SCADA"].includes(formData.Development) &&
              <TextArea
                {...InputConst[4]}
                value={formData.devScope}
                handleChange={handleChange}
              />
            }
          </div>
        }

        {/* this is the commisioning scope */}

        {
          ["COMMISSIONING", "DEVCOM"].includes(formData.service) && <div className="bg-indigo-50 p-6 rounded-lg border-2 border-green-300 shadow-sm">

            <h3 className="font-bold text-lg text-green-800 mb-4">
              📝 Commissioning
            </h3>

            {/* Select PO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <SelectField
                {...InputConst[61]}
                value={formData.CommisinionPO}
                handleChange={handleChange}
              />

              {
                formData?.CommisinionPO === "SEPERATE" && <InputFiled
                  {...InputConst[65]}
                  value={formData.LinkedOrderNumber}
                  handleChange={handleChange}
                />
              }
            </div>

            {/* Show service scope only if YES */}
            {formData?.CommisinionPO === "YES" && (
              <>
                <div className="mt-6">
                  <h4 className="font-semibold text-green-700 mb-3">Commisioning Scope</h4>

                  <div className="flex flex-wrap gap-4">

                    {/* Supervision of Commissioning */}
                    <label className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:shadow-sm transition">
                      <input
                        type="checkbox"
                        name="Docscommission.commissioning"
                        checked={formData?.Docscommission?.commissioning}
                        onChange={handleChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="text-gray-800 font-medium text-sm">
                        Supervision of Commissioning
                      </span>
                    </label>

                    {/* Erection */}
                    <label className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:shadow-sm transition">
                      <input
                        type="checkbox"
                        name="Docscommission.erection"
                        checked={formData?.Docscommission?.erection}
                        onChange={handleChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="text-gray-800 font-medium text-sm">
                        Erection
                      </span>
                    </label>

                    {/* Instrumentation */}
                    <label className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:shadow-sm transition">
                      <input
                        type="checkbox"
                        name="Docscommission.instrumentation"
                        checked={formData?.Docscommission?.instrumentation}
                        onChange={handleChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="text-gray-800 font-medium text-sm">
                        Instrumentation
                      </span>
                    </label>

                  </div>
                </div>
                <TextArea
                  {...InputConst[33]}
                  handleChange={handleChange}
                  value={formData.commScope}
                />
              </>
            )}
          </div>
        }


        {(formData?.CommisinionPO === "YES") && (
          <div className="bg-indigo-50 p-6 rounded-lg border-2 border-green-300 shadow-sm">
            <h3 className="font-bold text-lg  mb-4">
              💰 Service days details
            </h3>

            <SelectField
              {...InputConst[63]}
              value={formData.serviceDaysMention}
              handleChange={handleChange}
            />
            {formData?.serviceDaysMention === "YES" && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Service Days in Lots
                </label>

                <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden">

                  <div className="h-8 w-px bg-gray-200"></div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* Of Lots */}
                      <div>
                        <label className="text-xs text-gray-600 font-medium">Of Lots</label>
                        <input
                          type="number"
                          name="SrvsdaysInLots.lots"
                          value={formData.SrvsdaysInLots?.lots || ""}
                          onChange={handleChange}
                          required={true}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none"
                          placeholder="0"
                          min="0"
                        />
                      </div>

                      {/* Of Days */}
                      <div>
                        <label className="text-xs text-gray-600 font-medium">Of Days</label>
                        <input
                          type="number"
                          name="SrvsdaysInLots.value"
                          value={formData.SrvsdaysInLots?.value || ""}
                          onChange={handleChange}
                          required={true}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none"
                          placeholder="0"
                          min="0"
                        />
                      </div>

                      {/* Unit Selector */}
                      <div>
                        <label className="text-xs text-gray-600 font-medium">Unit</label>
                        <div className="relative">
                          <select
                            name="SrvsdaysInLots.unit"
                            value={formData.SrvsdaysInLots?.unit || "DAYS"}
                            onChange={handleChange}
                            required={true}
                            className="w-full appearance-none px-4 py-3 border-2 border-gray-200 rounded-xl outline-none cursor-pointer"
                          >
                            <option value="DAYS">Days</option>
                            <option value="MAN-DAYS">Man-Days</option>
                          </select>

                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                <InputFiled
                  {...InputConst[64]}
                  value={formData.servicedayrate}
                  handleChange={handleChange}
                />
              </div>
            </div>}
          </div>
        )}

        {/* this is the expesns scope */}
        {
          ["DEV", "DEVCOM", "COMMISSIONING"].includes(formData.service) && <>


            {formData?.CommisinionPO === "YES" && <div className="bg-indigo-50 p-6 rounded-lg border-2 border-green-300 shadow-sm">

              {/* Header Section */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                <h2 className="text-lg font-bold text-green-800">
                  📝 Expenses
                </h2>
              </div>

              {/* SelectField Section */}
              <div className="mb-6">
                <SelectField
                  {...InputConst[62]}
                  value={formData.expenseScopeside}
                  handleChange={handleChange}
                />
              </div>
              {
                formData?.expenseScopeside === "YES" &&
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Side */}
                  <div className="bg-white/90 p-6 rounded-2xl border-2 border-blue-200 shadow-sm">
                    <h3 className="text-base font-bold text-blue-700 mb-4 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                      SIEPL Scope
                    </h3>
                    <div className="space-y-3">
                      {/* Travel */}
                      <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                          Travel
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="companyExpense"
                            value="travel"
                            checked={formData.companyExpense?.includes('travel')}
                            onChange={handleChange}
                            className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                          />
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </label>

                      {/* Accommodation */}
                      <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                          Accommodation
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="companyExpense"
                            value="accommodation"
                            checked={formData.companyExpense?.includes('accommodation')}
                            onChange={handleChange}
                            className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                          />
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </label>

                      {/* Food */}
                      <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                          Food
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="companyExpense"
                            value="food"
                            checked={formData.companyExpense?.includes('food')}
                            onChange={handleChange}
                            className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                          />
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </label>

                      {/* Conveyance */}
                      <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                          Conveyance
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="companyExpense"
                            value="conveyance"
                            checked={formData.companyExpense?.includes('conveyance')}
                            onChange={handleChange}
                            className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                          />
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </label>

                      {/* no expenses */}
                      <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                          NO EXPENSES
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="companyExpense"
                            value="no_expenses"
                            checked={formData.companyExpense?.includes('no_expenses')}
                            onChange={handleChange}
                            className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-200"
                          />
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </label>

                    </div>
                  </div>

                  {/* Client Side */}
                  <div className="bg-white/90 p-6 rounded-2xl border-2 border-green-200 shadow-sm">
                    <h3 className="text-base font-bold text-green-700 mb-4 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                      Cutomer Scope
                    </h3>
                    <div className="space-y-3">
                      {/* Travel */}
                      <label className="group flex items-center justify-between p-3 bg-green-50/50 border border-green-100 rounded-xl cursor-pointer hover:bg-green-100/60 hover:border-green-300 hover:shadow-md transition-all duration-200">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-green-700 transition-colors">
                          Travel
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="clientExpense"
                            value="travel"
                            checked={formData.clientExpense?.includes('travel')}
                            onChange={handleChange}
                            className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-green-500 checked:to-green-600 checked:border-green-600 hover:border-green-400 focus:ring-2 focus:ring-green-200"
                          />
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </label>

                      {/* Accommodation */}
                      <label className="group flex items-center justify-between p-3 bg-green-50/50 border border-green-100 rounded-xl cursor-pointer hover:bg-green-100/60 hover:border-green-300 hover:shadow-md transition-all duration-200">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-green-700 transition-colors">
                          Accommodation
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="clientExpense"
                            value="accommodation"
                            checked={formData.clientExpense?.includes('accommodation')}
                            onChange={handleChange}
                            className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-green-500 checked:to-green-600 checked:border-green-600 hover:border-green-400 focus:ring-2 focus:ring-green-200"
                          />
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </label>

                      {/* Food */}
                      <label className="group flex items-center justify-between p-3 bg-green-50/50 border border-green-100 rounded-xl cursor-pointer hover:bg-green-100/60 hover:border-green-300 hover:shadow-md transition-all duration-200">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-green-700 transition-colors">
                          Food
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="clientExpense"
                            value="food"
                            checked={formData.clientExpense?.includes('food')}
                            onChange={handleChange}
                            className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-green-500 checked:to-green-600 checked:border-green-600 hover:border-green-400 focus:ring-2 focus:ring-green-200"
                          />
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </label>

                      {/* Conveyance */}
                      <label className="group flex items-center justify-between p-3 bg-green-50/50 border border-green-100 rounded-xl cursor-pointer hover:bg-green-100/60 hover:border-green-300 hover:shadow-md transition-all duration-200">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-green-700 transition-colors">
                          Conveyance
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="clientExpense"
                            value="conveyance"
                            checked={formData.clientExpense?.includes('conveyance')}
                            onChange={handleChange}
                            className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-green-500 checked:to-green-600 checked:border-green-600 hover:border-green-400 focus:ring-2 focus:ring-green-200"
                          />
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </label>

                      {/* no expenses */}

                      <label className="group flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100/60 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                        <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
                          NO EXPENSES
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="clientExpense"
                            value="no_expenses"
                            checked={formData.clientExpense?.includes('no_expenses')}
                            onChange={handleChange}
                            className="peer w-5 h-5 appearance-none rounded-md border-2 border-gray-300 bg-white cursor-pointer transition-all checked:bg-linear-to-br checked:from-green-500 checked:to-green-600 checked:border-green-600 hover:border-green-400 focus:ring-2 focus:ring-green-200"
                          />
                          <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </label>


                    </div>
                  </div>
                </div>

              }
            </div>}

            {/* 👥 Client & Contact Details */}

            {/*  this saved in temp-1 */}
            <div className="bg-indigo-50 p-6 rounded-lg border-2 border-purple-300 shadow-sm">
              <h3 className="font-bold text-lg text-purple-800 mb-4">
                👥 Client & Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">



                {["pending", "upcoming"].includes(formData.status) && (
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

                {(formData.status === "running" || formData.status === "upcoming") && (
                  <EngineerAssignment setEngineerData={setEngineerData} />
                )}
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
                {/* <InputFiled
              {...InputConst[1]}
              value={formData.duration}
              handleChange={handleChange}
            /> */}

                {(formData.status === "pending") && (
                  <InputFiled
                    {...InputConst[16]}
                    value={formData.requestDate}
                    handleChange={handleChange}
                  />
                )}

                {["running", "upcoming"].includes(formData.status) && (
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


                {["closed", "completed", "running"].includes(formData.status) && (
                  <InputFiled
                    {...InputConst[14]}
                    value={formData.actualStartDate}
                    handleChange={handleChange}
                  />
                )}


                {["completed", "closed"].includes(formData.status) && (
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

            {/* ✅ Checklists & Submissions */}
            <div className="bg-indigo-50 p-6 rounded-lg border-2 border-pink-300 shadow-sm">
              <h3 className="font-bold text-lg text-pink-800 mb-4">
                ✅ Checklists & Submissions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["running", "upcoming", "completed", "cancelled", "closed"].includes(formData.status) && (
                  <SelectField
                    {...InputConst[30]}
                    handleChange={handleChange}
                    value={formData.StartChecklist}
                  />
                )}


                {["completed", "cancelled", "closed"].includes(formData.status) && (
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
                {["completed", "closed"].includes(formData.status) && (
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


            {/* 📎 Documents */}
            <DocumentsSection Docs={Docs} setDocs={setDocs} />

          </>
        }
      </div >
    </>

  );
};

export default FormField;
