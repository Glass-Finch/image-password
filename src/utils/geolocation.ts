interface GeolocationData {
  country?: string
  region?: string
  city?: string
  timezone?: string
}

export async function getGeolocationFromIP(ip: string): Promise<GeolocationData> {
  try {
    // Skip localhost/private IPs
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return {}
    }

    // Use ip-api.com (free, no API key required, 1000 requests/hour)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,timezone`, {
      headers: {
        'User-Agent': 'ImagePasswordGame/1.0'
      }
    })
    
    if (!response.ok) {
      console.warn('Geolocation API request failed:', response.statusText)
      return {}
    }

    const data = await response.json()
    
    if (data.status !== 'success') {
      console.warn('Geolocation API returned error:', data.message || 'Unknown error')
      return {}
    }

    return {
      country: data.country || undefined,
      region: data.regionName || undefined,
      city: data.city || undefined,
      timezone: data.timezone || undefined
    }
  } catch (error) {
    console.error('Error fetching geolocation:', error)
    return {}
  }
}

// Helper to get client IP from request headers
export function getClientIP(request: Request): string {
  // Try various header combinations (depending on proxy/CDN setup)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnecting = request.headers.get('cf-connecting-ip') // Cloudflare
  
  if (forwarded) {
    // x-forwarded-for can be comma-separated list, take the first one
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnecting) {
    return cfConnecting
  }
  
  // Fallback (likely localhost in development)
  return '127.0.0.1'
}