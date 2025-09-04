'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/components/providers/GameProvider'
import { useText } from '@/hooks/useText'
import { getReferenceItems } from '@/utils/gameLogic'
import ReferenceCollection from '@/components/collection/ReferenceCollection'
import ItemChoices from './ItemChoices'
import StudyPhase from './StudyPhase'
import GameTimer from './GameTimer'
import SuccessOverlay from '@/components/ui/SuccessOverlay'
import LockedScreen from '@/components/ui/LockedScreen'
import LoadingState from '@/components/ui/LoadingState'
import { DevErrorTrigger } from '@/components/DevErrorTrigger'

export default function GameBoard() {
  const { 
    items, 
    config, 
    gameState, 
    isLoading, 
    error,
    loadingProgress,
    isImagesLoaded,
    analytics,
    startChallenge
  } = useGame()
  const text = useText()

  // Track completion when game ends
  useEffect(() => {
    if (gameState.gameStatus === 'success' && gameState.completedAt) {
      const duration = gameState.completedAt - gameState.roundStartTime
      analytics.trackCompletion(gameState.sessionId, true, duration)
    } else if (gameState.gameStatus === 'failed') {
      analytics.trackCompletion(gameState.sessionId, false, Date.now() - gameState.roundStartTime)
    }
  }, [gameState.gameStatus, gameState.completedAt, gameState.sessionId, gameState.roundStartTime, analytics])

  const handleSuccessComplete = async () => {
    // Redirect to our success page with session ID for verification
    window.location.href = `/success?session=${gameState.sessionId}`
  }

  if (isLoading || !isImagesLoaded || !text) {
    return <LoadingState progress={loadingProgress} message={text?.ui.loadingMessage} />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="game-panel text-center max-w-md mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-monokai-red mb-4">
            {text.messages.loadingError}
          </h2>
          <p className="text-monokai-text-secondary mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary"
          >
            {text.buttons.reloadPage}
          </button>
        </div>
      </div>
    )
  }

  const referenceItems = getReferenceItems(items, config)

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
      {(gameState.gameStatus === 'studying' || gameState.gameStatus === 'playing') && (
        <div className="text-center py-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2">
            {text.game.title}
          </h1>
          <p className="text-monokai-text-dim text-base sm:text-lg">
            {text.game.subtitle}
          </p>
        </div>
      )}

      {/* Main game layout */}
      {(gameState.gameStatus === 'studying' || gameState.gameStatus === 'playing') && (
        <div className="container mx-auto px-3 sm:px-4 py-2 max-w-7xl">
          {/* Mobile layout - stacked */}
          <div className="block md:hidden">
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {gameState.gameStatus === 'playing' && (
                <GameTimer className="bg-monokai-bg/90 backdrop-blur-sm rounded-lg p-3" />
              )}
              {gameState.gameStatus === 'playing' ? (
                <ItemChoices />
              ) : (
                <StudyPhase 
                  onStartChallenge={startChallenge}
                  loadingProgress={loadingProgress}
                  isImagesLoaded={isImagesLoaded}
                />
              )}
              <div className="border-t border-monokai-bg-light pt-4">
                <ReferenceCollection items={referenceItems} />
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
                <ReferenceCollection items={referenceItems} />
              </div>
              
              {/* Right side - Timer and choices */}
              <div className="flex flex-col justify-start pt-8 space-y-6">
                {gameState.gameStatus === 'playing' && <GameTimer />}
                {gameState.gameStatus === 'playing' ? (
                  <ItemChoices />
                ) : (
                  <StudyPhase 
                    onStartChallenge={startChallenge}
                    loadingProgress={loadingProgress}
                    isImagesLoaded={isImagesLoaded}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
      
      {/* Development error trigger */}
      <DevErrorTrigger />
    </div>
  )
}