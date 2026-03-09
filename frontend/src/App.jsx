import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import View from './pages/View'
import Login from './pages/Login'
import Register from './pages/Register'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/editor/:id" element={<Editor />} />
      <Route path="/m/:slug" element={<View />} />

      {/* login/registro (opcional — para quem quiser salvar conta) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* página inicial */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* fallback */}
      <Route path="*" element={<div>Página não encontrada</div>} />
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
