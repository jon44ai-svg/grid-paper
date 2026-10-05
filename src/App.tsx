import { useState } from 'react'
import { Controls, type ControlsTab } from './components/Controls'
import { Header } from './components/Header'
import { Preview } from './components/Preview'
import { MemePickerModal } from './components/MemePickerModal'
import { AiGeneratorModal } from './components/AiGeneratorModal'
import { AdminModal } from './components/AdminModal'
import { loadAiConfig, saveAiConfig, type AiConfig } from './lib/aiConfig'
import { useTypingPlayback } from './hooks/useTypingPlayback'
import { DEFAULT_SETTINGS, type DrawingStroke, type GeneratorSettings, type InsertedImage } from './types'

export default function App() {
  const [settings, setSettings] = useState<GeneratorSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState<ControlsTab>('text')
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [drawingColor, setDrawingColor] = useState('#D91414')
  const [drawingWidth, setDrawingWidth] = useState(3.5)
  const [isMemePickerOpen, setIsMemePickerOpen] = useState(false)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [aiConfig, setAiConfig] = useState<AiConfig>(loadAiConfig)

  const playback = useTypingPlayback({
    textLength: settings.text.length,
    typeSpeed: settings.typeSpeed,
    endPause: settings.endPause,
  })

  function patchSettings(patch: Partial<GeneratorSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }))
    if (patch.text !== undefined) playback.resetIndex()
  }

  function applyPreset(patch: Partial<GeneratorSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }))
    playback.playFromStart()
  }

  // Handle freehand drawing stroke added from Canvas
  function handleAddStroke(stroke: DrawingStroke) {
    setSettings((prev) => ({
      ...prev,
      drawings: [...prev.drawings, stroke],
    }))
  }

  function handleClearDrawings() {
    setSettings((prev) => ({
      ...prev,
      drawings: [],
    }))
  }

  // Handle meme face / sticker insertion
  function handleInsertSticker(svgDataUrl: string) {
    const newImage: InsertedImage = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      dataUrl: svgDataUrl,
      x: 0.05,
      y: 0.05,
      width: 110,
      height: 110,
    }

    setSettings((prev) => ({
      ...prev,
      images: [...prev.images, newImage],
    }))
  }

  // Handle custom photo file upload
  function handleCustomImageUpload(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      if (!dataUrl) return
      handleInsertSticker(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveImage(id: string) {
    setSettings((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }))
  }

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-sans antialiased flex flex-col selection:bg-red-900 selection:text-white">
      <Header
        onApplyPreset={applyPreset}
        onOpenMemePicker={() => setIsMemePickerOpen(true)}
        onOpenAiGenerator={() => setIsAiModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col lg:grid lg:grid-cols-12 gap-5 sm:gap-6">
        {/* On Mobile: Sticky top preview so the user always sees their WhatsApp sticker as they adjust controls */}
        {/* On Desktop: Right column (col-span-7) */}
        <div className="w-full lg:col-span-7 lg:order-2 sticky lg:static top-[57px] z-20 pb-1 lg:pb-0">
          <Preview
            settings={settings}
            charIndex={playback.charIndex}
            showCursor={playback.showCursor}
            onPlay={playback.playFromStart}
            onPause={playback.pause}
            isDrawingMode={isDrawingMode}
            drawingColor={drawingColor}
            drawingWidth={drawingWidth}
            onAddStroke={handleAddStroke}
            onClearDrawings={handleClearDrawings}
            onToggleDrawingMode={(active) => {
              setIsDrawingMode(active)
              if (active) setActiveTab('draw')
            }}
          />
        </div>

        {/* Controls Column (col-span-5 on desktop, scrollable below sticky preview on mobile) */}
        <div className="w-full lg:col-span-5 lg:order-1">
          <Controls
            settings={settings}
            onChange={patchSettings}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab)
              if (tab === 'draw') setIsDrawingMode(true)
              else if (isDrawingMode) setIsDrawingMode(false)
            }}
            isDrawingMode={isDrawingMode}
            onToggleDrawingMode={(active) => {
              setIsDrawingMode(active)
              if (active) setActiveTab('draw')
            }}
            drawingColor={drawingColor}
            onChangeDrawingColor={setDrawingColor}
            drawingWidth={drawingWidth}
            onChangeDrawingWidth={setDrawingWidth}
            onClearDrawings={handleClearDrawings}
            onOpenMemePicker={() => setIsMemePickerOpen(true)}
            onOpenAiGenerator={() => setIsAiModalOpen(true)}
            onCustomImageUpload={handleCustomImageUpload}
            onRemoveImage={handleRemoveImage}
          />
        </div>
      </main>

      {/* Meme Vault Modal / Drawer */}
      <MemePickerModal
        isOpen={isMemePickerOpen}
        onClose={() => setIsMemePickerOpen(false)}
        onApplyPreset={applyPreset}
        onInsertSticker={handleInsertSticker}
        onCustomImageUpload={handleCustomImageUpload}
      />

      {/* OpenRouter AI Scene Generator Modal */}
      <AiGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyScene={applyPreset}
        aiConfig={aiConfig}
      />
      <AdminModal
        isOpen={isAdminModalOpen}
        config={aiConfig}
        onClose={() => setIsAdminModalOpen(false)}
        onSave={(next) => {
          setAiConfig(next)
          saveAiConfig(next)
        }}
      />

      <footer className="bg-gray-900 border-t border-gray-800 py-3.5 px-4 text-center text-xs text-gray-500">
        Grid Paper Stickers & Typing Animation Generator • Client-side Canvas rendering, Red pen doodler & GIF processing
      </footer>
    </div>
  )
}
