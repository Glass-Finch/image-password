import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/config/supabase'

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Analytics not configured' }, { status: 501 })
  }

  try {
    const data = await request.json()
    const { type, payload } = data

    switch (type) {
      case 'session':
        const { error: sessionError } = await supabase
          .from('game_sessions')
          .insert([{
            session_id: payload.sessionId,
            deck_id: payload.deckId,
            user_agent: payload.userAgent,
            screen_resolution: payload.screenResolution,
            created_at: new Date().toISOString()
          }])

        if (sessionError) throw sessionError
        break

      case 'round':
        const { error: roundError } = await supabase
          .from('round_attempts')
          .insert([{
            session_id: payload.sessionId,
            deck_id: payload.deckId,
            round_number: payload.roundNumber,
            cards_shown: payload.cardsShown,
            correct_card_id: payload.correctCardId,
            selected_card_id: payload.selectedCardId,
            selection_time: payload.selectionTime,
            was_timeout: payload.wasTimeout,
            created_at: new Date(payload.timestamp).toISOString()
          }])

        if (roundError) throw roundError
        break

      case 'completion':
        const { error: completionError } = await supabase
          .from('game_sessions')
          .update({
            completed_at: new Date().toISOString(),
            success: payload.success,
            total_duration: payload.totalDuration
          })
          .eq('session_id', payload.sessionId)

        if (completionError) throw completionError
        break

      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to store analytics' }, { status: 500 })
  }
}