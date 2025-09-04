'use client'

import { motion } from 'framer-motion'
import { useText } from '@/hooks/useText'

interface StudyPhaseProps {
  onStartChallenge: () => void
  loadingProgress: number
  isImagesLoaded: boolean
  className?: string
}

export default function StudyPhase({ 
  onStartChallenge, 
  loadingProgress, 
  isImagesLoaded, 
  className = '' 
}: StudyPhaseProps) {
  const text = useText()

  return (
    <div className={`space-y-6 game-panel ${className}`}>
      <div className="text-center">
        <motion.h2 
          className="text-2xl font-bold gradient-text mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {text?.studyPhase.title || 'Ready for the Challenge?'}
        </motion.h2>
        
        <motion.p 
          className="text-lg text-monokai-text-secondary mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text?.studyPhase.instructions || 'Study the collection and begin when ready.'}
        </motion.p>
      </div>

      {/* Study Tips */}
      <motion.div
        className="bg-monokai-bg-dark/50 rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-md font-bold text-monokai-yellow mb-3">
          {text?.studyPhase.studyTip || '💡 Tip: Study carefully!'}
        </h3>
        <ul className="space-y-2 text-sm text-monokai-text">
          {text?.studyPhase.tips?.map((tip, index) => (
            <motion.li 
              key={index}
              className="flex items-start space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <span className="text-monokai-purple">•</span>
              <span>{tip}</span>
            </motion.li>
          )) || [
            <li key="default" className="flex items-start space-x-2">
              <span className="text-monokai-purple">•</span>
              <span>Study the reference collection carefully</span>
            </li>
          ]}
        </ul>
      </motion.div>

      {/* Loading Progress */}
      {!isImagesLoaded && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between text-sm text-monokai-text-secondary">
            <span>Loading images...</span>
            <span>{loadingProgress}%</span>
          </div>
          <div className="w-full bg-monokai-bg-dark rounded-full h-2">
            <motion.div
              className="bg-monokai-purple h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Challenge Button */}
      <motion.div
        className="text-center pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          onClick={onStartChallenge}
          disabled={!isImagesLoaded}
          className={`
            px-8 py-4 text-lg font-bold
            ${isImagesLoaded 
              ? 'btn-neon' 
              : 'bg-monokai-surface text-monokai-text-secondary cursor-not-allowed rounded-lg'
            }
          `}
          whileHover={isImagesLoaded ? { scale: 1.05 } : {}}
          whileTap={isImagesLoaded ? { scale: 0.95 } : {}}
        >
          {isImagesLoaded 
            ? (text?.studyPhase.buttonText || '🚀 Begin Challenge')
            : (text?.studyPhase.loadingButton || 'Loading Images...')
          }
        </motion.button>
      </motion.div>
    </div>
  )
}