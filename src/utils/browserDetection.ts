interface BrowserInfo {
  browserType: string
  browserVersion: string
  operatingSystem: string
  deviceType: 'desktop' | 'tablet' | 'mobile'
  deviceModel?: string
  language: string
  timezone: string
  viewportSize: string
}

export function getBrowserInfo(): BrowserInfo {
  const userAgent = navigator.userAgent

  // Browser detection
  let browserType = 'Unknown'
  let browserVersion = ''
  
  if (userAgent.includes('Chrome') && !userAgent.includes('Chromium')) {
    browserType = 'Chrome'
    const match = userAgent.match(/Chrome\/([0-9.]+)/)
    browserVersion = match ? match[1] : ''
  } else if (userAgent.includes('Firefox')) {
    browserType = 'Firefox'
    const match = userAgent.match(/Firefox\/([0-9.]+)/)
    browserVersion = match ? match[1] : ''
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browserType = 'Safari'
    const match = userAgent.match(/Version\/([0-9.]+)/)
    browserVersion = match ? match[1] : ''
  } else if (userAgent.includes('Edge')) {
    browserType = 'Edge'
    const match = userAgent.match(/Edge\/([0-9.]+)/)
    browserVersion = match ? match[1] : ''
  } else if (userAgent.includes('Opera')) {
    browserType = 'Opera'
    const match = userAgent.match(/Opera\/([0-9.]+)/)
    browserVersion = match ? match[1] : ''
  }

  // Operating System detection
  let operatingSystem = 'Unknown'
  if (userAgent.includes('Windows NT 10.0')) operatingSystem = 'Windows 10'
  else if (userAgent.includes('Windows NT 6.3')) operatingSystem = 'Windows 8.1'
  else if (userAgent.includes('Windows NT 6.1')) operatingSystem = 'Windows 7'
  else if (userAgent.includes('Windows')) operatingSystem = 'Windows'
  else if (userAgent.includes('Mac OS X')) {
    const match = userAgent.match(/Mac OS X ([0-9_]+)/)
    operatingSystem = match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS'
  }
  else if (userAgent.includes('Linux')) operatingSystem = 'Linux'
  else if (userAgent.includes('Android')) {
    const match = userAgent.match(/Android ([0-9.]+)/)
    operatingSystem = match ? `Android ${match[1]}` : 'Android'
  }
  else if (userAgent.includes('iPhone OS') || userAgent.includes('iOS')) {
    const match = userAgent.match(/OS ([0-9_]+)/)
    operatingSystem = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS'
  }

  // Device type detection
  let deviceType: 'desktop' | 'tablet' | 'mobile' = 'desktop'
  let deviceModel: string | undefined

  if (/Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone/i.test(userAgent)) {
    deviceType = 'mobile'
    
    // Try to extract device model
    if (userAgent.includes('iPhone')) {
      const match = userAgent.match(/iPhone OS ([0-9_]+)/)
      deviceModel = match ? `iPhone` : 'iPhone'
    } else if (userAgent.includes('iPad')) {
      deviceType = 'tablet'
      deviceModel = 'iPad'
    } else if (userAgent.includes('Android')) {
      // Android device model extraction is complex and varies by manufacturer
      const modelMatch = userAgent.match(/\(([^;]+);/)
      deviceModel = modelMatch ? modelMatch[1].trim() : undefined
    }
  } else if (/iPad|Tablet/i.test(userAgent)) {
    deviceType = 'tablet'
  }

  // Get language and timezone
  const language = navigator.language || 'en-US'
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

  // Get viewport size
  const viewportSize = `${window.innerWidth}x${window.innerHeight}`

  return {
    browserType,
    browserVersion,
    operatingSystem,
    deviceType,
    deviceModel,
    language,
    timezone,
    viewportSize
  }
}