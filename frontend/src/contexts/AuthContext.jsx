import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ id: "public-user" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Usuário público fixo (sem login)
    setUser({ id: "public-user" })
    setLoading(false)
  }, [])

  // Funções vazias para não quebrar o app
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
