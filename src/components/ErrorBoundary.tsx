'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Simple logging
    console.error('Game Error:', error, errorInfo)
    
    // Send to analytics if available (simple approach)
    try {
      // Try to send to our analytics endpoint
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'error',
          payload: {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href
          }
        })
      }).catch(() => {
        // Silently fail if analytics not available
        console.warn('Failed to send error to analytics')
      })
    } catch (analyticsError) {
      // Ignore analytics errors to prevent error boundary loops
      console.warn('Analytics error reporting failed:', analyticsError)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.handleRetry)
      }
      
      // Safe inline fallback to avoid circular dependencies
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: 'linear-gradient(135deg, #2d3748 0%, #1a1a1a 100%)'
        }}>
          <div style={{
            backgroundColor: '#333',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            textAlign: 'center',
            color: '#fff',
            border: '1px solid #555'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              color: '#fff'
            }}>
              Game Error
            </h2>
            <p style={{ 
              marginBottom: '1.5rem', 
              color: '#ccc',
              lineHeight: '1.5'
            }}>
              Something went wrong. Don&apos;t worry, you can try again!
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={this.handleRetry}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                🔄 Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
              >
                🎮 Restart Game
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '1rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#3b82f6' }}>
                  Technical Details
                </summary>
                <pre style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  color: '#ccc'
                }}>
                  {this.state.error?.message || 'Unknown error'}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}