import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi';

const Alert = ({ type = 'info', message, onClose, autoClose = false }) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!visible) return null;

  const config = {
    success: {
      icon: FiCheckCircle,
      bgColor: 'bg-green-50 border-green-500',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: FiAlertCircle,
      bgColor: 'bg-red-50 border-red-500',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: FiAlertTriangle,
      bgColor: 'bg-yellow-50 border-yellow-500',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: FiInfo,
      bgColor: 'bg-blue-50 border-blue-500',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  const { icon: Icon, bgColor, textColor, iconColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`border-l-4 p-4 ${bgColor} rounded-r-lg shadow-md mb-4`}
    >
      <div className="flex items-start">
        <Icon className={`${iconColor} text-xl mt-0.5 mr-3 flex-shrink-0`} />
        <p className={`${textColor} flex-1 text-sm font-medium`}>{message}</p>
        {onClose && (
          <button
            onClick={() => {
              setVisible(false);
              onClose();
            }}
            className={`${textColor} hover:opacity-70 ml-3`}
          >
            <FiX className="text-lg" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Alert;


