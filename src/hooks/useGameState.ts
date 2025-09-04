import { useState, useEffect, useCallback } from 'react'
import { GameState, Item, SelectedItem, GameRound } from '@/types/game'
import { generateSessionId } from '@/utils/itemUtils'
import { generateGameRounds } from '@/utils/gameLogic'
import { GAME_CONFIG } from '@/config/game-constants'
import { validateItem, validateGameState, validateRoundData } from '@/utils/gameErrors'

export function useGameState(items: Item[], collectionId: string, roundTypes?: string[]) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    sessionId: generateSessionId(),
    collectionId: collectionId,
    currentRound: 1,
    timeRemaining: GAME_CONFIG.ROUND_DURATION_MS / 1000,
    gameStatus: 'studying',
    selectedItems: [],
    currentRoundChoices: [],
    correctItemId: '',
    usedCorrectItems: [],
    usedWrongItems: [],
    roundStartTime: Date.now(),
    isSubmitting: false,
    networkError: false,
  }))

  const [gameRounds, setGameRounds] = useState<GameRound[]>([])

  // Initialize game rounds - trigger when items change or session restarts
  useEffect(() => {
    if (items.length === 0) return
    
    try {
      const rounds = generateGameRounds(items, roundTypes)
      setGameRounds(rounds)
      
      if (rounds.length > 0) {
        setGameState(prev => ({
          ...prev,
          currentRoundChoices: rounds[0].choices,
          correctItemId: rounds[0].correctId,
          networkError: false,
        }))
      }
    } catch (error) {
      console.error('Failed to initialize game:', error)
      setGameState(prev => ({ ...prev, gameStatus: 'failed', networkError: true }))
    }
  }, [items, collectionId, gameState.sessionId, roundTypes])

  const restartGame = useCallback(() => {
    const newSessionId = generateSessionId()
    setGameState({
      sessionId: newSessionId,
      collectionId: collectionId,
      currentRound: 1,
      timeRemaining: GAME_CONFIG.ROUND_DURATION_MS / 1000,
      gameStatus: 'studying',
      selectedItems: [],
      currentRoundChoices: [],
      correctItemId: '',
      usedCorrectItems: [],
      usedWrongItems: [],
      roundStartTime: Date.now(),
      isSubmitting: false,
      networkError: false,
    })
  }, [collectionId])

  const selectItem = useCallback((itemId: string) => {
    if (gameState.isSubmitting || gameState.gameStatus !== 'playing') return

    try {
      // Simple validation using helpers
      validateItem(itemId, gameState.currentRoundChoices)
      validateGameState(gameState.correctItemId, gameState.currentRoundChoices)

      const isCorrect = itemId === gameState.correctItemId
      const selectedItem: SelectedItem = {
        roundNumber: gameState.currentRound,
        itemId,
        isCorrect,
        selectionTime: Date.now() - gameState.roundStartTime,
        timestamp: Date.now(),
      }

      setGameState(prev => {
        const newSelectedItems = [...prev.selectedItems, selectedItem]
        
        if (!isCorrect) {
          return { ...prev, selectedItems: newSelectedItems, gameStatus: 'failed' }
        }

        if (prev.currentRound === GAME_CONFIG.ROUNDS_COUNT) {
          return {
            ...prev,
            selectedItems: newSelectedItems,
            gameStatus: 'success',
            completedAt: Date.now(),
          }
        }

        // Move to next round with simple validation
        const nextRound = prev.currentRound + 1
        const nextRoundData = gameRounds[nextRound - 1]
        validateRoundData(nextRoundData, nextRound)
        
        return {
          ...prev,
          selectedItems: newSelectedItems,
          currentRound: nextRound,
          currentRoundChoices: nextRoundData.choices,
          correctItemId: nextRoundData.correctId,
          timeRemaining: GAME_CONFIG.ROUND_DURATION_MS / 1000,
          roundStartTime: Date.now(),
        }
      })
    } catch (error) {
      console.error('Selection error:', error)
      setGameState(prev => ({ ...prev, gameStatus: 'failed', networkError: true }))
      
      // Re-throw for error boundary
      throw error
    }
  }, [gameState.isSubmitting, gameState.gameStatus, gameState.correctItemId, gameState.currentRoundChoices, gameState.roundStartTime, gameState.currentRound, gameRounds])

  const handleTimeout = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'locked',
    }))
  }, [])


  const updateTimeRemaining = useCallback((time: number) => {
    setGameState(prev => ({ ...prev, timeRemaining: time }))
  }, [])

  const startChallenge = useCallback(() => {
    try {
      if (!gameRounds?.length) throw new Error('No game rounds available')
      
      const firstRound = gameRounds[0]
      validateRoundData(firstRound, 1)

      setGameState(prev => ({ 
        ...prev, 
        gameStatus: 'playing',
        roundStartTime: Date.now(),
        currentRoundChoices: firstRound.choices,
        correctItemId: firstRound.correctId,
      }))
    } catch (error) {
      console.error('Challenge start error:', error)
      setGameState(prev => ({ ...prev, gameStatus: 'failed', networkError: true }))
      throw error
    }
  }, [gameRounds])

  return {
    gameState,
    selectItem,
    handleTimeout,
    restartGame,
    updateTimeRemaining,
    startChallenge,
    currentRoundData: gameRounds[gameState.currentRound - 1],
  }
}