import { Navigate } from 'react-router-dom'
// Google OAuth handles new account creation automatically — no separate register page needed
export default function Register() {
  return <Navigate to="/login" replace />
}
