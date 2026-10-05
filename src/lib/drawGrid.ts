export type GridDrawSettings = {
  paperBg: string
  gridColor: string
  gridSize: number
  lineWidth: number
  roughGrid: boolean
}

export function drawGridPaper(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: GridDrawSettings,
): void {
  const { paperBg, gridColor, gridSize, lineWidth, roughGrid } = settings

  ctx.fillStyle = paperBg
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.strokeStyle = gridColor
  ctx.lineWidth = lineWidth

  if (roughGrid) {
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.globalAlpha = 0.85 + Math.random() * 0.15
      for (let y = 0; y <= height; y += 10) {
        const jitter = (Math.random() - 0.5) * 0.6
        if (y === 0) ctx.moveTo(x + jitter, y)
        else ctx.lineTo(x + jitter, y)
      }
      ctx.stroke()
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.globalAlpha = 0.85 + Math.random() * 0.15
      for (let x = 0; x <= width; x += 10) {
        const jitter = (Math.random() - 0.5) * 0.6
        if (x === 0) ctx.moveTo(x, y + jitter)
        else ctx.lineTo(x, y + jitter)
      }
      ctx.stroke()
    }

    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width
      const ry = Math.random() * height
      ctx.fillRect(rx, ry, 1.5, 1.5)
    }
  } else {
    ctx.globalAlpha = 0.9
    ctx.beginPath()
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }
    ctx.stroke()
  }

  ctx.restore()
}
