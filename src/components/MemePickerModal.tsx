import { useState } from 'react'
import type { GeneratorSettings } from '../types'
import { MEME_PRESETS, type MemePreset } from '../data/memePresets'
import { BUILTIN_MEMES, type BuiltinSticker } from '../data/builtinMemes'

type Props = {
  isOpen: boolean
  onClose: () => void
  onApplyPreset: (patch: Partial<GeneratorSettings>) => void
  onInsertSticker: (svgDataUrl: string) => void
  onCustomImageUpload: (file: File) => void
}

export function MemePickerModal({
  isOpen,
  onClose,
  onApplyPreset,
  onInsertSticker,
  onCustomImageUpload,
}: Props) {
  const [activeTab, setActiveTab] = useState<'presets' | 'faces'>('presets')
  const [filter, setFilter] = useState<'all' | 'uni' | 'classic' | 'roast'>('all')

  if (!isOpen) return null

  const filteredPresets = MEME_PRESETS.filter((p) => {
    if (filter === 'all') return true
    return p.category === filter
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onCustomImageUpload(file)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div
        className="w-full max-w-xl bg-gray-900 border-t sm:border border-gray-800 sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/90">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎭</span>
            <div>
              <h2 className="text-base font-bold text-white">Meme & Sticker Vault</h2>
              <p className="text-xs text-gray-400">
                Exam roast templates, famous faces & custom sticker uploads
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-gray-800 bg-gray-950/60 px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 ${
              activeTab === 'presets'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            📜 Exam Meme Presets ({MEME_PRESETS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faces')}
            className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 ${
              activeTab === 'faces'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            🐸 Meme Faces & Custom ({BUILTIN_MEMES.length})
          </button>
        </div>

        {/* Tab 1: Exam Meme Presets */}
        {activeTab === 'presets' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Filter pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['all', 'uni', 'roast', 'classic'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap transition ${
                    filter === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                  }`}
                >
                  {cat === 'all' ? 'All Memes' : cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {filteredPresets.map((preset: MemePreset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onApplyPreset(preset.patch)
                    onClose()
                  }}
                  className="p-3 rounded-xl bg-gray-950/80 hover:bg-gray-800/90 border border-gray-800 hover:border-red-600/50 text-left transition flex items-start gap-3 group"
                >
                  <span className="text-2xl p-1.5 bg-gray-800/70 rounded-lg group-hover:scale-110 transition-transform">
                    {preset.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-100 group-hover:text-red-400 transition truncate">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-gray-400 line-clamp-1">
                      {preset.subtitle}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono mt-1">
                      {preset.patch.graderStamp ? `Stamp: ${preset.patch.graderStamp}` : ''}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Built-in faces + custom file upload */}
        {activeTab === 'faces' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Classic University Meme Faces:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {BUILTIN_MEMES.map((meme: BuiltinSticker) => (
                  <button
                    key={meme.id}
                    type="button"
                    onClick={() => {
                      onInsertSticker(meme.svgDataUrl)
                      onClose()
                    }}
                    className="flex flex-col items-center gap-1.5 p-2 bg-gray-950/80 hover:bg-gray-800 border border-gray-800 hover:border-amber-500 rounded-xl transition group"
                  >
                    <img
                      src={meme.svgDataUrl}
                      alt={meme.name}
                      className="w-14 h-14 object-contain rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[11px] font-medium text-gray-300 text-center truncate w-full">
                      {meme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Upload Custom Photo / Sticker:
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 hover:border-emerald-500 bg-gray-950/50 hover:bg-emerald-950/10 rounded-xl p-5 cursor-pointer transition">
                <span className="text-2xl mb-1">📸</span>
                <span className="text-xs font-semibold text-gray-200">
                  Tap to upload PNG, JPEG or WebP
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  Placed directly on the graph paper canvas
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-gray-800 bg-gray-950/80 flex justify-between items-center text-xs text-gray-500">
          <span>Stickers are embedded directly into WhatsApp exports</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-750 text-gray-300 rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
