'use client'

import { useCallback } from 'react'
import { isAnalyticsEnabled } from '@/config/supabase'
import { 
  logAnalyticsError, 
  collectSessionAnalyticsData, 
  sendToAnalytics,
  type RoundAnalyticsData,
  type CompletionAnalyticsData
} from '@/utils/analyticsUtils'

export function useAnalytics() {
  const trackSession = useCallback(async (sessionId: string, deckId: string) => {
    if (!isAnalyticsEnabled) return

    try {
      // Validate inputs
      if (!sessionId || !deckId) {
        throw new Error('Missing required session or deck ID')
      }

      // Collect all analytics data with built-in error handling
      const sessionData = collectSessionAnalyticsData(sessionId, deckId)
      
      // Send to analytics API
      await sendToAnalytics('session', sessionData)
    } catch (error) {
      logAnalyticsError({
        operation: 'session',
        error,
        context: { sessionId, deckId }
      })
    }
  }, [])

  const trackRound = useCallback(async (
    sessionId: string,
    deckId: string,
    roundNumber: number,
    roundType: string,
    cardsShown: string[],
    correctCardId: string,
    selectedCardId?: string,
    selectionTime?: number,
    wasTimeout: boolean = false
  ) => {
    if (!isAnalyticsEnabled) return

    try {
      const roundData: RoundAnalyticsData = {
        sessionId,
        deckId,
        roundNumber,
        roundType,
        cardsShown,
        correctCardId,
        selectedCardId,
        selectionTime,
        wasTimeout,
        timestamp: Date.now()
      }

      await sendToAnalytics('round', roundData)
    } catch (error) {
      logAnalyticsError({
        operation: 'round',
        error,
        context: { sessionId, roundNumber, roundType }
      })
    }
  }, [])

  const trackCompletion = useCallback(async (sessionId: string, success: boolean, totalDuration: number) => {
    if (!isAnalyticsEnabled) return

    try {
      const completionData: CompletionAnalyticsData = {
        sessionId,
        success,
        totalDuration
      }

      await sendToAnalytics('completion', completionData)
    } catch (error) {
      logAnalyticsError({
        operation: 'completion',
        error,
        context: { sessionId, success, totalDuration }
      })
    }
  }, [])

  return {
    trackSession,
    trackRound,
    trackCompletion,
  }
}