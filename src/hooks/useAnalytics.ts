'use client'

import { useCallback } from 'react'
import { supabase, isAnalyticsEnabled } from '@/config/supabase'

export function useAnalytics() {
  const trackSession = useCallback(async (sessionId: string, deckId: string) => {
    if (!isAnalyticsEnabled || !supabase) return

    try {
      await supabase.from('game_sessions').insert([{
        session_id: sessionId,
        deck_id: deckId,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
      }])
    } catch (error) {
      console.error('Failed to track session:', error)
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
    if (!isAnalyticsEnabled || !supabase) return

    try {
      await supabase.from('round_attempts').insert([{
        session_id: sessionId,
        deck_id: deckId,
        round_number: roundNumber,
        round_type: roundType,
        cards_shown: cardsShown,
        correct_card_id: correctCardId,
        selected_card_id: selectedCardId,
        selection_time: selectionTime,
        was_timeout: wasTimeout,
      }])
    } catch (error) {
      console.error('Failed to track round:', error)
    }
  }, [])

  const trackCompletion = useCallback(async (sessionId: string, success: boolean, totalDuration: number) => {
    if (!isAnalyticsEnabled || !supabase) return

    try {
      await supabase
        .from('game_sessions')
        .update({
          completed_at: new Date().toISOString(),
          success,
          total_duration: totalDuration
        })
        .eq('session_id', sessionId)
    } catch (error) {
      console.error('Failed to track completion:', error)
    }
  }, [])

  return {
    trackSession,
    trackRound,
    trackCompletion,
  }
}