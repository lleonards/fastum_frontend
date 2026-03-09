import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Preencha todos os campos')
      return
    }
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Email ou senha incorretos'
        : error.message)
    } else {
      toast.success('Bem-vindo de volta! ✨')
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-mystical flex items-center justify-center p-4 relative overflow-hidden">
      {/* Particles de fundo */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            background: `rgba(${Math.random() > 0.5 ? '200,164,90' : '180,100,200'}, ${Math.random() * 0.5 + 0.2})`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-7xl mb-4 inline-block"
          >
            📜
          </motion.div>
          <h1 className="text-3xl font-dancing text-amber-400 font-bold mb-2">
            MensagemMágica
          </h1>
          <p className="text-white/50 text-sm">
            Crie momentos inesquecíveis
          </p>
        </div>

        {/* Card de Login */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-playfair text-white mb-6 text-center">
            Entrar na Conta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Senha</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <><div className="spinner !w-5 !h-5" /> Entrando...</>
              ) : (
                <><span>✨</span> Entrar</>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              Não tem conta?{' '}
              <Link to="/register" className="text-amber-400 hover:text-amber-300 transition-colors font-semibold">
                Criar agora
              </Link>
            </p>
          </div>
        </div>

        {/* Decoração */}
        <div className="text-center mt-6 text-white/30 text-xs">
          ✦ Compartilhe amor com animação ✦
        </div>
      </motion.div>
    </div>
  )
}
