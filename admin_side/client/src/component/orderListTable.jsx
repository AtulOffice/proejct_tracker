import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchbyOrderbyId } from "../utils/apiCall";
import toast from "react-hot-toast";
import OrderDetailsPopup from "../utils/OrderShower";
import { MdEdit } from "react-icons/md";

const OrderTableAll = ({ data }) => {
  const [selectedProjectForPopup, setSelectedProjectForPopup] = useState(null);
  const navigate = useNavigate();

  const handleUpdate = (id) => {
    try {
      navigate(`/updateOrder/${id}`, {
        state: { fromButton: true, recordId: id, replace: true },
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const hadleOpenPopup = async (id) => {
    try {
      const val = await fetchbyOrderbyId(id);
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
    <div className="relative italic h-full col-span-full w-full overflow-hidden rounded-lg shadow-sm bg-white border border-gray-200">
      {selectedProjectForPopup && (
        <OrderDetailsPopup
          order={selectedProjectForPopup}
          onClose={() => setSelectedProjectForPopup(null)}
        />
      )}
      <div className="overflow-x-auto hidden md:block">
        <div className="max-h-[690px] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 border-b-2 border-purple-400 shadow-md">
                <th className="w-1/5 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  Client Name
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  Job ID
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  Booking Date
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  Entity Type
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  SO Type
                </th>
                <th className="w-1/5 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  Site
                </th>
                <th className="w-20 px-6 py-4 text-center text-sm font-semibold tracking-wide uppercase text-white!">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((order, indx) => (
                <tr
                  key={indx}
                  className="hover:bg-slate-50 transition-colors duration-150 group"
                >
                  <td
                    className="px-6 py-4"
                    onClick={() => hadleOpenPopup(order?._id)}
                  >
                    <div
                      className="text-sm font-medium text-gray-900 truncate hover:cursor-pointer hover:text-blue-600 transition-colors"
                      title={order.client}
                    >
                      {order?.client}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap font-mono">
                    {order.jobNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap font-mono">
                    {order?.bookingDate
                      ? new Date(order.bookingDate).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {order?.entityType || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {order.soType || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-gray-700 truncate"
                      title={order.site}
                    >
                      {order.site || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleUpdate(order?._id)}
                      className="inline-flex items-center justify-center p-2.5 rounded-lg bg-linear-to-br from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-200 hover:border-emerald-400 hover:from-emerald-100 hover:to-teal-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                      title="Edit this order"
                    >
                      <MdEdit
                        size={18}
                        className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile View - Optional Enhancement */}
      <div className="md:hidden space-y-3 p-4">
        {data.map((order, indx) => (
          <div
            key={indx}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-900 truncate max-w-[70%]">
                {order.client}
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {order.jobNumber}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Date:</span>
                <span className="text-gray-900 font-medium">
                  {order?.bookingDate
                    ? new Date(order.bookingDate).toLocaleDateString("en-GB")
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Entity Type:</span>
                <span className="text-gray-900">
                  {order?.entityType || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SO Type:</span>
                <span className="text-gray-900">{order.soType || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Site:</span>
                <span className="text-gray-900">{order.site || "—"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Footer Section */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">{data.length}</span>{" "}
            {data.length !== 1 ? "entries" : "entry"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTableAll;
