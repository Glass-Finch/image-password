'use client'

import { motion } from 'framer-motion'
import { useGame } from '@/components/providers/GameProvider'

interface LockedScreenProps {
  reason: 'timeout' | 'failed'
}

export default function LockedScreen({ reason }: LockedScreenProps) {
  const { restartGame } = useGame()

  const getMessage = () => {
    switch (reason) {
      case 'timeout':
        return {
          title: 'Time\'s Up! ⏰',
          message: 'You ran out of time. Try again with fresh cards!',
          emoji: '⌛'
        }
      case 'failed':
        return {
          title: 'Wrong Choice! ❌',
          message: 'That wasn\'t the right card. Give it another shot!',
          emoji: '🎯'
        }
    }
  }

  const { title, message, emoji } = getMessage()

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const iconVariants = {
    animate: {
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1]
      }
    }
  }

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(166, 226, 46, 0.3)"
    },
    tap: { scale: 0.95 }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center max-w-md mx-4">
        {/* Main icon */}
        <motion.div
          className="text-6xl mb-6"
          variants={iconVariants}
          animate="animate"
        >
          {emoji}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl font-bold text-monokai-red mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {title}
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-lg text-monokai-text mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {message}
        </motion.p>

        {/* Security notice */}
        <motion.div
          className="bg-monokai-bg-light border-l-4 border-monokai-orange p-4 mb-8 text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex items-center">
            <span className="text-monokai-orange text-xl mr-2">🔒</span>
            <div>
              <p className="text-sm font-semibold text-monokai-orange">Security Notice</p>
              <p className="text-xs text-monokai-text-dim mt-1">
                The puzzle has been reset to prevent answer lookup. New cards have been shuffled.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={restartGame}
            className="
              bg-gradient-to-r from-monokai-purple to-monokai-blue
              text-monokai-bg font-bold py-3 px-8 rounded-lg
              hover:from-monokai-blue hover:to-monokai-purple
              transition-all duration-300 transform
              shadow-lg
            "
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Try Again 🎮
          </motion.button>

          <motion.button
            onClick={() => {
              const studyUrl = process.env.NEXT_PUBLIC_LOSS_REDIRECT_URL || 'https://example.com/study'
              window.open(studyUrl, '_blank')
            }}
            className="
              bg-gradient-to-r from-monokai-yellow to-monokai-orange
              text-monokai-bg font-bold py-3 px-8 rounded-lg
              hover:from-monokai-orange hover:to-monokai-yellow
              transition-all duration-300 transform
              shadow-lg
            "
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Go Study Up 📚
          </motion.button>
        </div>

        {/* Hint text */}
        <motion.p
          className="text-xs text-monokai-text-dim mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Study the reference deck carefully. Choose cards that would complement it strategically.
        </motion.p>
      </div>

      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-monokai-red rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.6, 0.2, 0.6],
              scale: [1, 0.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}