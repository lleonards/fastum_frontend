import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const THEME_ICONS = { parchment: '📜', letter: '💌', gift: '🎁' }
const THEME_NAMES = { parchment: 'Pergaminho', letter: 'Carta', gift: 'Presente' }

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [copied, setCopied] = useState(null)

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Criador'

  useEffect(() => { fetchMessages() }, [user])

  const fetchMessages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setMessages(data || [])
    setLoading(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) {
      toast.error('Erro ao excluir mensagem')
    } else {
      toast.success('Mensagem excluída')
      setMessages(messages.filter(m => m.id !== id))
    }
    setDeleteId(null)
  }

  const copyLink = (slug) => {
    const url = `${window.location.origin}/m/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Link copiado! 🔗')
    setCopied(slug)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-mystical">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📜</span>
            <div>
              <h1 className="text-xl font-dancing text-amber-400 font-bold">MensagemMágica</h1>
              <p className="text-white/40 text-xs">Olá, {userName}! ✨</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/editor')}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <span>✏️</span> Nova Mensagem
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <span>🚪</span> Sair
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Mensagens Criadas', value: messages.length, icon: '💬' },
            { label: 'Pergaminhos', value: messages.filter(m => m.theme === 'parchment').length, icon: '📜' },
            { label: 'Cartas & Presentes', value: messages.filter(m => m.theme !== 'parchment').length, icon: '💌' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-amber-400 font-playfair">{stat.value}</div>
              <div className="text-white/50 text-xs mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mensagens */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-playfair text-white">Suas Mensagens</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/editor')}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm"
          >
            <span>+</span> Criar nova
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner" />
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-7xl mb-6">📝</div>
            <h3 className="text-xl font-playfair text-white/70 mb-3">Nenhuma mensagem ainda</h3>
            <p className="text-white/40 text-sm mb-8">
              Crie sua primeira mensagem animada e compartilhe com alguém especial
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/editor')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <span>✨</span> Criar Primeira Mensagem
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 flex flex-col gap-4 hover:border-amber-400/30 transition-all duration-300"
                >
                  {/* Header do card */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{THEME_ICONS[msg.theme] || '📜'}</span>
                      <div>
                        <p className="text-white font-semibold text-sm truncate max-w-[140px]">
                          {msg.title || 'Sem título'}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/20">
                          {THEME_NAMES[msg.theme] || msg.theme}
                        </span>
                      </div>
                    </div>
                    <div className="text-white/30 text-xs">
                      {new Date(msg.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {/* Preview do texto */}
                  <p className="text-white/50 text-xs leading-relaxed line-clamp-3">
                    {msg.message_text || 'Sem texto...'}
                  </p>

                  {/* Ações */}
                  <div className="flex gap-2 mt-auto">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/editor/${msg.id}`)}
                      className="flex-1 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs transition-all flex items-center justify-center gap-1"
                    >
                      ✏️ Editar
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyLink(msg.unique_slug)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-center gap-1
                        ${copied === msg.unique_slug
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 border border-amber-400/20'
                        }`}
                    >
                      {copied === msg.unique_slug ? '✓ Copiado!' : '🔗 Link'}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(`/m/${msg.unique_slug}`, '_blank')}
                      className="py-2 px-3 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/20 text-xs transition-all"
                    >
                      👁️
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteId(msg.id)}
                      className="py-2 px-3 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 text-xs transition-all"
                    >
                      🗑️
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Modal de confirmação de exclusão */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-5xl text-center mb-4">🗑️</div>
              <h3 className="text-xl font-playfair text-white text-center mb-2">Excluir Mensagem</h3>
              <p className="text-white/50 text-sm text-center mb-6">
                Esta ação é irreversível. O link de compartilhamento deixará de funcionar.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="btn-secondary flex-1 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
