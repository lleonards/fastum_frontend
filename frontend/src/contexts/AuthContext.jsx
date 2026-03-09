import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

const PUBLIC_USER_ID = "00000000-0000-0000-0000-000000000000"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ id: PUBLIC_USER_ID })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUser({ id: PUBLIC_USER_ID })
    setLoading(false)
  }, [])

  const signUp = async () => {
    return { data: null, error: null }
  }

  const signIn = async () => {
    return { data: null, error: null }
  }

  const signOut = async () => {
    return
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
