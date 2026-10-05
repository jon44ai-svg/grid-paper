import type { CursorStyle, DrawingStroke, GeneratorSettings, GraderMarkType, GraderStampType, InsertedImage } from '../types'
import { drawGridPaper } from './drawGrid'
import { isRTLText } from './rtl'

export type TextDrawOptions = {
  charCount: number
  drawCursor: boolean
  showCursor: boolean
  imageMap?: Map<string, HTMLImageElement>
}

// Global image cache for preview rendering so images loaded once can be drawn synchronously
const imageElementCache = new Map<string, HTMLImageElement>()

export function preloadImages(images: InsertedImage[]): Promise<Map<string, HTMLImageElement>> {
  if (!images || images.length === 0) {
    return Promise.resolve(new Map<string, HTMLImageElement>())
  }

  const map = new Map<string, HTMLImageElement>()
  const promises = images.map((img) => {
    return new Promise<void>((resolve) => {
      const cached = imageElementCache.get(img.dataUrl)
      if (cached && cached.complete && cached.naturalWidth > 0) {
        map.set(img.id, cached)
        resolve()
        return
      }

      const imageEl = new Image()
      imageEl.crossOrigin = 'anonymous'
      imageEl.onload = () => {
        imageElementCache.set(img.dataUrl, imageEl)
        map.set(img.id, imageEl)
        resolve()
      }
      imageEl.onerror = () => {
        resolve()
      }
      imageEl.src = img.dataUrl
    })
  })

  return Promise.all(promises).then(() => map)
}

export function drawInsertedImages(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  images: InsertedImage[],
  imageMap?: Map<string, HTMLImageElement>,
): void {
  if (!images || images.length === 0) return

  for (const img of images) {
    let el = imageMap?.get(img.id) || imageElementCache.get(img.dataUrl)
    if (!el) {
      el = new Image()
      el.src = img.dataUrl
      imageElementCache.set(img.dataUrl, el)
    }

    if (el.complete && el.naturalWidth > 0) {
      const renderX = img.x <= 1 ? img.x * canvasWidth : img.x
      const renderY = img.y <= 1 ? img.y * canvasHeight : img.y
      ctx.drawImage(el, renderX, renderY, img.width, img.height)
    }
  }
}

export function drawDrawingStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: DrawingStroke[],
  canvasWidth?: number,
  canvasHeight?: number,
): void {
  if (!strokes || strokes.length === 0) return

  const cw = canvasWidth ?? ctx.canvas.width
  const ch = canvasHeight ?? ctx.canvas.height

  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (const stroke of strokes) {
    if (!stroke.points || stroke.points.length === 0) continue

    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width

    ctx.beginPath()
    const first = stroke.points[0]
    const startX = first.x <= 1 ? first.x * cw : first.x
    const startY = first.y <= 1 ? first.y * ch : first.y
    ctx.moveTo(startX, startY)

    if (stroke.points.length === 1) {
      ctx.lineTo(startX + 0.1, startY + 0.1)
    } else {
      for (let i = 1; i < stroke.points.length; i++) {
        const pt = stroke.points[i]
        const px = pt.x <= 1 ? pt.x * cw : pt.x
        const py = pt.y <= 1 ? pt.y * ch : pt.y
        ctx.lineTo(px, py)
      }
    }
    ctx.stroke()
  }

  ctx.restore()
}

export function drawTextFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: GeneratorSettings,
  options: TextDrawOptions,
): void {
  drawGridPaper(ctx, width, height, {
    paperBg: settings.paperBg,
    gridColor: settings.gridColor,
    gridSize: settings.gridSize,
    lineWidth: settings.lineWidth,
    roughGrid: settings.roughGrid,
    showMarginLine: settings.showMarginLine,
    marginLineColor: settings.marginLineColor,
    showBinderHoles: settings.showBinderHoles,
  })

  // 1. Draw inserted images / meme stickers behind handwritten annotations and text
  drawInsertedImages(ctx, width, height, settings.images, options.imageMap)

  // 2. Draw user freehand drawings / doodles
  drawDrawingStrokes(ctx, settings.drawings, width, height)

  const fullText = settings.text
  const currentSubText = fullText.substring(0, options.charCount)
  const isRTL = isRTLText(fullText)

  if (currentSubText.length === 0 && !options.drawCursor) return

  ctx.save()

  const {
    fontSize,
    fontFamily,
    textColor,
    letterSpacing,
    gridSize,
    alignGrid,
    cursorStyle,
    inkBleed,
    graderMark,
    graderStamp,
  } = settings

  ctx.font = `700 ${fontSize}px ${fontFamily}`
  ctx.fillStyle = textColor
  ctx.textBaseline = 'alphabetic'

  if (inkBleed) {
    ctx.shadowColor = 'rgba(217, 20, 20, 0.45)'
    ctx.shadowBlur = 1.8
  }

  const displayLines = currentSubText.split('\n')

  let startY: number
  if (alignGrid) {
    const centerY = height / 2
    startY = Math.round(centerY / gridSize) * gridSize
  } else {
    startY = height / 2 + fontSize / 3
  }

  const lineHeight = Math.max(fontSize * 1.2, gridSize)
  const totalBlockHeight = displayLines.length * lineHeight

  // Calculate maximum line width for enclosing grader mark
  let maxLineWidth = 0
  const measuredLines = displayLines.map((lineText) => {
    let lineTotalWidth = 0
    const chars = Array.from(lineText)
    chars.forEach((c) => {
      lineTotalWidth += ctx.measureText(c).width + letterSpacing
    })
    if (chars.length > 0) lineTotalWidth -= letterSpacing
    if (lineTotalWidth > maxLineWidth) maxLineWidth = lineTotalWidth
    return { lineText, chars, lineTotalWidth }
  })

  displayLines.forEach((_lineText, lineIdx) => {
    const y = startY + (lineIdx - (displayLines.length - 1) / 2) * lineHeight
    const { chars, lineTotalWidth } = measuredLines[lineIdx]

    let currentX = isRTL
      ? (width + lineTotalWidth) / 2
      : (width - lineTotalWidth) / 2

    chars.forEach((char) => {
      const charWidth = ctx.measureText(char).width
      if (isRTL) {
        ctx.fillText(char, currentX - charWidth, y)
        currentX -= charWidth + letterSpacing
      } else {
        ctx.fillText(char, currentX, y)
        currentX += charWidth + letterSpacing
      }
    })

    // Grader marks appear when text finishes typing or in preview
    const isLastLine = lineIdx === displayLines.length - 1
    const textFinished = options.charCount >= fullText.length

    if (textFinished && isLastLine && graderMark !== 'none') {
      drawGraderMark(ctx, {
        mark: graderMark,
        x: width / 2,
        y: startY,
        width: Math.max(maxLineWidth + 40, 160),
        height: Math.max(totalBlockHeight + 30, 80),
        color: textColor,
      })
    }

    if (options.drawCursor && isLastLine) {
      drawCursor(ctx, {
        cursorStyle,
        textColor,
        fontSize,
        isRTL,
        currentX,
        y,
        showCursor: options.showCursor,
      })
    }
  })

  // Stamp in top-right or margin (classic professor/TA score grade)
  const textFinished = options.charCount >= fullText.length
  if (textFinished && graderStamp !== 'none') {
    drawGraderStamp(ctx, graderStamp, width, height, textColor)
  }

  ctx.restore()
}

function drawGraderMark(
  ctx: CanvasRenderingContext2D,
  args: {
    mark: GraderMarkType
    x: number
    y: number
    width: number
    height: number
    color: string
  },
): void {
  ctx.save()
  ctx.strokeStyle = args.color
  ctx.lineWidth = 3.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = 0.88

  if (args.mark === 'circle') {
    // Red pen hurried circle around the error
    ctx.beginPath()
    const rx = args.width / 2 + 10
    const ry = args.height / 2 + 5
    ctx.ellipse(args.x, args.y - 12, rx, ry, -0.06, 0, Math.PI * 2)
    ctx.stroke()
    // Second hurried overlapping stroke
    ctx.beginPath()
    ctx.ellipse(args.x + 3, args.y - 10, rx - 3, ry + 2, 0.04, 0.2, Math.PI * 2 + 0.3)
    ctx.stroke()
  } else if (args.mark === 'strike_through') {
    // Aggressive double strike-through
    ctx.beginPath()
    ctx.moveTo(args.x - args.width / 2 - 10, args.y - 12)
    ctx.lineTo(args.x + args.width / 2 + 10, args.y - 16)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(args.x - args.width / 2 - 5, args.y - 6)
    ctx.lineTo(args.x + args.width / 2 + 12, args.y - 10)
    ctx.stroke()
  } else if (args.mark === 'question_mark') {
    // Big professor "?" in the margin
    ctx.font = 'bold 54px "Caveat", "Permanent Marker", sans-serif'
    ctx.fillStyle = args.color
    ctx.fillText('?!', args.x + args.width / 2 + 14, args.y)
  } else if (args.mark === 'cross') {
    // Red X
    const sz = 28
    const cx = args.x + args.width / 2 + 30
    const cy = args.y - 16
    ctx.beginPath()
    ctx.moveTo(cx - sz, cy - sz)
    ctx.lineTo(cx + sz, cy + sz)
    ctx.moveTo(cx + sz, cy - sz)
    ctx.lineTo(cx - sz, cy + sz)
    ctx.stroke()
  } else if (args.mark === 'checkmark') {
    // Red TA checkmark
    const cx = args.x + args.width / 2 + 18
    const cy = args.y - 10
    ctx.beginPath()
    ctx.moveTo(cx - 15, cy)
    ctx.lineTo(cx, cy + 18)
    ctx.lineTo(cx + 28, cy - 24)
    ctx.stroke()
  }

  ctx.restore()
}

function drawGraderStamp(
  ctx: CanvasRenderingContext2D,
  stamp: GraderStampType,
  width: number,
  _height: number,
  color: string,
): void {
  ctx.save()
  const stampX = width - 85
  const stampY = 70

  ctx.translate(stampX, stampY)
  ctx.rotate(-0.16) // Slightly tilted rubber stamp angle

  let text = ''
  let sub = ''
  if (stamp === 'zero') {
    text = '0 / 100'
    sub = 'נכשל'
  } else if (stamp === 'hundred') {
    text = '100'
    sub = 'מצוין!'
  } else if (stamp === 'minus_ten') {
    text = '-10'
    sub = 'שגיאה'
  } else if (stamp === 'fail') {
    text = 'FAIL'
    sub = 'חזרה על הקורס'
  } else if (stamp === 'pass') {
    text = 'עובר בקושי'
    sub = '56'
  } else if (stamp === 'recheck') {
    text = 'ערעור'
    sub = 'נדחה'
  }

  // Stamp border box
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.85
  ctx.strokeRect(-65, -35, 130, 68)

  // Stamp inner dashed border
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1.2
  ctx.strokeRect(-61, -31, 122, 60)
  ctx.setLineDash([])

  // Main stamp text
  ctx.font = '900 24px "Heebo", "Permanent Marker", sans-serif'
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 0, -6)

  // Subtitle (Hebrew / comment)
  if (sub) {
    ctx.font = '700 13px "Heebo", sans-serif'
    ctx.fillText(sub, 0, 16)
  }

  ctx.restore()
}

function drawCursor(
  ctx: CanvasRenderingContext2D,
  args: {
    cursorStyle: CursorStyle
    textColor: string
    fontSize: number
    isRTL: boolean
    currentX: number
    y: number
    showCursor: boolean
  },
): void {
  if (args.cursorStyle === 'none') return

  let cursorSymbol = '▋'
  if (args.cursorStyle === 'pipe') cursorSymbol = '|'
  if (args.cursorStyle === 'underscore') cursorSymbol = '_'

  ctx.fillStyle = args.textColor
  ctx.globalAlpha = args.showCursor ? 0.9 : 0.2

  // In RTL, text grows to the left. currentX is placed right at the left edge of the last character drawn.
  // In LTR, currentX is placed at the right edge of the last character drawn.
  const cursorMetrics = ctx.measureText(cursorSymbol)
  const cursorWidth = cursorMetrics.width

  if (args.isRTL) {
    ctx.fillText(cursorSymbol, args.currentX - cursorWidth, args.y)
  } else {
    ctx.fillText(cursorSymbol, args.currentX, args.y)
  }
}
