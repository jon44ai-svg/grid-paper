import type { GeneratorSettings } from '../types'

type Props = {
  onApplyPreset: (patch: Partial<GeneratorSettings>) => void
}

export function Header({ onApplyPreset }: Props) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/50 text-white font-black text-xl">
            א
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight flex items-center gap-2">
              Grid Text & GIF Generator
              <span className="text-xs bg-red-900/80 text-red-300 font-mono px-2 py-0.5 rounded-full border border-red-700">
                HD GIF & PNG
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Create red retro text on graph paper & export typing animations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Presets:</span>
          <button
            type="button"
            className="text-xs px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-red-400 border border-gray-700 transition font-mono whitespace-nowrap"
            onClick={() =>
              onApplyPreset({
                text: 'אוי ואבוי',
                fontFamily: "'Heebo', sans-serif",
                textColor: '#E50914',
                fontSize: 52,
                gridSize: 45,
                roughGrid: true,
              })
            }
          >
            &quot;אוי ואבוי&quot; (Original)
          </button>
          <button
            type="button"
            className="text-xs px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-blue-400 border border-gray-700 transition font-mono whitespace-nowrap"
            onClick={() =>
              onApplyPreset({
                text: 'GAME OVER',
                fontFamily: "'Press Start 2P', cursive",
                textColor: '#E50914',
                fontSize: 42,
                gridSize: 40,
              })
            }
          >
            &quot;GAME OVER&quot;
          </button>
          <button
            type="button"
            className="text-xs px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-emerald-400 border border-gray-700 transition font-mono whitespace-nowrap"
            onClick={() =>
              onApplyPreset({
                text: 'שלום עולם!',
                fontFamily: "'Rubik Mono One', sans-serif",
                textColor: '#E50914',
                fontSize: 46,
              })
            }
          >
            &quot;שלום עולם&quot;
          </button>
        </div>
      </div>
    </header>
  )
}
