import type { GeneratorSettings } from '../types'

type Props = {
  onApplyPreset: (patch: Partial<GeneratorSettings>) => void
  onOpenMemePicker: () => void
  onOpenAiGenerator: () => void
  onOpenAdmin: () => void
}

export function Header({
  onApplyPreset,
  onOpenMemePicker,
  onOpenAiGenerator,
  onOpenAdmin,
}: Props) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-3 sm:px-4 py-2.5 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-950/60 text-white font-black text-lg sm:text-xl flex-shrink-0">
            א
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white leading-tight flex items-center gap-1.5 truncate">
              <span>Grid Paper Stickers</span>
              <span className="hidden xs:inline text-[10px] bg-red-950 text-red-400 font-mono px-1.5 py-0.5 rounded border border-red-800">
                WhatsApp 512
              </span>
            </h1>
            <p className="text-[11px] text-gray-400 truncate hidden sm:block">
              Red retro handwriting, TA exam grader marks & animated GIFs
            </p>
          </div>
        </div>

        {/* Quick Launch Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onOpenMemePicker}
            className="text-xs px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-800/80 transition font-medium flex items-center gap-1 active:scale-95 shadow-sm"
          >
            <span>🎭</span>
            <span className="hidden xs:inline">Memes</span>
          </button>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="text-xs px-2 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
            title="Admin AI settings"
          >
            ⚙️
          </button>

          <button
            type="button"
            onClick={onOpenAiGenerator}
            className="text-xs px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-800/80 transition font-medium flex items-center gap-1 active:scale-95 shadow-sm"
          >
            <span>✨</span>
            <span className="hidden xs:inline">AI Roast</span>
          </button>

          {/* Quick preset */}
          <button
            type="button"
            className="text-xs px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-red-400 border border-gray-700 transition font-mono whitespace-nowrap active:scale-95"
            onClick={() =>
              onApplyPreset({
                text: 'אוי ואבוי',
                fontFamily: "'Heebo', sans-serif",
                textColor: '#D91414',
                fontSize: 52,
                gridSize: 45,
                roughGrid: true,
                canvasSize: { width: 512, height: 512 },
                showMarginLine: true,
                showBinderHoles: true,
                graderMark: 'circle',
                graderStamp: 'zero',
                inkBleed: true,
              })
            }
            title="Load classic 'אוי ואבוי' Uni Grader preset"
          >
            0/100
          </button>
        </div>
      </div>
    </header>
  )
}
