import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Notfound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-16 px-4"
    >
      <svg
        className="w-16 h-16 text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <p className="text-xl font-medium text-gray-700 mb-1">
        No projects found
      </p>
      <p className="text-gray-500 text-center max-w-md">
        Try adjusting your search criteria or changing the time filter to see
        more results
      </p>
    </motion.div>
  );
};

export default Notfound;
