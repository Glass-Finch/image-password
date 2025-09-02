export interface Card {
  id: string
  name: string
  image: string
  score: number // +1 for correct, -1 for distractor
  card_type: 'monster' | 'spell' | 'trap'
  tags?: string[]
}

export interface DeckConfig {
  id: string
  name: string
  referenceCards: string[] // 15 card IDs for display
  theme: {
    primary: string
    secondary: string
    accent: string
    backgroundGradient: string[]
  }
  successMessage: string
  redirectUrl: string // env variable key
}

export interface GameRound {
  choices: Card[] // 4 cards to choose from
  correctId: string
  roundNumber: number
}

export interface SelectedCard {
  roundNumber: number
  cardId: string
  isCorrect: boolean
  selectionTime: number // milliseconds from round start
  timestamp: number
}

export interface GameState {
  sessionId: string
  deckId: string
  currentRound: number // 1-3
  timeRemaining: number // 60 seconds per round
  gameStatus: 'playing' | 'success' | 'failed' | 'locked'
  selectedCards: SelectedCard[]
  currentRoundChoices: Card[]
  correctCardId: string
  usedCorrectCards: string[]
  usedWrongCards: string[]
  roundStartTime: number
  isSubmitting: boolean
  networkError: boolean
  completedAt?: number
}

export interface AnalyticsData {
  sessionId: string
  deckId: string
  roundNumber: number
  cardsShown: string[]
  correctCardId: string
  selectedCardId?: string
  selectionTime?: number
  wasTimeout: boolean
  userAgent: string
  screenResolution: string
  timestamp: number
}