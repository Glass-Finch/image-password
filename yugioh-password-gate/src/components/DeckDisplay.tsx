import React from 'react';
import { DeckCard } from '../types/Card';

interface DeckDisplayProps {
  deckCards: DeckCard[];
}

const DeckDisplay: React.FC<DeckDisplayProps> = ({ deckCards }) => {
  return (
    <div className="deck-display">
      <h2>Deck</h2>
      <div className="deck-grid">
        {deckCards.map((card) => (
          <div key={card.id} className="deck-card">
            <img 
              src={card.imageUrl} 
              alt={card.name}
              className="card-image"
              onError={(e) => {
                // Fallback for missing images
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-card.svg';
              }}
            />
            {card.quantity && card.quantity > 1 && (
              <span className="card-quantity">{card.quantity}</span>
            )}
            <div className="card-name">{card.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckDisplay;