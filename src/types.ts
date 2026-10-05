export type CursorStyle = 'none' | 'block' | 'pipe' | 'underscore'
export type GraderMarkType = 'none' | 'circle' | 'strike_through' | 'question_mark' | 'cross' | 'checkmark'
export type GraderStampType = 'none' | 'zero' | 'hundred' | 'minus_ten' | 'fail' | 'pass' | 'recheck'

export type CanvasSize = {
  width: number
  height: number
}

export type DrawingStroke = {
  points: { x: number; y: number }[]
  color: string
  width: number
}

export type InsertedImage = {
  id: string
  dataUrl: string
  x: number // 0-1 normalized
  y: number // 0-1 normalized
  width: number // px
  height: number // px
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
  // Grader & Notebook features
  showMarginLine: boolean
  marginLineColor: string
  showBinderHoles: boolean
  graderMark: GraderMarkType
  graderStamp: GraderStampType
  inkBleed: boolean
  whatsappOptimized: boolean
  // Drawings and memes
  drawings: DrawingStroke[]
  images: InsertedImage[]
}

export const DEFAULT_SETTINGS: GeneratorSettings = {
  text: 'אוי ואבוי',
  fontFamily: "'Heebo', sans-serif",
  textColor: '#D91414',
  fontSize: 48,
  letterSpacing: 2,
  gridSize: 45,
  lineWidth: 2.5,
  gridColor: '#111111',
  paperBg: '#FCFAF2',
  roughGrid: true,
  alignGrid: true,
  typeSpeed: 180,
  endPause: 1.2,
  cursorStyle: 'block',
  canvasSize: { width: 512, height: 512 },
  showMarginLine: true,
  marginLineColor: '#FF4444',
  showBinderHoles: true,
  graderMark: 'circle',
  graderStamp: 'zero',
  inkBleed: true,
  whatsappOptimized: true,
  drawings: [],
  images: [],
}

export const FONT_OPTIONS = [
  { value: "'Caveat', cursive", label: 'Caveat (Quick Red Pen)' },
  { value: "'Permanent Marker', cursive", label: 'Permanent Marker (Felt Pen)' },
  { value: "'Kalam', cursive", label: 'Kalam (Messy Handwriting)' },
  { value: "'Amatic SC', cursive", label: 'Amatic SC (Hebrew/Eng Tall)' },
  { value: "'Heebo', sans-serif", label: 'Heebo Black (Clean Bold)' },
  { value: "'Assistant', sans-serif", label: 'Assistant Bold' },
  { value: "'Frank Ruhl Hofshi', serif", label: 'Frank Ruhl (Classic)' },
  { value: "'Miriam Libre', sans-serif", label: 'Miriam Libre' },
  { value: "'Press Start 2P', cursive", label: 'Press Start 2P (Pixel)' },
  { value: "'Rubik Mono One', sans-serif", label: 'Rubik Mono One (Bold)' },
  { value: "'Rubik Glitch', display", label: 'Rubik Glitch' },
  { value: "'Silkscreen', cursive", label: 'Silkscreen (Pixel)' },
  { value: "'VT323', monospace", label: 'VT323 (Retro Terminal)' },
] as const

export const CANVAS_SIZE_OPTIONS = [
  { value: '512x512', width: 512, height: 512, label: 'WhatsApp Sticker (512 × 512)' },
  { value: '600x300', width: 600, height: 300, label: 'Wide Banner (600 × 300)' },
  { value: '700x250', width: 700, height: 250, label: 'Exam Strip (700 × 250)' },
  { value: '400x400', width: 400, height: 400, label: 'Compact Square (400 × 400)' },
] as const

export const PAPER_THEMES = [
  { value: '#FCFAF2', label: 'Vintage Exam Paper' },
  { value: '#FFFFFF', label: 'Crisp White' },
  { value: '#FFF8DC', label: 'Yellow Legal Pad' },
  { value: '#E9EEF4', label: 'Calculus Blue Grid' },
  { value: '#1A202C', label: 'Dark Mode Grid' },
] as const
