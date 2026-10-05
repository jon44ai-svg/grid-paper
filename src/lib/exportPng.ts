import type { GeneratorSettings } from '../types'
import { drawTextFrame } from './drawText'

export function downloadPng(settings: GeneratorSettings): void {
  const canvas = document.createElement('canvas')
  canvas.width = settings.canvasSize.width
  canvas.height = settings.canvasSize.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const text = settings.text || 'אוי ואבוי'
  drawTextFrame(ctx, canvas.width, canvas.height, { ...settings, text }, {
    charCount: text.length,
    drawCursor: false,
    showCursor: false,
  })

  const link = document.createElement('a')
  link.download = `grid-text-${Date.now()}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
