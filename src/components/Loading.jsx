import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-primary bg-opacity-80 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-8 h-8 bg-accent rounded-full"></div>
          </motion.div>
        </div>
        <p className="text-white mt-4">Loading...</p>
      </div>
    </motion.div>
  );
};

export default Loading; 