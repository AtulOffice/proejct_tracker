import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchbyOrderbyId } from "../utils/apiCall";
import toast from "react-hot-toast";
import OrderDetailsPopup from "../utils/OrderShower";
import { MdCancel, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";

const OrderTableAll = ({ data }) => {
  const [selectedProjectForPopup, setSelectedProjectForPopup] = useState(null);
  const navigate = useNavigate();
  console.log(data)

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
            <thead className="sticky top-0">
              <tr className="bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 border-b-2 border-purple-400 shadow-md">
                <th className="w-32 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  Job ID
                </th>
                <th className="w-1/5 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  Client Name
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  Booking Date
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  Target Del Date
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  SO Type
                </th>
                <th className="w-1/5 px-6 py-4 text-left text-sm font-semibold tracking-wide uppercase text-white!">
                  Site
                </th>
                <th className="w-20 px-6 py-4 text-center text-sm font-semibold tracking-wide uppercase text-white!">
                  view
                </th>
                <th className="w-20 px-6 py-4 text-center text-sm font-semibold tracking-wide uppercase text-white!">
                  Edit
                </th>
                <th className="w-20 px-6 py-4 text-center text-sm font-semibold tracking-wide uppercase text-white!">
                  Cancel
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((order, indx) => (
                <tr
                  key={indx}
                  className="hover:bg-slate-50 transition-colors duration-150 group"
                >
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap font-mono">
                    {order.jobNumber}
                  </td>
                  <td
                    className="px-6 py-4"

                  >
                    <div
                      className="text-sm  text-gray-900 truncate  hover:text-blue-600 transition-colors"
                      title={order.client}
                    >
                      {order?.client}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap font-mono">
                    {order?.bookingDate || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {order?.actualDeleveryDate || "—"}
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
                      onClick={() => hadleOpenPopup(order?._id)}
                      className="relative inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-white border-0 hover:from-emerald-500 hover:via-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-2xl hover:shadow-emerald-400/50 transition-all duration-300 group overflow-hidden"
                      title="Edit this order"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <FaEye
                        size={18}
                        className="relative z-10 group-hover:scale-110 transition-transform duration-300"
                      />
                    </button>
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
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toast('This Feature comming soon', {
                        icon: '👍',
                      })}
                      className="inline-flex items-center justify-center p-2.5 rounded-lg bg-gradient-to-br from-red-200 to-rose-200 text-white border border-red-600 hover:from-red-300 hover:to-rose-500 hover:border-red-500 shadow-sm hover:shadow-lg hover:shadow-red-500/40 transition-all duration-300 group"
                      title="Cancel this order"
                    >
                      <MdCancel
                        size={18}
                        className="group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300"
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
            onClick={() => { hadleOpenPopup(order?._id) }}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-900 truncate max-w-[70%]">
                {order.client}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate(order._id);
                }}
                className="p-2 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                title="Edit order"
              >
                <MdEdit size={16} />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Job Number:</span>
                <span className="text-gray-900 font-medium">
                  {order.jobNumber}
                </span>
              </div>
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
    </div >
  );
};

export default OrderTableAll;
