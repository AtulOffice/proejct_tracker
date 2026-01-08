import React from "react";

const LoadingSkeltionAll = () => {
  return (
    <div className="w-full min-h-screen p-6 sm:p-10 rounded-2xl animate-pulse bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 flex flex-col justify-center space-y-6">
      <div className="h-12 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-full sm:max-w-4xl mx-auto shadow-lg"></div>
      <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-full sm:max-w-3xl mx-auto shadow-md"></div>
      <div className="space-y-3 mt-6 w-full sm:max-w-4xl mx-auto">
        <div className="h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded shadow-md w-full"></div>
        <div className="h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded shadow-md w-5/6"></div>
        <div className="h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded shadow-md w-2/3"></div>
        <div className="h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded shadow-md w-4/5"></div>
      </div>
      <div className="h-14 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-full sm:w-1/3 mt-10 mx-auto shadow-lg"></div>
    </div>
  );
};

export default LoadingSkeltionAll;
