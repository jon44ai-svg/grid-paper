import { useState } from 'react'
import type { GeneratorSettings } from '../types'
import type { AiConfig } from '../lib/aiConfig'
import {
  generateAiExamScene,
  getRandomSurprisePrompt,
  type AiSceneResult,
} from '../lib/openRouterAi'

type Props = {
  isOpen: boolean
  onClose: () => void
  onApplyScene: (patch: Partial<GeneratorSettings>) => void
  aiConfig: AiConfig
}

export function AiGeneratorModal({ isOpen, onClose, onApplyScene, aiConfig }: Props) {
  const [userApiKey, setUserApiKey] = useState(() => localStorage.getItem('grid-paper-user-openrouter-key') || '')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [lastResult, setLastResult] = useState<AiSceneResult | null>(null)

  if (!isOpen) return null

  const handleSurpriseMe = async () => {
    const randomTopic = getRandomSurprisePrompt()
    setPrompt(randomTopic)
    await runGeneration(randomTopic)
  }

  const handleCustomGenerate = async () => {
    if (!prompt.trim()) {
      handleSurpriseMe()
      return
    }
    await runGeneration(prompt.trim())
  }

  const runGeneration = async (themePrompt: string) => {
    setIsGenerating(true)
    setErrorMsg('')
    try {
      const result = await generateAiExamScene(themePrompt, userApiKey, aiConfig)
      setLastResult(result)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const applyCurrentResult = () => {
    if (!lastResult) return
    onApplyScene(lastResult.patch)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div
        className="w-full max-w-lg bg-gray-900 border-t sm:border border-gray-800 sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-gray-900 to-red-950/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                OpenRouter AI Exam Roast
                <span className="text-[10px] bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700/60 font-mono">
                  Auto-Scene
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Generate sarcastic exam errors, grader stamps & pen marks
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Security notice */}
          <div className="p-3 bg-gray-950/70 rounded-xl border border-gray-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <span>🔒</span>
                <span>Secure AI scene generation</span>
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              On Vercel, the OpenRouter key stays server-side. GitHub Pages uses the offline scene generator.
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-[11px] text-purple-400">Use my own OpenRouter key</summary>
              <input
                type="password"
                value={userApiKey}
                onChange={(e) => {
                  setUserApiKey(e.target.value)
                  localStorage.setItem('grid-paper-user-openrouter-key', e.target.value)
                }}
                placeholder="Optional personal key"
                className="mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
              <p className="mt-1 text-[10px] text-gray-500">Stored only in this browser and sent directly to OpenRouter when used.</p>
            </details>
          </div>

          {/* Theme Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300">
              Exam Theme or Topic:
            </label>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Calculus derivative mistake, Cries in Linear Algebra, Taylor series = 0..."
              className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-purple-500 outline-none resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleSurpriseMe}
              className="py-2.5 px-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-purple-950/40 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>🎲</span>
              <span>Surprise Me (Exam Roast)</span>
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleCustomGenerate}
              className="py-2.5 px-3 bg-gray-800 hover:bg-gray-750 text-white border border-gray-700 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>{isGenerating ? '⏳ Generating...' : '✨ Generate Scene'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="text-xs text-red-400 bg-red-950/50 border border-red-800/60 p-2.5 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Generated Result Preview */}
          {lastResult && (
            <div className="p-3.5 bg-gray-950 rounded-xl border border-purple-500/40 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                  Generated Exam Scene:
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {lastResult.patch.graderStamp ? `Stamp: ${lastResult.patch.graderStamp}` : ''}
                </span>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-amber-200 text-base font-bold text-center whitespace-pre-line font-mono">
                {lastResult.patch.text}
              </div>

              <div className="text-xs text-gray-400 italic">
                💬 {lastResult.roastReason}
              </div>

              <button
                type="button"
                onClick={applyCurrentResult}
                className="w-full py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold rounded-lg shadow-md transition transform active:scale-95"
              >
                Apply to Canvas Now 🎯
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800 bg-gray-950/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-750 text-gray-300 rounded-lg text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
