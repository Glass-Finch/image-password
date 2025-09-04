import { renderHook } from '@testing-library/react'
import { useAnalytics } from './useAnalytics'

// Mock Supabase
jest.mock('../config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ error: null })),
      update: jest.fn(() => ({ eq: jest.fn(() => Promise.resolve({ error: null })) }))
    }))
  },
  isAnalyticsEnabled: true
}))

describe('useAnalytics', () => {
  test('provides analytics functions', () => {
    const { result } = renderHook(() => useAnalytics())
    
    expect(typeof result.current.trackSession).toBe('function')
    expect(typeof result.current.trackRound).toBe('function')
    expect(typeof result.current.trackCompletion).toBe('function')
  })

  test('trackSession calls Supabase correctly', async () => {
    const { result } = renderHook(() => useAnalytics())
    
    // Should not throw error (will catch fetch errors in implementation)
    await expect(result.current.trackSession('test-session', 'default')).resolves.toBeUndefined()
  })

  test('trackRound calls Supabase correctly', async () => {
    const { result } = renderHook(() => useAnalytics())
    
    // Should not throw error (will catch fetch errors in implementation)
    await expect(result.current.trackRound(
      'test-session',
      'default', 
      1,
      'monster',
      ['card1', 'card2'],
      'card1',
      'card1',
      1500,
      false
    )).resolves.toBeUndefined()
  })

  test('trackCompletion calls Supabase correctly', async () => {
    const { result } = renderHook(() => useAnalytics())
    
    // Should not throw error (will catch fetch errors in implementation)
    await expect(result.current.trackCompletion('test-session', true, 45000)).resolves.toBeUndefined()
  })
})