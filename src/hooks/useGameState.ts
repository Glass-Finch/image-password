import { useState, useEffect, useCallback } from 'react'
import { GameState, Card, SelectedCard, GameRound } from '@/types/game'
import { generateSessionId, getUserAgent, getScreenResolution } from '@/utils/cardUtils'
import { generateGameRounds, isGameComplete, hasGameFailed } from '@/utils/gameLogic'
import { preloadImagesInBackground } from '@/utils/imagePreloader'
import { GAME_CONFIG } from '@/config/game-constants'

export function useGameState(cards: Card[], deckId: string) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    sessionId: generateSessionId(),
    deckId,
    currentRound: 1,
    timeRemaining: GAME_CONFIG.ROUND_DURATION_MS / 1000,
    gameStatus: 'playing',
    selectedCards: [],
    currentRoundChoices: [],
    correctCardId: '',
    usedCorrectCards: [],
    usedWrongCards: [],
    roundStartTime: Date.now(),
    isSubmitting: false,
    networkError: false,
  }))

  const [gameRounds, setGameRounds] = useState<GameRound[]>([])

  // Initialize game rounds - trigger when cards change or session restarts
  useEffect(() => {
    if (cards.length === 0) return
    
    try {
      const correctCards = cards.filter(c => c.score === 1)
      const wrongCards = cards.filter(c => c.score === -1)
      
      if (correctCards.length < 3 || wrongCards.length < 9) {
        console.error('Insufficient cards for game')
        setGameState(prev => ({ ...prev, gameStatus: 'failed', networkError: true }))
        return
      }
      
      const rounds: GameRound[] = []
      const usedCorrect: string[] = []
      const usedWrong: string[] = []
      
      for (let i = 0; i < GAME_CONFIG.ROUNDS_COUNT; i++) {
        const availableCorrect = correctCards.filter(c => !usedCorrect.includes(c.id))
        const availableWrong = wrongCards.filter(c => !usedWrong.includes(c.id))
        
        const correctCard = availableCorrect[Math.floor(Math.random() * availableCorrect.length)]
        const selectedWrongCards: Card[] = []
        const tempUsedWrong = [...usedWrong]
        
        for (let j = 0; j < 5; j++) {
          const remainingWrong = availableWrong.filter(c => !tempUsedWrong.includes(c.id))
          if (remainingWrong.length === 0) {
            break
          }
          const wrongCard = remainingWrong[Math.floor(Math.random() * remainingWrong.length)]
          selectedWrongCards.push(wrongCard)
          tempUsedWrong.push(wrongCard.id)
        }
        
        usedWrong.push(...selectedWrongCards.map(c => c.id))
        
        // Shuffle choices
        const choices = [correctCard, ...selectedWrongCards].sort(() => Math.random() - 0.5)
        
        rounds.push({
          choices,
          correctId: correctCard.id,
          roundNumber: i + 1
        })
        
        usedCorrect.push(correctCard.id)
      }
      
      setGameRounds(rounds)
      
      if (rounds.length > 0) {
        // Preload all images for smooth transitions
        const allRoundImages = rounds.flatMap(round => round.choices.map(card => card.image))
        preloadImagesInBackground(allRoundImages)
        
        setGameState(prev => ({
          ...prev,
          currentRoundChoices: rounds[0].choices,
          correctCardId: rounds[0].correctId,
        }))
      }
    } catch (error) {
      console.error('Failed to initialize game:', error)
      setGameState(prev => ({ ...prev, gameStatus: 'failed', networkError: true }))
    }
  }, [cards, deckId, gameState.sessionId])

  const restartGame = useCallback(() => {
    const newSessionId = generateSessionId()
    setGameState({
      sessionId: newSessionId,
      deckId,
      currentRound: 1,
      timeRemaining: GAME_CONFIG.ROUND_DURATION_MS / 1000,
      gameStatus: 'playing',
      selectedCards: [],
      currentRoundChoices: [],
      correctCardId: '',
      usedCorrectCards: [],
      usedWrongCards: [],
      roundStartTime: Date.now(),
      isSubmitting: false,
      networkError: false,
    })
  }, [deckId])

  const selectCard = useCallback((cardId: string) => {
    if (gameState.isSubmitting || gameState.gameStatus !== 'playing') return

    const isCorrect = cardId === gameState.correctCardId
    const selectionTime = Date.now() - gameState.roundStartTime

    const selectedCard: SelectedCard = {
      roundNumber: gameState.currentRound,
      cardId,
      isCorrect,
      selectionTime,
      timestamp: Date.now(),
    }

    setGameState(prev => {
      const newSelectedCards = [...prev.selectedCards, selectedCard]
      
      if (!isCorrect) {
        // Wrong answer - show punishment screen
        return {
          ...prev,
          selectedCards: newSelectedCards,
          gameStatus: 'failed',
        }
      }

      if (prev.currentRound === GAME_CONFIG.ROUNDS_COUNT) {
        // Game completed successfully
        return {
          ...prev,
          selectedCards: newSelectedCards,
          gameStatus: 'success',
          completedAt: Date.now(),
        }
      }

      // Move to next round
      const nextRound = prev.currentRound + 1
      const nextRoundData = gameRounds[nextRound - 1]
      
      return {
        ...prev,
        selectedCards: newSelectedCards,
        currentRound: nextRound,
        currentRoundChoices: nextRoundData ? nextRoundData.choices : [],
        correctCardId: nextRoundData ? nextRoundData.correctId : '',
        timeRemaining: GAME_CONFIG.ROUND_DURATION_MS / 1000,
        roundStartTime: Date.now(),
      }
    })
  }, [gameState.isSubmitting, gameState.gameStatus, gameState.correctCardId, gameState.roundStartTime, gameState.currentRound, gameRounds])

  const handleTimeout = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'locked',
    }))
  }, [])


  const updateTimeRemaining = useCallback((time: number) => {
    setGameState(prev => ({ ...prev, timeRemaining: time }))
  }, [])

  return {
    gameState,
    selectCard,
    handleTimeout,
    restartGame,
    updateTimeRemaining,
    currentRoundData: gameRounds[gameState.currentRound - 1],
  }
}