import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(
  supabaseUrl   || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      // Store session in localStorage so it survives page refreshes
      persistSession: true,
      // Automatically refresh the access token before it expires
      autoRefreshToken: true,
      // Detect OAuth callback tokens in the URL hash/query string
      detectSessionInUrl: true,
      // Use pkce flow (more secure, required for Cloudflare Pages)
      flowType: 'pkce',
    },
  }
)
