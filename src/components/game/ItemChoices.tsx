'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Item } from '@/types/game'
import ItemImage from '@/components/collection/ItemImage'
import { useGame } from '@/components/providers/GameProvider'
import { useText } from '@/hooks/useText'
import { GAME_CONFIG, ANIMATION_DURATIONS } from '@/config/game-constants'

interface ItemChoicesProps {
  className?: string
}

export default function ItemChoices({ className = '' }: ItemChoicesProps) {
  const { gameState, selectItem, currentRoundData, analytics } = useGame()
  const text = useText()
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [feedbackItems, setFeedbackItems] = useState<Record<string, boolean>>({})

  const handleItemSelect = async (item: Item) => {
    if (gameState.gameStatus !== 'playing' || gameState.isSubmitting || selectedItemId) {
      return
    }

    setSelectedItemId(item.id)
    const isCorrect = item.id === gameState.correctItemId
    
    // Track round attempt
    const roundType = text?.rounds.types?.[gameState.currentRound - 1] || 'unknown'
    
    analytics.trackRound(
      gameState.sessionId,
      gameState.collectionId,
      gameState.currentRound,
      roundType,
      gameState.currentRoundChoices.map(c => c.id),
      gameState.correctItemId,
      item.id,
      Date.now() - gameState.roundStartTime,
      false
    )
    
    // Show immediate visual feedback
    setFeedbackItems(prev => ({
      ...prev,
      [item.id]: isCorrect
    }))

    // Wait for animation before proceeding
    setTimeout(() => {
      selectItem(item.id)
      setSelectedItemId(null)
      setFeedbackItems({})
    }, ANIMATION_DURATIONS.ITEM_SELECTION)
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
    <div className={`space-y-4 sm:space-y-6 bg-monokai-bg-dark/30 rounded-xl p-6 sm:p-8 lg:p-10 border border-monokai-blue/30 ${className}`}>
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-2">
          {text?.ui.chooseItem || '⚡ Choose the Card'}
        </h2>
        <p className="text-xs sm:text-sm text-monokai-text-dim">
          {text && text.rounds.types && text.rounds.instructions[text.rounds.types[gameState.currentRound - 1]]}
        </p>
      </div>
      
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center items-center max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={gameState.currentRound}
      >
        {gameState.currentRoundChoices.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <ItemImage
              item={item}
              onClick={() => handleItemSelect(item)}
              isSelected={selectedItemId === item.id}
              isCorrect={feedbackItems[item.id]}
              isClickable={gameState.gameStatus === 'playing' && !gameState.isSubmitting && !selectedItemId}
              size="large"
              className="shadow-xl"
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