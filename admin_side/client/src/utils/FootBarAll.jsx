import React from "react";
import { FaHome } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const FootBarAll = ({ one, two, three, four }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200">
        {one}
      </span>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200">
        {two}
      </span>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200">
        {three}
      </span>
      {four && (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-linear-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200 flex items-center gap-1">
          {four === "OFFICE" ? (
            <>
              <FaHome className="text-indigo-700 text-sm" />
            </>
          ) : (
            <>
              <MdLocationOn className="text-pink-700 text-sm" />
            </>
          )}
        </span>
      )}
    </div>
  );
};

export default FootBarAll;
