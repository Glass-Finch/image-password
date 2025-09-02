export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export interface ChoiceCard extends Card {
  score: 'positive' | 'negative';
  round?: number; // Optional: if specific cards should appear in specific rounds
}

export interface DeckCard extends Card {
  quantity?: number;
}

export interface GameState {
  currentRound: number;
  totalRounds: number;
  completedRounds: number;
  selectedCards: string[]; // IDs of selected cards
  isComplete: boolean;
}