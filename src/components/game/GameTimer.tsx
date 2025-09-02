'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/components/providers/GameProvider'

interface GameTimerProps {
  className?: string
}

export default function GameTimer({ className = '' }: GameTimerProps) {
  const { gameState, handleTimeout } = useGame()
  const [timeRemaining, setTimeRemaining] = useState(60)

  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1
        if (newTime <= 0) {
          handleTimeout()
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState.gameStatus, handleTimeout])

  // Reset timer when round changes
  useEffect(() => {
    setTimeRemaining(60)
  }, [gameState.currentRound])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getTimerStyle = () => {
    if (timeRemaining > 30) return 'text-monokai-purple'
    if (timeRemaining > 10) return 'text-monokai-yellow'
    return 'text-monokai-red'
  }

  const getProgressPercentage = () => {
    return (timeRemaining / 60) * 100
  }

  const getProgressColor = () => {
    const percentage = getProgressPercentage()
    if (percentage > 50) return '#ae81ff' // purple
    if (percentage > 16.67) return '#e6db74' // yellow
    return '#f92672' // red
  }

  return (
    <div className={`space-y-3 bg-monokai-bg-dark/40 rounded-xl p-4 border border-monokai-purple/30 ${className}`}>
      {/* Timer display */}
      <div className="text-center">
        <motion.div
          className={`text-6xl font-bold ${getTimerStyle()}`}
          animate={timeRemaining <= 10 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {timeRemaining}
        </motion.div>
        <div className="text-lg text-monokai-text-dim font-semibold">
          Round {gameState.currentRound} of 3
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-3 bg-monokai-bg-dark rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: getProgressColor() }}
          initial={{ width: '100%' }}
          animate={{ width: `${getProgressPercentage()}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        
        {/* Pulse effect when time is low */}
        {timeRemaining <= 10 && (
          <motion.div
            className="absolute inset-0 bg-monokai-red rounded-full"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      {/* Warning messages */}
      {timeRemaining <= 30 && timeRemaining > 10 && (
        <motion.div
          className="text-center text-monokai-yellow text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Time is running out!
        </motion.div>
      )}
      
      {timeRemaining <= 10 && timeRemaining > 0 && (
        <motion.div
          className="text-center text-monokai-red text-sm font-bold"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          HURRY UP! {timeRemaining} seconds left!
        </motion.div>
      )}
    </div>
  )
}