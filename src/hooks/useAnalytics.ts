'use client'

import { useCallback } from 'react'
import { supabase, isAnalyticsEnabled } from '@/config/supabase'
import { getBrowserInfo } from '@/utils/browserDetection'
import { getTrafficData } from '@/utils/urlParams'
import { getVisitorId, isReturningVisitor } from '@/utils/visitorTracking'

export function useAnalytics() {
  const trackSession = useCallback(async (sessionId: string, deckId: string) => {
    if (!isAnalyticsEnabled) return

    try {
      // Collect enhanced browser and device information
      const browserInfo = getBrowserInfo()
      const trafficData = getTrafficData()
      const visitorId = getVisitorId()
      const returningVisitor = isReturningVisitor()

      // Use API route instead of direct Supabase call to handle server-side geolocation
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'session',
          payload: {
            sessionId,
            deckId,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: browserInfo.viewportSize,
            browserType: browserInfo.browserType,
            browserVersion: browserInfo.browserVersion,
            operatingSystem: browserInfo.operatingSystem,
            deviceType: browserInfo.deviceType,
            deviceModel: browserInfo.deviceModel,
            language: browserInfo.language,
            timezone: browserInfo.timezone,
            referrerUrl: trafficData.referrerUrl,
            landingPage: trafficData.landingPage,
            utmSource: trafficData.utmParams.utm_source,
            utmMedium: trafficData.utmParams.utm_medium,
            utmCampaign: trafficData.utmParams.utm_campaign,
            utmTerm: trafficData.utmParams.utm_term,
            utmContent: trafficData.utmParams.utm_content,
            isReturningVisitor: returningVisitor,
            visitorId: visitorId
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
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
    if (!isAnalyticsEnabled) return

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'round',
          payload: {
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
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to track round:', error)
    }
  }, [])

  const trackCompletion = useCallback(async (sessionId: string, success: boolean, totalDuration: number) => {
    if (!isAnalyticsEnabled) return

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'completion',
          payload: {
            sessionId,
            success,
            totalDuration
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
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