import { useEffect, useRef, useState } from 'react'
import type { GeneratorSettings } from '../types'
import { drawTextFrame } from '../lib/drawText'
import { createTypingGif } from '../lib/exportGif'
import { downloadPng } from '../lib/exportPng'
import { GifResult } from './GifResult'

type Props = {
  settings: GeneratorSettings
  charIndex: number
  showCursor: boolean
  onPlay: () => void
  onPause: () => void
}

export function Preview({ settings, charIndex, showCursor, onPlay, onPause }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gifOpen, setGifOpen] = useState(false)
  const [gifPercent, setGifPercent] = useState(0)
  const [gifLabel, setGifLabel] = useState('')
  const [gifUrl, setGifUrl] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = settings.canvasSize.width
    canvas.height = settings.canvasSize.height

    drawTextFrame(ctx, canvas.width, canvas.height, settings, {
      charCount: charIndex,
      drawCursor: true,
      showCursor,
    })
  }, [settings, charIndex, showCursor])

  async function handleGif() {
    setGifOpen(true)
    setGifUrl(null)
    setGifPercent(5)
    setGifLabel('Preparing animation frames...')
    onPause()

    const result = await createTypingGif(settings, ({ percent, label }) => {
      setGifPercent(percent)
      setGifLabel(label)
    })

    if (result.error) {
      setGifLabel(result.error)
      return
    }
    setGifUrl(result.image)
  }

  return (
    <div className="lg:col-span-7 flex flex-col gap-5">
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 shadow-sm flex flex-col items-center">
        <div className="w-full flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
            <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-gray-400 ml-2">Live Canvas Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition shadow"
              onClick={onPlay}
            >
              Play Typing
            </button>
            <button
              type="button"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-lg font-medium transition border border-gray-700"
              onClick={onPause}
            >
              Pause
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center items-center overflow-x-auto p-2 bg-gray-950/80 rounded-xl border border-gray-800 min-h-[320px]">
          <canvas
            ref={canvasRef}
            width={settings.canvasSize.width}
            height={settings.canvasSize.height}
            className="max-w-full rounded shadow-2xl border border-gray-700 bg-white"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <div className="w-full mt-3 flex items-center justify-between text-xs text-gray-400 px-1">
          <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300 font-mono">
            {charIndex} / {settings.text.length} chars
          </span>
          <span className="text-gray-500 text-[11px]">Grid baseline matched</span>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <button
            type="button"
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-950/40 transition transform active:scale-95"
            onClick={() => downloadPng(settings)}
          >
            Download PNG Image
          </button>
          <button
            type="button"
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/40 transition transform active:scale-95"
            onClick={handleGif}
          >
            Generate & Download GIF
          </button>
        </div>
      </div>

      <GifResult
        visible={gifOpen}
        percent={gifPercent}
        label={gifLabel}
        imageUrl={gifUrl}
        onClose={() => setGifOpen(false)}
      />

      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-xs text-gray-400 space-y-2">
        <div className="font-semibold text-gray-300">Features & Hebrew Support:</div>
        <ul className="list-disc list-inside space-y-1 pl-1">
          <li>
            <strong>Bi-directional typing:</strong> RTL for Hebrew (e.g.{' '}
            <span className="text-red-400 font-bold">אוי ואבוי</span>) and LTR for English.
          </li>
          <li>
            <strong>Scanned Texture:</strong> Distressed grid lines like a math notebook.
          </li>
          <li>
            <strong>Custom Font Engine:</strong> Google fonts with canvas baseline alignment.
          </li>
        </ul>
      </div>
    </div>
  )
}
