interface GeolocationData {
  country?: string
  region?: string
  city?: string
  timezone?: string
}

// Helper function to detect private and localhost IPs
function isPrivateOrLocalhost(ip: string): boolean {
  // IPv4 localhost and private ranges
  if (ip === '127.0.0.1' || ip === 'localhost') return true
  if (ip.startsWith('192.168.')) return true
  if (ip.startsWith('10.')) return true
  if (ip.startsWith('172.')) {
    const secondOctet = parseInt(ip.split('.')[1])
    if (secondOctet >= 16 && secondOctet <= 31) return true
  }
  
  // IPv6 localhost and private ranges
  if (ip === '::1') return true
  if (ip === '::') return true
  if (ip.startsWith('fe80:')) return true // Link-local
  if (ip.startsWith('fc00:') || ip.startsWith('fd00:')) return true // Unique local
  
  // IPv4-mapped IPv6 addresses
  if (ip.startsWith('::ffff:')) {
    const ipv4Part = ip.substring(7)
    return isPrivateOrLocalhost(ipv4Part)
  }
  
  return false
}

export async function getGeolocationFromIP(ip: string): Promise<GeolocationData> {
  try {
    // Skip localhost/private IPs (both IPv4 and IPv6)
    if (isPrivateOrLocalhost(ip)) {
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
  const vercelForwarded = request.headers.get('x-vercel-forwarded-for') // Vercel
  
  // Helper to validate and clean IP address
  const validateIP = (ip: string): string | null => {
    const cleanIP = ip.trim()
    
    // Skip obviously invalid IPs
    if (!cleanIP || cleanIP === 'undefined' || cleanIP === 'null') {
      return null
    }
    
    // For development, skip private IPs and try to get a real one
    if (isPrivateOrLocalhost(cleanIP)) {
      return null
    }
    
    return cleanIP
  }
  
  // Check forwarded headers in priority order
  if (forwarded) {
    // x-forwarded-for can be comma-separated list, check each one
    const ips = forwarded.split(',').map(ip => ip.trim())
    for (const ip of ips) {
      const validIP = validateIP(ip)
      if (validIP) {
        return validIP
      }
    }
  }
  
  if (vercelForwarded) {
    const validIP = validateIP(vercelForwarded)
    if (validIP) return validIP
  }
  
  if (realIP) {
    const validIP = validateIP(realIP)
    if (validIP) return validIP
  }
  
  if (cfConnecting) {
    const validIP = validateIP(cfConnecting)
    if (validIP) return validIP
  }
  
  // In development/localhost scenarios, use a test IP for demonstration
  // This allows testing the geolocation system even in development
  return process.env.NODE_ENV === 'development' ? '8.8.8.8' : '127.0.0.1'
}