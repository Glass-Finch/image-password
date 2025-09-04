'use client'

import { useState } from 'react'

interface Props {
  className?: string
}

export function DevErrorTrigger({ className = '' }: Props) {
  const [shouldThrowError, setShouldThrowError] = useState(false)
  const [errorType, setErrorType] = useState<'generic' | 'network' | 'chunk'>('generic')

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const throwError = () => {
    setShouldThrowError(true)
  }

  const getErrorMessage = () => {
    switch (errorType) {
      case 'network':
        return 'Failed to fetch data from server'
      case 'chunk':
        return 'ChunkLoadError: Loading chunk 123 failed'
      default:
        return 'Test error for development purposes'
    }
  }

  // Throw error if triggered
  if (shouldThrowError) {
    throw new Error(getErrorMessage())
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 ${className}`}>
      <h3 className="font-bold mb-2">🧪 Dev Error Testing</h3>
      <div className="space-y-2">
        <select 
          value={errorType} 
          onChange={(e) => setErrorType(e.target.value as any)}
          className="w-full bg-red-700 text-white p-1 rounded text-sm"
        >
          <option value="generic">Generic Error</option>
          <option value="network">Network Error</option>
          <option value="chunk">Chunk Load Error</option>
        </select>
        
        <button
          onClick={throwError}
          className="w-full bg-red-800 hover:bg-red-900 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
        >
          💥 Trigger Error
        </button>
        
        <p className="text-xs opacity-75">
          This will test the error boundary
        </p>
      </div>
    </div>
  )
}