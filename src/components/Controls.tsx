import {
  CANVAS_SIZE_OPTIONS,
  FONT_OPTIONS,
  PAPER_THEMES,
  type GeneratorSettings,
} from '../types'
import { isRTLText } from '../lib/rtl'

export type ControlsTab = 'text' | 'draw' | 'memes' | 'ai'

type Props = {
  settings: GeneratorSettings
  onChange: (patch: Partial<GeneratorSettings>) => void
  activeTab: ControlsTab
  onTabChange: (tab: ControlsTab) => void
  isDrawingMode: boolean
  onToggleDrawingMode: (active: boolean) => void
  drawingColor: string
  onChangeDrawingColor: (c: string) => void
  drawingWidth: number
  onChangeDrawingWidth: (w: number) => void
  onClearDrawings: () => void
  onOpenMemePicker: () => void
  onOpenAiGenerator: () => void
  onCustomImageUpload: (file: File) => void
  onRemoveImage: (id: string) => void
}

export function Controls({
  settings,
  onChange,
  activeTab,
  onTabChange,
  isDrawingMode,
  onToggleDrawingMode,
  drawingColor,
  onChangeDrawingColor,
  drawingWidth,
  onChangeDrawingWidth,
  onClearDrawings,
  onOpenMemePicker,
  onOpenAiGenerator,
  onCustomImageUpload,
  onRemoveImage,
}: Props) {
  const rtl = isRTLText(settings.text)
  const sizeKey = `${settings.canvasSize.width}x${settings.canvasSize.height}`

  return (
    <div className="flex flex-col gap-4">
      {/* Sleek Mobile-First Segmented Control Tabs */}
      <div className="bg-gray-900/90 backdrop-blur p-1.5 rounded-2xl border border-gray-800 shadow-lg grid grid-cols-4 gap-1">
        <button
          type="button"
          onClick={() => onTabChange('text')}
          className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-semibold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'text'
              ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
          }`}
        >
          <span className="text-base sm:text-sm">✍️</span>
          <span className="truncate">Text & Stamp</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('draw')}
          className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-semibold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'draw'
              ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
          }`}
        >
          <span className="text-base sm:text-sm">🎨</span>
          <span className="truncate">Grader Pen</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('memes')}
          className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-semibold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'memes'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
          }`}
        >
          <span className="text-base sm:text-sm">🖼️</span>
          <span className="truncate">Memes</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('ai')}
          className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-semibold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'ai'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
          }`}
        >
          <span className="text-base sm:text-sm">✨</span>
          <span className="truncate">AI Roast</span>
        </button>
      </div>

      {/* Tab 1: Text & Stamp */}
      {activeTab === 'text' && (
        <div className="flex flex-col gap-4">
          <section className="bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h2 className="text-sm font-semibold text-gray-200">Text & Typography</h2>
              <span
                className={
                  rtl
                    ? 'text-xs text-red-400 font-semibold bg-red-950/60 px-2 py-0.5 rounded border border-red-800'
                    : 'text-xs text-blue-400 font-semibold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800'
                }
              >
                {rtl ? 'Hebrew (RTL)' : 'English (LTR)'}
              </span>
            </div>

            <div>
              <label htmlFor="text-input" className="block text-xs font-medium text-gray-400 mb-1">
                Input Text (Hebrew / English):
              </label>
              <textarea
                id="text-input"
                rows={2}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white text-lg font-mono focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition resize-y"
                value={settings.text}
                onChange={(e) => onChange({ text: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="font-family" className="block text-xs font-medium text-gray-400 mb-1">
                  Font Style:
                </label>
                <select
                  id="font-family"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2 text-xs text-white focus:border-red-500 outline-none"
                  value={settings.fontFamily}
                  onChange={(e) => onChange({ fontFamily: e.target.value })}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="text-color" className="block text-xs font-medium text-gray-400 mb-1">
                  Text Color:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="text-color"
                    value={settings.textColor}
                    className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent"
                    onChange={(e) => onChange({ textColor: e.target.value.toUpperCase() })}
                  />
                  <input
                    type="text"
                    value={settings.textColor}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white uppercase font-mono"
                    onChange={(e) => {
                      const v = e.target.value
                      if (/^#[0-9A-F]{6}$/i.test(v)) onChange({ textColor: v.toUpperCase() })
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <RangeField
                label="Font Size"
                value={settings.fontSize}
                min={20}
                max={100}
                suffix="px"
                accent="accent-red-500"
                onChange={(fontSize) => onChange({ fontSize })}
              />
              <RangeField
                label="Letter Spacing"
                value={settings.letterSpacing}
                min={-5}
                max={25}
                suffix="px"
                accent="accent-red-500"
                onChange={(letterSpacing) => onChange({ letterSpacing })}
              />
            </div>
          </section>

          {/* Grader Marks & Stamps */}
          <section className="bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h2 className="text-sm font-semibold text-gray-200">Exam Grader & Stamps</h2>
              <span className="text-[11px] text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                TA / Professor Stamp
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="grader-mark" className="block text-xs font-medium text-gray-400 mb-1">
                  Red Pen Annotation:
                </label>
                <select
                  id="grader-mark"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2 text-xs text-white focus:border-red-500 outline-none"
                  value={settings.graderMark}
                  onChange={(e) =>
                    onChange({
                      graderMark: e.target.value as GeneratorSettings['graderMark'],
                    })
                  }
                >
                  <option value="none">None</option>
                  <option value="circle">Hurried Red Circle ⭕</option>
                  <option value="strike_through">Double Strike-Through <s>Text</s></option>
                  <option value="question_mark">Question Mark ?! in Margin</option>
                  <option value="cross">Red Cross ❌</option>
                  <option value="checkmark">Red Checkmark ✔️</option>
                </select>
              </div>

              <div>
                <label htmlFor="grader-stamp" className="block text-xs font-medium text-gray-400 mb-1">
                  Grader Grade Stamp:
                </label>
                <select
                  id="grader-stamp"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2 text-xs text-white focus:border-red-500 outline-none"
                  value={settings.graderStamp}
                  onChange={(e) =>
                    onChange({
                      graderStamp: e.target.value as GeneratorSettings['graderStamp'],
                    })
                  }
                >
                  <option value="none">None</option>
                  <option value="zero">0 / 100 (נכשל)</option>
                  <option value="minus_ten">-10 (שגיאה)</option>
                  <option value="recheck">ערעור נדחה</option>
                  <option value="fail">FAIL (חזרה על הקורס)</option>
                  <option value="pass">עובר בקושי (56)</option>
                  <option value="hundred">100 (מצוין!)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.inkBleed}
                  className="w-4 h-4 rounded text-red-600 bg-gray-800 border-gray-700 focus:ring-red-500"
                  onChange={(e) => onChange({ inkBleed: e.target.checked })}
                />
                <span>Ballpoint Ink Bleed / Shadow</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.whatsappOptimized}
                  className="w-4 h-4 rounded text-emerald-500 bg-gray-800 border-gray-700 focus:ring-emerald-500"
                  onChange={(e) => onChange({ whatsappOptimized: e.target.checked })}
                />
                <span className="text-emerald-400 font-medium">WhatsApp Sticker Size (512×512)</span>
              </label>
            </div>
          </section>

          {/* Grid Paper Style */}
          <section className="bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-gray-200 border-b border-gray-800 pb-2">
              Paper Texture & Dimensions
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <RangeField
                label="Grid Cell Size"
                value={settings.gridSize}
                min={15}
                max={80}
                suffix="px"
                accent="accent-blue-500"
                onChange={(gridSize) => onChange({ gridSize })}
              />
              <RangeField
                label="Line Thickness"
                value={settings.lineWidth}
                min={1}
                max={6}
                step={0.5}
                suffix="px"
                accent="accent-blue-500"
                onChange={(lineWidth) => onChange({ lineWidth })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="paper-bg" className="block text-xs font-medium text-gray-400 mb-1">
                  Paper Theme:
                </label>
                <select
                  id="paper-bg"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2 text-xs text-white"
                  value={settings.paperBg}
                  onChange={(e) => onChange({ paperBg: e.target.value })}
                >
                  {PAPER_THEMES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="canvas-size" className="block text-xs font-medium text-gray-400 mb-1">
                  Aspect Ratio / Size:
                </label>
                <select
                  id="canvas-size"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2 text-xs text-white"
                  value={sizeKey}
                  onChange={(e) => {
                    const opt = CANVAS_SIZE_OPTIONS.find((o) => o.value === e.target.value)
                    if (opt) onChange({ canvasSize: { width: opt.width, height: opt.height } })
                  }}
                >
                  {CANVAS_SIZE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.roughGrid}
                  className="w-4 h-4 rounded text-red-600 bg-gray-800 border-gray-700 focus:ring-red-500"
                  onChange={(e) => onChange({ roughGrid: e.target.checked })}
                />
                <span>Rough/Scanned Texture</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showMarginLine}
                  className="w-4 h-4 rounded text-red-600 bg-gray-800 border-gray-700 focus:ring-red-500"
                  onChange={(e) => onChange({ showMarginLine: e.target.checked })}
                />
                <span>Notebook Margin Line</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showBinderHoles}
                  className="w-4 h-4 rounded text-red-600 bg-gray-800 border-gray-700 focus:ring-red-500"
                  onChange={(e) => onChange({ showBinderHoles: e.target.checked })}
                />
                <span>Binder Punch Holes</span>
              </label>
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: Freehand Grader Pen / Doodles */}
      {activeTab === 'draw' && (
        <section className="bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-200">Grader Red Pen / Freehand Draw</h2>
              <p className="text-xs text-gray-400">
                Touch or drag directly on the canvas preview above to draw scribbles!
              </p>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                isDrawingMode
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {isDrawingMode ? 'Pen Active' : 'Off'}
            </span>
          </div>

          <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-gray-200">Interactive Canvas Scribbler</div>
              <div className="text-[11px] text-gray-400">
                Draw circles around text, question marks or angry crosses
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggleDrawingMode(!isDrawingMode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
                isDrawingMode
                  ? 'bg-red-600 hover:bg-red-500 text-white ring-2 ring-red-400/30'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
              }`}
            >
              {isDrawingMode ? '🛑 Stop Drawing' : '✏️ Start Drawing'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Pen Ink Color:
              </label>
              <div className="flex items-center gap-2">
                {['#D91414', '#B91C1C', '#E11D48', '#1D4ED8', '#047857', '#111827'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onChangeDrawingColor(c)}
                    className={`w-7 h-7 rounded-full transition transform active:scale-90 ${
                      drawingColor.toUpperCase() === c.toUpperCase()
                        ? 'ring-2 ring-white scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <RangeField
              label="Pen Thickness"
              value={drawingWidth}
              min={1}
              max={12}
              step={0.5}
              suffix="px"
              accent="accent-red-500"
              onChange={onChangeDrawingWidth}
            />
          </div>

          {settings.drawings.length > 0 && (
            <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {settings.drawings.length} stroke{settings.drawings.length > 1 ? 's' : ''} on canvas
              </span>
              <button
                type="button"
                onClick={onClearDrawings}
                className="px-3 py-1 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-lg text-xs font-medium transition"
              >
                🗑️ Clear All Pen Strokes
              </button>
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Memes & Image Insertion */}
      {activeTab === 'memes' && (
        <section className="bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-200">Exam Memes & Stickers</h2>
              <p className="text-xs text-gray-400">
                Add classic university roasts, Pepe, Wojak, or upload your own photo
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenMemePicker}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition shadow"
            >
              Browse Vault 🚀
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={onOpenMemePicker}
              className="p-3 bg-gray-950/90 hover:bg-gray-800/80 border border-gray-800 rounded-xl text-left transition flex flex-col gap-1.5 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📜</span>
              <span className="text-xs font-bold text-gray-200">Exam Roast Presets</span>
              <span className="text-[10px] text-gray-400">0/100, WTF proof, Taylor ≈ 0</span>
            </button>

            <label className="p-3 bg-gray-950/90 hover:bg-gray-800/80 border border-gray-800 rounded-xl text-left transition flex flex-col gap-1.5 group cursor-pointer">
              <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
              <span className="text-xs font-bold text-gray-200">Upload Photo</span>
              <span className="text-[10px] text-gray-400">PNG, JPG or sticker badge</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) onCustomImageUpload(f)
                }}
              />
            </label>

            <button
              type="button"
              onClick={onOpenMemePicker}
              className="p-3 bg-gray-950/90 hover:bg-gray-800/80 border border-gray-800 rounded-xl text-left transition flex flex-col gap-1.5 group col-span-2 sm:col-span-1"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🐸</span>
              <span className="text-xs font-bold text-gray-200">Meme Faces</span>
              <span className="text-[10px] text-gray-400">Pepe, Wojak, Crying Cat</span>
            </button>
          </div>

          {/* List of currently active inserted images */}
          {settings.images.length > 0 && (
            <div className="pt-2 border-t border-gray-800 space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Active Stickers on Canvas ({settings.images.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {settings.images.map((img) => (
                  <div
                    key={img.id}
                    className="flex items-center gap-2 p-1.5 bg-gray-950 rounded-lg border border-gray-800"
                  >
                    <img
                      src={img.dataUrl}
                      alt="sticker"
                      className="w-7 h-7 object-contain rounded"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(img.id)}
                      className="text-gray-400 hover:text-red-400 text-xs px-1"
                      title="Remove sticker"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Tab 4: AI Roast Generator */}
      {activeTab === 'ai' && (
        <section className="bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-1.5">
                <span>✨</span>
                <span>OpenRouter AI Exam Generator</span>
              </h2>
              <p className="text-xs text-gray-400">
                Auto-generate exam roasts, sarcastic TA marks & stamps
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAiGenerator}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition shadow"
            >
              Open AI Modal 🔮
            </button>
          </div>

          <div className="p-3 bg-purple-950/20 border border-purple-900/40 rounded-xl space-y-2">
            <div className="text-xs text-purple-200 font-semibold">
              Instant AI Roast Themes:
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                type="button"
                onClick={onOpenAiGenerator}
                className="px-2 py-1 bg-purple-900/40 hover:bg-purple-800 text-purple-300 rounded border border-purple-700/50"
              >
                Calculus Disaster
              </button>
              <button
                type="button"
                onClick={onOpenAiGenerator}
                className="px-2 py-1 bg-purple-900/40 hover:bg-purple-800 text-purple-300 rounded border border-purple-700/50"
              >
                Linear Algebra det(A)=0
              </button>
              <button
                type="button"
                onClick={onOpenAiGenerator}
                className="px-2 py-1 bg-purple-900/40 hover:bg-purple-800 text-purple-300 rounded border border-purple-700/50"
              >
                Begging for 56
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  accent,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix: string
  accent: string
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}:</span>
        <span className="text-white font-mono">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className={`w-full ${accent} bg-gray-800 rounded-lg h-2 cursor-pointer`}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
