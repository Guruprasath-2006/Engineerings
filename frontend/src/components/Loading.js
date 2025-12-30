import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ fullScreen = false, message = 'Loading...' }) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <motion.div
          className="inline-block"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full"></div>
        </motion.div>
        <motion.p
          className="mt-4 text-gold font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};

export default Loading;


