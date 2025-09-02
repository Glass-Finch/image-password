import { generateCategoryBasedRounds } from './gameLogic'

describe('gameLogic', () => {
  const createMockCards = () => [
    // Monster cards
    { id: 'monster-correct-1', name: 'Fairy Monster 1', image: '/img1.jpg', score: 1, card_type: 'monster' as const, tags: ['fairy'] },
    { id: 'monster-correct-2', name: 'Fairy Monster 2', image: '/img2.jpg', score: 1, card_type: 'monster' as const, tags: ['fairy'] },
    { id: 'monster-wrong-1', name: 'Dragon 1', image: '/img3.jpg', score: -1, card_type: 'monster' as const, tags: ['dragon'] },
    { id: 'monster-wrong-2', name: 'Dragon 2', image: '/img4.jpg', score: -1, card_type: 'monster' as const, tags: ['dragon'] },
    { id: 'monster-wrong-3', name: 'Dragon 3', image: '/img5.jpg', score: -1, card_type: 'monster' as const, tags: ['dragon'] },
    { id: 'monster-wrong-4', name: 'Dragon 4', image: '/img6.jpg', score: -1, card_type: 'monster' as const, tags: ['dragon'] },
    { id: 'monster-wrong-5', name: 'Dragon 5', image: '/img7.jpg', score: -1, card_type: 'monster' as const, tags: ['dragon'] },
    { id: 'monster-wrong-6', name: 'Dragon 6', image: '/img8.jpg', score: -1, card_type: 'monster' as const, tags: ['dragon'] },
    
    // Spell cards
    { id: 'spell-correct-1', name: 'Fairy Spell 1', image: '/img9.jpg', score: 1, card_type: 'spell' as const, tags: ['fairy'] },
    { id: 'spell-correct-2', name: 'Fairy Spell 2', image: '/img10.jpg', score: 1, card_type: 'spell' as const, tags: ['fairy'] },
    { id: 'spell-wrong-1', name: 'Dark Spell 1', image: '/img11.jpg', score: -1, card_type: 'spell' as const, tags: ['dark'] },
    { id: 'spell-wrong-2', name: 'Dark Spell 2', image: '/img12.jpg', score: -1, card_type: 'spell' as const, tags: ['dark'] },
    { id: 'spell-wrong-3', name: 'Dark Spell 3', image: '/img13.jpg', score: -1, card_type: 'spell' as const, tags: ['dark'] },
    { id: 'spell-wrong-4', name: 'Dark Spell 4', image: '/img14.jpg', score: -1, card_type: 'spell' as const, tags: ['dark'] },
    { id: 'spell-wrong-5', name: 'Dark Spell 5', image: '/img15.jpg', score: -1, card_type: 'spell' as const, tags: ['dark'] },
    { id: 'spell-wrong-6', name: 'Dark Spell 6', image: '/img16.jpg', score: -1, card_type: 'spell' as const, tags: ['dark'] },
    
    // Trap cards
    { id: 'trap-correct-1', name: 'Fairy Trap 1', image: '/img17.jpg', score: 1, card_type: 'trap' as const, tags: ['fairy'] },
    { id: 'trap-correct-2', name: 'Fairy Trap 2', image: '/img18.jpg', score: 1, card_type: 'trap' as const, tags: ['fairy'] },
    { id: 'trap-wrong-1', name: 'Dark Trap 1', image: '/img19.jpg', score: -1, card_type: 'trap' as const, tags: ['dark'] },
    { id: 'trap-wrong-2', name: 'Dark Trap 2', image: '/img20.jpg', score: -1, card_type: 'trap' as const, tags: ['dark'] },
    { id: 'trap-wrong-3', name: 'Dark Trap 3', image: '/img21.jpg', score: -1, card_type: 'trap' as const, tags: ['dark'] },
    { id: 'trap-wrong-4', name: 'Dark Trap 4', image: '/img22.jpg', score: -1, card_type: 'trap' as const, tags: ['dark'] },
    { id: 'trap-wrong-5', name: 'Dark Trap 5', image: '/img23.jpg', score: -1, card_type: 'trap' as const, tags: ['dark'] },
    { id: 'trap-wrong-6', name: 'Dark Trap 6', image: '/img24.jpg', score: -1, card_type: 'trap' as const, tags: ['dark'] },
  ]

  describe('generateCategoryBasedRounds', () => {
    test('generates 3 rounds with correct categories', () => {
      const cards = createMockCards()
      const rounds = generateCategoryBasedRounds(cards)
      
      expect(rounds).toHaveLength(3)
      expect(rounds[0].roundNumber).toBe(1)
      expect(rounds[1].roundNumber).toBe(2)
      expect(rounds[2].roundNumber).toBe(3)
    })

    test('round 1 contains only monster cards', () => {
      const cards = createMockCards()
      const rounds = generateCategoryBasedRounds(cards)
      
      const round1Cards = rounds[0].choices
      expect(round1Cards).toHaveLength(6)
      round1Cards.forEach(card => {
        expect(card.card_type).toBe('monster')
      })
    })

    test('round 2 contains only spell cards', () => {
      const cards = createMockCards()
      const rounds = generateCategoryBasedRounds(cards)
      
      const round2Cards = rounds[1].choices
      expect(round2Cards).toHaveLength(6)
      round2Cards.forEach(card => {
        expect(card.card_type).toBe('spell')
      })
    })

    test('round 3 contains only trap cards', () => {
      const cards = createMockCards()
      const rounds = generateCategoryBasedRounds(cards)
      
      const round3Cards = rounds[2].choices
      expect(round3Cards).toHaveLength(6)
      round3Cards.forEach(card => {
        expect(card.card_type).toBe('trap')
      })
    })

    test('each round has exactly 1 correct card', () => {
      const cards = createMockCards()
      const rounds = generateCategoryBasedRounds(cards)
      
      rounds.forEach(round => {
        const correctCards = round.choices.filter(card => card.id === round.correctId)
        expect(correctCards).toHaveLength(1)
        expect(correctCards[0].score).toBe(1)
      })
    })

    test('each round has exactly 5 wrong cards', () => {
      const cards = createMockCards()
      const rounds = generateCategoryBasedRounds(cards)
      
      rounds.forEach(round => {
        const wrongCards = round.choices.filter(card => card.id !== round.correctId)
        expect(wrongCards).toHaveLength(5)
        wrongCards.forEach(card => {
          expect(card.score).toBe(-1)
        })
      })
    })

    test('throws error when insufficient cards for category', () => {
      const insufficientCards = createMockCards().slice(0, 10) // Not enough for all categories
      
      expect(() => generateCategoryBasedRounds(insufficientCards))
        .toThrow(/Not enough/)
    })
  })
})