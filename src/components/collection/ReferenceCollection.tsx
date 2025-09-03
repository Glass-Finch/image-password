'use client'

import { motion } from 'framer-motion'
import { Card } from '@/types/game'
import ItemImage from './ItemImage'
import { GAME_CONFIG } from '@/config/game-constants'

interface ReferenceDeckProps {
  cards: Card[]
  className?: string
}

export default function ReferenceDeck({ cards, className = '' }: ReferenceDeckProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className={`space-y-4 bg-monokai-bg-dark/50 rounded-xl p-6 border border-monokai-bg-light ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          🎴 Reference Deck
        </h2>
        <p className="text-sm text-monokai-text-dim">
          Choose cards that complement this deck
        </p>
      </div>
      
      <motion.div
        className="grid grid-cols-3 gap-4 justify-center max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card, index) => (
          <motion.div key={card.id} variants={itemVariants}>
            <ItemImage 
              card={card} 
              size="large"
              className="shadow-lg"
            />
          </motion.div>
        ))}
      </motion.div>
      
      {cards.length !== GAME_CONFIG.REFERENCE_DECK_SIZE && (
        <div className="text-center text-monokai-red text-sm">
          Warning: Expected {GAME_CONFIG.REFERENCE_DECK_SIZE} reference cards, found {cards.length}
        </div>
      )}
    </div>
  )
}