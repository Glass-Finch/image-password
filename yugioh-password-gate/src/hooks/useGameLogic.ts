import { useState, useEffect, useCallback } from 'react';
import { ChoiceCard } from '../types/Card';
import { getChoiceCards, getConfig } from '../utils/cardLoader';

interface GameState {
  currentRound: number;
  completedRounds: number;
  isComplete: boolean;
  isLoading: boolean;
  currentChoices: ChoiceCard[];
  selectedCards: string[];
  isInitialized: boolean;
}

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    completedRounds: 0,
    isComplete: false,
    isLoading: true,
    currentChoices: [],
    selectedCards: [],
    isInitialized: false
  });

  const [choiceCards, setChoiceCards] = useState<ChoiceCard[]>([]);
  const [config, setConfig] = useState<any>(null);

  // Generate random choices for a round (4 negative, 1 positive)
  const generateRoundChoices = useCallback((cards: ChoiceCard[], gameConfig: any): ChoiceCard[] => {
    if (!cards.length || !gameConfig) return [];
    
    const positiveCards = cards.filter((card: ChoiceCard) => card.score === 'positive');
    const negativeCards = cards.filter((card: ChoiceCard) => card.score === 'negative');
    
    // Randomly select 1 positive and 4 negative cards
    const selectedPositive = positiveCards[Math.floor(Math.random() * positiveCards.length)];
    const selectedNegatives = negativeCards
      .sort(() => Math.random() - 0.5)
      .slice(0, gameConfig.negativeCardsPerRound);
    
    // Combine and shuffle
    const roundChoices = [selectedPositive, ...selectedNegatives]
      .sort(() => Math.random() - 0.5);
    
    return roundChoices;
  }, []);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cards, gameConfig] = await Promise.all([
          getChoiceCards(),
          getConfig()
        ]);
        setChoiceCards(cards);
        setConfig(gameConfig);
        
        // Generate initial choices
        const initialChoices = generateRoundChoices(cards, gameConfig);

        setGameState(prev => ({
          ...prev,
          currentChoices: initialChoices,
          isLoading: false,
          isInitialized: true
        }));
      } catch (error) {
        console.error('Failed to load card data:', error);
      }
    };

    loadData();
  }, [generateRoundChoices]);

  const handleCardSelect = useCallback((cardId: string) => {
    const selectedCard = gameState.currentChoices.find(card => card.id === cardId);
    
    if (!selectedCard) return;

    setGameState(prev => ({
      ...prev,
      isLoading: true,
      selectedCards: [...prev.selectedCards, cardId]
    }));

    // Check if correct choice (positive score)
    if (selectedCard.score === 'positive') {
      // Correct choice
      setTimeout(() => {
        setGameState(prev => {
          const newCompletedRounds = prev.completedRounds + 1;
          const newCurrentRound = prev.currentRound + 1;
          const isGameComplete = newCompletedRounds >= (config?.totalRounds || 3);
          
          if (isGameComplete) {
            // Game completed successfully
            return {
              ...prev,
              completedRounds: newCompletedRounds,
              isComplete: true,
              isLoading: false
            };
          } else {
            // Move to next round
            return {
              ...prev,
              completedRounds: newCompletedRounds,
              currentRound: newCurrentRound,
              currentChoices: generateRoundChoices(choiceCards, config),
              isLoading: false
            };
          }
        });
      }, 1500); // Brief delay to show selection
    } else {
      // Incorrect choice - reset game
      setTimeout(() => {
        setGameState(prev => ({
          currentRound: 1,
          completedRounds: 0,
          isComplete: false,
          isLoading: false,
          currentChoices: generateRoundChoices(choiceCards, config),
          selectedCards: [],
          isInitialized: prev.isInitialized
        }));
      }, 2000); // Longer delay to show incorrect choice
    }
  }, [gameState.currentChoices, generateRoundChoices, choiceCards, config]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      currentRound: 1,
      completedRounds: 0,
      isComplete: false,
      isLoading: false,
      currentChoices: generateRoundChoices(choiceCards, config),
      selectedCards: [],
      isInitialized: prev.isInitialized
    }));
  }, [generateRoundChoices, choiceCards, config]);

  return {
    gameState,
    handleCardSelect,
    resetGame,
    config
  };
};