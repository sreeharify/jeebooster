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
import RankPredictor from './pages/RankPredictor'
import NotificationToast from './components/NotificationToast'
import './index.css'

function Splash() {
  return (
    <div className="min-h-screen bg-lime-50 flex flex-col items-center justify-center dot-pattern">
      <div className="text-center animate-fade-in">
        <div className="text-7xl animate-bounce-slow mb-4">🚀</div>
        <p className="font-display text-3xl text-green-700 mb-2">JeeBooster</p>
        <p className="font-body text-green-400 font-semibold text-sm mb-6">Loading your progress…</p>
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2.5 h-2.5 bg-lime-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return <Splash />

  return (
    <>
      <NotificationToast />
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />

        {/* Protected — redirect to /login if not signed in */}
        <Route path="/"               element={user ? <Dashboard />      : <Navigate to="/login" replace />} />
        <Route path="/learn"          element={user ? <Learn />          : <Navigate to="/login" replace />} />
        <Route path="/lesson/:lessonId"     element={user ? <Lesson />         : <Navigate to="/login" replace />} />
        <Route path="/profile"        element={user ? <Profile />        : <Navigate to="/login" replace />} />
        <Route path="/leaderboard"    element={user ? <Leaderboard />    : <Navigate to="/login" replace />} />
        <Route path="/achievements"   element={user ? <Achievements />   : <Navigate to="/login" replace />} />
        <Route path="/mock-test"      element={user ? <MockTest />       : <Navigate to="/login" replace />} />
        <Route path="/rank-predictor" element={user ? <RankPredictor /> : <Navigate to="/login" replace />} />

        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
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
