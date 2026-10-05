import { useCallback, useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import type { DrawingStroke, GeneratorSettings } from '../types'
import { drawTextFrame, preloadImages } from '../lib/drawText'

type Options = {
  settings: GeneratorSettings
  charIndex: number
  showCursor: boolean
  isDrawingMode: boolean
  drawingColor: string
  drawingWidth: number
  onAddStroke?: (stroke: DrawingStroke) => void
}

export function usePreviewCanvas(options: Options) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const pointsRef = useRef<{ x: number; y: number }[]>([])

  const { settings, charIndex, showCursor } = options

  useEffect(() => {
    let cancelled = false
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    canvas.width = settings.canvasSize.width
    canvas.height = settings.canvasSize.height
    drawTextFrame(context, canvas.width, canvas.height, settings, {
      charCount: charIndex,
      drawCursor: true,
      showCursor,
    })

    preloadImages(settings.images).then((imageMap) => {
      if (cancelled || !canvasRef.current) return
      const nextContext = canvasRef.current.getContext('2d')
      if (!nextContext) return
      drawTextFrame(nextContext, canvas.width, canvas.height, settings, {
        charCount: charIndex,
        drawCursor: true,
        showCursor,
        imageMap,
      })
    })

    return () => {
      cancelled = true
    }
  }, [settings, charIndex, showCursor])

  const coordinates = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const bounds = canvas.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return null
    return {
      x: Math.max(0, Math.min(canvas.width, (clientX - bounds.left) * (canvas.width / bounds.width))),
      y: Math.max(0, Math.min(canvas.height, (clientY - bounds.top) * (canvas.height / bounds.height))),
    }
  }, [])

  const handlePointerDown = useCallback((event: PointerEvent<HTMLCanvasElement>) => {
    if (!options.isDrawingMode) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const point = coordinates(event.clientX, event.clientY)
    if (!point) return
    drawingRef.current = true
    pointsRef.current = [point]
    const context = canvasRef.current?.getContext('2d')
    if (context) {
      context.fillStyle = options.drawingColor
      context.beginPath()
      context.arc(point.x, point.y, options.drawingWidth / 2, 0, Math.PI * 2)
      context.fill()
    }
  }, [coordinates, options])

  const handlePointerMove = useCallback((event: PointerEvent<HTMLCanvasElement>) => {
    if (!options.isDrawingMode || !drawingRef.current) return
    event.preventDefault()
    const point = coordinates(event.clientX, event.clientY)
    const previous = pointsRef.current.at(-1)
    if (!point || !previous) return
    pointsRef.current.push(point)
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    context.strokeStyle = options.drawingColor
    context.lineWidth = options.drawingWidth
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.beginPath()
    context.moveTo(previous.x, previous.y)
    context.lineTo(point.x, point.y)
    context.stroke()
  }, [coordinates, options])

  const handlePointerUp = useCallback((event: PointerEvent<HTMLCanvasElement>) => {
    if (!options.isDrawingMode || !drawingRef.current) return
    drawingRef.current = false
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // Pointer capture may already be released.
    }
    if (pointsRef.current.length && options.onAddStroke) {
      options.onAddStroke({
        points: [...pointsRef.current],
        color: options.drawingColor,
        width: options.drawingWidth,
      })
    }
    pointsRef.current = []
  }, [options])

  return { canvasRef, handlePointerDown, handlePointerMove, handlePointerUp }
}
