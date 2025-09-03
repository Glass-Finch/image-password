import { CollectionConfig } from '@/types/game'

export const DEFAULT_COLLECTION_CONFIG: CollectionConfig = {
  id: 'default',
  name: 'Image Knowledge Challenge',
  referenceItems: [
    'fairy-1', 'fairy-2', 'fairy-3', 'fairy-4', 'fairy-5',
    'fairy-6', 'fairy-7', 'fairy-8', 'fairy-9', 'fairy-10',
    'fairy-11', 'fairy-12', 'fairy-13', 'fairy-14', 'fairy-15'
  ],
  theme: {
    primary: '#ae81ff', // Monokai purple (primary)
    secondary: '#f92672', // Monokai red  
    accent: '#e6db74', // Monokai yellow
    backgroundGradient: ['#272822', '#3e3d32']
  },
  successMessage: 'Challenge Master! ✨',
  redirectUrl: 'DEFAULT_SUCCESS_URL'
}

export const COLLECTION_CONFIGS: Record<string, CollectionConfig> = {
  default: DEFAULT_COLLECTION_CONFIG
}

export const DEFAULT_COLLECTION = 'default'