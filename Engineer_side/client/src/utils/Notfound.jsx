import React from "react";
import { motion } from "framer-motion";
import { SearchX, Sparkles } from "lucide-react";

const Notfound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="col-span-full flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="relative mb-6"
        >
          <div className="relative bg-white rounded-full p-6 shadow-lg">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <SearchX className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
            </motion.div>
          </div>
          <motion.div
            animate={{ y: [-6, -12], opacity: [0, 1, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3,
            }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
          </motion.div>
          <motion.div
            animate={{ y: [-6, -12], opacity: [0, 1, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.8,
            }}
            className="absolute -bottom-1 -left-1"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            No Results Found
          </h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-gray-500 text-center max-w-md leading-relaxed"
          >
            We couldn't find what you're looking for. Try adjusting your search
            criteria or time filter to discover more results.
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 bg-blue-400 rounded-full"
          />
          <span className="text-sm text-gray-600">
            Try broadening your search
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Notfound;
