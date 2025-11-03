import React from "react";

const LoadingSkeltionAll = () => {
  return (
    <div className="w-full min-h-screen p-6 sm:p-10 rounded-2xl animate-pulse bg-white flex flex-col justify-center space-y-6">
      <div className="h-12 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-full sm:max-w-4xl mx-auto shadow"></div>
      <div className="h-8 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-full sm:max-w-3xl mx-auto shadow"></div>
      <div className="space-y-3 mt-6 w-full sm:max-w-4xl mx-auto">
        <div className="h-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded shadow w-full"></div>
        <div className="h-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded shadow w-5/6"></div>
        <div className="h-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded shadow w-2/3"></div>
        <div className="h-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded shadow w-4/5"></div>
      </div>
      <div className="h-14 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-full sm:w-1/3 mt-10 mx-auto shadow"></div>
    </div>
  );
};

export default LoadingSkeltionAll;
