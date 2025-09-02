import { useState, useEffect, useCallback, useRef } from 'react'
import { GAME_CONFIG } from '@/config/game-constants'

interface UseTimerOptions {
  onTimeout: () => void
  onTick?: (timeRemaining: number) => void
  autoStart?: boolean
}

export function useTimer({ onTimeout, onTick, autoStart = true }: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(GAME_CONFIG.ROUND_DURATION_MS / 1000)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback((newTime?: number) => {
    const time = newTime ?? (GAME_CONFIG.ROUND_DURATION_MS / 1000)
    setTimeRemaining(time)
    setIsRunning(autoStart)
    onTick?.(time)
  }, [autoStart, onTick])

  const stop = useCallback(() => {
    setIsRunning(false)
    setTimeRemaining(0)
    onTick?.(0)
  }, [onTick])

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = Math.max(0, prev - 1)
          onTick?.(newTime)
          
          if (newTime === 0) {
            setIsRunning(false)
            onTimeout()
          }
          
          return newTime
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeRemaining, onTimeout, onTick])

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  const getTimerStyle = useCallback(() => {
    if (timeRemaining > 30) return 'text-monokai-purple'
    if (timeRemaining > 10) return 'text-monokai-yellow'
    return 'text-monokai-red timer-warning'
  }, [timeRemaining])

  const getTimerClass = useCallback(() => {
    if (timeRemaining <= 5) return 'timer-critical'
    if (timeRemaining <= 10) return 'timer-warning'
    return ''
  }, [timeRemaining])

  return {
    timeRemaining,
    isRunning,
    start,
    pause,
    reset,
    stop,
    formatTime: formatTime(timeRemaining),
    timerStyle: getTimerStyle(),
    timerClass: getTimerClass(),
  }
}