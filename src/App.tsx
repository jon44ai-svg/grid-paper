import { useState } from 'react'
import { Controls } from './components/Controls'
import { Header } from './components/Header'
import { Preview } from './components/Preview'
import { useTypingPlayback } from './hooks/useTypingPlayback'
import { DEFAULT_SETTINGS, type GeneratorSettings } from './types'

export default function App() {
  const [settings, setSettings] = useState<GeneratorSettings>(DEFAULT_SETTINGS)
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

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-sans antialiased flex flex-col">
      <Header onApplyPreset={applyPreset} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Controls settings={settings} onChange={patchSettings} />
        <Preview
          settings={settings}
          charIndex={playback.charIndex}
          showCursor={playback.showCursor}
          onPlay={playback.playFromStart}
          onPause={playback.pause}
        />
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-3 px-4 text-center text-xs text-gray-500">
        Grid Paper Text & Typing Animation Generator • Client-side rendering & GIF processing
      </footer>
    </div>
  )
}
