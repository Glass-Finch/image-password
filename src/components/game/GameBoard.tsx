'use client'

import { motion } from 'framer-motion'
import { useGame } from '@/components/providers/GameProvider'
import { getReferenceCards } from '@/utils/gameLogic'
import ReferenceDeck from '@/components/deck/ReferenceDeck'
import CardChoices from './CardChoices'
import GameTimer from './GameTimer'
import SuccessOverlay from '@/components/ui/SuccessOverlay'
import LockedScreen from '@/components/ui/LockedScreen'
import LoadingState from '@/components/ui/LoadingState'

export default function GameBoard() {
  const { 
    cards, 
    config, 
    gameState, 
    isLoading, 
    error 
  } = useGame()

  const handleSuccessComplete = async () => {
    // For development/demo, redirect directly to the configured URL
    const redirectUrl = process.env.NEXT_PUBLIC_SUCCESS_URL || 'https://example.com/success'
    
    try {
      // In production, you'd verify with API first
      const response = await fetch('/api/success-redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: gameState.sessionId,
          deckId: gameState.deckId,
        }),
      })

      if (response.ok) {
        window.location.href = response.url
      } else {
        // Fallback to direct redirect
        window.location.href = redirectUrl
      }
    } catch (error) {
      console.error('Error during redirect, using fallback:', error)
      window.location.href = redirectUrl
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-monokai-red mb-4">
            Loading Error
          </h2>
          <p className="text-monokai-text mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-monokai-blue text-monokai-bg px-6 py-2 rounded-lg hover:bg-monokai-green transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  const referenceCards = getReferenceCards(cards, config)

  return (
    <div className="min-h-screen relative">
      {/* Success overlay */}
      {gameState.gameStatus === 'success' && (
        <SuccessOverlay onComplete={handleSuccessComplete} />
      )}

      {/* Locked/Failed screen */}
      {gameState.gameStatus === 'locked' && (
        <LockedScreen reason="timeout" />
      )}

      {gameState.gameStatus === 'failed' && (
        <LockedScreen reason="failed" />
      )}

      {/* Kawaii Title */}
      {gameState.gameStatus === 'playing' && (
        <div className="text-center py-6">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            ✨ Yu-Gi-Oh! Trials of the Fairies ✨
          </h1>
          <p className="text-monokai-text-dim text-lg">
            🧚‍♀️ Prove your fairy deck mastery! 🧚‍♀️
          </p>
        </div>
      )}

      {/* Main game layout */}
      {gameState.gameStatus === 'playing' && (
        <div className="container mx-auto px-4 py-2 max-w-7xl">
          {/* Mobile layout - stacked */}
          <div className="block md:hidden">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GameTimer className="bg-monokai-bg/90 backdrop-blur-sm rounded-lg p-3" />
              <CardChoices />
              <div className="border-t border-monokai-bg-light pt-4">
                <ReferenceDeck cards={referenceCards} />
              </div>
            </motion.div>
          </div>

          {/* Desktop layout - side by side */}
          <div className="hidden md:block">
            <motion.div
              className="grid grid-cols-2 gap-8 min-h-screen py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Left side - Reference deck */}
              <div className="flex flex-col justify-center">
                <ReferenceDeck cards={referenceCards} />
              </div>
              
              {/* Right side - Timer and choices */}
              <div className="flex flex-col justify-start pt-8 space-y-6">
                <GameTimer />
                <CardChoices />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}