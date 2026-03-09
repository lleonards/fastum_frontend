import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Preencha todos os campos')
      return
    }
    if (form.password.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres')
      return
    }
    if (form.password !== form.confirm) {
      toast.error('As senhas não coincidem')
      return
    }
    setLoading(true)
    const { data, error } = await signUp(form.email, form.password, form.name)
    setLoading(false)
    if (error) {
      toast.error(error.message === 'User already registered'
        ? 'Este email já está cadastrado'
        : error.message)
    } else {
      if (data?.user && !data?.session) {
        toast.success('Conta criada! Verifique seu email para confirmar.')
        navigate('/login')
      } else {
        toast.success('Conta criada com sucesso! 🎉')
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen bg-mystical flex items-center justify-center p-4 relative overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            background: `rgba(200,120,180, ${Math.random() * 0.5 + 0.2})`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4 inline-block"
          >
            💌
          </motion.div>
          <h1 className="text-3xl font-dancing text-amber-400 font-bold mb-2">
            MensagemMágica
          </h1>
          <p className="text-white/50 text-sm">Crie sua conta gratuita</p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-playfair text-white mb-6 text-center">
            Criar Conta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Seu nome</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Maria Silva"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Senha</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Confirmar senha</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repita a senha"
                className="input-field"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <><div className="spinner !w-5 !h-5" /> Criando...</>
              ) : (
                <><span>🌟</span> Criar Conta Grátis</>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              Já tem conta?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors font-semibold">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
