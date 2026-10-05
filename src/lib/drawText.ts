import type { CursorStyle, GeneratorSettings } from '../types'
import { drawGridPaper } from './drawGrid'
import { isRTLText } from './rtl'

export type TextDrawOptions = {
  charCount: number
  drawCursor: boolean
  showCursor: boolean
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
  })

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
  } = settings

  ctx.font = `700 ${fontSize}px ${fontFamily}`
  ctx.fillStyle = textColor
  ctx.textBaseline = 'alphabetic'

  const displayLines = currentSubText.split('\n')

  let startY: number
  if (alignGrid) {
    const centerY = height / 2
    startY = Math.round(centerY / gridSize) * gridSize
  } else {
    startY = height / 2 + fontSize / 3
  }

  const lineHeight = Math.max(fontSize * 1.2, gridSize)

  displayLines.forEach((lineText, lineIdx) => {
    const y = startY + (lineIdx - (displayLines.length - 1) / 2) * lineHeight

    let lineTotalWidth = 0
    const chars = Array.from(lineText)
    chars.forEach((c) => {
      lineTotalWidth += ctx.measureText(c).width + letterSpacing
    })
    if (chars.length > 0) lineTotalWidth -= letterSpacing

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

    if (options.drawCursor && lineIdx === displayLines.length - 1) {
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

  if (args.isRTL) {
    ctx.fillText(cursorSymbol, args.currentX - args.fontSize * 0.4, args.y)
  } else {
    ctx.fillText(cursorSymbol, args.currentX, args.y)
  }
}
