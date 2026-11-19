// Constantes compartilhadas entre Editor e View (fontes, papéis e desenhos).
// Mantê-las num só lugar garante que o preview do editor seja idêntico à página final.

// `adjust` compensa o tamanho visual: fontes cursivas/script têm x-height pequeno e
// parecem bem menores que as serifadas no mesmo font-size.
export const FONTS = [
  { value: '"Dancing Script", cursive', label: 'Dancing Script', family: 'Dancing Script', adjust: 1.05 },
  { value: '"Great Vibes", cursive', label: 'Great Vibes', family: 'Great Vibes', adjust: 1.2 },
  { value: 'Allura, cursive', label: 'Allura', family: 'Allura', adjust: 1.2 },
  { value: '"Alex Brush", cursive', label: 'Alex Brush', family: 'Alex Brush', adjust: 1.2 },
  { value: 'Satisfy, cursive', label: 'Satisfy', family: 'Satisfy', adjust: 1 },
  { value: 'Pacifico, cursive', label: 'Pacifico', family: 'Pacifico', adjust: 0.9 },
  { value: 'Tangerine, cursive', label: 'Tangerine', family: 'Tangerine', adjust: 1.45 },
  { value: '"Playfair Display", serif', label: 'Playfair Display', family: 'Playfair Display', adjust: 1 },
  { value: '"Cormorant Garamond", serif', label: 'Cormorant Garamond', family: 'Cormorant Garamond', adjust: 1.12 },
  { value: '"Crimson Text", serif', label: 'Crimson Text', family: 'Crimson Text', adjust: 1.05 },
  { value: 'Lora, serif', label: 'Lora', family: 'Lora', adjust: 1 },
  { value: '"EB Garamond", serif', label: 'EB Garamond', family: 'EB Garamond', adjust: 1.08 },
  { value: '"Libre Baskerville", serif', label: 'Libre Baskerville', family: 'Libre Baskerville', adjust: 0.92 },
  { value: 'Cinzel, serif', label: 'Cinzel', family: 'Cinzel', adjust: 0.92 },
  { value: 'Raleway, sans-serif', label: 'Raleway', family: 'Raleway', adjust: 1 },
  { value: 'Montserrat, sans-serif', label: 'Montserrat', family: 'Montserrat', adjust: 0.95 },
  { value: '"Josefin Sans", sans-serif', label: 'Josefin Sans', family: 'Josefin Sans', adjust: 1.05 },
  { value: 'Ubuntu, sans-serif', label: 'Ubuntu', family: 'Ubuntu', adjust: 0.98 },
]

export const DEFAULT_FONT = FONTS[0].value

// Tamanho final (px) aplicado ao texto, já compensado pela fonte escolhida.
export function getFontSize(fontFamily, size) {
  const f = FONTS.find(x => x.value === fontFamily)
  return Math.round((Number(size) || 18) * (f?.adjust || 1) * 10) / 10
}

// Pré-carrega uma (ou todas) as fontes e avisa quando terminar, para o React redesenhar o texto.
export function loadFonts(fonts = FONTS) {
  if (typeof document === 'undefined' || !document.fonts?.load) return Promise.resolve()
  return Promise.all(
    fonts.map(f =>
      Promise.all([
        document.fonts.load(`400 20px "${f.family}"`, 'Aa Ãç'),
        document.fonts.load(`700 20px "${f.family}"`, 'Aa Ãç'),
      ]).catch(() => {})
    )
  )
}

export const PAPER_COLORS = [
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

export const PAPER_BG_MAP = {
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

export const PAPER_DESIGNS = [
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

export const designClassFor = (design) =>
  design && design !== 'none' ? `design-${design}` : ''
