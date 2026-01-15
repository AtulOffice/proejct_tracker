import React, { useState, useEffect, useRef } from "react";
import Notfound from "../utils/Notfound";
import LoadingSkeltionAll from "../utils/LoaderAllPorject";
import { filterProjectsUtils } from "../utils/filterUtils";
import FilterCompo from "../utils/FilterCompo";
import OrderTableAll from "./orderListTable.jsx";
import { fetchOrdersAll } from "../apiCall/orders.Api.js";
import { useSelector } from "react-redux";

const OrderList = () => {
  const { toggle } = useSelector((state) => state.ui);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [data, setData] = useState();
  const [debounceSearchTerm, setdebounceSerchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setdebounceSerchTerm(searchTerm);
    }, 2000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const getOrders = async () => {
      if (debounceSearchTerm && debounceSearchTerm.trim() !== "") {
        try {
          const val = await fetchOrdersAll({
            search: debounceSearchTerm,
          });
          if (val) {
            setData(val?.orders);
          }
        } catch (error) {
          console.error("Failed to fetch by jobNumber", error);
        }
      } else {
        const val = await fetchOrdersAll({
          search: "",
        });
        if (val) {
          setData(val?.orders);
        }
      }
    };
    getOrders();
  }, [toggle, debounceSearchTerm]);

  useEffect(() => {
    if (!data) return;
    const filterfun = setTimeout(() => {
      const filtered = filterProjectsUtils({
        data: data,
        timeFilter,
      });
      setFilteredProjects(filtered);
    }, 100);

    return () => clearTimeout(filterfun);
  }, [timeFilter, data]);

  const filterRef = useRef(null);

  if (!data) {
    return <LoadingSkeltionAll />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:ml-40 px-6 pt-20 bg-linear-to-br from-gray-50 to-white rounded-2xl shadow-sm">
      <FilterCompo
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        filteredProjects={filteredProjects}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        filterRef={filterRef}
        EngHandle={true}
      />

      <div className="flex-1 w-full overflow-hidden rounded-xl shadow-lg bg-white border border-gray-200">
        {filteredProjects.length > 0 ? (
          <OrderTableAll data={filteredProjects} />
        ) : (
          <Notfound />
        )}
      </div>
    </div>
  );
};

export default OrderList;
