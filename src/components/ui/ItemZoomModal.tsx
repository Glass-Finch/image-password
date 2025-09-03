'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card } from '@/types/game'

interface CardZoomModalProps {
  card: Card
  isOpen: boolean
  onClose: () => void
}

export default function CardZoomModal({ card, isOpen, onClose }: CardZoomModalProps) {
  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-sm w-full"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden border-2 border-monokai-purple shadow-2xl">
          <Image
            src={card.image}
            alt={card.name}
            fill
            className="object-cover"
            quality={100}
            priority
          />
        </div>
        
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold text-monokai-text mb-2">
            {card.name}
          </h3>
          <div className="flex justify-center items-center space-x-2 text-sm text-monokai-text-dim">
            <span className="px-2 py-1 bg-monokai-bg-dark rounded-full">
              {card.card_type}
            </span>
            {card.tags?.filter(tag => tag !== 'correct' && tag !== 'distractor' && tag !== 'reference').map(tag => (
              <span key={tag} className="px-2 py-1 bg-monokai-bg-light rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-monokai-red rounded-full flex items-center justify-center text-white font-bold hover:bg-monokai-red/80 transition-colors"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  )
}