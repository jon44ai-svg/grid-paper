export type GridDrawSettings = {
  paperBg: string
  gridColor: string
  gridSize: number
  lineWidth: number
  roughGrid: boolean
  showMarginLine?: boolean
  marginLineColor?: string
  showBinderHoles?: boolean
}

// Pseudo-random seeded generator to prevent flickering/jitter across animation frames
function makePrng(seed = 12345) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function drawGridPaper(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: GridDrawSettings,
): void {
  const {
    paperBg,
    gridColor,
    gridSize,
    lineWidth,
    roughGrid,
    showMarginLine = false,
    marginLineColor = '#FF4444',
    showBinderHoles = false,
  } = settings

  ctx.fillStyle = paperBg
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.strokeStyle = gridColor
  ctx.lineWidth = lineWidth

  const rng = makePrng(42)

  if (roughGrid) {
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.globalAlpha = 0.85 + rng() * 0.15
      for (let y = 0; y <= height; y += 10) {
        const jitter = (rng() - 0.5) * 0.8
        if (y === 0) ctx.moveTo(x + jitter, y)
        else ctx.lineTo(x + jitter, y)
      }
      ctx.stroke()
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.globalAlpha = 0.85 + rng() * 0.15
      for (let x = 0; x <= width; x += 10) {
        const jitter = (rng() - 0.5) * 0.8
        if (x === 0) ctx.moveTo(x, y + jitter)
        else ctx.lineTo(x, y + jitter)
      }
      ctx.stroke()
    }

    // Vintage paper grain & fibers
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'
    for (let i = 0; i < 350; i++) {
      const rx = rng() * width
      const ry = rng() * height
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

  // Uni notebook red margin rule line (typically near left edge or right for Hebrew)
  if (showMarginLine) {
    const marginX = width > 400 ? 54 : 36
    ctx.beginPath()
    ctx.strokeStyle = marginLineColor
    ctx.lineWidth = lineWidth * 1.2
    ctx.globalAlpha = 0.85
    ctx.moveTo(marginX, 0)
    ctx.lineTo(marginX, height)
    ctx.stroke()
  }

  // Realistic notebook binder punch holes
  if (showBinderHoles) {
    const holeRadius = Math.max(9, Math.round(width * 0.024))
    const holeX = Math.round(width * 0.04)
    const holePositions = [height * 0.18, height * 0.5, height * 0.82]

    holePositions.forEach((hy) => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(holeX, hy, holeRadius, 0, Math.PI * 2)
      ctx.fillStyle = '#222222' // Punch-through hole showing background dark
      ctx.fill()
      // Subtle shadow rim around hole
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()
    })
  }

  ctx.restore()
}
