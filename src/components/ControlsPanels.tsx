import type { GeneratorSettings } from '../types'
import { CANVAS_SIZE_OPTIONS, FONT_OPTIONS, PAPER_THEMES } from '../types'
import type { ControlsProps } from './Controls'

const card = 'bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-sm space-y-4'
const input = 'w-full bg-gray-950 border border-gray-700 rounded-xl p-2 text-xs text-white'

export function TextControls({ settings, onChange }: Pick<ControlsProps, 'settings' | 'onChange'>) {
  return (
    <div className="flex flex-col gap-4">
      <section className={card}>
        <h2 className="text-sm font-semibold text-gray-200 border-b border-gray-800 pb-2">Text & Typography</h2>
        <label htmlFor="text-input" className="text-xs text-gray-400">Input Text (Hebrew / English)</label>
        <textarea id="text-input" rows={2} value={settings.text} onChange={(event) => onChange({ text: event.target.value })} className={`${input} text-lg resize-y`} />
        <div className="grid grid-cols-2 gap-3">
          <label htmlFor="font-family" className="text-xs text-gray-400">Font
            <select id="font-family" value={settings.fontFamily} onChange={(event) => onChange({ fontFamily: event.target.value })} className={`mt-1 ${input}`}>
              {FONT_OPTIONS.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
            </select>
          </label>
          <label htmlFor="text-color" className="text-xs text-gray-400">Text color
            <input id="text-color" type="color" value={settings.textColor} onChange={(event) => onChange({ textColor: event.target.value.toUpperCase() })} className="mt-1 h-9 w-full bg-transparent" />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <RangeField label="Font size" value={settings.fontSize} min={20} max={100} suffix="px" onChange={(fontSize) => onChange({ fontSize })} />
          <RangeField label="Letter spacing" value={settings.letterSpacing} min={-5} max={25} suffix="px" onChange={(letterSpacing) => onChange({ letterSpacing })} />
        </div>
      </section>

      <section className={card}>
        <h2 className="text-sm font-semibold text-gray-200 border-b border-gray-800 pb-2">Grader marks</h2>
        <SelectField id="grader-mark" label="Red pen annotation" value={settings.graderMark} onChange={(graderMark) => onChange({ graderMark: graderMark as GeneratorSettings['graderMark'] })} options={[
          ['none', 'None'], ['circle', 'Hurried circle'], ['strike_through', 'Strike-through'], ['question_mark', 'Question mark'], ['cross', 'Red cross'], ['checkmark', 'Checkmark'],
        ]} />
        <SelectField id="grader-stamp" label="Grade stamp" value={settings.graderStamp} onChange={(graderStamp) => onChange({ graderStamp: graderStamp as GeneratorSettings['graderStamp'] })} options={[
          ['none', 'None'], ['zero', '0 / 100'], ['minus_ten', '-10'], ['recheck', 'Appeal denied'], ['fail', 'FAIL'], ['pass', 'Barely passed'], ['hundred', '100'],
        ]} />
        <Check label="Ballpoint ink bleed" checked={settings.inkBleed} onChange={(inkBleed) => onChange({ inkBleed })} />
        <Check label="WhatsApp 512×512 export" checked={settings.whatsappOptimized} onChange={(whatsappOptimized) => onChange({ whatsappOptimized })} />
      </section>

      <section className={card}>
        <h2 className="text-sm font-semibold text-gray-200 border-b border-gray-800 pb-2">Paper & animation</h2>
        <div className="grid grid-cols-2 gap-3">
          <RangeField label="Grid size" value={settings.gridSize} min={15} max={80} suffix="px" onChange={(gridSize) => onChange({ gridSize })} />
          <RangeField label="Line width" value={settings.lineWidth} min={1} max={6} step={0.5} suffix="px" onChange={(lineWidth) => onChange({ lineWidth })} />
          <RangeField label="Typing speed" value={settings.typeSpeed} min={50} max={600} step={10} suffix="ms" onChange={(typeSpeed) => onChange({ typeSpeed })} />
          <RangeField label="End pause" value={settings.endPause} min={0.2} max={3} step={0.2} suffix="s" onChange={(endPause) => onChange({ endPause })} />
        </div>
        <SelectField id="paper-bg" label="Paper theme" value={settings.paperBg} onChange={(paperBg) => onChange({ paperBg })} options={PAPER_THEMES.map((theme) => [theme.value, theme.label])} />
        <SelectField id="canvas-size" label="Canvas size" value={`${settings.canvasSize.width}x${settings.canvasSize.height}`} onChange={(value) => {
          const option = CANVAS_SIZE_OPTIONS.find((item) => item.value === value)
          if (option) onChange({ canvasSize: { width: option.width, height: option.height } })
        }} options={CANVAS_SIZE_OPTIONS.map((option) => [option.value, option.label])} />
        <Check label="Rough paper texture" checked={settings.roughGrid} onChange={(roughGrid) => onChange({ roughGrid })} />
        <Check label="Notebook margin line" checked={settings.showMarginLine} onChange={(showMarginLine) => onChange({ showMarginLine })} />
        <Check label="Binder punch holes" checked={settings.showBinderHoles} onChange={(showBinderHoles) => onChange({ showBinderHoles })} />
      </section>
    </div>
  )
}

export function DrawingControls({ isDrawingMode, onToggleDrawingMode, drawingColor, onChangeDrawingColor, drawingWidth, onChangeDrawingWidth, settings, onClearDrawings }: Pick<ControlsProps, 'isDrawingMode' | 'onToggleDrawingMode' | 'drawingColor' | 'onChangeDrawingColor' | 'drawingWidth' | 'onChangeDrawingWidth' | 'settings' | 'onClearDrawings'>) {
  const colors = ['#D91414', '#B91C1C', '#E11D48', '#1D4ED8', '#047857', '#111827']
  return <section className={card}>
    <h2 className="text-sm font-semibold text-gray-200">Grader red pen</h2>
    <p className="text-xs text-gray-400">Draw directly on the preview canvas.</p>
    <button type="button" onClick={() => onToggleDrawingMode(!isDrawingMode)} className="rounded-xl bg-red-600 p-3 text-xs font-bold text-white">{isDrawingMode ? 'Stop drawing' : 'Start drawing'}</button>
    <div className="flex items-center gap-2">
      {colors.map((color) => <button key={color} type="button" aria-label={`Use pen color ${color}`} onClick={() => onChangeDrawingColor(color)} className={`h-7 w-7 rounded-full ${drawingColor === color ? 'ring-2 ring-white' : 'opacity-70'}`} style={{ backgroundColor: color }} />)}
    </div>
    <RangeField label="Pen thickness" value={drawingWidth} min={1} max={12} step={0.5} suffix="px" onChange={onChangeDrawingWidth} />
    {settings.drawings.length > 0 && <button type="button" onClick={onClearDrawings} className="rounded-lg bg-red-950 p-2 text-xs text-red-300">Clear {settings.drawings.length} strokes</button>}
  </section>
}

export function MemeControls({ onOpenMemePicker, onCustomImageUpload, settings, onRemoveImage }: Pick<ControlsProps, 'onOpenMemePicker' | 'onCustomImageUpload' | 'settings' | 'onRemoveImage'>) {
  return <section className={card}>
    <h2 className="text-sm font-semibold text-gray-200">Memes & images</h2>
    <p className="text-xs text-gray-400">Add exam roasts, meme faces, or your own image.</p>
    <button type="button" onClick={onOpenMemePicker} className="rounded-xl bg-amber-600 p-3 text-xs font-bold text-white">Browse meme vault</button>
    <label htmlFor="controls-image-upload" className="cursor-pointer rounded-xl border border-dashed border-gray-700 p-4 text-center text-xs text-gray-300">Upload image
      <input id="controls-image-upload" type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) onCustomImageUpload(file) }} />
    </label>
    {settings.images.length > 0 && <div className="flex flex-wrap gap-2">{settings.images.map((image) => <button key={image.id} type="button" onClick={() => onRemoveImage(image.id)} className="rounded bg-gray-950 p-1 text-xs" title="Remove image"><img src={image.dataUrl} alt="Inserted sticker" className="h-10 w-10 object-contain" /></button>)}</div>}
  </section>
}

export function AiControls({ onOpenAiGenerator }: Pick<ControlsProps, 'onOpenAiGenerator'>) {
  return <section className={card}>
    <h2 className="text-sm font-semibold text-gray-200">AI exam roast</h2>
    <p className="text-xs text-gray-400">Generate a scene from an exam topic.</p>
    <button type="button" onClick={onOpenAiGenerator} className="rounded-xl bg-purple-700 p-3 text-xs font-bold text-white">Open AI generator</button>
  </section>
}

function SelectField({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: string[][]; onChange: (value: string) => void }) {
  return <label htmlFor={id} className="block text-xs text-gray-400">{label}<select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={`mt-1 ${input}`}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center gap-2 text-xs text-gray-300"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>
}

function RangeField({ label, value, min, max, step = 1, suffix, onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix: string; onChange: (value: number) => void }) {
  return <label className="block text-xs text-gray-400">{label}<span className="float-right font-mono text-white">{value}{suffix}</span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full accent-red-500" /></label>
}
