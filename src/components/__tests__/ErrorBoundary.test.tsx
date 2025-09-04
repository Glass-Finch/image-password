import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GameErrorBoundary } from '../ErrorBoundary'

// Mock component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div data-testid="no-error">Component rendered without error</div>
}

// Mock component that works normally
const WorkingComponent = () => <div data-testid="working">Working component</div>

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

// Mock fetch for analytics
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
) as jest.Mock

// Suppress console.error in tests
const originalConsoleError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalConsoleError
})

describe('GameErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders children when there is no error', () => {
    render(
      <GameErrorBoundary>
        <WorkingComponent />
      </GameErrorBoundary>
    )
    
    expect(screen.getByTestId('working')).toBeInTheDocument()
  })

  test('renders error fallback when child component throws', () => {
    render(
      <GameErrorBoundary>
        <ThrowError />
      </GameErrorBoundary>
    )
    
    expect(screen.getByText('Game Error')).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
    expect(screen.getByText('🔄 Try Again')).toBeInTheDocument()
    expect(screen.getByText('🎮 Restart Game')).toBeInTheDocument()
  })

  test('shows error UI for any errors (simplified inline fallback)', () => {
    const NetworkError = () => {
      throw new Error('Failed to fetch data from server')
    }

    render(
      <GameErrorBoundary>
        <NetworkError />
      </GameErrorBoundary>
    )
    
    expect(screen.getByText('Game Error')).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
  })

  test('retry button exists and is clickable', () => {
    render(
      <GameErrorBoundary>
        <ThrowError />
      </GameErrorBoundary>
    )
    
    expect(screen.getByText('Game Error')).toBeInTheDocument()
    
    const retryButton = screen.getByText('🔄 Try Again')
    expect(retryButton).toBeInTheDocument()
    
    // Test that button is clickable (doesn't throw)
    fireEvent.click(retryButton)
    
    // The button should still be there after click (since component still throws)
    expect(screen.getByText('🔄 Try Again')).toBeInTheDocument()
  })

  test('sends error report to analytics', () => {
    render(
      <GameErrorBoundary>
        <ThrowError />
      </GameErrorBoundary>
    )
    
    // Should have attempted to send error to analytics
    expect(fetch).toHaveBeenCalledWith('/api/analytics', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('"type":"error"')
    }))
  })

  test('shows debug info in development mode', () => {
    // Mock NODE_ENV for this test
    const originalEnv = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      configurable: true
    })
    
    render(
      <GameErrorBoundary>
        <ThrowError />
      </GameErrorBoundary>
    )
    
    expect(screen.getByText('Technical Details')).toBeInTheDocument()
    
    // Restore original value
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      configurable: true
    })
  })

  test('handles custom fallback component', () => {
    const customFallback = (error: Error, retry: () => void) => (
      <div>
        <span>Custom error: {error.message}</span>
        <button onClick={retry}>Custom Retry</button>
      </div>
    )

    render(
      <GameErrorBoundary fallback={customFallback}>
        <ThrowError />
      </GameErrorBoundary>
    )
    
    expect(screen.getByText('Custom error: Test error message')).toBeInTheDocument()
    expect(screen.getByText('Custom Retry')).toBeInTheDocument()
  })
})