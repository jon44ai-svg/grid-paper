export type CursorStyle = 'none' | 'block' | 'pipe' | 'underscore'

export type CanvasSize = {
  width: number
  height: number
}

export type GeneratorSettings = {
  text: string
  fontFamily: string
  textColor: string
  fontSize: number
  letterSpacing: number
  gridSize: number
  lineWidth: number
  gridColor: string
  paperBg: string
  roughGrid: boolean
  alignGrid: boolean
  typeSpeed: number
  endPause: number
  cursorStyle: CursorStyle
  canvasSize: CanvasSize
}

export const DEFAULT_SETTINGS: GeneratorSettings = {
  text: 'אוי ואבוי',
  fontFamily: "'Heebo', sans-serif",
  textColor: '#E50914',
  fontSize: 48,
  letterSpacing: 2,
  gridSize: 45,
  lineWidth: 2.5,
  gridColor: '#111111',
  paperBg: '#FFFFFF',
  roughGrid: true,
  alignGrid: true,
  typeSpeed: 180,
  endPause: 1.2,
  cursorStyle: 'block',
  canvasSize: { width: 600, height: 300 },
}

export const FONT_OPTIONS = [
  { value: "'Press Start 2P', cursive", label: 'Press Start 2P (Pixel)' },
  { value: "'Rubik Mono One', sans-serif", label: 'Rubik Mono One (Bold)' },
  { value: "'Rubik Glitch', display", label: 'Rubik Glitch' },
  { value: "'Silkscreen', cursive", label: 'Silkscreen (Pixel)' },
  { value: "'VT323', monospace", label: 'VT323 (Retro Terminal)' },
  { value: "'Heebo', sans-serif", label: 'Heebo Black (Clean Bold)' },
  { value: "'Assistant', sans-serif", label: 'Assistant Bold' },
  { value: "'Frank Ruhl Hofshi', serif", label: 'Frank Ruhl (Classic)' },
  { value: "'Miriam Libre', sans-serif", label: 'Miriam Libre' },
] as const

export const CANVAS_SIZE_OPTIONS = [
  { value: '600x300', width: 600, height: 300, label: 'Wide Banner (600 × 300)' },
  { value: '500x500', width: 500, height: 500, label: 'Square (500 × 500)' },
  { value: '700x250', width: 700, height: 250, label: 'Header Strip (700 × 250)' },
  { value: '400x200', width: 400, height: 200, label: 'Compact (400 × 200)' },
] as const

export const PAPER_THEMES = [
  { value: '#FFFFFF', label: 'White' },
  { value: '#F8F6F0', label: 'Warm Notebook' },
  { value: '#E2E8F0', label: 'Blueprint Grey' },
  { value: '#1A202C', label: 'Dark Mode Grid' },
] as const
