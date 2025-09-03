'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session')
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)
  const [secretUrl, setSecretUrl] = useState('')

  useEffect(() => {
    async function verifySession() {
      if (!sessionId) {
        setIsLoading(false)
        return
      }

      try {
        // For now, skip server verification and trust the session parameter
        // In production, you'd verify against Supabase that this session was completed
        if (sessionId && sessionId.length > 10) {
          setIsVerified(true)
          setSecretUrl(process.env.NEXT_PUBLIC_SUCCESS_URL || 'https://example.com')
        }
      } catch (error) {
        console.error('Verification failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    verifySession()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-monokai-bg via-monokai-bg-light to-monokai-bg flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold gradient-text mb-2">
            Verifying Access...
          </h1>
          <p className="text-monokai-text-dim">
            Confirming your fairy deck mastery
          </p>
        </motion.div>
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-monokai-bg via-monokai-bg-light to-monokai-bg flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-monokai-red mb-4">
            Access Denied
          </h1>
          <p className="text-monokai-text mb-6">
            You must complete the fairy deck challenge to access this content.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-monokai-purple text-monokai-bg px-6 py-3 rounded-lg font-bold hover:bg-monokai-blue transition-colors"
          >
            Return to Challenge
          </button>
        </motion.div>
      </div>
    )
  }

  if (iframeError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-monokai-bg via-monokai-bg-light to-monokai-bg flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold gradient-text mb-4">
            Access Granted!
          </h1>
          <p className="text-monokai-text mb-6">
            Congratulations! You&apos;ve proven your fairy deck mastery.
          </p>
          <button
            onClick={() => window.open(secretUrl, '_blank')}
            className="bg-monokai-purple text-monokai-bg px-8 py-4 rounded-lg font-bold hover:bg-monokai-blue transition-colors text-lg"
          >
            Enter Secret Area 🚀
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-monokai-bg">
      {/* Compact header with navigation */}
      <div className="bg-gradient-to-r from-monokai-purple to-monokai-blue p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white">✨ Fairy Deck Master</span>
            <span className="text-xs text-monokai-text hidden sm:inline">Exclusive Content</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-monokai-bg/20 hover:bg-monokai-bg/40 text-white px-3 py-1 rounded text-sm transition-colors"
              title="Return to Puzzle"
            >
              🎮 Puzzle
            </button>
            <button
              onClick={() => window.close()}
              className="bg-monokai-bg/20 hover:bg-monokai-bg/40 text-white px-3 py-1 rounded text-sm transition-colors"
              title="Close Tab"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen iframe */}
      <iframe
        src={secretUrl}
        className="w-full border-0"
        style={{ height: 'calc(100vh - 48px)' }}
        title="Secret Content"
        onError={() => setIframeError(true)}
        onLoad={() => console.log('Content loaded successfully')}
      />
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-monokai-bg via-monokai-bg-light to-monokai-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold gradient-text">
            Loading...
          </h1>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}