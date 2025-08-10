'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'spinner',
  className = '',
  text
}) => {
  const sizes = {
    sm: { spinner: 'h-4 w-4', dot: 'h-2 w-2', text: 'text-sm' },
    md: { spinner: 'h-8 w-8', dot: 'h-3 w-3', text: 'text-base' },
    lg: { spinner: 'h-12 w-12', dot: 'h-4 w-4', text: 'text-lg' },
    xl: { spinner: 'h-16 w-16', dot: 'h-5 w-5', text: 'text-xl' },
  };

  const spinnerAnimation = {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear" as const
    }
  };

  const dotAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const pulseAnimation = {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            animate={spinnerAnimation}
            className={`border-3 border-blue-200 border-t-blue-600 border-r-blue-600 rounded-full ${sizes[size].spinner}`}
          />
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  ...dotAnimation,
                  transition: {
                    ...dotAnimation.transition,
                    delay: i * 0.2
                  }
                }}
                className={`bg-blue-600 rounded-full ${sizes[size].dot}`}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            animate={pulseAnimation}
            className={`bg-blue-600 rounded-full ${sizes[size].spinner}`}
          />
        );

      case 'wave':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: [1, 2, 1],
                  transition: {
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut'
                  }
                }}
                className={`bg-blue-600 rounded-sm ${sizes[size].dot}`}
                style={{ height: sizes[size].dot.includes('h-2') ? '8px' : sizes[size].dot.includes('h-3') ? '12px' : '16px', width: '3px' }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="flex items-center justify-center">
        {renderSpinner()}
      </div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-gray-600 font-medium ${sizes[size].text}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;