import gifshot from 'gifshot'
import type { GeneratorSettings } from '../types'
import { drawTextFrame } from './drawText'

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

  const canvas = document.createElement('canvas')
  canvas.width = settings.canvasSize.width
  canvas.height = settings.canvasSize.height
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
    })
    frames.push(canvas.toDataURL('image/png'))

    if (i === totalChars) {
      const pauseFrameCount = Math.max(3, Math.round(settings.endPause * 5))
      for (let p = 0; p < pauseFrameCount; p++) {
        drawTextFrame(ctx, canvas.width, canvas.height, settings, {
          charCount: i,
          drawCursor: true,
          showCursor: p % 2 === 0,
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
        gifWidth: settings.canvasSize.width,
        gifHeight: settings.canvasSize.height,
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
