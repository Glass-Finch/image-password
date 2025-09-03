'use client'

import { motion } from 'framer-motion'
import { Item } from '@/types/game'
import ItemImage from './ItemImage'
import { GAME_CONFIG } from '@/config/game-constants'

interface ReferenceCollectionProps {
  items: Item[]
  className?: string
}

export default function ReferenceCollection({ items, className = '' }: ReferenceCollectionProps) {
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
    <div className={`space-y-3 sm:space-y-4 bg-monokai-bg-dark/50 rounded-xl p-4 sm:p-6 border border-monokai-bg-light ${className}`}>
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-2">
          🎴 Reference Deck
        </h2>
        <p className="text-xs sm:text-sm text-monokai-text-dim">
          Choose cards that complement this deck
        </p>
      </div>
      
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4 justify-center max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.div key={item.id} variants={itemVariants}>
            <ItemImage 
              item={item} 
              size="large"
              className="shadow-lg"
              priority={true}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {items.length !== GAME_CONFIG.REFERENCE_COLLECTION_SIZE && (
        <div className="text-center text-monokai-red text-sm">
          Warning: Expected {GAME_CONFIG.REFERENCE_COLLECTION_SIZE} reference items, found {items.length}
        </div>
      )}
    </div>
  )
}