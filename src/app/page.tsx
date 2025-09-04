'use client'

import { Suspense } from 'react'
import GameBoard from '@/components/game/GameBoard'
import { GameProvider } from '@/components/providers/GameProvider'
import { GameErrorBoundary } from '@/components/ErrorBoundary'

export default function HomePage() {
  return (
    <GameProvider>
      <GameErrorBoundary>
        <main className="min-h-screen bg-gradient-to-br from-monokai-bg via-monokai-bg-light to-monokai-bg">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-monokai-text text-xl">Loading magical challenge...</div>
            </div>
          }>
            <GameBoard />
          </Suspense>
        </main>
      </GameErrorBoundary>
    </GameProvider>
  )
}