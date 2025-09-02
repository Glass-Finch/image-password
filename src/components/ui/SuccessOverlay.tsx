'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useGame } from '@/components/providers/GameProvider'

interface SuccessOverlayProps {
  onComplete: () => void
}

export default function SuccessOverlay({ onComplete }: SuccessOverlayProps) {
  const { config } = useGame()
  const [showStars, setShowStars] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStars(true)
    }, 500)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  const starVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: { 
      scale: [0, 1.2, 1], 
      rotate: [0, 360],
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: "backOut",
        times: [0, 0.6, 1]
      }
    }
  }

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.8,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background magical particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-monokai-yellow rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative text-center">
        {/* Main success star */}
        <motion.div
          className="text-8xl mb-6 kawaii-star"
          variants={starVariants}
          initial="hidden"
          animate="visible"
        >
          ⭐
        </motion.div>

        {/* Floating sparkles around the star */}
        {showStars && (
          <>
            {['✨', '🌟', '💫'].map((emoji, index) => (
              <motion.div
                key={index}
                className={`absolute text-4xl ${
                  index === 0 ? '-top-4 -left-8' :
                  index === 1 ? '-top-4 -right-8' :
                  '-bottom-4 left-1/2 transform -translate-x-1/2'
                }`}
                variants={sparkleVariants}
                animate="animate"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                {emoji}
              </motion.div>
            ))}
          </>
        )}

        {/* Success text */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Success!
          </h1>
          <p className="text-xl text-monokai-text mb-6">
            {config.successMessage}
          </p>
          <div className="text-monokai-text-dim">
            Redirecting to your destination...
          </div>
        </motion.div>

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 border-4 border-monokai-green rounded-xl"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(166, 226, 46, 0.4)",
              "0 0 0 20px rgba(166, 226, 46, 0)",
              "0 0 0 0 rgba(166, 226, 46, 0.4)"
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  )
}