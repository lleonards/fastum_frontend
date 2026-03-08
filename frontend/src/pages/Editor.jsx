import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { nanoid } from 'nanoid'

// ====== CONSTANTS ======
const THEMES = [
  { id: 'parchment', name: 'Pergaminho', icon: '📜', desc: 'Clássico e elegante' },
  { id: 'letter', name: 'Carta', icon: '💌', desc: 'Romântico e delicado' },
  { id: 'gift', name: 'Presente', icon: '🎁', desc: 'Surpresa especial' },
]

const FONTS = [
  { value: '"Dancing Script", cursive', label: 'Dancing Script' },
  { value: '"Great Vibes", cursive', label: 'Great Vibes' },
  { value: 'Allura, cursive', label: 'Allura' },
  { value: '"Alex Brush", cursive', label: 'Alex Brush' },
  { value: 'Satisfy, cursive', label: 'Satisfy' },
  { value: 'Pacifico, cursive', label: 'Pacifico' },
  { value: 'Tangerine, cursive', label: 'Tangerine' },
  { value: '"Playfair Display", serif', label: 'Playfair Display' },
  { value: '"Cormorant Garamond", serif', label: 'Cormorant Garamond' },
  { value: '"Crimson Text", serif', label: 'Crimson Text' },
  { value: 'Lora, serif', label: 'Lora' },
  { value: '"EB Garamond", serif', label: 'EB Garamond' },
  { value: '"Libre Baskerville", serif', label: 'Libre Baskerville' },
  { value: 'Cinzel, serif', label: 'Cinzel' },
  { value: 'Raleway, sans-serif', label: 'Raleway' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: '"Josefin Sans", sans-serif', label: 'Josefin Sans' },
  { value: 'Ubuntu, sans-serif', label: 'Ubuntu' },
]

const PAPER_COLORS = [
  { value: 'parchment', label: 'Pergaminho', bg: 'linear-gradient(135deg,#f4e4c1,#dfc891)' },
  { value: 'ivory', label: 'Marfim', bg: 'linear-gradient(135deg,#fffff0,#fafaf0)' },
  { value: 'rose', label: 'Rosa', bg: 'linear-gradient(135deg,#fff0f5,#ffe0ec)' },
  { value: 'sky', label: 'Azul Céu', bg: 'linear-gradient(135deg,#f0f8ff,#e0f0ff)' },
  { value: 'mint', label: 'Menta', bg: 'linear-gradient(135deg,#f0fff5,#e0f5ea)' },
  { value: 'lavender', label: 'Lavanda', bg: 'linear-gradient(135deg,#f5f0ff,#ede0ff)' },
  { value: 'peach', label: 'Pêssego', bg: 'linear-gradient(135deg,#fff5f0,#ffe8d8)' },
  { value: 'gold', label: 'Dourado', bg: 'linear-gradient(135deg,#fffaed,#fff0c0)' },
  { value: 'white', label: 'Branco', bg: '#ffffff' },
  { value: 'cream', label: 'Creme', bg: 'linear-gradient(135deg,#fffdd0,#fff8b0)' },
]

const PAPER_DESIGNS = [
  { value: 'none', label: 'Sem desenho', icon: '⬜' },
  { value: 'roses', label: 'Rosas', icon: '🌹' },
  { value: 'hearts', label: 'Corações', icon: '💕' },
  { value: 'stars', label: 'Estrelas', icon: '⭐' },
  { value: 'leaves', label: 'Folhas', icon: '🍃' },
  { value: 'waves', label: 'Ondas', icon: '🌊' },
  { value: 'diamonds', label: 'Diamantes', icon: '💎' },
  { value: 'butterflies', label: 'Borboletas', icon: '🦋' },
  { value: 'snowflakes', label: 'Flocos de Neve', icon: '❄️' },
]

const TEXT_COLORS = [
  '#2c1810', '#4a3728', '#1a1a2e', '#2d0a1a', '#0a2d1a',
  '#8b4513', '#722f37', '#1e3a5f', '#2d4a1e', '#4a1e6e',
  '#c0392b', '#8e44ad', '#2980b9', '#27ae60', '#f39c12',
  '#ffffff', '#f5f5dc', '#ffe4e1', '#e0f0ff', '#e8f5e9',
]

const PAPER_BG_MAP = {
  parchment: 'linear-gradient(135deg,#f4e4c1 0%,#e8d5a3 25%,#dfc891 50%,#e8d5a3 75%,#f0e0b0 100%)',
  ivory: 'linear-gradient(135deg,#fffff0,#fafaf0)',
  rose: 'linear-gradient(135deg,#fff0f5,#ffe0ec)',
  sky: 'linear-gradient(135deg,#f0f8ff,#e0f0ff)',
  mint: 'linear-gradient(135deg,#f0fff5,#e0f5ea)',
  lavender: 'linear-gradient(135deg,#f5f0ff,#ede0ff)',
  peach: 'linear-gradient(135deg,#fff5f0,#ffe8d8)',
  gold: 'linear-gradient(135deg,#fffaed,#fff0c0)',
  white: '#ffffff',
  cream: 'linear-gradient(135deg,#fffdd0,#fff8b0)',
}

export default function Editor() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const fileInputRef = useRef(null)

  const [saving, setSaving] = useState(false)
  const [loadingData, setLoadingData] = useState(!!id)
  const [generatedLink, setGeneratedLink] = useState('')
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photos, setPhotos] = useState([])
  const [activeTab, setActiveTab] = useState('theme')

  const [form, setForm] = useState({
    title: '',
    theme: 'parchment',
    message_text: '',
    font_family: '"Dancing Script", cursive',
    font_size: 18,
    text_color: '#2c1810',
    paper_color: 'parchment',
    paper_design: 'none',
    ribbon_color: '#c0392b',
    envelope_color: '#d4a0b8',
    unique_slug: nanoid(10),
  })

  // Carrega dados se estiver editando
  useEffect(() => {
    if (id) {
      loadMessage()
    }
  }, [id])

  const loadMessage = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, message_photos(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      toast.error('Mensagem não encontrada')
      navigate('/dashboard')
      return
    }

    setForm({
      title: data.title || '',
      theme: data.theme || 'parchment',
      message_text: data.message_text || '',
      font_family: data.font_family || '"Dancing Script", cursive',
      font_size: data.font_size || 18,
      text_color: data.text_color || '#2c1810',
      paper_color: data.paper_color || 'parchment',
      paper_design: data.paper_design || 'none',
      ribbon_color: data.ribbon_color || '#c0392b',
      envelope_color: data.envelope_color || '#d4a0b8',
      unique_slug: data.unique_slug,
    })

    if (data.message_photos) {
      setPhotos(data.message_photos.map(p => ({ id: p.id, url: p.photo_url, name: '' })))
    }

    setLoadingData(false)
  }

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    if (photos.length + files.length > 20) {
      toast.error('Máximo de 20 fotos permitido')
      return
    }

    setUploadingPhoto(true)

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} é muito grande (máx 5MB)`)
        continue
      }

      const ext = file.name.split('.').pop()
      const fileName = `${user.id}/${nanoid()}.${ext}`

      const { data, error } = await supabase.storage
        .from('message-photos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (error) {
        toast.error(`Erro ao enviar ${file.name}`)
        continue
      }

      const { data: urlData } = supabase.storage
        .from('message-photos')
        .getPublicUrl(data.path)

      setPhotos(prev => [...prev, {
        id: nanoid(),
        url: urlData.publicUrl,
        name: file.name,
        path: data.path,
        isNew: true
      }])
    }

    setUploadingPhoto(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removePhoto = async (photo) => {
    if (photo.path) {
      await supabase.storage.from('message-photos').remove([photo.path])
    }
    if (!photo.isNew && photo.id) {
      await supabase.from('message_photos').delete().eq('id', photo.id)
    }
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
    toast.success('Foto removida')
  }

  const handleSave = async () => {
    if (!form.message_text.trim()) {
      toast.error('Escreva uma mensagem!')
      setActiveTab('text')
      return
    }
    if (!form.title.trim()) {
      toast.error('Dê um título à sua mensagem!')
      return
    }

    setSaving(true)

    try {
      let messageId = id
      const payload = {
        user_id: user.id,
        ...form,
        updated_at: new Date().toISOString(),
      }

      if (id) {
        const { error } = await supabase.from('messages').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('messages')
          .insert({ ...payload, created_at: new Date().toISOString() })
          .select()
          .single()
        if (error) throw error
        messageId = data.id
      }

      // Salva fotos novas
      const newPhotos = photos.filter(p => p.isNew)
      for (let i = 0; i < newPhotos.length; i++) {
        await supabase.from('message_photos').insert({
          message_id: messageId,
          photo_url: newPhotos[i].url,
          order_index: photos.indexOf(newPhotos[i]),
        })
      }

      const link = `${window.location.origin}/m/${form.unique_slug}`
      setGeneratedLink(link)
      setShowLinkModal(true)
      toast.success('Mensagem salva! 🎉')

    } catch (err) {
      toast.error('Erro ao salvar: ' + err.message)
    }

    setSaving(false)
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-mystical flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-white/50 text-sm">Carregando mensagem...</p>
        </div>
      </div>
    )
  }

  const paperBg = PAPER_BG_MAP[form.paper_color] || PAPER_BG_MAP.parchment
  const designClass = form.paper_design !== 'none' ? `design-${form.paper_design}` : ''

  const tabs = [
    { id: 'theme', label: 'Tema', icon: '🎨' },
    { id: 'text', label: 'Texto', icon: '✏️' },
    { id: 'style', label: 'Estilo', icon: '🖌️' },
    { id: 'photos', label: 'Fotos', icon: '📸' },
  ]

  return (
    <div className="min-h-screen bg-mystical">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-white/60 hover:text-white transition-colors">
              ← Voltar
            </button>
            <span className="text-white/30">|</span>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Título da mensagem..."
              className="bg-transparent border-none outline-none text-white font-playfair text-lg placeholder-white/30 w-48"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(`/m/${form.unique_slug}`, '_blank')}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              👁️ Preview
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              {saving ? <><div className="spinner !w-4 !h-4" /> Salvando...</> : <><span>🔗</span> Gerar Link</>}
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6 flex-col lg:flex-row">
        {/* Painel de Edição */}
        <div className="w-full lg:w-[420px] flex-shrink-0">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-5 border border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5
                  ${activeTab === tab.id
                    ? 'bg-amber-400 text-black shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* TAB: TEMA */}
            {activeTab === 'theme' && (
              <motion.div
                key="theme"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <h3 className="text-white/70 text-sm font-semibold uppercase tracking-wider">Escolha o Tema</h3>
                <div className="grid grid-cols-3 gap-3">
                  {THEMES.map(theme => (
                    <motion.button
                      key={theme.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setForm({ ...form, theme: theme.id })}
                      className={`theme-card py-4 px-2 ${form.theme === theme.id ? 'selected' : ''}`}
                    >
                      <span className="text-4xl">{theme.icon}</span>
                      <span className="text-white text-xs font-semibold">{theme.name}</span>
                      <span className="text-white/40 text-[10px] text-center">{theme.desc}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Cor do envelope/fita */}
                {form.theme === 'letter' && (
                  <div className="glass-card p-4">
                    <label className="text-white/70 text-sm block mb-3">Cor do Envelope</label>
                    <div className="flex gap-2 flex-wrap">
                      {['#d4a0b8', '#a0c4d4', '#b8d4a0', '#d4c4a0', '#c4a0d4', '#d4a0a0', '#a0a0d4'].map(c => (
                        <button
                          key={c}
                          onClick={() => setForm({ ...form, envelope_color: c })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${form.envelope_color === c ? 'border-amber-400 scale-110' : 'border-transparent'}`}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {form.theme === 'gift' && (
                  <div className="glass-card p-4">
                    <label className="text-white/70 text-sm block mb-3">Cor da Fita</label>
                    <div className="flex gap-2 flex-wrap">
                      {['#c0392b', '#8e44ad', '#2980b9', '#f39c12', '#27ae60', '#e91e8c', '#ff6b35'].map(c => (
                        <button
                          key={c}
                          onClick={() => setForm({ ...form, ribbon_color: c })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${form.ribbon_color === c ? 'border-amber-400 scale-110' : 'border-transparent'}`}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: TEXTO */}
            {activeTab === 'text' && (
              <motion.div
                key="text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="glass-card p-4">
                  <label className="text-white/70 text-sm block mb-2">Sua Mensagem *</label>
                  <textarea
                    value={form.message_text}
                    onChange={e => setForm({ ...form, message_text: e.target.value })}
                    placeholder="Escreva sua mensagem aqui... 💕"
                    rows={10}
                    className="input-field resize-none"
                    style={{ fontFamily: form.font_family, fontSize: `${form.font_size}px`, color: form.text_color }}
                  />
                  <div className="mt-2 text-white/30 text-xs text-right">
                    {form.message_text.length} caracteres
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: ESTILO */}
            {activeTab === 'style' && (
              <motion.div
                key="style"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {/* Fonte */}
                <div className="glass-card p-4">
                  <label className="text-white/70 text-sm block mb-3">Fonte do Texto</label>
                  <select
                    value={form.font_family}
                    onChange={e => setForm({ ...form, font_family: e.target.value })}
                    className="input-field"
                    style={{ fontFamily: form.font_family }}
                  >
                    {FONTS.map(f => (
                      <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <div
                    className="mt-3 p-3 rounded-lg bg-white/5 text-center text-lg"
                    style={{ fontFamily: form.font_family, color: form.text_color }}
                  >
                    Prévia da fonte ✨
                  </div>
                </div>

                {/* Tamanho */}
                <div className="glass-card p-4">
                  <label className="text-white/70 text-sm block mb-3">
                    Tamanho do Texto: <span className="text-amber-400">{form.font_size}px</span>
                  </label>
                  <input
                    type="range"
                    min={12}
                    max={36}
                    value={form.font_size}
                    onChange={e => setForm({ ...form, font_size: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Cor do texto */}
                <div className="glass-card p-4">
                  <label className="text-white/70 text-sm block mb-3">Cor do Texto</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {TEXT_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setForm({ ...form, text_color: c })}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${form.text_color === c ? 'border-amber-400 scale-125' : 'border-white/20 hover:scale-110'}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-white/50 text-xs">Custom:</label>
                    <input
                      type="color"
                      value={form.text_color}
                      onChange={e => setForm({ ...form, text_color: e.target.value })}
                      className="w-10 h-8 rounded cursor-pointer bg-transparent border border-white/20"
                    />
                    <span className="text-white/40 text-xs">{form.text_color}</span>
                  </div>
                </div>

                {/* Cor do papel */}
                <div className="glass-card p-4">
                  <label className="text-white/70 text-sm block mb-3">Cor do Papel</label>
                  <div className="grid grid-cols-5 gap-2">
                    {PAPER_COLORS.map(p => (
                      <button
                        key={p.value}
                        onClick={() => setForm({ ...form, paper_color: p.value })}
                        title={p.label}
                        className={`w-full aspect-square rounded-lg border-2 transition-all ${form.paper_color === p.value ? 'border-amber-400 scale-105' : 'border-white/20 hover:scale-105'}`}
                        style={{ background: p.bg }}
                      />
                    ))}
                  </div>
                </div>

                {/* Desenhos no papel */}
                <div className="glass-card p-4">
                  <label className="text-white/70 text-sm block mb-3">Desenhos no Papel</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PAPER_DESIGNS.map(d => (
                      <button
                        key={d.value}
                        onClick={() => setForm({ ...form, paper_design: d.value })}
                        className={`py-2 px-2 rounded-lg text-xs flex flex-col items-center gap-1 border transition-all
                          ${form.paper_design === d.value
                            ? 'border-amber-400 bg-amber-400/15 text-amber-400'
                            : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40'
                          }`}
                      >
                        <span className="text-lg">{d.icon}</span>
                        <span>{d.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: FOTOS */}
            {activeTab === 'photos' && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="glass-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white/70 text-sm">Galeria de Fotos</label>
                    <span className="text-white/40 text-xs">{photos.length}/20</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto || photos.length >= 20}
                    className="w-full py-8 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-amber-400/50 hover:bg-amber-400/5 transition-all cursor-pointer"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    {uploadingPhoto ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="spinner" />
                        <span className="text-white/50 text-sm">Enviando...</span>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-white/60 text-sm">Clique para adicionar fotos</p>
                        <p className="text-white/30 text-xs mt-1">JPG, PNG, WebP • Máx 5MB cada</p>
                      </div>
                    )}
                  </motion.button>

                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {photos.map((photo, i) => (
                        <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden">
                          <img
                            src={photo.url}
                            alt={`Foto ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => removePhoto(photo)}
                              className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg"
                            >
                              Remover
                            </button>
                          </div>
                          <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded">
                            {i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="glass-card p-4 text-center text-white/40 text-xs">
                  📌 As fotos aparecerão na galeria "Nossas Memórias" ao final da mensagem
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Preview em tempo real */}
        <div className="flex-1">
          <div className="sticky top-20">
            <h3 className="text-white/50 text-sm mb-4 text-center uppercase tracking-wider">
              ✨ Preview em Tempo Real
            </h3>

            <div className="flex items-center justify-center min-h-[600px] bg-black/20 rounded-2xl border border-white/10 p-6">
              <PreviewCard
                theme={form.theme}
                text={form.message_text || 'Sua mensagem aparecerá aqui...'}
                fontFamily={form.font_family}
                fontSize={form.font_size}
                textColor={form.text_color}
                paperBg={paperBg}
                designClass={designClass}
                ribbonColor={form.ribbon_color}
                envelopeColor={form.envelope_color}
                photosCount={photos.length}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Link Gerado */}
      <AnimatePresence>
        {showLinkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLinkModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: 2 }}
                className="text-6xl text-center mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-playfair text-amber-400 text-center mb-2">
                Mensagem Salva!
              </h3>
              <p className="text-white/60 text-sm text-center mb-6">
                Compartilhe este link com quem você ama
              </p>

              <div className="bg-white/10 rounded-xl p-4 mb-4 border border-white/20">
                <p className="text-amber-300 text-sm break-all font-mono">{generatedLink}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink)
                    toast.success('Link copiado! 🔗')
                  }}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  📋 Copiar Link
                </button>
                <button
                  onClick={() => window.open(generatedLink, '_blank')}
                  className="btn-secondary flex items-center justify-center gap-2 px-4"
                >
                  👁️
                </button>
              </div>

              <button
                onClick={() => { setShowLinkModal(false); navigate('/dashboard') }}
                className="mt-4 w-full text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                Ir ao Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ====== COMPONENTE DE PREVIEW ======
function PreviewCard({ theme, text, fontFamily, fontSize, textColor, paperBg, designClass, ribbonColor, envelopeColor, photosCount }) {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    setOpened(false)
    const timer = setTimeout(() => setOpened(true), 600)
    return () => clearTimeout(timer)
  }, [theme])

  if (theme === 'parchment') {
    return (
      <div className="w-full max-w-xs">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="closed"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setOpened(true)}
            >
              {/* Rolo superior */}
              <div className="w-full h-10 rounded-full scroll-roll flex items-center justify-center">
                <span className="text-amber-200/50 text-xs">── ✦ ──</span>
              </div>
              {/* Papel enrolado */}
              <div className="w-full bg-[#dfc891] rounded-sm py-3 px-4 text-center" style={{ minHeight: 80 }}>
                <div className="text-amber-800/50 text-xs">Clique para abrir...</div>
              </div>
              {/* Rolo inferior */}
              <div className="w-full h-10 rounded-full scroll-roll flex items-center justify-center">
                <span className="text-amber-200/50 text-xs">── ✦ ──</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="opened"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
            >
              <div className="w-full h-8 rounded-full scroll-roll" />
              <div
                className={`p-6 min-h-[250px] relative ${designClass}`}
                style={{ background: paperBg }}
              >
                <p style={{ fontFamily, fontSize: `${Math.max(fontSize - 4, 12)}px`, color: textColor, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                  {text}
                </p>
                {photosCount > 0 && (
                  <div className="mt-4 text-center">
                    <span className="text-xs px-3 py-1 rounded-full bg-black/10 text-amber-900/60">📸 {photosCount} fotos</span>
                  </div>
                )}
              </div>
              <div className="w-full h-8 rounded-full scroll-roll" />
            </motion.div>
          )}
        </AnimatePresence>
        {!opened && <p className="text-white/30 text-xs text-center mt-3">Clique no pergaminho para abrir</p>}
      </div>
    )
  }

  if (theme === 'letter') {
    return (
      <div className="w-full max-w-xs">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="env-closed"
              exit={{ opacity: 0 }}
              className="cursor-pointer"
              onClick={() => setOpened(true)}
              style={{ perspective: '1000px' }}
            >
              {/* Envelope fechado */}
              <div className="relative" style={{ background: envelopeColor, borderRadius: '8px', padding: '40px 20px', textAlign: 'center' }}>
                <div className="text-5xl">✉️</div>
                <p className="text-white/60 text-xs mt-3">Clique para abrir</p>
                {/* Aba do envelope */}
                <div
                  className="absolute top-0 left-0 right-0 h-20"
                  style={{
                    background: `linear-gradient(to bottom right, ${envelopeColor}, ${envelopeColor}dd)`,
                    clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
                    borderRadius: '8px 8px 0 0',
                  }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div key="letter-open" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Envelope com aba aberta */}
              <div className="relative mb-2" style={{ background: envelopeColor, borderRadius: '8px', padding: '8px 20px 20px', height: '80px' }}>
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: -150 }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-0 left-0 right-0 h-20 origin-top"
                  style={{
                    background: `linear-gradient(to bottom right, ${envelopeColor}cc, ${envelopeColor}88)`,
                    clipPath: 'polygon(0 0, 50% 70%, 100% 0)',
                  }}
                />
              </div>
              {/* Carta */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className={`p-5 rounded-lg shadow-xl ${designClass}`}
                style={{ background: paperBg, minHeight: '200px' }}
              >
                <p style={{ fontFamily, fontSize: `${Math.max(fontSize - 4, 12)}px`, color: textColor, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                  {text}
                </p>
                {photosCount > 0 && (
                  <div className="mt-3 text-center">
                    <span className="text-xs px-3 py-1 rounded-full bg-black/5">📸 {photosCount} fotos</span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {!opened && <p className="text-white/30 text-xs text-center mt-3">Clique no envelope para abrir</p>}
      </div>
    )
  }

  if (theme === 'gift') {
    return (
      <div className="w-full max-w-xs">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="gift-closed"
              exit={{ opacity: 0 }}
              className="cursor-pointer"
              onClick={() => setOpened(true)}
            >
              {/* Tampa */}
              <div className="relative rounded-t-lg py-5 px-6 text-center" style={{ background: '#c0392b' }}>
                {/* Fita horizontal */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                  <div className="w-full h-3" style={{ background: ribbonColor }} />
                </div>
                {/* Laço */}
                <div className="relative z-10 flex justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-4xl"
                  >
                    🎀
                  </motion.div>
                </div>
              </div>
              {/* Caixa */}
              <div className="rounded-b-lg py-8 px-6 text-center" style={{ background: '#e74c3c' }}>
                {/* Fita vertical */}
                <div className="absolute inset-0 flex justify-center pointer-events-none">
                  <div className="w-3 h-full" style={{ background: ribbonColor }} />
                </div>
                <p className="text-white/70 text-xs relative z-10">Clique para abrir!</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="gift-open">
              {/* Tampa voando */}
              <motion.div
                initial={{ y: 0, rotate: 0, opacity: 1 }}
                animate={{ y: -80, rotate: 15, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="rounded-t-lg py-5 px-6 text-center"
                style={{ background: '#c0392b' }}
              >
                <div className="flex items-center">
                  <div className="w-full h-3" style={{ background: ribbonColor }} />
                </div>
                <div className="text-3xl mt-1">🎀</div>
              </motion.div>

              {/* Conteúdo do presente */}
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{ transformOrigin: 'bottom' }}
              >
                <div
                  className={`p-5 rounded-b-lg shadow-xl ${designClass}`}
                  style={{ background: paperBg, minHeight: '220px' }}
                >
                  <p style={{ fontFamily, fontSize: `${Math.max(fontSize - 4, 12)}px`, color: textColor, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                    {text}
                  </p>
                  {photosCount > 0 && (
                    <div className="mt-3 text-center">
                      <span className="text-xs px-3 py-1 rounded-full bg-black/5">📸 {photosCount} fotos</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {!opened && <p className="text-white/30 text-xs text-center mt-3">Clique no presente para abrir</p>}
      </div>
    )
  }

  return null
}
