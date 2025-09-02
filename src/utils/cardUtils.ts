import { Card, DeckConfig } from '@/types/game'

export function randomSelect<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function validateDeckRequirements(cards: Card[], config: DeckConfig) {
  const correctCards = cards.filter(c => c.score === 1)
  const wrongCards = cards.filter(c => c.score === -1)
  const referenceCards = cards.filter(c => config.referenceCards.includes(c.id))
  
  if (referenceCards.length !== 15) {
    throw new Error(`Reference deck must have exactly 15 cards, found ${referenceCards.length}`)
  }
  
  if (correctCards.length < 3) {
    throw new Error(`Need minimum 3 correct cards, found ${correctCards.length}`)
  }
  
  if (wrongCards.length < 9) {
    throw new Error(`Need minimum 9 distractor cards, found ${wrongCards.length}`)
  }
  
  return { correctCards, wrongCards, referenceCards }
}

export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function getScreenResolution(): string {
  if (typeof window === 'undefined') return 'unknown'
  return `${window.screen.width}x${window.screen.height}`
}

export function getUserAgent(): string {
  if (typeof window === 'undefined') return 'unknown'
  return window.navigator.userAgent
}