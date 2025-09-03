import { generateCategoryBasedRounds } from './gameLogic'

describe('gameLogic', () => {
  const createMockItems = () => [
    // Monster items
    { id: 'monster-correct-1', name: 'Correct Monster 1', image: '/img1.jpg', score: 1, item_type: 'monster' as const, tags: ['correct'] },
    { id: 'monster-correct-2', name: 'Correct Monster 2', image: '/img2.jpg', score: 1, item_type: 'monster' as const, tags: ['correct'] },
    { id: 'monster-wrong-1', name: 'Dragon 1', image: '/img3.jpg', score: -1, item_type: 'monster' as const, tags: ['dragon'] },
    { id: 'monster-wrong-2', name: 'Dragon 2', image: '/img4.jpg', score: -1, item_type: 'monster' as const, tags: ['dragon'] },
    { id: 'monster-wrong-3', name: 'Dragon 3', image: '/img5.jpg', score: -1, item_type: 'monster' as const, tags: ['dragon'] },
    { id: 'monster-wrong-4', name: 'Dragon 4', image: '/img6.jpg', score: -1, item_type: 'monster' as const, tags: ['dragon'] },
    { id: 'monster-wrong-5', name: 'Dragon 5', image: '/img7.jpg', score: -1, item_type: 'monster' as const, tags: ['dragon'] },
    { id: 'monster-wrong-6', name: 'Dragon 6', image: '/img8.jpg', score: -1, item_type: 'monster' as const, tags: ['dragon'] },
    
    // Spell items
    { id: 'spell-correct-1', name: 'Correct Spell 1', image: '/img9.jpg', score: 1, item_type: 'spell' as const, tags: ['correct'] },
    { id: 'spell-correct-2', name: 'Correct Spell 2', image: '/img10.jpg', score: 1, item_type: 'spell' as const, tags: ['correct'] },
    { id: 'spell-wrong-1', name: 'Dark Spell 1', image: '/img11.jpg', score: -1, item_type: 'spell' as const, tags: ['dark'] },
    { id: 'spell-wrong-2', name: 'Dark Spell 2', image: '/img12.jpg', score: -1, item_type: 'spell' as const, tags: ['dark'] },
    { id: 'spell-wrong-3', name: 'Dark Spell 3', image: '/img13.jpg', score: -1, item_type: 'spell' as const, tags: ['dark'] },
    { id: 'spell-wrong-4', name: 'Dark Spell 4', image: '/img14.jpg', score: -1, item_type: 'spell' as const, tags: ['dark'] },
    { id: 'spell-wrong-5', name: 'Dark Spell 5', image: '/img15.jpg', score: -1, item_type: 'spell' as const, tags: ['dark'] },
    { id: 'spell-wrong-6', name: 'Dark Spell 6', image: '/img16.jpg', score: -1, item_type: 'spell' as const, tags: ['dark'] },
    
    // Trap items
    { id: 'trap-correct-1', name: 'Correct Trap 1', image: '/img17.jpg', score: 1, item_type: 'trap' as const, tags: ['correct'] },
    { id: 'trap-correct-2', name: 'Correct Trap 2', image: '/img18.jpg', score: 1, item_type: 'trap' as const, tags: ['correct'] },
    { id: 'trap-wrong-1', name: 'Dark Trap 1', image: '/img19.jpg', score: -1, item_type: 'trap' as const, tags: ['dark'] },
    { id: 'trap-wrong-2', name: 'Dark Trap 2', image: '/img20.jpg', score: -1, item_type: 'trap' as const, tags: ['dark'] },
    { id: 'trap-wrong-3', name: 'Dark Trap 3', image: '/img21.jpg', score: -1, item_type: 'trap' as const, tags: ['dark'] },
    { id: 'trap-wrong-4', name: 'Dark Trap 4', image: '/img22.jpg', score: -1, item_type: 'trap' as const, tags: ['dark'] },
    { id: 'trap-wrong-5', name: 'Dark Trap 5', image: '/img23.jpg', score: -1, item_type: 'trap' as const, tags: ['dark'] },
    { id: 'trap-wrong-6', name: 'Dark Trap 6', image: '/img24.jpg', score: -1, item_type: 'trap' as const, tags: ['dark'] },
  ]

  describe('generateCategoryBasedRounds', () => {
    test('generates 3 rounds with correct categories', () => {
      const items = createMockItems()
      const rounds = generateCategoryBasedRounds(items, ['monster', 'spell', 'trap'])
      
      expect(rounds).toHaveLength(3)
      expect(rounds[0].roundNumber).toBe(1)
      expect(rounds[1].roundNumber).toBe(2)
      expect(rounds[2].roundNumber).toBe(3)
    })

    test('round 1 contains only monster items', () => {
      const items = createMockItems()
      const rounds = generateCategoryBasedRounds(items, ['monster', 'spell', 'trap'])
      
      const round1Items = rounds[0].choices
      expect(round1Items).toHaveLength(6)
      round1Items.forEach(item => {
        expect(item.item_type).toBe('monster')
      })
    })

    test('round 2 contains only spell items', () => {
      const items = createMockItems()
      const rounds = generateCategoryBasedRounds(items, ['monster', 'spell', 'trap'])
      
      const round2Items = rounds[1].choices
      expect(round2Items).toHaveLength(6)
      round2Items.forEach(item => {
        expect(item.item_type).toBe('spell')
      })
    })

    test('round 3 contains only trap items', () => {
      const items = createMockItems()
      const rounds = generateCategoryBasedRounds(items, ['monster', 'spell', 'trap'])
      
      const round3Items = rounds[2].choices
      expect(round3Items).toHaveLength(6)
      round3Items.forEach(item => {
        expect(item.item_type).toBe('trap')
      })
    })

    test('each round has exactly 1 correct item', () => {
      const items = createMockItems()
      const rounds = generateCategoryBasedRounds(items, ['monster', 'spell', 'trap'])
      
      rounds.forEach(round => {
        const correctItems = round.choices.filter(item => item.id === round.correctId)
        expect(correctItems).toHaveLength(1)
        expect(correctItems[0].score).toBe(1)
      })
    })

    test('each round has exactly 5 wrong items', () => {
      const items = createMockItems()
      const rounds = generateCategoryBasedRounds(items, ['monster', 'spell', 'trap'])
      
      rounds.forEach(round => {
        const wrongItems = round.choices.filter(item => item.id !== round.correctId)
        expect(wrongItems).toHaveLength(5)
        wrongItems.forEach(item => {
          expect(item.score).toBe(-1)
        })
      })
    })

    test('throws error when insufficient items for category', () => {
      const insufficientItems = createMockItems().slice(0, 10)
      
      expect(() => generateCategoryBasedRounds(insufficientItems, ['monster', 'spell', 'trap']))
        .toThrow(/Not enough/)
    })
  })
})