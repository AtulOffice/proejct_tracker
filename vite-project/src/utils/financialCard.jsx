import React from "react";

export const OrderDetailsCard = ({ order }) => {
  if (!order) return null;
  return (
    <>
      <div className="relative w-full flex items-center justify-center my-10">
        <div className="absolute inset-x-0 h-[3px] bg-linear-to-r from-transparent via-indigo-500 to-transparent rounded-full shadow-lg" />
        <span className="relative px-6 py-1.5 text-base sm:text-lg font-extrabold tracking-wider text-indigo-800 uppercase bg-linear-to-r from-white via-white to-white border-2 border-indigo-400 rounded-full shadow-md">
          Financial Overview
        </span>
      </div>
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Financial Overview
          </h3>
          <div className="flex-1 h-px bg-linear-to-r from-blue-200 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FinancialCard
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            }
            label="Total Order Value"
            value={
              order?.orderValueTotal
                ? (order.orderValueTotal / 100000).toFixed(2)
                : "0.00"
            }
            linear="from-blue-500 to-blue-600"
            bglinear="from-blue-50 to-blue-100"
            borderColor="border-blue-200"
          />
          <FinancialCard
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            }
            label="Supply Value"
            value={
              order?.orderValueSupply
                ? (order.orderValueSupply / 100000).toFixed(2)
                : "0.00"
            }
            linear="from-green-500 to-emerald-600"
            bglinear="from-green-50 to-emerald-100"
            borderColor="border-green-200"
          />
          <FinancialCard
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            label="Service Value"
            value={
              order?.orderValueService
                ? (order.orderValueService / 100000).toFixed(2)
                : "0.00"
            }
            linear="from-purple-500 to-purple-600"
            bglinear="from-purple-50 to-purple-100"
            borderColor="border-purple-200"
          />
          <FinancialCard
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            label="Net Order Value"
            value={
              order?.netOrderValue
                ? (order.netOrderValue / 100000).toFixed(2)
                : "0.00"
            }
            linear="from-orange-500 to-amber-600"
            bglinear="from-orange-50 to-amber-100"
            borderColor="border-orange-200"
          />
        </div>
      </section>

      {/* Client & Order Information */}
      <section className="mb-8">
        <SectionHeader
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
          title="Client & Order Information"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
          <EnhancedInfoRow label="Client" value={order?.client} />
          <EnhancedInfoRow label="End User" value={order?.endUser} />
          <EnhancedInfoRow label="Order Number" value={order?.orderNumber} />
          <EnhancedInfoRow label="Job Number" value={order?.jobNumber} />
          <EnhancedInfoRow label="SO Type" value={order?.soType} />
          <EnhancedInfoRow label="Entity Type" value={order?.entityType} />
          <EnhancedInfoRow label="Site Location" value={order?.site} />
          <EnhancedInfoRow
            label="Sales Manager"
            value={order?.concerningSalesManager}
          />
          <EnhancedInfoRow
            label="Technical Person Email"
            value={order?.technicalEmail}
          />
        </div>
      </section>

      {/* Timeline & Delivery */}
      <section className="mb-8">
        <SectionHeader
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          title="Timeline & Delivery"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
          <EnhancedInfoRow
            label="Booking Date"
            value={
              order?.bookingDate
                ? new Date(order.bookingDate).toLocaleDateString()
                : null
            }
          />
          <EnhancedInfoRow
            label="Order Date"
            value={
              order?.orderDate
                ? new Date(order.orderDate).toLocaleDateString()
                : null
            }
          />
          <EnhancedInfoRow
            label="Delivery Date"
            value={
              order?.deleveryDate
                ? new Date(order.deleveryDate).toLocaleDateString()
                : null
            }
          />
          <EnhancedInfoRow
            label="Credit Days"
            value={order?.creditDays ? `${order.creditDays} days` : null}
          />
        </div>
      </section>

      {/* Status & Dispatch with Enhanced Badges */}
      <section className="mb-8">
        <SectionHeader
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="Status & Dispatch"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <EnhancedStatusCard
            label="Order Status"
            value={order?.status}
            colorClass={getStatusColor(order?.status)}
          />
          <EnhancedStatusCard
            label="Billing Status"
            value={order?.billingStatus}
            colorClass="bg-blue-500 text-white"
          />
          <EnhancedStatusCard
            label="Dispatch Status"
            value={order?.dispatchStatus}
            colorClass={
              order?.dispatchStatus === "URGENT"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }
          />
          <EnhancedStatusCard
            label="Formal Order"
            value={order?.formalOrderStatus}
            colorClass={
              order?.formalOrderStatus === "RECEIVED"
                ? "bg-green-500 text-white"
                : "bg-orange-500 text-white"
            }
          />
        </div>
      </section>

      {/* Payment Terms with Premium Design */}
      <section className="mb-8">
        <SectionHeader
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          }
          title="Payment Terms"
        />
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg space-y-6">
          <EnhancedInfoRow
            label="Payment Against"
            value={order?.paymentAgainst}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaymentTermCard
              title="Adavance Term"
              type={order?.paymentType1}
              percentage={order?.paymentPercent1}
              amount={order?.paymentAmount1}
              linearFrom="from-blue-500"
              linearTo="to-cyan-500"
            />
            <PaymentTermCard
              title="Retention Amount"
              type={order?.paymentType2}
              percentage={order?.paymentPercent2}
              amount={order?.paymentAmount2}
              linearFrom="from-purple-500"
              linearTo="to-pink-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            <EnhancedInfoRow
              label="Sales Basic"
              value={
                order?.salesBasic
                  ? `₹${(order.salesBasic / 100000).toFixed(2)} Lacs`
                  : null
              }
            />
            <EnhancedInfoRow
              label="Sales Total"
              value={
                order?.salesTotal
                  ? `₹${(order.salesTotal / 100000).toFixed(2)} Lacs`
                  : null
              }
            />
          </div>
        </div>
      </section>

      {/* Additional Details */}
      <section className="mb-6">
        <SectionHeader
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="Additional Details"
        />
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg space-y-5">
          <EnhancedInfoRow
            label="Job Description"
            value={order?.jobDescription}
            fullWidth
          />
          <EnhancedInfoRow label="Remarks" value={order?.remarks} fullWidth />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            <EnhancedInfoRow
              label="Amendment Required"
              value={order?.amndReqrd}
            />
            <EnhancedInfoRow label="Cancellation" value={order?.cancellation} />
            <EnhancedInfoRow
              label="Bill Pending"
              value={order?.billPending}
            />
            {/* <EnhancedInfoRow
              label="Saved in Project"
              value={order?.isSaveInProject ? "Yes" : "No"}
            /> */}
          </div>
        </div>
      </section>
    </>
  );
};

const FinancialCard = ({
  icon,
  label,
  value,
  linear,
  bglinear,
  borderColor,
}) => (
  <div
    className={`group relative bg-linear-to-br ${bglinear} p-6 rounded-2xl border-2 ${borderColor} shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
    <div
      className={`relative inline-flex p-3 rounded-xl bg-linear-to-r ${linear} text-white mb-3 shadow-lg`}
    >
      {icon}
    </div>
    <p className="relative text-xs font-medium text-gray-600 mb-2">{label}</p>
    <p
      className={`relative text-3xl font-bold bg-linear-to-r ${linear} bg-clip-text text-transparent`}
    >
      ₹{value}
      <span className="text-base font-normal ml-1.5 text-gray-600">Lacs</span>
    </p>
  </div>
);

// Enhanced Section Header
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-md">
      {React.cloneElement(icon, { className: "w-5 h-5 text-white" })}
    </div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <div className="flex-1 h-px bg-linear-to-r from-blue-200 via-indigo-200 to-transparent"></div>
  </div>
);

// Enhanced Info Row Component
const EnhancedInfoRow = ({ label, value, fullWidth = false }) => (
  <div className={`group ${fullWidth ? "col-span-full" : ""}`}>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
      <span className="w-1 h-1 rounded-full bg-blue-500"></span>
      {label}
    </p>
    <p className="text-sm text-gray-900 font-semibold group-hover:text-blue-600 transition-colors">
      {value || (
        <span className="text-gray-400 italic font-normal">Not provided</span>
      )}
    </p>
  </div>
);

// Enhanced Status Card Component
const EnhancedStatusCard = ({ label, value, colorClass }) => (
  <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
      {label}
    </p>
    <div
      className={`inline-flex px-5 py-2.5 text-sm font-bold rounded-xl shadow-lg ${colorClass} transform group-hover:scale-105 transition-all duration-200`}
    >
      {value || "N/A"}
    </div>
  </div>
);

// Payment Term Card Component
const PaymentTermCard = ({
  title,
  type,
  percentage,
  amount,
  linearFrom,
  linearTo,
}) => (
  <div
    className={`relative bg-linear-to-br ${linearFrom} ${linearTo} p-6 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300`}
  >
    <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-500"></div>
    <h4 className="relative text-base font-bold text-white mb-4 flex items-center gap-2">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
      {title}
    </h4>
    <div className="relative space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/80 font-medium">Type</span>
        <span className="text-sm text-white font-bold">{type || "N/A"}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/80 font-medium">Percentage</span>
        <span className="text-sm text-white font-bold">
          {percentage ? `${percentage}%` : "N/A"}
        </span>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-white/30">
        <span className="text-xs text-white/80 font-medium">Amount</span>
        <span className="text-lg text-white font-bold">
          {amount ? `₹${(amount / 100000).toFixed(2)} L` : "N/A"}
        </span>
      </div>
    </div>
  </div>
);

// Enhanced Status Color Function
const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "OPEN":
      return "bg-green-500 text-white";
    case "CLOSED":
      return "bg-gray-500 text-white";
    case "PENDING":
      return "bg-yellow-500 text-white";
    case "CANCELLED":
      return "bg-red-500 text-white";
    default:
      return "bg-blue-500 text-white";
  }
};
