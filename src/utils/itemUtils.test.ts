import { randomSelect, shuffle, generateSessionId } from './itemUtils'

describe('itemUtils', () => {
  describe('randomSelect', () => {
    test('selects correct number of items', () => {
      const items = [1, 2, 3, 4, 5]
      const result = randomSelect(items, 3)
      expect(result).toHaveLength(3)
    })

    test('returns empty array when selecting 0 items', () => {
      const items = [1, 2, 3]
      const result = randomSelect(items, 0)
      expect(result).toHaveLength(0)
    })

    test('handles selecting more items than available', () => {
      const items = [1, 2]
      const result = randomSelect(items, 5)
      expect(result).toHaveLength(2)
      expect(result).toEqual(expect.arrayContaining([1, 2]))
    })

    test('handles empty array input', () => {
      const result = randomSelect([], 3)
      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })

    test('handles negative count', () => {
      const items = [1, 2, 3]
      const result = randomSelect(items, -1)
      expect(result).toHaveLength(0)
    })

    test('handles single item array', () => {
      const items = [42]
      const result = randomSelect(items, 1)
      expect(result).toHaveLength(1)
      expect(result[0]).toBe(42)
    })

    test('returns all items when count equals array length', () => {
      const items = [1, 2, 3]
      const result = randomSelect(items, 3)
      expect(result).toHaveLength(3)
      expect(result).toEqual(expect.arrayContaining([1, 2, 3]))
    })
  })

  describe('shuffle', () => {
    test('returns array with same length', () => {
      const items = [1, 2, 3, 4, 5]
      const result = shuffle(items)
      expect(result).toHaveLength(items.length)
    })

    test('contains all original elements', () => {
      const items = [1, 2, 3]
      const result = shuffle([...items])
      items.forEach(item => {
        expect(result).toContain(item)
      })
    })

    test('does not modify original array', () => {
      const items = [1, 2, 3, 4, 5]
      const originalCopy = [...items]
      shuffle(items)
      expect(items).toEqual(originalCopy)
    })

    test('handles empty array', () => {
      const result = shuffle([])
      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })

    test('handles single item array', () => {
      const items = [42]
      const result = shuffle(items)
      expect(result).toHaveLength(1)
      expect(result[0]).toBe(42)
    })

    test('handles two item array (tests swap logic)', () => {
      const items = [1, 2]
      const result = shuffle(items)
      expect(result).toHaveLength(2)
      expect(result).toContain(1)
      expect(result).toContain(2)
    })

    test('shuffles large arrays without error', () => {
      const items = Array.from({ length: 1000 }, (_, i) => i)
      const result = shuffle(items)
      expect(result).toHaveLength(1000)
      // Check that all original items are present
      items.forEach(item => {
        expect(result).toContain(item)
      })
    })

    test('produces different results on multiple calls', () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const result1 = shuffle([...items])
      const result2 = shuffle([...items])
      
      // With 10 items, it's extremely unlikely they'd be identical
      // This tests the randomness (though not guaranteed)
      let isDifferent = false
      for (let i = 0; i < items.length; i++) {
        if (result1[i] !== result2[i]) {
          isDifferent = true
          break
        }
      }
      // Note: This test might rarely fail due to randomness, but very unlikely
      expect(isDifferent).toBe(true)
    })
  })

  describe('generateSessionId', () => {
    test('generates unique session IDs', () => {
      const id1 = generateSessionId()
      const id2 = generateSessionId()
      expect(id1).not.toEqual(id2)
    })

    test('has correct format', () => {
      const sessionId = generateSessionId()
      expect(sessionId).toMatch(/^\d+-[a-z0-9]+$/)
    })

    test('contains timestamp component', () => {
      const beforeTime = Date.now()
      const sessionId = generateSessionId()
      const afterTime = Date.now()
      
      const timestamp = parseInt(sessionId.split('-')[0])
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(timestamp).toBeLessThanOrEqual(afterTime)
    })

    test('contains random component', () => {
      const sessionId = generateSessionId()
      const parts = sessionId.split('-')
      expect(parts).toHaveLength(2)
      
      const randomPart = parts[1]
      expect(randomPart).toHaveLength(9)
      expect(randomPart).toMatch(/^[a-z0-9]+$/)
    })

    test('generates different random parts', () => {
      // Mock Date.now to return same timestamp
      const originalDateNow = Date.now
      Date.now = jest.fn(() => 1234567890)
      
      const id1 = generateSessionId()
      const id2 = generateSessionId()
      
      // Should have same timestamp but different random parts
      const randomPart1 = id1.split('-')[1]
      const randomPart2 = id2.split('-')[1]
      expect(randomPart1).not.toEqual(randomPart2)
      
      // Restore original Date.now
      Date.now = originalDateNow
    })

    test('handles edge case with different timestamps', () => {
      const id1 = generateSessionId()
      // Small delay to ensure different timestamp
      setTimeout(() => {
        const id2 = generateSessionId()
        expect(id1).not.toEqual(id2)
      }, 1)
    })
  })

  describe('Edge cases and error handling', () => {
    test('randomSelect with non-integer count', () => {
      const items = [1, 2, 3, 4, 5]
      const result = randomSelect(items, 2.7)
      expect(result).toHaveLength(2) // Should truncate to 2
    })

    test('shuffle preserves array type', () => {
      const stringArray = ['a', 'b', 'c']
      const result = shuffle(stringArray)
      expect(result).toHaveLength(3)
      expect(typeof result[0]).toBe('string')
    })

    test('randomSelect preserves array type', () => {
      const objectArray = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const result = randomSelect(objectArray, 2)
      expect(result).toHaveLength(2)
      expect(typeof result[0]).toBe('object')
      expect(result[0]).toHaveProperty('id')
    })

    test('generateSessionId always returns string', () => {
      const sessionId = generateSessionId()
      expect(typeof sessionId).toBe('string')
      expect(sessionId.length).toBeGreaterThan(10)
    })
  })
})