import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import fastumLogo from '../assets/fastum_logo.png'

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

// Geração de confetti
function createConfetti() {
  const colors = ['#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#3b82f6', '#ec4899', '#f97316']
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;'
  document.body.appendChild(container)

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div')
    const size = Math.random() * 10 + 6
    const color = colors[Math.floor(Math.random() * colors.length)]
    const left = Math.random() * 100
    const delay = Math.random() * 1.5
    const duration = Math.random() * 2 + 2
    const rotation = Math.random() * 720

    piece.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      background:${color};
      left:${left}%;top:-20px;
      border-radius:${Math.random() > 0.5 ? '50%' : '0'};
      animation:confettiFall ${duration}s ease-in ${delay}s forwards;
    `
    container.appendChild(piece)
  }

  setTimeout(() => container.remove(), 5000)
}

// Componente de typewriter
function TypewriterText({ text, fontFamily, fontSize, textColor, onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    indexRef.current = 0

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        clearInterval(interval)
        setDone(true)
        if (onDone) onDone()
      }
    }, 30)

    return () => clearInterval(interval)
  }, [text])

  return (
    <div
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        color: textColor,
        whiteSpace: 'pre-wrap',
        lineHeight: 1.9,
        minHeight: '120px',
      }}
    >
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{ color: textColor }}
        >
          |
        </motion.span>
      )}
    </div>
  )
}

// Galeria Modal
function GalleryModal({ photos, onClose }) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + photos.length) % photos.length)
  const next = () => setCurrent(i => (i + 1) % photos.length)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.97)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative w-full max-w-4xl mx-4 flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-4 px-2">
          <p className="text-white/50 text-sm font-dancing text-xl">
            Nossas Memórias ✨
          </p>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-sm">{current + 1} / {photos.length}</span>
            <button onClick={onClose} className="text-white/60 hover:text-white text-2xl transition-colors">✕</button>
          </div>
        </div>

        {/* Imagem principal */}
        <div className="relative w-full flex items-center justify-center" style={{ maxHeight: '70vh' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={photos[current]?.photo_url}
              alt={`Memória ${current + 1}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-2xl"
              style={{ border: '2px solid rgba(255,255,255,0.1)' }}
            />
          </AnimatePresence>

          {/* Botões de navegação */}
          {photos.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prev}
                className="absolute left-2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white text-xl flex items-center justify-center border border-white/20 backdrop-blur-sm"
              >
                ‹
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={next}
                className="absolute right-2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white text-xl flex items-center justify-center border border-white/20 backdrop-blur-sm"
              >
                ›
              </motion.button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 max-w-full px-2">
            {photos.map((photo, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrent(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                  ${i === current ? 'border-amber-400 opacity-100' : 'border-white/20 opacity-50 hover:opacity-80'}`}
              >
                <img src={photo.photo_url} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ====== TEMA PERGAMINHO ======
function ParchmentView({ message, photos, onShowGallery }) {
  const [phase, setPhase] = useState('idle') // idle | unrolling | text | done
  const paperBg = PAPER_BG_MAP[message.paper_color] || PAPER_BG_MAP.parchment
  const designClass = message.paper_design !== 'none' ? `design-${message.paper_design}` : ''

  const handleOpen = () => {
    if (phase !== 'idle') return
    setPhase('unrolling')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: 'linear-gradient(135deg,#1a1200 0%,#2d1f00 50%,#1a1200 100%)' }}>

      {/* Partículas douradas */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            background: `rgba(200,164,90,${Math.random() * 0.5 + 0.2})`,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="cursor-pointer"
              onClick={handleOpen}
            >
              {/* Pergaminho enrolado */}
              <div className="relative inline-block">
                {/* Rolo */}
                <div
                  className="w-64 h-14 rounded-full mx-auto shadow-2xl"
                  style={{
                    background: 'radial-gradient(ellipse at 30% 40%, #d4a85a 0%, #8b6914 100%)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.15)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-amber-200/60 text-sm tracking-widest">── ✦ ──</span>
                  </div>
                </div>
                {/* Papel enrolado (centro) */}
                <div
                  className="w-56 mx-auto py-6"
                  style={{ background: 'linear-gradient(to bottom, #dfc891, #d4b870, #dfc891)', marginTop: -4, marginBottom: -4 }}
                />
                {/* Rolo inferior */}
                <div
                  className="w-64 h-14 rounded-full mx-auto shadow-2xl"
                  style={{
                    background: 'radial-gradient(ellipse at 30% 40%, #d4a85a 0%, #8b6914 100%)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.15)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-amber-200/60 text-sm tracking-widest">── ✦ ──</span>
                  </div>
                </div>
              </div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-amber-400/80 mt-8 text-sm tracking-wider"
              >
                ✦ Toque para abrir ✦
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {phase === 'unrolling' && (
          <motion.div
            key="unrolling"
            initial={{ opacity: 1 }}
            className="w-full max-w-2xl"
          >
            {/* Rolo superior */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full h-14 rounded-full mx-auto"
              style={{
                background: 'radial-gradient(ellipse at 30% 40%, #d4a85a 0%, #8b6914 100%)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            />

            {/* Papel se abrindo */}
            <motion.div
              initial={{ scaleY: 0.05, opacity: 0.5 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
              onAnimationComplete={() => setPhase('text')}
            >
              <div
                className={`px-8 py-10 ${designClass}`}
                style={{ background: paperBg, minHeight: '200px' }}
              />
            </motion.div>

            {/* Rolo inferior */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full h-14 rounded-full mx-auto"
              style={{
                background: 'radial-gradient(ellipse at 30% 40%, #d4a85a 0%, #8b6914 100%)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            />
          </motion.div>
        )}

        {(phase === 'text' || phase === 'done') && (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl"
          >
            {/* Rolo superior */}
            <div
              className="w-full h-14 rounded-full"
              style={{
                background: 'radial-gradient(ellipse at 30% 40%, #d4a85a 0%, #8b6914 100%)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.15)',
              }}
            />

            {/* Conteúdo do pergaminho */}
            <div
              className={`relative px-8 sm:px-12 py-10 ${designClass}`}
              style={{ background: paperBg, boxShadow: 'inset 0 0 40px rgba(139,90,43,0.15)' }}
            >
              {/* Decoração de bordas */}
              <div className="absolute top-4 left-4 text-amber-800/20 text-2xl">✦</div>
              <div className="absolute top-4 right-4 text-amber-800/20 text-2xl">✦</div>
              <div className="absolute bottom-4 left-4 text-amber-800/20 text-2xl">✦</div>
              <div className="absolute bottom-4 right-4 text-amber-800/20 text-2xl">✦</div>

              <TypewriterText
                text={message.message_text}
                fontFamily={message.font_family}
                fontSize={message.font_size}
                textColor={message.text_color}
                onDone={() => setPhase('done')}
              />

              {/* Botão de galeria */}
              {phase === 'done' && photos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-10 flex justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onShowGallery}
                    className="group flex items-center gap-2 px-6 py-3 rounded-full border border-amber-800/30 bg-amber-900/10 hover:bg-amber-900/20 transition-all"
                  >
                    <span className="text-lg">📸</span>
                    <span style={{ fontFamily: '"Dancing Script", cursive', fontSize: '18px', color: message.text_color || '#5a3e28' }}>
                      Nossas Memórias
                    </span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-amber-700/60"
                    >
                      →
                    </motion.span>
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Rolo inferior */}
            <div
              className="w-full h-14 rounded-full"
              style={{
                background: 'radial-gradient(ellipse at 30% 40%, #d4a85a 0%, #8b6914 100%)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.15)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ====== TEMA CARTA ======
function LetterView({ message, photos, onShowGallery }) {
  const [phase, setPhase] = useState('idle')
  const paperBg = PAPER_BG_MAP[message.paper_color] || '#ffffff'
  const designClass = message.paper_design !== 'none' ? `design-${message.paper_design}` : ''
  const envColor = message.envelope_color || '#d4a0b8'

  const handleOpen = () => { if (phase === 'idle') setPhase('opening') }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: 'linear-gradient(135deg,#1a0a0f 0%,#2d0a1f 50%,#1a0a1f 100%)' }}>

      {/* Partículas rosas */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 10 + 8}px`,
          }}
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.7, 0.2], rotate: [0, 20, 0] }}
          transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 3 }}
        >
          {['✿', '♥', '❧', '✦', '❀'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="cursor-pointer"
            onClick={handleOpen}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
              style={{ width: 'min(280px, 90vw)' }}
            >
              {/* Envelope */}
              <div
                className="relative rounded-lg overflow-hidden shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${envColor} 0%, ${envColor}dd 100%)`,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${envColor}40`,
                }}
              >
                {/* Aba V */}
                <svg viewBox="0 0 280 120" style={{ display: 'block', width: '100%', height: '120px' }}>
                  <polygon points="0,0 140,90 280,0" fill={envColor} />
                  <polygon points="0,0 140,90 280,0" fill="rgba(255,255,255,0.1)" />
                </svg>

                {/* Corpo do envelope */}
                <div className="px-6 py-8 flex flex-col items-center gap-3" style={{ minHeight: 160 }}>
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <span className="text-5xl">💌</span>
                  </motion.div>
                  {/* Linhas decorativas */}
                  <div className="w-full space-y-2">
                    {[0.6, 0.4, 0.5].map((opacity, i) => (
                      <div key={i} className="h-0.5 rounded" style={{ background: `rgba(255,255,255,${opacity})`, width: `${[80, 60, 70][i]}%`, margin: '0 auto' }} />
                    ))}
                  </div>
                  {/* Lacre */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg mt-2" style={{ background: `${envColor}aa`, border: `2px solid rgba(255,255,255,0.3)` }}>
                    <span className="text-lg">♥</span>
                  </div>
                </div>

                {/* Base V */}
                <svg viewBox="0 0 280 80" style={{ display: 'block', width: '100%', height: '80px', marginTop: -2 }}>
                  <polygon points="0,80 140,0 280,80" fill={`${envColor}dd`} />
                </svg>
              </div>

              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center mt-5 text-sm tracking-wider"
                style={{ color: envColor }}
              >
                ♥ Toque para abrir ♥
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {phase === 'opening' && (
          <motion.div key="opening" className="relative" style={{ width: '100%', maxWidth: 'min(520px, 95vw)' }}>
            {/* Envelope de baixo */}
            <div
              className="relative rounded-b-lg mx-auto"
              style={{ background: envColor, height: 220, maxWidth: 'min(420px, 95vw)' }}
            >
              <svg viewBox="0 0 280 80" style={{ display: 'block', width: '100%', marginTop: -1 }}>
                <polygon points="0,80 140,0 280,80" fill={envColor} />
              </svg>
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)' }}
              />
            </div>

            {/* Aba abrindo */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -180 }}
              transition={{ duration: 0.7 }}
              style={{ transformOrigin: 'top', position: 'absolute', top: 0, left: 0, right: 0, height: 120, zIndex: 5 }}
              onAnimationComplete={() => setPhase('letter')}
            >
              <svg viewBox="0 0 420 140" style={{ width: '100%', height: 140 }}>
                <polygon points="0,0 210,120 420,0" fill={envColor} />
                <polygon points="0,0 210,120 420,0" fill="rgba(255,255,255,0.15)" />
              </svg>
            </motion.div>

            {/* Carta saindo */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: -40, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute left-4 right-4 top-4 rounded-lg shadow-2xl"
              style={{ background: paperBg, zIndex: 3, padding: '20px', height: 160 }}
            />
          </motion.div>
        )}

        {phase === 'letter' && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            {/* Envelope aberto (parte inferior) */}
            <div
              className="w-full h-6 rounded-b-xl mx-auto"
              style={{ background: envColor, maxWidth: 560, boxShadow: `0 4px 20px ${envColor}40` }}
            />

            {/* Carta */}
            <div
              className={`relative mx-auto rounded-t-lg shadow-2xl px-8 sm:px-12 py-10 ${designClass}`}
              style={{
                background: paperBg,
                maxWidth: 560,
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              {/* Decorações da carta */}
              <div className="absolute top-4 left-0 right-0 flex justify-center gap-2 text-xs opacity-30">
                {['✿', '♥', '✿'].map((s, i) => <span key={i} style={{ color: message.text_color }}>{s}</span>)}
              </div>

              <div className="pt-4">
                <TypewriterText
                  text={message.message_text}
                  fontFamily={message.font_family}
                  fontSize={message.font_size}
                  textColor={message.text_color}
                  onDone={() => {}}
                />
              </div>

              {/* Botão galeria */}
              {photos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="mt-10 flex justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onShowGallery}
                    className="flex items-center gap-2 px-6 py-3 rounded-full transition-all"
                    style={{
                      border: `1px solid ${message.text_color}30`,
                      background: `${message.text_color}08`,
                    }}
                  >
                    <span className="text-lg">📸</span>
                    <span style={{ fontFamily: '"Dancing Script", cursive', fontSize: '18px', color: message.text_color }}>
                      Nossas Memórias
                    </span>
                  </motion.button>
                </motion.div>
              )}

              {/* Assinatura decorativa */}
              <div className="mt-8 text-right opacity-30">
                <span style={{ fontFamily: '"Dancing Script", cursive', color: message.text_color }}>♥</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper para ajustar brilho de cor hex
function adjustColor(hex, amount) {
  const clean = hex.replace('#', '')
  const num = parseInt(clean.length === 3
    ? clean.split('').map(c => c+c).join('')
    : clean, 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}

// ====== TEMA PRESENTE ======
function GiftView({ message, photos, onShowGallery }) {
  const [phase, setPhase] = useState('idle')
  const paperBg = PAPER_BG_MAP[message.paper_color] || '#ffffff'
  const designClass = message.paper_design !== 'none' ? `design-${message.paper_design}` : ''
  const ribColor = message.ribbon_color || '#c0392b'
  const boxColor = message.box_color || '#c0392b'

  const handleOpen = () => {
    if (phase === 'idle') {
      setPhase('shaking')
      createConfetti()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: 'linear-gradient(135deg,#0a0015 0%,#1a0030 50%,#0f0025 100%)' }}>

      {/* Estrelas */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none text-yellow-300"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, fontSize: `${Math.random() * 12 + 6}px`, opacity: Math.random() * 0.6 + 0.1 }}
          animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 3 }}
        >
          ✦
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="gift-idle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="cursor-pointer"
            onClick={handleOpen}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Caixa do presente */}
              <div style={{ width: 'min(260px, 90vw)', margin: '0 auto' }}>
                {/* Tampa com laço */}
                <div
                  className="relative rounded-t-2xl py-8 px-6"
                  style={{
                    background: `linear-gradient(135deg, ${adjustColor(boxColor, 20)} 0%, ${adjustColor(boxColor, 50)} 100%)`,
                    boxShadow: '0 -5px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Fita horizontal na tampa */}
                  <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                    <div className="w-full h-4 opacity-90" style={{ background: ribColor }} />
                  </div>
                  {/* Fita vertical na tampa */}
                  <div className="absolute inset-0 flex justify-center">
                    <div className="w-4 h-full opacity-90" style={{ background: ribColor }} />
                  </div>
                  {/* Laço */}
                  <div className="relative z-10 flex justify-center">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg width="80" height="60" viewBox="0 0 80 60">
                        {/* Laço esquerdo */}
                        <ellipse cx="20" cy="30" rx="18" ry="12" fill={ribColor} opacity="0.9" transform="rotate(-20 20 30)" />
                        <ellipse cx="60" cy="30" rx="18" ry="12" fill={ribColor} opacity="0.9" transform="rotate(20 60 30)" />
                        {/* Centro do laço */}
                        <ellipse cx="40" cy="30" rx="8" ry="8" fill={ribColor} />
                        <ellipse cx="40" cy="30" rx="5" ry="5" fill="rgba(255,255,255,0.3)" />
                        {/* Fitas caindo */}
                        <path d="M35 36 Q30 50 25 58" stroke={ribColor} strokeWidth="4" fill="none" strokeLinecap="round" />
                        <path d="M45 36 Q50 50 55 58" stroke={ribColor} strokeWidth="4" fill="none" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Corpo da caixa */}
                <div
                  className="relative rounded-b-2xl py-10 px-6"
                  style={{
                    background: `linear-gradient(135deg, ${adjustColor(boxColor, -20)} 0%, ${boxColor} 100%)`,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Fita vertical no corpo */}
                  <div className="absolute inset-0 flex justify-center">
                    <div className="w-4 h-full opacity-80" style={{ background: ribColor }} />
                  </div>
                  {/* Reflexo da caixa */}
                  <div className="absolute top-0 left-0 right-0 h-12 rounded-b-none opacity-20"
                    style={{ background: 'linear-gradient(to bottom, white, transparent)' }} />

                  {/* Texto decorativo */}
                  <div className="relative z-10 text-center">
                    <motion.p
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-white/80 text-xs font-light tracking-widest"
                    >
                      🎁 Para você
                    </motion.p>
                  </div>
                </div>
              </div>

              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center mt-6 text-purple-300/80 text-sm tracking-wider"
              >
                ✦ Toque para abrir ✦
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {phase === 'shaking' && (
          <motion.div
            key="shaking"
            animate={{ x: [-8, 8, -6, 6, -4, 4, 0], rotate: [-3, 3, -2, 2, 0] }}
            transition={{ duration: 0.6 }}
            onAnimationComplete={() => setPhase('opening')}
            style={{ width: 'min(260px, 90vw)', margin: '0 auto' }}
          >
            <div className="relative rounded-t-2xl py-8 px-6" style={{ background: `linear-gradient(135deg, ${adjustColor(boxColor, 20)}, ${adjustColor(boxColor, 50)})` }}>
              <div className="absolute inset-0 flex justify-center"><div className="w-4 h-full opacity-90" style={{ background: ribColor }} /></div>
              <div className="absolute inset-y-0 left-0 right-0 flex items-center"><div className="w-full h-4 opacity-90" style={{ background: ribColor }} /></div>
              <div className="relative z-10 text-center text-4xl">🎀</div>
            </div>
            <div className="rounded-b-2xl py-10" style={{ background: `linear-gradient(135deg, ${adjustColor(boxColor, -20)}, ${boxColor})` }}>
              <div className="absolute inset-0 flex justify-center"><div className="w-4 h-full opacity-80" style={{ background: ribColor }} /></div>
            </div>
          </motion.div>
        )}

        {phase === 'opening' && (
          <motion.div key="opening" style={{ width: '100%', maxWidth: 'min(400px, 95vw)' }} className="mx-auto">
            {/* Tampa voando */}
            <motion.div
              initial={{ y: 0, rotate: 0, x: 0 }}
              animate={{ y: -200, rotate: 25, x: 60, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative rounded-2xl py-6 px-6 mx-auto"
              style={{ background: `linear-gradient(135deg, ${adjustColor(boxColor, 20)}, ${adjustColor(boxColor, 50)})`, maxWidth: 'min(260px, 90vw)' }}
            >
              <div className="text-center text-4xl">🎀</div>
            </motion.div>

            {/* Conteúdo saindo */}
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              style={{ transformOrigin: 'bottom' }}
              onAnimationComplete={() => setPhase('message')}
            >
              <div
                className={`mx-auto rounded-2xl px-8 py-8 ${designClass}`}
                style={{ background: paperBg, minHeight: 200 }}
              />
            </motion.div>
          </motion.div>
        )}

        {phase === 'message' && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
          >
            {/* Caixa de conteúdo */}
            <div
              className={`relative rounded-2xl px-8 sm:px-12 py-12 ${designClass}`}
              style={{
                background: paperBg,
                boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                border: `3px solid ${ribColor}40`,
              }}
            >
              {/* Fita decorativa no topo */}
              <div
                className="absolute -top-1 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: ribColor }}
              />

              {/* Estrelas decorativas */}
              <div className="absolute top-4 left-6 right-6 flex justify-between opacity-20">
                {['✦', '⋆', '✦'].map((s, i) => <span key={i} style={{ color: message.text_color, fontSize: 12 }}>{s}</span>)}
              </div>

              <div className="pt-2">
                <TypewriterText
                  text={message.message_text}
                  fontFamily={message.font_family}
                  fontSize={message.font_size}
                  textColor={message.text_color}
                  onDone={() => {}}
                />
              </div>

              {/* Botão galeria */}
              {photos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="mt-10 flex justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onShowGallery}
                    className="flex items-center gap-2 px-6 py-3 rounded-full transition-all"
                    style={{ border: `1px solid ${ribColor}40`, background: `${ribColor}10` }}
                  >
                    <span className="text-lg">📸</span>
                    <span style={{ fontFamily: '"Dancing Script", cursive', fontSize: '18px', color: message.text_color }}>
                      Nossas Memórias
                    </span>
                  </motion.button>
                </motion.div>
              )}

              {/* Fita decorativa na base */}
              <div
                className="absolute -bottom-1 left-0 right-0 h-1 rounded-b-2xl"
                style={{ background: ribColor }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ====== PÁGINA VIEW PRINCIPAL ======
export default function View() {
  const { slug } = useParams()
  const [message, setMessage] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showGallery, setShowGallery] = useState(false)

  useEffect(() => {
    fetchMessage()
  }, [slug])

  const fetchMessage = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_message_by_slug', { p_slug: slug })

      if (error || !data?.message) {
        setError('Mensagem não encontrada ou link inválido.')
        setLoading(false)
        return
      }

      setMessage(data.message)
      const sortedPhotos = (data.photos || []).sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
      setPhotos(sortedPhotos)
      setLoading(false)
    } catch (err) {
      setError('Erro ao carregar mensagem.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mystical flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-5xl mb-6 inline-block"
          >
            ✦
          </motion.div>
          <p className="text-amber-400/70 text-lg font-dancing">Preparando sua surpresa...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-mystical flex items-center justify-center">
        <div className="text-center glass-card p-10 max-w-sm mx-4">
          <div className="text-5xl mb-4">💔</div>
          <h2 className="text-2xl font-playfair text-white mb-3">Ops!</h2>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {message.theme === 'parchment' && (
        <ParchmentView message={message} photos={photos} onShowGallery={() => setShowGallery(true)} />
      )}
      {message.theme === 'letter' && (
        <LetterView message={message} photos={photos} onShowGallery={() => setShowGallery(true)} />
      )}
      {message.theme === 'gift' && (
        <GiftView message={message} photos={photos} onShowGallery={() => setShowGallery(true)} />
      )}

      {/* Rodapé discreto */}
      <div className="fixed bottom-3 right-4 pointer-events-none opacity-25">
        <img src={fastumLogo} alt="Fastum" className="h-5 w-auto" />
      </div>

      {/* Modal de galeria */}
      <AnimatePresence>
        {showGallery && photos.length > 0 && (
          <GalleryModal photos={photos} onClose={() => setShowGallery(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
