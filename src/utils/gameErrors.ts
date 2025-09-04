// Concise error messages - only the most commonly repeated ones
export const GAME_ERRORS = {
  MISSING_ITEM_ID: 'Invalid item selection',
  MISSING_CORRECT_ID: 'Missing correct answer',
  MISSING_CHOICES: 'Missing round choices', 
  INVALID_SELECTION: 'Item not in choices',
  MISSING_ROUND_DATA: 'Missing round data',
  NO_ROUNDS: 'No game rounds available'
} as const

// Simple validation helpers that throw with consistent messages
export const validateItem = (itemId: string, choices: Array<{id: string}>): void => {
  if (!itemId) throw new Error(GAME_ERRORS.MISSING_ITEM_ID)
  if (!choices.some(c => c.id === itemId)) throw new Error(GAME_ERRORS.INVALID_SELECTION)
}

export const validateGameState = (correctItemId: string, currentRoundChoices: Array<any>): void => {
  if (!correctItemId) throw new Error(GAME_ERRORS.MISSING_CORRECT_ID)
  if (!currentRoundChoices?.length) throw new Error(GAME_ERRORS.MISSING_CHOICES)
}

export const validateRoundData = (roundData: any, roundNumber: number): void => {
  if (!roundData) throw new Error(`${GAME_ERRORS.MISSING_ROUND_DATA} for round ${roundNumber}`)
  if (!roundData.choices?.length) throw new Error(GAME_ERRORS.MISSING_CHOICES)
  if (!roundData.correctId) throw new Error(GAME_ERRORS.MISSING_CORRECT_ID)
}