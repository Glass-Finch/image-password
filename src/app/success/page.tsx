'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useText } from '@/hooks/useText'
import { GameErrorBoundary } from '@/components/ErrorBoundary'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session')
  const text = useText()
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
            {text?.messages.verifyingAccess || 'Verifying Access...'}
          </h1>
          <p className="text-monokai-text-dim">
            {text?.errors.confirmingMastery || 'Confirming your mastery'}
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
            {text?.messages.accessDenied || 'Access Denied'}
          </h1>
          <p className="text-monokai-text mb-6">
            {text?.errors.mustComplete || 'You must complete the challenge to access this content.'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-monokai-purple text-monokai-bg px-6 py-3 rounded-lg font-bold hover:bg-monokai-blue transition-colors"
          >
            {text?.buttons.returnToChallenge || 'Return to Challenge'}
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
            {text?.messages.accessGranted || 'Access Granted!'}
          </h1>
          <p className="text-monokai-text mb-6">
            {text?.errors.congratulationsMessage || 'Congratulations! You\'ve proven your mastery.'}
          </p>
          <button
            onClick={() => window.open(secretUrl, '_blank')}
            className="bg-monokai-purple text-monokai-bg px-8 py-4 rounded-lg font-bold hover:bg-monokai-blue transition-colors text-lg"
          >
            {text?.buttons.enterSecretArea || 'Enter Secret Area 🚀'}
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
            <span className="text-lg font-bold text-white">{text?.ui.successHeader || '✨ Challenge Master'}</span>
            <span className="text-xs text-monokai-text hidden sm:inline">{text?.ui.exclusiveContent || 'Exclusive Content'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-monokai-bg/20 hover:bg-monokai-bg/40 text-white px-3 py-1 rounded text-sm transition-colors"
              title="Return to Puzzle"
            >
              {text?.buttons.returnToPuzzle || '🎮 Puzzle'}
            </button>
            <button
              onClick={() => window.close()}
              className="bg-monokai-bg/20 hover:bg-monokai-bg/40 text-white px-3 py-1 rounded text-sm transition-colors"
              title="Close Tab"
            >
              {text?.buttons.closeTab || '✕ Close'}
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
        onLoad={() => {}}
      />
    </div>
  )
}

export default function SuccessPage() {
  return (
    <GameErrorBoundary>
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
    </GameErrorBoundary>
  )
}