import { useMemo } from 'react'
import { isRTLText } from '../lib/rtl'
import type { GeneratorSettings } from '../types'
import { AiControls, DrawingControls, MemeControls, TextControls } from './ControlsPanels'

export type ControlsTab = 'text' | 'draw' | 'memes' | 'ai'

export type ControlsProps = {
  settings: GeneratorSettings
  onChange: (patch: Partial<GeneratorSettings>) => void
  activeTab: ControlsTab
  onTabChange: (tab: ControlsTab) => void
  isDrawingMode: boolean
  onToggleDrawingMode: (active: boolean) => void
  drawingColor: string
  onChangeDrawingColor: (color: string) => void
  drawingWidth: number
  onChangeDrawingWidth: (width: number) => void
  onClearDrawings: () => void
  onOpenMemePicker: () => void
  onOpenAiGenerator: () => void
  onCustomImageUpload: (file: File) => void
  onRemoveImage: (id: string) => void
}

const tabs: { id: ControlsTab; icon: string; label: string }[] = [
  { id: 'text', icon: '✍️', label: 'Text' },
  { id: 'draw', icon: '🎨', label: 'Draw' },
  { id: 'memes', icon: '🖼️', label: 'Memes' },
  { id: 'ai', icon: '✨', label: 'AI' },
]

export function Controls(props: ControlsProps) {
  const direction = useMemo(() => (isRTLText(props.settings.text) ? 'RTL' : 'LTR'), [props.settings.text])

  return (
    <div className="flex flex-col gap-4">
      <nav aria-label="Sticker controls" className="grid grid-cols-4 gap-1 rounded-2xl border border-gray-800 bg-gray-900/90 p-1.5 shadow-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-current={props.activeTab === tab.id ? 'page' : undefined}
            onClick={() => props.onTabChange(tab.id)}
            className={`rounded-xl py-2 text-xs font-semibold transition ${props.activeTab === tab.id ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
          >
            <span className="mr-1">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </nav>

      {props.activeTab === 'text' && <TextControls settings={props.settings} onChange={(patch) => props.onChange({ ...patch, ...(patch.text !== undefined ? {} : {}) })} />}
      {props.activeTab === 'draw' && <DrawingControls {...props} />}
      {props.activeTab === 'memes' && <MemeControls {...props} />}
      {props.activeTab === 'ai' && <AiControls onOpenAiGenerator={props.onOpenAiGenerator} />}

      {props.activeTab === 'text' && <span className="sr-only">Text direction: {direction}</span>}
    </div>
  )
}
