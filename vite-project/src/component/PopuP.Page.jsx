import React from "react";

const PopupConfirmation = ({
  setCancelflag,
  title,
  message,
  btnval,
  handleConfirm,
  isDisabled,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-120 max-w-md animate-fade-in border-4 border-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
        <h2 className="text-2xl font-extrabold text-red-600 mb-4 flex items-center">
          <svg
            className="w-7 h-7 mr-3 text-red-500 animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
          {title}
        </h2>
        <p className="text-gray-800 mb-8 text-lg font-medium">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              setCancelflag(false);
            }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-900 font-semibold transition shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              handleConfirm();
            }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 hover:from-red-600 hover:via-pink-600 hover:to-yellow-500 text-white font-semibold transition shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {btnval}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupConfirmation;
