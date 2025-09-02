import { DeckCard, ChoiceCard } from '../types/Card';

export interface CardData {
  config: {
    totalRounds: number;
    choicesPerRound: number;
    positiveCardsPerRound: number;
    negativeCardsPerRound: number;
    redirectUrl: string;
  };
  deckCards: DeckCard[];
  choiceCards: ChoiceCard[];
}

let cardData: CardData | null = null;

export const loadCardData = async (): Promise<CardData> => {
  if (cardData) {
    return cardData;
  }

  try {
    const response = await fetch('/data/cards.json');
    if (!response.ok) {
      throw new Error('Failed to load card data');
    }
    cardData = await response.json();
    return cardData!;
  } catch (error) {
    console.error('Error loading card data:', error);
    throw error;
  }
};

export const getConfig = async () => {
  const data = await loadCardData();
  return data.config;
};

export const getDeckCards = async () => {
  const data = await loadCardData();
  return data.deckCards;
};

export const getChoiceCards = async () => {
  const data = await loadCardData();
  return data.choiceCards;
};