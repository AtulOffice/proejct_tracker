import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OrderDetailsPopup from "../utils/OrderShower";
import { MdCancel, MdEdit } from "react-icons/md";
import { FaCheckCircle, FaEye } from "react-icons/fa";
import { firstNameWithInitial, formatYesNo, limitText, limitWords, middleEllipsis } from "../utils/middleEliminator";
import PopupConfirmation from "./PopuP.Page";
import { fetchOrderById } from "../apiCall/orders.Api";
import { useDispatch } from "react-redux";
import { toggleMode } from "../redux/slices/uiSlice";
import apiClient from "../api/axiosClient";
import { formatDateDDMMYY } from "../utils/formatter";

const OrderTableAll = ({ data }) => {
  const [selectedProjectForPopup, setSelectedProjectForPopup] = useState(null);
  const [id, seId] = useState("");
  const [cancelFlag, setCancelflag] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleUpdate = (id) => {
    try {
      navigate(`/updateOrder/${id}`, {
        state: { fromButton: true, recordId: id, replace: true },
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleCancelled = async (id) => {
    try {
      const res = await apiClient.put(`/order/cancel/${id}`);
      dispatch(toggleMode())
      toast.success(res?.data?.message || "Project cancelled successfully");
    } catch (e) {
      console.error(e);
      toast.error(
        e?.response?.data?.message || "Failed to cancel the order"
      );
    } finally {
      setCancelflag(false)
    }
  };


  const hadleOpenPopup = async (id) => {
    try {
      const val = await fetchOrderById(id);
      if (val) {
        setSelectedProjectForPopup(val);
      }
      // toast.success("Order details fetched successfully");
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data.message || "An error occurred");
      }
      console.log("Error fetching project details:", error);
    }
  };

  return (
    <div className="relative h-full col-span-full w-full overflow-hidden rounded-lg shadow-sm bg-white border border-gray-200">
      {cancelFlag && (
        <PopupConfirmation
          setCancelflag={setCancelflag}
          handleConfirm={() => handleCancelled(id)}
          // isDisabled={isDisabled}
          title="Are you sure?"
          message={`Do you really want to cancel this Order ? This action cannot be undone.`}
          btnval="YES"
        />
      )}
      {selectedProjectForPopup && (
        <OrderDetailsPopup
          order={selectedProjectForPopup}
          onClose={() => setSelectedProjectForPopup(null)}
        />
      )}
      <div className="hidden md:block">
        <div className="max-h-[760px] overflow-auto hide-scrollbar">
          <table className="w-full table-fixed border-collapse">
            <thead className="sticky top-0 z-20">
              <tr className="bg-gray-900">
                <th className="w-16 px-2 py-0.5 text-center font-semibold text-sm !text-white bg-gray-900 sticky left-0 z-30">
                  Sr No
                </th>
                <th className="w-25 px-3 py-0.5 text-left font-semibold text-sm !text-white bg-gray-900 sticky left-16 z-30">
                  Job ID
                </th>
                <th className="w-32 px-3 py-0.5 text-left font-semibold text-sm !text-white">Client</th>
                <th className="w-32 px-3 py-0.5 text-left font-semibold text-sm !text-white">Booking Date</th>
                <th className="w-32 px-2 py-0.5 text-left font-semibold text-sm !text-white">Target Del Date</th>
                <th className="w-28 px-3 py-0.5 text-left font-semibold text-sm !text-white">End User</th>
                <th className="w-28 px-3 py-0.5 text-left font-semibold text-sm !text-white">Acc. M.</th>
                <th className="w-16 px-2 py-0.5 text-center font-semibold text-sm !text-white">Po Rec.</th>
                <th className="w-16 px-2 py-0.5 text-center font-semibold text-sm !text-white">Amnd.</th>
                <th className="w-16 px-2 py-0.5 text-center font-semibold text-sm !text-white">Dis. Sts</th>
                <th className="w-16 px-2 py-0.5 text-center font-semibold text-sm !text-white">Svc Sts</th>
                <th className="w-16 px-2 py-0.5 text-center font-semibold text-sm !text-white">Bill Sts</th>

                <th className="w-[48px] px-0.5 py-0.5 text-center font-semibold text-xs !text-white bg-gray-900 sticky right-[126px] z-30">
                  View
                </th>
                <th className="w-[48px] px-0.5 py-0.5 text-center font-semibold text-xs !text-white bg-gray-900 sticky right-[84px] z-30">
                  Edit
                </th>
                <th className="w-[48px] px-0.5 py-0.5 text-center font-semibold text-xs !text-white bg-gray-900 sticky right-[42px] z-30">
                  Cancel
                </th>
                <th className="w-[48px] px-0.5 py-0.5 text-center font-semibold text-xs !text-white bg-gray-900 sticky right-0 z-30">
                  Approve
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((order, indx) => {
                const isCancelled = order?.isCancelled === true;
                const disabledBtn = "text-gray-400 cursor-not-allowed";

                return (
                  <tr
                    key={indx}
                    className={`transition-colors duration-150 font-mono
              ${isCancelled
                        ? "bg-red-100 text-red-700"
                        : indx % 2 === 1
                          ? "bg-gray-200 hover:bg-slate-100"
                          : "bg-white hover:bg-slate-50"
                      }`}
                  >
                    {/* LEFT STICKY */}
                    <td className="px-4 py-0.5 text-center text-sm font-semibold sticky left-0 bg-inherit z-10">
                      {indx + 1}
                    </td>
                    <td className="px-2 py-0.5 text-base whitespace-nowrap sticky left-16 bg-inherit z-10">
                      {order.jobNumber}
                    </td>

                    {/* SCROLLABLE MIDDLE */}
                    <td className="px-2 py-0.5 text-base whitespace-nowrap">
                      <div className="truncate text-sm" title={order.client}>
                        {limitText(order.client, 10)}
                      </div>
                    </td>
                    <td className="px-2 py-0.5 text-base whitespace-nowrap">
                      {formatDateDDMMYY(order?.bookingDate)}
                    </td>
                    <td className="px-2 py-0.5 text-base whitespace-nowrap">
                      {formatDateDDMMYY(order?.actualDeleveryDate)}
                    </td>
                    <td className="px-2 py-0.5 text-base whitespace-nowrap">
                      <div className="truncate text-sm" title={order.site}>
                        {limitText(order.endUser, 10)}
                      </div>
                    </td>
                    <td className="px-2 py-0.5 text-base whitespace-nowrap">
                      {firstNameWithInitial(order?.concerningSalesManager?.name)}
                    </td>
                    <td className="px-2 py-0.5 text-base whitespace-nowrap">
                      {formatYesNo(order?.poReceived)}
                    </td>
                    <td className="px-2 py-0.5 text-base whitespace-nowrap">
                      {formatYesNo(order?.amndReqrd)}
                    </td>
                    <td className="px-2 py-0.5 text-base whitespace-nowrap">
                      -
                    </td>
                    <td className="px-2 py-0.5 text-base whitespace-nowrap">
                      -
                    </td>
                    <td className="px-2 py-0.5 text-base whitespace-nowrap">
                      -
                    </td>

                    {/* RIGHT STICKY ACTIONS */}
                    <td className="px-1 py-0.5 text-center sticky right-[144px] bg-inherit z-10">
                      <button
                        onClick={() => hadleOpenPopup(order._id)}
                        className="p-0.5 rounded transition-all bg-transparent text-white hover:bg-gray-200"
                      >
                        <FaEye size={14} />
                      </button>
                    </td>

                    <td className="px-1 py-0.5 text-center sticky right-[84px] bg-inherit z-10">
                      <button
                        disabled={isCancelled}
                        onClick={() => !isCancelled && handleUpdate(order._id)}
                        className={`p-0.5 rounded transition-all ${isCancelled ? disabledBtn : "text-emerald-600 hover:bg-gray-200"
                          }`}
                      >
                        <MdEdit size={14} />
                      </button>
                    </td>

                    <td className="px-1 py-0.5 text-center sticky right-[42px] bg-inherit z-10">
                      <button
                        disabled={isCancelled}
                        onClick={() => {
                          if (isCancelled) return;
                          seId(order?._id);
                          setCancelflag(true);
                        }}
                        className={`p-0.5 rounded transition-all ${isCancelled ? disabledBtn : "text-red-600 hover:bg-gray-200"
                          }`}
                      >
                        <MdCancel size={14} />
                      </button>
                    </td>

                    <td className="px-1 py-0.5 text-center sticky right-0 bg-inherit z-10">
                      <button
                        className={`p-0.5 rounded transition-all ${isCancelled ? disabledBtn : "text-blue-600 hover:bg-gray-200"
                          }`}
                      >
                        <FaCheckCircle size={14} />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Optional Enhancement */}
      <div className="md:hidden space-y-3 p-4">
        {data.map((order, indx) => {
          const isCancelled = order?.isCancelled === true;
          return (
            <div
              key={indx}
              onClick={() => hadleOpenPopup(order?._id)}
              className={`border rounded-lg p-4 transition-all
          ${isCancelled
                  ? "bg-red-50 border-red-200 text-red-700 cursor-not-allowed"
                  : "bg-white border-gray-200 hover:shadow-md cursor-pointer"
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="text-sm font-semibold truncate max-w-[70%]"
                  title={middleEllipsis(order.client)}
                >
                  {order.client}
                </div>
                {!isCancelled && <button
                  disabled={isCancelled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isCancelled) handleUpdate(order._id);
                  }}
                  className={`p-2 rounded-md border transition-all
              ${isCancelled
                      ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                      : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  title={isCancelled ? "Action not allowed" : "Edit order"}
                >
                  <MdEdit size={16} />
                </button>}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Job Number:</span>
                  <span className="font-medium">
                    {middleEllipsis(order.jobNumber)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Booking Date:</span>
                  <span className="font-medium">
                    {order?.bookingDate
                      ? new Date(order.bookingDate).toLocaleDateString("en-GB")
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Entity Type:</span>
                  <span>{order?.entityType || "—"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">SO Type:</span>
                  <span>{order.soType || "—"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Site:</span>
                  <span>{middleEllipsis(order.site, 10, 5)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Section */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">{data.length}</span>{" "}
            {data.length !== 1 ? "entries" : "entry"}
          </p>
        </div>
      </div>

    </div >
  );
};

export default OrderTableAll;
