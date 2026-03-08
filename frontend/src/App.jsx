import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import View from './pages/View'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-mystical flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4" />
        <p className="text-amber-400/70 text-sm">Carregando...</p>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-mystical flex items-center justify-center">
      <div className="spinner" />
    </div>
  )
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/editor" element={<PrivateRoute><Editor /></PrivateRoute>} />
      <Route path="/editor/:id" element={<PrivateRoute><Editor /></PrivateRoute>} />
      <Route path="/m/:slug" element={<View />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#e8e8e8',
              border: '1px solid rgba(200, 164, 90, 0.3)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#f59e0b', secondary: '#1a1a2e' }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#1a1a2e' }
            }
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
