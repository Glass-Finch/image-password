import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/config/supabase'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, deckId } = await request.json()
    
    if (!sessionId || !deckId) {
      return NextResponse.json({ error: 'Missing session data' }, { status: 400 })
    }

    // Verify session completion server-side
    if (supabase) {
      const { data: session, error } = await supabase
        .from('game_sessions')
        .select('success, completed_at')
        .eq('session_id', sessionId)
        .eq('deck_id', deckId)
        .single()
      
      if (error || !session?.success || !session?.completed_at) {
        return NextResponse.json({ error: 'Session not completed or invalid' }, { status: 403 })
      }
    }
    
    // Get redirect URL from environment variables
    const redirectUrlKey = `${deckId.toUpperCase()}_SUCCESS_URL`
    const redirectUrl = process.env[redirectUrlKey]
    
    if (!redirectUrl) {
      console.error(`Missing environment variable: ${redirectUrlKey}`)
      return NextResponse.json({ error: 'Redirect URL not configured' }, { status: 500 })
    }
    
    return NextResponse.redirect(redirectUrl, 302)
  } catch (error) {
    console.error('Redirect error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}