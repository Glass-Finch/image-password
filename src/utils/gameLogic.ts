import { Card, GameRound, DeckConfig } from '@/types/game'
import { randomSelect, shuffle, validateDeckRequirements } from './cardUtils'
import { GAME_CONFIG } from '@/config/game-constants'

export function generateGameRounds(cards: Card[], config: DeckConfig): GameRound[] {
  const { correctCards, wrongCards } = validateDeckRequirements(cards, config)
  
  const rounds: GameRound[] = []
  const usedCorrect: string[] = []
  const usedWrong: string[] = []
  
  for (let i = 0; i < GAME_CONFIG.ROUNDS_COUNT; i++) {
    const availableCorrect = correctCards.filter(c => !usedCorrect.includes(c.id))
    const availableWrong = wrongCards.filter(c => !usedWrong.includes(c.id))
    
    if (availableCorrect.length === 0) {
      throw new Error(`Not enough unique correct cards for round ${i + 1}`)
    }
    
    if (availableWrong.length < 3) {
      throw new Error(`Not enough unique wrong cards for round ${i + 1}`)
    }
    
    const correctCard = randomSelect(availableCorrect, 1)[0]
    const wrongCardChoices = randomSelect(availableWrong, 3)
    
    rounds.push({
      choices: shuffle([correctCard, ...wrongCardChoices]),
      correctId: correctCard.id,
      roundNumber: i + 1
    })
    
    usedCorrect.push(correctCard.id)
    usedWrong.push(...wrongCardChoices.map(c => c.id))
  }
  
  return rounds
}

export function isGameComplete(selectedCards: any[], roundsCount: number): boolean {
  if (selectedCards.length !== roundsCount) return false
  return selectedCards.every(card => card.isCorrect)
}

export function hasGameFailed(selectedCards: any[]): boolean {
  return selectedCards.some(card => !card.isCorrect)
}

export function calculateSelectionTime(roundStartTime: number, selectionTime: number): number {
  return selectionTime - roundStartTime
}

export function isTimeExpired(timeRemaining: number): boolean {
  return timeRemaining <= 0
}

export function getReferenceCards(cards: Card[], config: DeckConfig): Card[] {
  return cards.filter(card => config.referenceCards.includes(card.id))
}