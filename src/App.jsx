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

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-lime-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl animate-bounce-slow mb-4">🌿</div>
        <p className="font-display text-2xl text-green-600">Loading...</p>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <>
      <NotificationToast />
      <Routes>
        <Route path="/login"    element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
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
        <Route path="*" element={<Navigate to="/" />} />
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
