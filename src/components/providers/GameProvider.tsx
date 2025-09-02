'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Card, DeckConfig } from '@/types/game'
import { DECK_CONFIGS, DEFAULT_DECK } from '@/config/deck-configs'
import { useGameState } from '@/hooks/useGameState'
import { useAnalytics } from '@/hooks/useAnalytics'
import { preloadImagesWithProgress } from '@/utils/imagePreloader'

interface GameContextType {
  cards: Card[]
  config: DeckConfig
  gameState: ReturnType<typeof useGameState>['gameState']
  selectCard: ReturnType<typeof useGameState>['selectCard']
  handleTimeout: ReturnType<typeof useGameState>['handleTimeout']
  restartGame: ReturnType<typeof useGameState>['restartGame']
  currentRoundData: ReturnType<typeof useGameState>['currentRoundData']
  isLoading: boolean
  error: string | null
  loadingProgress: number
  isImagesLoaded: boolean
  analytics: ReturnType<typeof useAnalytics>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<Card[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isImagesLoaded, setIsImagesLoaded] = useState(false)
  
  const config = DECK_CONFIGS[DEFAULT_DECK]
  const gameState = useGameState(cards, config.id)
  const analytics = useAnalytics()

  // Load cards data
  useEffect(() => {
    async function loadCards() {
      try {
        const response = await fetch(`/cards.json?t=${Date.now()}`)
        if (!response.ok) {
          throw new Error('Failed to load cards data')
        }
        const cardsData: Card[] = await response.json()
        setCards(cardsData)
        
        // Preload ALL card images with progress tracking
        const allImages = cardsData.map(card => card.image)
        await preloadImagesWithProgress(allImages, (loaded, total) => {
          setLoadingProgress(Math.round((loaded / total) * 100))
        })
        
        setIsImagesLoaded(true)
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error loading cards'
        setError(errorMessage)
        console.error('Failed to load cards:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCards()
  }, [])

  // Track initial session
  useEffect(() => {
    if (!isLoading && !error && gameState.gameState.sessionId && isImagesLoaded) {
      analytics.trackSession(gameState.gameState.sessionId, config.id)
    }
  }, [isLoading, error, gameState.gameState.sessionId, config.id, analytics, isImagesLoaded])

  const contextValue: GameContextType = {
    cards,
    config,
    gameState: gameState.gameState,
    selectCard: gameState.selectCard,
    handleTimeout: gameState.handleTimeout,
    restartGame: gameState.restartGame,
    currentRoundData: gameState.currentRoundData,
    isLoading,
    error,
    loadingProgress,
    isImagesLoaded,
    analytics,
  }

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}