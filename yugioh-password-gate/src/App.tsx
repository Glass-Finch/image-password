import React, { useEffect, useState } from 'react';
import DeckDisplay from './components/DeckDisplay';
import CardChoices from './components/CardChoices';
import { useGameLogic } from './hooks/useGameLogic';
import { getDeckCards } from './utils/cardLoader';
import { DeckCard } from './types/Card';
import './App.css';

function App() {
  const { gameState, handleCardSelect, resetGame, config } = useGameLogic();
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);

  // Load deck cards
  useEffect(() => {
    const loadDeckCards = async () => {
      try {
        const cards = await getDeckCards();
        setDeckCards(cards);
      } catch (error) {
        console.error('Failed to load deck cards:', error);
      }
    };

    loadDeckCards();
  }, []);

  // Handle successful completion
  useEffect(() => {
    if (gameState.isComplete && config) {
      // Brief delay before redirect
      const timer = setTimeout(() => {
        window.location.href = config.redirectUrl;
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [gameState.isComplete, config]);

  if (gameState.isComplete) {
    return (
      <div className="success-screen">
        <div className="success-content">
          <h1>🎉 Access Granted!</h1>
          <p>You have proven your Yu-Gi-Oh! knowledge.</p>
          <p>Redirecting you now...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Yu-Gi-Oh! Knowledge Gate</h1>
        <p>Prove your deck building skills to gain access</p>
      </header>
      
      <main className="app-main">
        <div className="left-panel">
          <DeckDisplay deckCards={deckCards} />
        </div>
        
        <div className="right-panel">
          <CardChoices
            choices={gameState.currentChoices}
            onCardSelect={handleCardSelect}
            currentRound={gameState.currentRound}
            totalRounds={config?.totalRounds || 3}
            isLoading={gameState.isLoading}
          />
        </div>
      </main>
      
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}

export default App;
