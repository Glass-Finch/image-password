import { Item, GameRound, CollectionConfig } from '@/types/game'
import { randomSelect, shuffle } from './itemUtils'
import { GAME_CONFIG } from '@/config/game-constants'

export function generateGameRounds(items: Item[], roundTypes?: string[]): GameRound[] {
  return generateCategoryBasedRounds(items, roundTypes)
}

export function generateCategoryBasedRounds(items: Item[], roundTypes: string[] = ['type1', 'type2', 'type3']): GameRound[] {
  const correctImages = items.filter(c => c.score === 1)
  const wrongImages = items.filter(c => c.score === -1)
  
  const challengeTypes = roundTypes
  const rounds: GameRound[] = []
  const usedCorrect: string[] = []
  const usedWrong: string[] = []
  
  for (let i = 0; i < GAME_CONFIG.ROUNDS_COUNT; i++) {
    const roundType = challengeTypes[i]
    
    // Get available images of the specific type for this round
    const availableCorrect = correctImages.filter(c => 
      !usedCorrect.includes(c.id) && c.item_type === roundType
    )
    const availableWrong = wrongImages.filter(c => 
      !usedWrong.includes(c.id) && c.item_type === roundType
    )
    
    if (availableCorrect.length === 0) {
      throw new Error(`Not enough correct ${roundType} images for round ${i + 1}`)
    }
    
    if (availableWrong.length < 5) {
      throw new Error(`Not enough wrong ${roundType} images for round ${i + 1}`)
    }
    
    const correctImage = randomSelect(availableCorrect, 1)[0]
    const wrongImageChoices = randomSelect(availableWrong, 5)
    
    rounds.push({
      choices: shuffle([correctImage, ...wrongImageChoices]),
      correctId: correctImage.id,
      roundNumber: i + 1
    })
    
    usedCorrect.push(correctImage.id)
    usedWrong.push(...wrongImageChoices.map(c => c.id))
  }
  
  return rounds
}

export function getReferenceItems(items: Item[], config: CollectionConfig): Item[] {
  return items.filter(item => config.referenceItems.includes(item.id))
}