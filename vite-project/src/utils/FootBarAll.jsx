import React from "react";

const FootBarAll = ({ one, two, three }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200">
        {one}
      </span>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200">
        {two}
      </span>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-800 shadow-sm hover:shadow-md transition duration-200">
        {three}
      </span>
    </div>
  );
};

export default FootBarAll;
