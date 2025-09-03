interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

interface TrafficData {
  referrerUrl: string
  landingPage: string
  utmParams: UTMParams
}

export function getTrafficData(): TrafficData {
  const url = new URL(window.location.href)
  
  // Extract UTM parameters
  const utmParams: UTMParams = {
    utm_source: url.searchParams.get('utm_source') || undefined,
    utm_medium: url.searchParams.get('utm_medium') || undefined,
    utm_campaign: url.searchParams.get('utm_campaign') || undefined,
    utm_term: url.searchParams.get('utm_term') || undefined,
    utm_content: url.searchParams.get('utm_content') || undefined,
  }

  // Remove undefined values
  Object.keys(utmParams).forEach(key => {
    if (utmParams[key as keyof UTMParams] === undefined) {
      delete utmParams[key as keyof UTMParams]
    }
  })

  return {
    referrerUrl: document.referrer || '',
    landingPage: window.location.href,
    utmParams
  }
}

export function parseUTMParams(url: string): UTMParams {
  const urlObj = new URL(url)
  
  return {
    utm_source: urlObj.searchParams.get('utm_source') || undefined,
    utm_medium: urlObj.searchParams.get('utm_medium') || undefined,
    utm_campaign: urlObj.searchParams.get('utm_campaign') || undefined,
    utm_term: urlObj.searchParams.get('utm_term') || undefined,
    utm_content: urlObj.searchParams.get('utm_content') || undefined,
  }
}