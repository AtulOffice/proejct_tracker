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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon container with animated border */}
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
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-md opacity-40"
            style={{ padding: "2px" }}
          />
          <div className="relative bg-white rounded-full p-6 shadow-lg">
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SearchX className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
            </motion.div>
          </div>

          {/* Floating sparkles */}
          <motion.div
            animate={{
              y: [-10, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3,
            }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
          </motion.div>
          <motion.div
            animate={{
              y: [-10, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.8,
            }}
            className="absolute -bottom-2 -left-2"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
          </motion.div>
        </motion.div>

        {/* Text content with staggered animation */}
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

        {/* Subtle hint with animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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
