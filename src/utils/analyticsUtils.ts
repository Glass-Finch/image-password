import { getBrowserInfo } from './browserDetection'
import { getTrafficData } from './urlParams'
import { getVisitorId, isReturningVisitor } from './visitorTracking'

interface AnalyticsError {
  operation: string
  error: Error | unknown
  context: Record<string, any>
}

export function logAnalyticsError({ operation, error, context }: AnalyticsError): void {
  if (error instanceof Error) {
    console.warn(`${operation} tracking failed (non-blocking):`, {
      message: error.message,
      timestamp: new Date().toISOString(),
      ...context
    })
  } else {
    console.warn(`${operation} tracking failed with unknown error:`, error)
  }
}

export interface SessionAnalyticsData {
  sessionId: string
  deckId: string
  userAgent: string
  screenResolution: string
  viewportSize: string
  browserType: string
  browserVersion: string
  operatingSystem: string
  deviceType: string
  deviceModel?: string
  language: string
  timezone: string
  referrerUrl: string
  landingPage: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  isReturningVisitor: boolean
  visitorId: string
}

export function collectSessionAnalyticsData(sessionId: string, deckId: string): SessionAnalyticsData {
  // Collect browser info with fallbacks
  let browserInfo
  try {
    browserInfo = getBrowserInfo()
  } catch (error) {
    console.warn('Failed to get browser info, using defaults:', error)
    browserInfo = {
      browserType: 'Unknown',
      browserVersion: '',
      operatingSystem: 'Unknown',
      deviceType: 'desktop' as const,
      language: 'en-US',
      timezone: 'UTC',
      viewportSize: '0x0'
    }
  }

  // Collect traffic data with fallbacks
  let trafficData
  try {
    trafficData = getTrafficData()
  } catch (error) {
    console.warn('Failed to get traffic data, using defaults:', error)
    trafficData = {
      referrerUrl: '',
      landingPage: typeof window !== 'undefined' ? window.location.href : '',
      utmParams: {}
    }
  }

  // Collect visitor data with fallbacks
  let visitorId, returningVisitor
  try {
    visitorId = getVisitorId()
    returningVisitor = isReturningVisitor()
  } catch (error) {
    console.warn('Failed to get visitor data, using defaults:', error)
    visitorId = 'unknown'
    returningVisitor = false
  }

  return {
    sessionId,
    deckId,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    screenResolution: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : '0x0',
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
}

export interface RoundAnalyticsData {
  sessionId: string
  deckId: string
  roundNumber: number
  roundType: string
  cardsShown: string[]
  correctCardId: string
  selectedCardId?: string
  selectionTime?: number
  wasTimeout: boolean
  timestamp: number
}

export interface CompletionAnalyticsData {
  sessionId: string
  success: boolean
  totalDuration: number
}

export async function sendToAnalytics(
  type: 'session' | 'round' | 'completion' | 'error',
  payload: SessionAnalyticsData | RoundAnalyticsData | CompletionAnalyticsData | any
): Promise<void> {
  const response = await fetch('/api/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, payload })
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`Analytics API error (${response.status}): ${errorText}`)
  }
}