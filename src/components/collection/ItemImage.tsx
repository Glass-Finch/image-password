'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Item } from '@/types/game'
import { ANIMATION_DURATIONS } from '@/config/game-constants'
import ItemZoomModal from '@/components/ui/ItemZoomModal'

interface ItemImageProps {
  item: Item
  onClick?: () => void
  isSelected?: boolean
  isCorrect?: boolean | null
  isClickable?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const sizeClasses = {
  small: 'w-20 h-28 sm:w-24 sm:h-32',
  medium: 'w-28 h-40 sm:w-32 sm:h-44',
  large: 'w-40 h-56 sm:w-48 sm:h-64',
}

export default function ItemImage({
  item,
  onClick,
  isSelected = false,
  isCorrect = null,
  isClickable = false,
  size = 'medium',
  className = '',
}: ItemImageProps) {
  const [showZoomModal, setShowZoomModal] = useState(false)

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick()
    }
  }

  const handleTapToZoom = () => {
    setShowZoomModal(true)
  }

  const getSelectionClass = () => {
    if (!isSelected) return ''
    if (isCorrect === null) return 'ring-2 ring-monokai-blue' // Selection feedback
    return isCorrect ? 'card-selected-correct' : 'card-selected-wrong'
  }

  return (
    <>
      <motion.div
        className={`
          card-zoom-hover rounded-xl overflow-hidden border-2 border-monokai-bg-light
          ${sizeClasses[size]}
          ${isClickable ? 'cursor-pointer hover:border-monokai-purple transition-all duration-200 hover:shadow-lg hover:shadow-monokai-purple/20' : ''}
          ${getSelectionClass()}
          ${className}
        `}
        onClick={handleClick}
        onDoubleClick={handleTapToZoom}
        whileHover={{ scale: 1.75 }}
        whileTap={isClickable ? { scale: 0.95 } : undefined}
        transition={{ duration: ANIMATION_DURATIONS.ITEM_HOVER / 1000 }}
      >
      <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-cover"
        sizes={`(max-width: 640px) ${size === 'small' ? '160px' : size === 'medium' ? '224px' : '320px'}, ${size === 'small' ? '192px' : size === 'medium' ? '256px' : '384px'}`}
        priority={true}
        quality={95}
        unoptimized={false}
      />
      
      {/* Magical glow overlay for interactive cards */}
      {isClickable && (
        <div className="absolute inset-0 magical-glow opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Card name overlay on hover */}
      {isClickable && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-1 text-center transform translate-y-full"
          whileHover={{ translateY: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-outline">{item.name}</div>
        </motion.div>
      )}
      
      {/* Selection feedback */}
      {isSelected && isCorrect !== null && (
        <motion.div
          className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${
            isCorrect ? 'text-monokai-green' : 'text-monokai-red'
          }`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: ANIMATION_DURATIONS.ITEM_SELECTION / 1000 }}
        >
          {isCorrect ? '✓' : '✗'}
        </motion.div>
      )}
    </motion.div>

    <ItemZoomModal
      item={item}
      isOpen={showZoomModal}
      onClose={() => setShowZoomModal(false)}
    />
  </>
  )
}