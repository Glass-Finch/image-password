export interface Item {
  id: string
  name: string
  image: string
  score: number // +1 for correct, -1 for distractor
  item_type: string // Configurable type based on theme
  tags?: string[]
}

export interface CollectionConfig {
  id: string
  name: string
  referenceItems: string[] // 15 item IDs for display
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
  choices: Item[] // 6 items to choose from
  correctId: string
  roundNumber: number
}

export interface SelectedItem {
  roundNumber: number
  itemId: string
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
  selectedItems: SelectedItem[]
  currentRoundChoices: Item[]
  correctItemId: string
  correctCardId: string // Backward compatibility
  usedCorrectItems: string[]
  usedWrongItems: string[]
  roundStartTime: number
  isSubmitting: boolean
  networkError: boolean
  completedAt?: number
}

export interface AnalyticsData {
  sessionId: string
  deckId: string
  roundNumber: number
  itemsShown: string[]
  correctItemId: string
  selectedItemId?: string
  selectionTime?: number
  wasTimeout: boolean
  userAgent: string
  screenResolution: string
  timestamp: number
}

// Backward compatibility aliases
export type Card = Item
export type SelectedCard = SelectedItem  
export type DeckConfig = CollectionConfig