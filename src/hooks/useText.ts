'use client'

import { useState, useEffect } from 'react'

interface TextConfig {
  game: {
    title: string
    subtitle: string
  }
  rounds: {
    types: string[]
    labels: {
      [key: string]: string
    }
    instructions: {
      [key: string]: string
    }
  }
  ui: {
    chooseItem: string
    referenceCollection: string
    collectionInstructions: string
    loadingMessage: string
    loadingImages: string
    loadingRoundChoices: string
    successHeader: string
    exclusiveContent: string
  }
  timer: {
    roundOf: string
    timeRunningOut: string
    hurryUp: string
  }
  buttons: {
    tryAgain: string
    studyUp: string
    returnToPuzzle: string
    closeTab: string
    enterSecretArea: string
    returnToChallenge: string
    reloadPage: string
  }
  messages: {
    success: string
    accessGranted: string
    accessDenied: string
    wrongChoice: string
    timeUp: string
    loadingError: string
    verifyingAccess: string
    welcomeExclusive: string
  }
  errors: {
    wrongChoiceMessage: string
    timeoutMessage: string
    mustComplete: string
    failedToLoad: string
    confirmingMastery: string
    congratulationsMessage: string
  }
  security: {
    securityNotice: string
    preventLookup: string
  }
  hints: {
    studyCollection: string
  }
  studyPhase: {
    title: string
    instructions: string
    tips: string[]
    buttonText: string
    loadingButton: string
    studyTip: string
  }
}

export function useText(language: string = 'en'): TextConfig | null {
  const [textData, setTextData] = useState<TextConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadText() {
      try {
        const response = await fetch(`/config/text/${language}.json`)
        if (response.ok) {
          const data = await response.json()
          setTextData(data)
        } else {
          console.error(`Failed to load text for language: ${language}`)
        }
      } catch (error) {
        console.error('Error loading text configuration:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadText()
  }, [language])

  return textData
}

export function formatText(template: string, variables: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key]?.toString() || match
  })
}