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
  })
})