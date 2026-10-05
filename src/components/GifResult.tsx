type Props = {
  visible: boolean
  percent: number
  label: string
  imageUrl: string | null
  onClose: () => void
}

export function GifResult({ visible, percent, label, imageUrl, onClose }: Props) {
  if (!visible) return null

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-emerald-800/60 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h3 className="text-sm font-bold text-emerald-400">Generated Animated GIF</h3>
        <button type="button" className="text-gray-400 hover:text-white text-xs" onClick={onClose}>
          Close
        </button>
      </div>

      {!imageUrl ? (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-300">
            <span>{label}</span>
            <span className="font-mono text-emerald-400">{percent}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-[width] duration-150"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 pt-2">
          <img
            src={imageUrl}
            className="max-w-full rounded border border-gray-700 shadow-md"
            alt="Animated Text GIF"
          />
          <a
            download={`grid-typing-${Date.now()}.gif`}
            href={imageUrl}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow-lg"
          >
            Save GIF File
          </a>
        </div>
      )}
    </div>
  )
}
