import { useState, useEffect, useCallback } from 'react'
import { GameState, Item, SelectedItem, GameRound } from '@/types/game'
import { generateSessionId } from '@/utils/itemUtils'
import { generateGameRounds } from '@/utils/gameLogic'
import { GAME_CONFIG } from '@/config/game-constants'

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

    const isCorrect = itemId === gameState.correctItemId
    const selectionTime = Date.now() - gameState.roundStartTime

    const selectedItem: SelectedItem = {
      roundNumber: gameState.currentRound,
      itemId,
      isCorrect,
      selectionTime,
      timestamp: Date.now(),
    }

    setGameState(prev => {
      const newSelectedItems = [...prev.selectedItems, selectedItem]
      
      if (!isCorrect) {
        // Wrong answer - show punishment screen
        return {
          ...prev,
          selectedItems: newSelectedItems,
          gameStatus: 'failed',
        }
      }

      if (prev.currentRound === GAME_CONFIG.ROUNDS_COUNT) {
        // Game completed successfully
        return {
          ...prev,
          selectedItems: newSelectedItems,
          gameStatus: 'success',
          completedAt: Date.now(),
        }
      }

      // Move to next round
      const nextRound = prev.currentRound + 1
      const nextRoundData = gameRounds[nextRound - 1]
      
      return {
        ...prev,
        selectedItems: newSelectedItems,
        currentRound: nextRound,
        currentRoundChoices: nextRoundData ? nextRoundData.choices : [],
        correctItemId: nextRoundData ? nextRoundData.correctId : '',
        timeRemaining: GAME_CONFIG.ROUND_DURATION_MS / 1000,
        roundStartTime: Date.now(),
      }
    })
  }, [gameState.isSubmitting, gameState.gameStatus, gameState.correctItemId, gameState.roundStartTime, gameState.currentRound, gameRounds])

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
    setGameState(prev => ({ 
      ...prev, 
      gameStatus: 'playing',
      roundStartTime: Date.now()
    }))
  }, [])

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