import {
  CANVAS_SIZE_OPTIONS,
  FONT_OPTIONS,
  PAPER_THEMES,
  type GeneratorSettings,
} from '../types'
import { isRTLText } from '../lib/rtl'

type Props = {
  settings: GeneratorSettings
  onChange: (patch: Partial<GeneratorSettings>) => void
}

export function Controls({ settings, onChange }: Props) {
  const rtl = isRTLText(settings.text)
  const sizeKey = `${settings.canvasSize.width}x${settings.canvasSize.height}`

  return (
    <div className="lg:col-span-5 flex flex-col gap-5">
      <section className="bg-gray-900 rounded-xl p-4 border border-gray-800 shadow-sm space-y-4">
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
            className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white text-lg font-mono focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition resize-y"
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

      <section className="bg-gray-900 rounded-xl p-4 border border-gray-800 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-200 border-b border-gray-800 pb-2">
          Grid & Paper Styling
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
            <label htmlFor="grid-color" className="block text-xs font-medium text-gray-400 mb-1">
              Grid Line Color:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="grid-color"
                value={settings.gridColor}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                onChange={(e) => onChange({ gridColor: e.target.value.toUpperCase() })}
              />
              <span className="text-xs text-gray-400 font-mono">{settings.gridColor}</span>
            </div>
          </div>

          <div>
            <label htmlFor="paper-bg" className="block text-xs font-medium text-gray-400 mb-1">
              Paper Background:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="paper-bg"
                value={settings.paperBg}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                onChange={(e) => onChange({ paperBg: e.target.value.toUpperCase() })}
              />
              <select
                className="bg-gray-950 border border-gray-700 rounded text-xs px-2 py-1 text-white"
                value={
                  PAPER_THEMES.some((t) => t.value === settings.paperBg)
                    ? settings.paperBg
                    : settings.paperBg
                }
                onChange={(e) => onChange({ paperBg: e.target.value })}
              >
                {PAPER_THEMES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
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
              checked={settings.alignGrid}
              className="w-4 h-4 rounded text-red-600 bg-gray-800 border-gray-700 focus:ring-red-500"
              onChange={(e) => onChange({ alignGrid: e.target.checked })}
            />
            <span>Center & Align Text to Grid</span>
          </label>
        </div>
      </section>

      <section className="bg-gray-900 rounded-xl p-4 border border-gray-800 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-gray-200 border-b border-gray-800 pb-2">
          Animation & Typing Settings
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <RangeField
            label="Typing Speed"
            value={settings.typeSpeed}
            min={50}
            max={600}
            step={10}
            suffix="ms"
            accent="accent-emerald-500"
            onChange={(typeSpeed) => onChange({ typeSpeed })}
          />
          <RangeField
            label="End Pause"
            value={settings.endPause}
            min={0.2}
            max={3}
            step={0.2}
            suffix="s"
            accent="accent-emerald-500"
            onChange={(endPause) => onChange({ endPause })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="cursor-style" className="block text-xs font-medium text-gray-400 mb-1">
              Cursor Style:
            </label>
            <select
              id="cursor-style"
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2 text-xs text-white"
              value={settings.cursorStyle}
              onChange={(e) =>
                onChange({
                  cursorStyle: e.target.value as GeneratorSettings['cursorStyle'],
                })
              }
            >
              <option value="none">None</option>
              <option value="block">Block ▋</option>
              <option value="pipe">Line |</option>
              <option value="underscore">Underscore _</option>
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
      </section>
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
