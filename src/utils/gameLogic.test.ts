import { isGameComplete, hasGameFailed, calculateSelectionTime, isTimeExpired } from './gameLogic'

describe('gameLogic', () => {
  describe('isGameComplete', () => {
    test('returns true when all rounds are correct', () => {
      const selectedCards = [
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: true }
      ]
      expect(isGameComplete(selectedCards, 3)).toBe(true)
    })

    test('returns false when rounds incomplete', () => {
      const selectedCards = [
        { isCorrect: true },
        { isCorrect: true }
      ]
      expect(isGameComplete(selectedCards, 3)).toBe(false)
    })
  })

  describe('hasGameFailed', () => {
    test('returns true when any answer is wrong', () => {
      const selectedCards = [
        { isCorrect: true },
        { isCorrect: false }
      ]
      expect(hasGameFailed(selectedCards)).toBe(true)
    })

    test('returns false when all answers correct', () => {
      const selectedCards = [
        { isCorrect: true },
        { isCorrect: true }
      ]
      expect(hasGameFailed(selectedCards)).toBe(false)
    })
  })

  describe('calculateSelectionTime', () => {
    test('calculates time difference correctly', () => {
      expect(calculateSelectionTime(1000, 3500)).toBe(2500)
    })
  })

  describe('isTimeExpired', () => {
    test('returns true when time is 0 or negative', () => {
      expect(isTimeExpired(0)).toBe(true)
      expect(isTimeExpired(-5)).toBe(true)
    })

    test('returns false when time is positive', () => {
      expect(isTimeExpired(30)).toBe(false)
    })
  })
})