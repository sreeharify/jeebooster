import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      // Supabase redirects the browser — nothing more needed here
    } catch (err) {
      setError(err.message || 'Could not sign in with Google')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-100 to-green-100 dot-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10 animate-pop">
          <div className="text-7xl mb-3">🌿</div>
          <h1 className="font-display text-5xl text-green-700">IELTSdua</h1>
          <p className="font-body font-semibold text-green-500 mt-2 text-lg">Your path to Band 9 🎯</p>
        </div>

        {/* Card */}
        <div className="card animate-slide-up text-center">
          <h2 className="font-display text-2xl text-green-800 mb-1">Welcome!</h2>
          <p className="text-green-500 font-semibold text-sm mb-7">Sign in to start learning</p>

          {error && (
            <div className="bg-red-100 border-2 border-red-300 text-red-700 rounded-2xl p-3 mb-5 text-sm font-semibold">
              😅 {error}
            </div>
          )}

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="text-xl animate-spin">🌀</span>
            ) : (
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="text-base">{loading ? 'Redirecting...' : 'Continue with Google'}</span>
          </button>

          <p className="text-xs text-gray-400 font-semibold mt-5">
            By signing in you agree to our terms. <br />
            New accounts are created automatically 🌱
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {['🎧 Listening', '👁️ Reading', '✍️ Writing', '🗣️ Speaking', '⚡ Grammar', '📊 Band Estimator'].map(f => (
            <span key={f} className="bg-white/70 border border-lime-300 text-green-700 font-bold text-xs px-3 py-1.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
