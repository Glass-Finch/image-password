'use client'

import { motion } from 'framer-motion'

interface LoadingStateProps {
  message?: string
  progress?: number
}

export default function LoadingState({ message = 'Loading magical challenge...', progress = 0 }: LoadingStateProps) {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-monokai-bg via-monokai-bg-light to-monokai-bg">
      {/* Floating magical elements */}
      <div className="relative mb-8">
        <motion.div
          className="text-6xl"
          variants={floatingVariants}
          animate="animate"
        >
          🎴
        </motion.div>
        
        {/* Spinning ring around card */}
        <motion.div
          className="absolute inset-0 border-4 border-transparent border-t-monokai-green border-r-monokai-blue rounded-full"
          variants={spinnerVariants}
          animate="animate"
        />
        
        {/* Pulsing outer ring */}
        <motion.div
          className="absolute inset-0 border-2 border-monokai-yellow rounded-full -m-4"
          variants={pulseVariants}
          animate="animate"
        />
      </div>

      {/* Loading text */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-xl font-bold gradient-text">
          {message}
        </h2>
        
        <div className="flex items-center justify-center space-x-1 text-monokai-text-secondary">
          <span>Loading images</span>
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.5
              }}
            >
              .
            </motion.span>
          ))}
        </div>
        
        {progress > 0 && (
          <div className="mt-4 w-64 mx-auto">
            <div className="flex justify-between text-sm text-monokai-text-secondary mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-monokai-bg-dark rounded-full h-2">
              <motion.div
                className="bg-monokai-purple h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Background magical particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-monokai-yellow rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  )
}