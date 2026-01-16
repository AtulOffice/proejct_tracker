import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OrderDetailsPopup from "../utils/OrderShower";
import { MdCancel, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { middleEllipsis } from "../utils/middleEliminator";
import PopupConfirmation from "./PopuP.Page";
import { fetchOrderById } from "../apiCall/orders.Api";
import { useDispatch } from "react-redux";
import { toggleMode } from "../redux/slices/uiSlice";
import apiClient from "../api/axiosClient";

const OrderTableAll = ({ data }) => {
  console.log(data)
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
      <div className="overflow-x-auto hidden md:block">
        <div className="max-h-[460px] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-900">
                <th className="w-16 px-2 py-1.5 text-center font-semibold text-white!">
                  Sr No
                </th>

                <th className="w-20 px-3 py-1.5 text-left font-semibold text-white!">
                  Job ID
                </th>

                <th className="w-32 px-3 py-1.5 text-left font-semibold text-white!">
                  Client
                </th>

                <th className="w-32 px-3 py-1.5 text-left font-semibold text-white!">
                  Booking Date
                </th>

                <th className="w-32 px-2 py-1.5 text-left font-semibold text-white!">
                  Target Del Date
                </th>

                <th className="w-28 px-3 py-1.5 text-left font-semibold text-white!">
                  Site
                </th>

                <th className="w-28 px-3 py-1.5 text-left font-semibold text-white!">
                  Acc. M.
                </th>

                <th className="w-16 px-2 py-1.5 text-center font-semibold text-white!">
                  Po Rec.
                </th>

                <th className="w-16 px-2 py-1.5 text-center font-semibold text-white!">
                  Amnd.
                </th>

                {/* ✅ Actions group */}
                <th className="w-[60px] px-1 py-1.5 text-center font-semibold text-white!">
                  View
                </th>
                <th className="w-[60px] px-1 py-1.5 text-center font-semibold text-white!">
                  Edit
                </th>
                <th className="w-[70px] px-1 py-1.5 text-center font-semibold text-white!">
                  Cancel
                </th>
              </tr>
            </thead>


            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((order, indx) => {
                const isCancelled = order?.isCancelled === true;
                const disabledBtn =
                  "text-gray-400  cursor-not-allowed";

                return (
                  <tr
                    key={indx}
                    className={`transition-colors duration-150
            ${isCancelled
                        ? "bg-red-100 text-red-700"
                        : indx % 2 === 1
                          ? "bg-gray-200 hover:bg-slate-100"
                          : "bg-white hover:bg-slate-50"
                      }`}
                  >
                    <td className="px-4 py-1 text-center text-sm font-semibold">
                      {indx + 1}
                    </td>

                    <td className="px-6 py-1 text-base whitespace-nowrap font-mono">
                      {order.jobNumber}
                    </td>

                    <td className="px-6 py-1 text-base whitespace-nowrap">
                      <div className="truncate text-sm" title={order.client}>
                        {middleEllipsis(order.client, 10, 5)}
                      </div>
                    </td>

                    <td className="px-6 py-1 text-base whitespace-nowrap font-mono">
                      {order?.bookingDate || "—"}
                    </td>

                    <td className="px-6 py-1 text-base whitespace-nowrap">
                      {order?.actualDeleveryDate || "—"}
                    </td>

                    <td className="px-6 py-1 text-base whitespace-nowrap">
                      <div className="truncate text-sm" title={order.site}>
                        {middleEllipsis(order.site, 7, 5)}
                      </div>
                    </td>
                    <td className="px-6 py-1 text-base whitespace-nowrap">
                      {middleEllipsis(order?.concerningSalesManager?.name, 7, 5)}
                    </td><td className="px-6 py-1 text-base whitespace-nowrap">
                      {order?.poReceived || "—"}
                    </td>
                    <td className="px-6 py-1 text-base whitespace-nowrap">
                      {order?.amndReqrd || "—"}
                    </td>

                    <td className="px-6 py-1 text-center">
                      <button
                        onClick={() => hadleOpenPopup(order._id)}
                        className={`p-3 rounded-xl transition-all bg-transparent text-white hover:bg-gray-200`}
                        title={isCancelled ? "Action not allowed" : "View order"}
                      >
                        <FaEye size={18} />
                      </button>
                    </td>

                    <td className="px-6 py-1 text-center">
                      <button
                        disabled={isCancelled}
                        onClick={() => !isCancelled && handleUpdate(order._id)}
                        className={`p-2.5 rounded-lg transition-all
      ${isCancelled
                            ? disabledBtn
                            : "bg-transparent text-emerald-600 hover:bg-gray-200"
                          }`}
                        title={isCancelled ? "Action not allowed" : "Edit order"}
                      >
                        <MdEdit size={18} />
                      </button>
                    </td>


                    <td className="px-6 py-1 text-center">
                      <button
                        disabled={isCancelled}
                        onClick={() => {
                          if (isCancelled) return;
                          seId(order?._id);
                          setCancelflag(true);
                        }}
                        className={`p-2.5 rounded-lg transition-all
      ${isCancelled
                            ? disabledBtn
                            : "bg-transparent text-red-600 hover:bg-gray-200"
                          }`}
                        title={isCancelled ? "Order already cancelled" : "Cancel order"}
                      >
                        <MdCancel size={18} />
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
