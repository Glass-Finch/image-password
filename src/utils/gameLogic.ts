import { Card, GameRound, DeckConfig } from '@/types/game'
import { randomSelect, shuffle, validateDeckRequirements } from './cardUtils'
import { GAME_CONFIG } from '@/config/game-constants'

export function generateGameRounds(cards: Card[], config: DeckConfig): GameRound[] {
  return generateCategoryBasedRounds(cards, config)
}

export function generateCategoryBasedRounds(cards: Card[], config: DeckConfig): GameRound[] {
  const correctCards = cards.filter(c => c.score === 1)
  const wrongCards = cards.filter(c => c.score === -1)
  
  // Define round categories: Round 1 = Monster, Round 2 = Spell, Round 3 = Trap
  const roundTypes = ['monster', 'spell', 'trap']
  const rounds: GameRound[] = []
  const usedCorrect: string[] = []
  const usedWrong: string[] = []
  
  for (let i = 0; i < GAME_CONFIG.ROUNDS_COUNT; i++) {
    const roundType = roundTypes[i]
    
    // Get available cards of the specific type for this round
    const availableCorrect = correctCards.filter(c => 
      !usedCorrect.includes(c.id) && c.card_type === roundType
    )
    const availableWrong = wrongCards.filter(c => 
      !usedWrong.includes(c.id) && c.card_type === roundType
    )
    
    console.log(`Round ${i + 1} (${roundType}): ${availableCorrect.length} correct, ${availableWrong.length} wrong`)
    
    if (availableCorrect.length === 0) {
      throw new Error(`Not enough correct ${roundType} cards for round ${i + 1}`)
    }
    
    if (availableWrong.length < 5) {
      throw new Error(`Not enough wrong ${roundType} cards for round ${i + 1}`)
    }
    
    const correctCard = randomSelect(availableCorrect, 1)[0]
    const wrongCardChoices = randomSelect(availableWrong, 5)
    
    console.log(`Round ${i + 1} choices:`, [correctCard, ...wrongCardChoices].map(c => `${c.name} (${c.card_type})`))
    
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