import React from 'react';
import { motion } from 'framer-motion';

const LiquidLoader = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <motion.div
        className="relative w-20 h-20"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-0 bg-accent rounded-full opacity-25 blur-xl" />
        <motion.div
          className="absolute inset-0 bg-accent rounded-full"
          animate={{
            scale: [1, 0.8, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 bg-white mix-blend-overlay rounded-full"
          animate={{
            scale: [1, 0.9, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};

export default LiquidLoader; 