import { DeckCard, ChoiceCard } from '../types/Card';

// Your main deck - replace with your actual deck cards
export const deckCards: DeckCard[] = [
  {
    id: 'deck-001',
    name: 'Blue-Eyes White Dragon',
    imageUrl: '/images/placeholder-card.jpg',
    quantity: 3
  },
  {
    id: 'deck-002',
    name: 'Blue-Eyes Alternative White Dragon',
    imageUrl: '/images/placeholder-card.jpg',
    quantity: 3
  },
  {
    id: 'deck-003',
    name: 'The White Stone of Ancients',
    imageUrl: '/images/placeholder-card.jpg',
    quantity: 3
  },
  {
    id: 'deck-004',
    name: 'Sage with Eyes of Blue',
    imageUrl: '/images/placeholder-card.jpg',
    quantity: 3
  },
  {
    id: 'deck-005',
    name: 'Blue-Eyes Chaos MAX Dragon',
    imageUrl: '/images/placeholder-card.jpg',
    quantity: 2
  },
  {
    id: 'deck-006',
    name: 'Blue-Eyes Twin Burst Dragon',
    imageUrl: '/images/placeholder-card.jpg',
    quantity: 1
  },
  {
    id: 'deck-007',
    name: 'Blue-Eyes Ultimate Dragon',
    imageUrl: '/images/placeholder-card.jpg',
    quantity: 1
  },
  {
    id: 'deck-008',
    name: 'Polymerization',
    imageUrl: '/images/placeholder-card.jpg',
    quantity: 3
  },
  {
    id: 'deck-009',
    name: 'Trade-In',
    imageUrl: '/images/placeholder-card.jpg',
    quantity: 3
  },
  {
    id: 'deck-010',
    name: 'Return of the Dragon Lords',
    imageUrl: '/images/placeholder-card.jpg',
    quantity: 2
  }
];

// Pool of cards for choices - example Blue-Eyes synergy theme
export const choiceCards: ChoiceCard[] = [
  // Positive scoring cards (synergistic with Blue-Eyes deck)
  {
    id: 'choice-pos-001',
    name: 'Dragon Spirit of White',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'positive'
  },
  {
    id: 'choice-pos-002',
    name: 'Maiden with Eyes of Blue',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'positive'
  },
  {
    id: 'choice-pos-003',
    name: 'Azure-Eyes Silver Dragon',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'positive'
  },
  {
    id: 'choice-pos-004',
    name: 'Blue-Eyes Abyss Dragon',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'positive'
  },
  {
    id: 'choice-pos-005',
    name: 'Lord of D.',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'positive'
  },
  
  // Negative scoring cards (anti-synergistic)
  {
    id: 'choice-neg-001',
    name: 'Elemental HERO Sparkman',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-002',
    name: 'Kuriboh',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-003',
    name: 'Dark Magician',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-004',
    name: 'Red-Eyes Black Dragon',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-005',
    name: 'Mystical Space Typhoon',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-006',
    name: 'Celtic Guardian',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-007',
    name: 'Fissure',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-008',
    name: 'Meteor Dragon',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-009',
    name: 'Wall of Illusion',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-010',
    name: 'Flame Swordsman',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-011',
    name: 'Time Wizard',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-012',
    name: 'Gaia The Fierce Knight',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-013',
    name: 'Summoned Skull',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-014',
    name: 'Mirror Force',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-015',
    name: 'Trap Hole',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-016',
    name: 'Man-Eater Bug',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-017',
    name: 'Pot of Greed',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-018',
    name: 'La Jinn',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-019',
    name: 'Magician of Faith',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  },
  {
    id: 'choice-neg-020',
    name: 'Giant Soldier of Stone',
    imageUrl: '/images/placeholder-card.jpg',
    score: 'negative'
  }
];

// Configuration
export const GAME_CONFIG = {
  TOTAL_ROUNDS: 3,
  CHOICES_PER_ROUND: 5,
  POSITIVE_CARDS_PER_ROUND: 1,
  NEGATIVE_CARDS_PER_ROUND: 4,
  REDIRECT_URL: 'https://your-target-website.com' // Replace with actual URL
};