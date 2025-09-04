'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
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
  const trackedSessionRef = useRef<string | null>(null)
  
  const config = COLLECTION_CONFIGS[DEFAULT_COLLECTION]
  const text = useText()
  const gameState = useGameState(items, config.id, text?.rounds.types)
  const analytics = useAnalytics()

  // Load items data
  useEffect(() => {
    async function loadItems() {
      try {
        // Validate we have a valid base URL
        if (typeof window === 'undefined') {
          throw new Error('Cannot load items - window not available')
        }

        const response = await fetch(`/items.json?t=${Date.now()}`)
        if (!response.ok) {
          throw new Error(`Failed to load items data: ${response.status} ${response.statusText}`)
        }
        
        const itemsData: Item[] = await response.json()
        
        // Validate items data structure
        if (!Array.isArray(itemsData)) {
          throw new Error('Invalid items data format - expected array')
        }

        if (itemsData.length === 0) {
          throw new Error('No items found in data file')
        }

        // Validate required item fields
        const invalidItems = itemsData.filter(item => 
          !item.id || !item.image || !item.item_type
        )
        if (invalidItems.length > 0) {
          throw new Error(`Found ${invalidItems.length} items with missing required fields (id, image, item_type)`)
        }

        setItems(itemsData)
        
        // Preload ALL item images with progress tracking and error handling
        try {
          const allImages = itemsData.map(item => item.image).filter(Boolean)
          if (allImages.length === 0) {
            throw new Error('No valid image paths found in items')
          }

          await preloadImagesWithProgress(allImages, (loaded, total) => {
            setLoadingProgress(Math.round((loaded / total) * 100))
          })
          
          setIsImagesLoaded(true)
          setError(null)
        } catch (imageError) {
          console.warn('Some images failed to load, but continuing:', imageError)
          // Don't fail completely if some images don't load - set as loaded anyway
          setIsImagesLoaded(true)
          setError(null)
        }
        
      } catch (err) {
        let errorMessage = 'Unknown error loading items'
        
        if (err instanceof Error) {
          errorMessage = err.message
          
          // Add helpful context for common errors
          if (err.message.includes('Failed to fetch')) {
            errorMessage = 'Network error: Could not load game data. Please check your internet connection.'
          } else if (err.message.includes('JSON')) {
            errorMessage = 'Data format error: Game configuration file is corrupted.'
          }
        }
        
        setError(errorMessage)
        console.error('Failed to load items:', err)
        
        // Don't throw here - let the component handle the error state gracefully
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [])

  // Track initial session (only once per session)
  useEffect(() => {
    const currentSessionId = gameState.gameState.sessionId
    
    if (!isLoading && !error && currentSessionId && isImagesLoaded && 
        trackedSessionRef.current !== currentSessionId) {
      
      // Track session with error handling (don't let analytics break the game)
      try {
        analytics.trackSession(currentSessionId, config.id)
        trackedSessionRef.current = currentSessionId
      } catch (analyticsError) {
        // Analytics errors should not break the game experience
        console.warn('Failed to track session, continuing without analytics:', analyticsError)
        // Still mark as tracked to prevent retries
        trackedSessionRef.current = currentSessionId
      }
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