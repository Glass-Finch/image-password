const VISITOR_ID_COOKIE = 'visitor_id'
const COOKIE_EXPIRY_DAYS = 365

export function getVisitorId(): string {
  // Try to get existing visitor ID from cookie
  const existingId = getCookie(VISITOR_ID_COOKIE)
  
  if (existingId) {
    return existingId
  }
  
  // Generate new visitor ID
  const newId = generateVisitorId()
  setCookie(VISITOR_ID_COOKIE, newId, COOKIE_EXPIRY_DAYS)
  return newId
}

export function isReturningVisitor(): boolean {
  // Check if visitor ID cookie already exists
  return getCookie(VISITOR_ID_COOKIE) !== null
}

function generateVisitorId(): string {
  // Generate a UUID-like string for visitor tracking
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => {
    return (Math.random() * 16 | 0).toString(16)
  })
}

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

function getCookie(name: string): string | null {
  const nameEQ = name + '='
  const cookies = document.cookie.split(';')
  
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length)
    }
  }
  
  return null
}