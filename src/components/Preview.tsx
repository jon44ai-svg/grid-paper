import { useState } from 'react'
import type { DrawingStroke, GeneratorSettings } from '../types'
import { createTypingGif } from '../lib/exportGif'
import { downloadPng } from '../lib/exportPng'
import { usePreviewCanvas } from '../hooks/usePreviewCanvas'
import { GifResult } from './GifResult'

type Props = {
  settings: GeneratorSettings
  charIndex: number
  showCursor: boolean
  onPlay: () => void
  onPause: () => void
  isDrawingMode?: boolean
  drawingColor?: string
  drawingWidth?: number
  onAddStroke?: (stroke: DrawingStroke) => void
  onClearDrawings?: () => void
  onToggleDrawingMode?: (active: boolean) => void
}

export function Preview({
  settings,
  charIndex,
  showCursor,
  onPlay,
  onPause,
  isDrawingMode = false,
  drawingColor = '#D91414',
  drawingWidth = 3,
  onAddStroke,
  onClearDrawings,
  onToggleDrawingMode,
}: Props) {
  const [gifOpen, setGifOpen] = useState(false)
  const [gifPercent, setGifPercent] = useState(0)
  const [gifLabel, setGifLabel] = useState('')
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [isExportingPng, setIsExportingPng] = useState(false)

  const { canvasRef, handlePointerDown, handlePointerMove, handlePointerUp } = usePreviewCanvas({
    settings,
    charIndex,
    showCursor,
    isDrawingMode,
    drawingColor,
    drawingWidth,
    onAddStroke,
  })

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

  async function handlePng() {
    setIsExportingPng(true)
    try {
      await downloadPng(settings)
    } finally {
      setIsExportingPng(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Canvas Card */}
      <div className="bg-gray-900 rounded-2xl p-3 sm:p-4 border border-gray-800 shadow-xl flex flex-col items-center">
        {/* Header bar of preview */}
        <div className="w-full flex items-center justify-between border-b border-gray-800/80 pb-2.5 mb-3 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-xs font-semibold text-gray-300 ml-1 hidden xs:inline">
              Sticker Canvas
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Freehand scribble toggle on preview */}
            {onToggleDrawingMode && (
              <button
                type="button"
                onClick={() => onToggleDrawingMode(!isDrawingMode)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 border shadow-sm ${
                  isDrawingMode
                    ? 'bg-red-600 text-white border-red-500 shadow-red-950/50'
                    : 'bg-gray-800 text-gray-300 hover:text-white border-gray-700 hover:bg-gray-750'
                }`}
                title="Click or drag directly on the canvas to draw grader ink marks"
              >
                <span>{isDrawingMode ? '🛑 Done Pen' : '✏️ Draw'}</span>
              </button>
            )}

            {settings.drawings.length > 0 && onClearDrawings && (
              <button
                type="button"
                onClick={onClearDrawings}
                className="text-[11px] px-2 py-1.5 rounded-lg bg-gray-800 hover:bg-red-950/40 text-gray-400 hover:text-red-400 border border-gray-700/80 transition"
                title="Undo/Clear all hand drawn red marks"
              >
                Clear Pen
              </button>
            )}

            <button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium transition shadow active:scale-95"
              onClick={onPlay}
            >
              ▶ Play
            </button>
            <button
              type="button"
              className="bg-gray-800 hover:bg-gray-750 text-gray-300 text-xs px-2.5 py-1.5 rounded-lg font-medium transition border border-gray-700"
              onClick={onPause}
            >
              ⏸ Pause
            </button>
          </div>
        </div>

        {/* Live Canvas Area with touch interaction */}
        <div
          className={`relative w-full flex justify-center items-center overflow-hidden p-2 sm:p-4 rounded-xl border transition-all ${
            isDrawingMode
              ? 'bg-red-950/15 border-red-500/50 ring-2 ring-red-500/20'
              : 'bg-gray-950/90 border-gray-800/80'
          }`}
        >
          {isDrawingMode && (
            <div className="absolute top-2 left-2 z-10 bg-red-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow pointer-events-none animate-pulse">
              ✏️ Pen active: Touch & draw red marks!
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={settings.canvasSize.width}
            height={settings.canvasSize.height}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`max-w-full rounded-lg shadow-2xl border bg-white select-none transition-shadow ${
              isDrawingMode
                ? 'cursor-crosshair border-red-500/80 touch-none'
                : 'border-gray-700 cursor-default'
            }`}
            style={{
              imageRendering: 'pixelated',
              maxHeight: 'min(50vh, 420px)',
              objectFit: 'contain',
              touchAction: isDrawingMode ? 'none' : 'auto',
            }}
          />
        </div>

        {/* Status indicator bar under canvas */}
        <div className="w-full mt-2.5 flex items-center justify-between text-xs text-gray-400 px-1">
          <span className="bg-gray-800/90 px-2 py-0.5 rounded text-gray-300 font-mono text-[11px]">
            {charIndex} / {settings.text.length} chars
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {settings.drawings.length > 0 && (
              <span className="text-red-400 text-[10px] bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60 font-mono">
                {settings.drawings.length} doodle{settings.drawings.length > 1 ? 's' : ''}
              </span>
            )}
            {settings.images.length > 0 && (
              <span className="text-amber-400 text-[10px] bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60 font-mono">
                {settings.images.length} sticker{settings.images.length > 1 ? 's' : ''}
              </span>
            )}
            <span className="text-emerald-400 text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 font-mono">
              WhatsApp 512×512
            </span>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="w-full grid grid-cols-2 gap-2 sm:gap-3 mt-4">
          <button
            type="button"
            disabled={isExportingPng}
            className="w-full py-2.5 sm:py-3 px-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-red-950/30 transition transform active:scale-95 flex items-center justify-center gap-1.5"
            onClick={handlePng}
          >
            <span>📥</span>
            <span>{isExportingPng ? 'Saving...' : 'PNG Sticker'}</span>
          </button>
          <button
            type="button"
            className="w-full py-2.5 sm:py-3 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-950/30 transition transform active:scale-95 flex items-center justify-center gap-1.5"
            onClick={handleGif}
          >
            <span>🎬</span>
            <span>Animated GIF</span>
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
    </div>
  )
}
