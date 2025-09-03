import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/config/supabase'
import { getGeolocationFromIP, getClientIP } from '@/utils/geolocation'

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Analytics not configured' }, { status: 501 })
  }

  try {
    const data = await request.json()
    const { type, payload } = data

    switch (type) {
      case 'session':
        // Get IP address and geolocation data
        const clientIP = getClientIP(request)
        const geoData = await getGeolocationFromIP(clientIP)
        
        const { error: sessionError } = await supabase
          .from('game_sessions')
          .insert([{
            session_id: payload.sessionId,
            deck_id: payload.deckId,
            user_agent: payload.userAgent,
            screen_resolution: payload.screenResolution,
            viewport_size: payload.viewportSize,
            browser_type: payload.browserType,
            browser_version: payload.browserVersion,
            operating_system: payload.operatingSystem,
            device_type: payload.deviceType,
            device_model: payload.deviceModel,
            language: payload.language,
            timezone: payload.timezone,
            referrer_url: payload.referrerUrl,
            landing_page: payload.landingPage,
            utm_source: payload.utmSource,
            utm_medium: payload.utmMedium,
            utm_campaign: payload.utmCampaign,
            utm_term: payload.utmTerm,
            utm_content: payload.utmContent,
            ip_address: clientIP,
            country: geoData.country,
            region: geoData.region,
            city: geoData.city,
            is_returning_visitor: payload.isReturningVisitor,
            visitor_id: payload.visitorId,
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
            round_type: payload.roundType || 'unknown', // Default to 'unknown' if not provided
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