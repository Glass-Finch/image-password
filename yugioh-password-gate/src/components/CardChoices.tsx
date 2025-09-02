import React from 'react';
import { ChoiceCard } from '../types/Card';

interface CardChoicesProps {
  choices: ChoiceCard[];
  onCardSelect: (cardId: string) => void;
  currentRound: number;
  totalRounds: number;
  isLoading?: boolean;
}

const CardChoices: React.FC<CardChoicesProps> = ({ 
  choices, 
  onCardSelect, 
  currentRound, 
  totalRounds,
  isLoading = false 
}) => {
  const handleCardClick = (cardId: string) => {
    if (isLoading) return;
    onCardSelect(cardId);
  };

  return (
    <div className="card-choices">
      <div className="round-header">
        <h2>Choose the card that best fits this deck</h2>
        <p className="round-indicator">
          Round {currentRound} of {totalRounds}
        </p>
      </div>
      
      <div className="choices-grid">
        {choices.map((card) => (
          <div 
            key={card.id} 
            className={`choice-card ${isLoading ? 'disabled' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <img 
              src={card.imageUrl} 
              alt={card.name}
              className="card-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-card.svg';
              }}
            />
            <div className="card-name">{card.name}</div>
          </div>
        ))}
      </div>
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading next round...</div>
        </div>
      )}
    </div>
  );
};

export default CardChoices;