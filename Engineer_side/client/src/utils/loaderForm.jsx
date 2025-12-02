import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse min-h-screen p-10 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 flex flex-col justify-center space-y-8">
      <div className="h-12 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-full max-w-4xl mx-auto shadow-lg"></div>

      <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-full max-w-3xl mx-auto shadow-md"></div>

      <div className="space-y-4 mt-8 max-w-4xl mx-auto w-full">
        <div className="h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded shadow-md"></div>
        <div className="h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-5/6 shadow-md"></div>
        <div className="h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-2/3 shadow-md"></div>
        <div className="h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-4/5 shadow-md"></div>
      </div>

      <div className="h-14 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-1/3 mt-12 mx-auto shadow-lg"></div>
    </div>
  );
};

export default LoadingSkeleton;
