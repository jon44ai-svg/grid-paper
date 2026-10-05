import gifshot from 'gifshot'
import type { GeneratorSettings } from '../types'
import { drawTextFrame, preloadImages } from './drawText'

export type GifProgress = {
  percent: number
  label: string
}

export type GifResult = {
  image: string
  error?: string
}

export async function createTypingGif(
  settings: GeneratorSettings,
  onProgress: (progress: GifProgress) => void,
): Promise<GifResult> {
  const fullText = settings.text || 'אוי ואבוי'
  if (!fullText.trim()) {
    return { image: '', error: 'Empty text' }
  }

  onProgress({ percent: 5, label: 'Preparing animation frames...' })

  // Preload any inserted images before capturing frames
  const imageMap = await preloadImages(settings.images)

  // For WhatsApp sticker export, cap dimensions to 512x512 and keep file size under 500KB
  const exportWidth = settings.whatsappOptimized
    ? Math.min(512, settings.canvasSize.width)
    : settings.canvasSize.width
  const exportHeight = settings.whatsappOptimized
    ? Math.min(512, settings.canvasSize.height)
    : settings.canvasSize.height

  const canvas = document.createElement('canvas')
  canvas.width = exportWidth
  canvas.height = exportHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return { image: '', error: 'Canvas unavailable' }
  }

  const frames: string[] = []
  const totalChars = fullText.length

  for (let i = 0; i <= totalChars; i++) {
    drawTextFrame(ctx, canvas.width, canvas.height, settings, {
      charCount: i,
      drawCursor: true,
      showCursor: true,
      imageMap,
    })
    frames.push(canvas.toDataURL('image/png'))

    if (i === totalChars) {
      const pauseFrameCount = Math.max(3, Math.round(settings.endPause * 5))
      for (let p = 0; p < pauseFrameCount; p++) {
        drawTextFrame(ctx, canvas.width, canvas.height, settings, {
          charCount: i,
          drawCursor: true,
          showCursor: p % 2 === 0,
          imageMap,
        })
        frames.push(canvas.toDataURL('image/png'))
      }
    }
  }

  onProgress({ percent: 35, label: 'Encoding GIF animation...' })

  const frameInterval = settings.typeSpeed / 1000

  return new Promise((resolve) => {
    gifshot.createGIF(
      {
        images: frames,
        interval: frameInterval,
        gifWidth: exportWidth,
        gifHeight: exportHeight,
        numWorkers: 2,
        progressCallback: (captureProgress: number) => {
          const pct = Math.round(35 + captureProgress * 60)
          onProgress({ percent: pct, label: 'Encoding GIF animation...' })
        },
      },
      (obj) => {
        if (obj.error || !obj.image) {
          resolve({ image: '', error: String(obj.error || 'GIF encoding failed') })
          return
        }
        onProgress({ percent: 100, label: 'Done' })
        resolve({ image: obj.image })
      },
    )
  })
}
