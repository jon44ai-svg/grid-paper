import { useState } from 'react'
import type { AiConfig } from '../lib/aiConfig'

type Props = {
  isOpen: boolean
  config: AiConfig
  onClose: () => void
  onSave: (config: AiConfig) => void
}

export function AdminModal({ isOpen, config, onClose, onSave }: Props) {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [draft, setDraft] = useState(config)
  const [error, setError] = useState('')

  if (!isOpen) return null

  function login() {
    if (username === 'admin' && password === 'admin') {
      setAuthenticated(true)
      setError('')
    } else {
      setError('Invalid demo credentials')
    }
  }

  function save() {
    onSave(draft)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-end sm:items-center justify-center sm:p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl p-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-white">Admin AI Settings</h2>
            <p className="text-[11px] text-amber-400">Demo mode: changes are saved in this browser only.</p>
          </div>
          <button type="button" aria-label="Close admin settings" onClick={onClose} className="text-gray-400 text-xl">×</button>
        </div>

        {!authenticated ? (
          <div className="space-y-3">
            <input aria-label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm" />
            <input aria-label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm" />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="button" onClick={login} className="w-full rounded-lg bg-purple-700 p-3 text-sm font-bold">Enter admin mode</button>
          </div>
        ) : (
          <div className="space-y-4">
            <label htmlFor="admin-model" className="block text-xs text-gray-400">
              Model preset
              <select id="admin-model" value={draft.model} onChange={(e) => setDraft({ ...draft, model: e.target.value })} className="mt-1 w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm text-white">
                <option value="deepseek/deepseek-chat">DeepSeek Chat — witty</option>
                <option value="google/gemini-2.0-flash-001">Gemini Flash — fast</option>
                <option value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 — creative</option>
              </select>
            </label>
            <label htmlFor="admin-prompt" className="block text-xs text-gray-400">
              Prompt instructions
              <textarea id="admin-prompt" value={draft.promptPrefix} onChange={(e) => setDraft({ ...draft, promptPrefix: e.target.value })} rows={4} className="mt-1 w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm text-white resize-y" />
            </label>
            <label className="flex gap-2 items-center text-sm text-gray-300">
              <input type="checkbox" checked={draft.enabled} onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })} />
              Enable server AI when configured
            </label>
            <button type="button" onClick={save} className="w-full rounded-lg bg-emerald-700 p-3 text-sm font-bold">Save AI settings</button>
          </div>
        )}
      </div>
    </div>
  )
}
