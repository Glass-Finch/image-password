'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Item, CollectionConfig } from '@/types/game'
import { COLLECTION_CONFIGS, DEFAULT_COLLECTION } from '@/config/collection-configs'
import { useGameState } from '@/hooks/useGameState'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useText } from '@/hooks/useText'
import { preloadImagesWithProgress } from '@/utils/imagePreloader'

interface GameContextType {
  items: Item[]
  config: CollectionConfig
  gameState: ReturnType<typeof useGameState>['gameState']
  selectItem: ReturnType<typeof useGameState>['selectItem']
  handleTimeout: ReturnType<typeof useGameState>['handleTimeout']
  restartGame: ReturnType<typeof useGameState>['restartGame']
  startChallenge: ReturnType<typeof useGameState>['startChallenge']
  currentRoundData: ReturnType<typeof useGameState>['currentRoundData']
  isLoading: boolean
  error: string | null
  loadingProgress: number
  isImagesLoaded: boolean
  analytics: ReturnType<typeof useAnalytics>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isImagesLoaded, setIsImagesLoaded] = useState(false)
  
  const config = COLLECTION_CONFIGS[DEFAULT_COLLECTION]
  const text = useText()
  const gameState = useGameState(items, config.id, text?.rounds.types)
  const analytics = useAnalytics()

  // Load items data
  useEffect(() => {
    async function loadItems() {
      try {
        const response = await fetch(`/items.json?t=${Date.now()}`)
        if (!response.ok) {
          throw new Error('Failed to load items data')
        }
        const itemsData: Item[] = await response.json()
        setItems(itemsData)
        
        // Preload ALL item images with progress tracking
        const allImages = itemsData.map(item => item.image)
        await preloadImagesWithProgress(allImages, (loaded, total) => {
          setLoadingProgress(Math.round((loaded / total) * 100))
        })
        
        setIsImagesLoaded(true)
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error loading items'
        setError(errorMessage)
        console.error('Failed to load items:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [])

  // Track initial session
  useEffect(() => {
    if (!isLoading && !error && gameState.gameState.sessionId && isImagesLoaded) {
      analytics.trackSession(gameState.gameState.sessionId, config.id)
    }
  }, [isLoading, error, gameState.gameState.sessionId, config.id, analytics, isImagesLoaded])

  const contextValue: GameContextType = {
    items,
    config,
    gameState: gameState.gameState,
    selectItem: gameState.selectItem,
    handleTimeout: gameState.handleTimeout,
    restartGame: gameState.restartGame,
    startChallenge: gameState.startChallenge,
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