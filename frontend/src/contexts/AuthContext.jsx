import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import supabase from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsub = null

    const init = async () => {
      setLoading(true)

      // 1) tenta recuperar sessão existente
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session?.user) {
        setUser(sessionData.session.user)
        setLoading(false)
      } else {
        // 2) se não houver sessão, cria uma identidade anônima (1 por navegador)
        const { data, error } = await supabase.auth.signInAnonymously()
        if (!error) setUser(data?.user || null)
        setLoading(false)
      }

      // 3) assina mudanças
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })
      unsub = listener?.subscription
    }

    init()

    return () => {
      if (unsub) unsub.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  // OBS: para manter acesso gratuito, ao sair nós criamos um NOVO usuário anônimo.
  // (isso “reseta” o histórico do navegador, como você queria)
  const signOut = async () => {
    await supabase.auth.signOut()
    const { data } = await supabase.auth.signInAnonymously()
    setUser(data?.user || null)
  }

  const isAnonymous = useMemo(() => {
    // Supabase marca usuários anônimos com is_anonymous (quando disponível)
    return !!user?.is_anonymous
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isAnonymous }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
