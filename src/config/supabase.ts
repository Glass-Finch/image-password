import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have valid supabase config (not placeholder values)
const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('your-')
const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 10 && !supabaseAnonKey.includes('your-')

if (!isValidUrl || !isValidKey) {
  console.warn('Supabase environment variables missing or using placeholder values - analytics will be disabled')
}

export const supabase = (isValidUrl && isValidKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isAnalyticsEnabled = !!supabase