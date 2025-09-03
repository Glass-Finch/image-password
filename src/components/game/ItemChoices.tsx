'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/types/game'
import ItemImage from '@/components/collection/ItemImage'
import { useGame } from '@/components/providers/GameProvider'
import { useText } from '@/hooks/useText'
import { GAME_CONFIG, ANIMATION_DURATIONS } from '@/config/game-constants'

interface CardChoicesProps {
  className?: string
}

export default function CardChoices({ className = '' }: CardChoicesProps) {
  const { gameState, selectCard, currentRoundData, analytics } = useGame()
  const text = useText()
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [feedbackCards, setFeedbackCards] = useState<Record<string, boolean>>({})

  const handleCardSelect = async (card: Card) => {
    if (gameState.gameStatus !== 'playing' || gameState.isSubmitting || selectedCardId) {
      return
    }

    setSelectedCardId(card.id)
    const isCorrect = card.id === gameState.correctCardId
    
    // Track round attempt
    const roundType = text?.rounds.types?.[gameState.currentRound - 1] || 'unknown'
    
    analytics.trackRound(
      gameState.sessionId,
      gameState.deckId,
      gameState.currentRound,
      roundType,
      gameState.currentRoundChoices.map(c => c.id),
      gameState.correctCardId,
      card.id,
      Date.now() - gameState.roundStartTime,
      false
    )
    
    // Show immediate visual feedback
    setFeedbackCards(prev => ({
      ...prev,
      [card.id]: isCorrect
    }))

    // Wait for animation before proceeding
    setTimeout(() => {
      selectCard(card.id)
      setSelectedCardId(null)
      setFeedbackCards({})
    }, ANIMATION_DURATIONS.CARD_SELECTION)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  if (!currentRoundData || !gameState.currentRoundChoices.length) {
    return (
      <div className={`text-center text-monokai-text-dim ${className}`}>
        {text?.ui.loadingRoundChoices || 'Loading round choices...'}
      </div>
    )
  }

  return (
    <div className={`space-y-6 bg-monokai-bg-dark/30 rounded-xl p-6 border border-monokai-blue/30 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          {text?.ui.chooseItem || '⚡ Choose the Card'}
        </h2>
        <p className="text-sm text-monokai-text-dim">
          {text && text.rounds.types && text.rounds.instructions[text.rounds.types[gameState.currentRound - 1]]}
        </p>
      </div>
      
      <motion.div
        className="grid grid-cols-3 gap-4 justify-center items-center max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={gameState.currentRound}
      >
        {gameState.currentRoundChoices.map((card) => (
          <motion.div key={card.id} variants={itemVariants}>
            <ItemImage
              card={card}
              onClick={() => handleCardSelect(card)}
              isSelected={selectedCardId === card.id}
              isCorrect={feedbackCards[card.id]}
              isClickable={gameState.gameStatus === 'playing' && !gameState.isSubmitting && !selectedCardId}
              size="large"
              className="mx-auto shadow-xl"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Round progress indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {Array.from({ length: GAME_CONFIG.ROUNDS_COUNT }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index + 1 < gameState.currentRound
                ? 'bg-monokai-purple'
                : index + 1 === gameState.currentRound
                ? 'bg-monokai-blue animate-pulse'
                : 'bg-monokai-bg-light'
            }`}
          />
        ))}
      </div>
    </div>
  )
}