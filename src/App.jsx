import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProgressProvider } from './contexts/ProgressContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Learn from './pages/Learn'
import Lesson from './pages/Lesson'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import Achievements from './pages/Achievements'
import MockTest from './pages/MockTest'
import Vocabulary from './pages/Vocabulary'
import WritingPractice from './pages/WritingPractice'
import SpeakingPractice from './pages/SpeakingPractice'
import GrammarDrills from './pages/GrammarDrills'
import ReadingPractice from './pages/ReadingPractice'
import BandEstimator from './pages/BandEstimator'
import NotificationToast from './components/NotificationToast'
import './index.css'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-lime-50 flex items-center justify-center dot-pattern">
      <div className="text-center animate-fade-in">
        <div className="text-7xl animate-bounce-slow mb-4">🌿</div>
        <p className="font-display text-2xl text-green-600 mb-2">IELTS Master</p>
        <p className="font-body text-green-400 font-semibold text-sm">Loading your progress...</p>
        {/* Animated dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-lime-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />

  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()

  // Show loading only on initial boot, not on every render
  if (loading) return <LoadingScreen />

  return (
    <>
      <NotificationToast />
      <Routes>
        {/* Public */}
        <Route path="/login"    element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

        {/* Protected */}
        <Route path="/"               element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/learn"          element={<ProtectedRoute><Learn /></ProtectedRoute>} />
        <Route path="/lesson/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
        <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/leaderboard"    element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/achievements"   element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
        <Route path="/mock-test"      element={<ProtectedRoute><MockTest /></ProtectedRoute>} />
        <Route path="/vocabulary"     element={<ProtectedRoute><Vocabulary /></ProtectedRoute>} />
        <Route path="/writing"        element={<ProtectedRoute><WritingPractice /></ProtectedRoute>} />
        <Route path="/speaking"       element={<ProtectedRoute><SpeakingPractice /></ProtectedRoute>} />
        <Route path="/grammar"        element={<ProtectedRoute><GrammarDrills /></ProtectedRoute>} />
        <Route path="/reading"        element={<ProtectedRoute><ReadingPractice /></ProtectedRoute>} />
        <Route path="/band-estimator" element={<ProtectedRoute><BandEstimator /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <AppRoutes />
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
