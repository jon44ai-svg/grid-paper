import type { GeneratorSettings } from '../types'
import { drawTextFrame, preloadImages } from './drawText'

export async function downloadPng(settings: GeneratorSettings): Promise<void> {
  const canvas = document.createElement('canvas')
  canvas.width = settings.canvasSize.width
  canvas.height = settings.canvasSize.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const imageMap = await preloadImages(settings.images)
  const text = settings.text || 'אוי ואבוי'
  drawTextFrame(ctx, canvas.width, canvas.height, { ...settings, text }, {
    charCount: text.length,
    drawCursor: false,
    showCursor: false,
    imageMap,
  })

  const link = document.createElement('a')
  link.download = `grid-text-${Date.now()}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
