export type AiConfig = {
  model: string
  promptPrefix: string
  enabled: boolean
}

export const DEFAULT_AI_CONFIG: AiConfig = {
  model: 'deepseek/deepseek-chat',
  promptPrefix: 'Keep it short, funny, and suitable for a university exam sticker.',
  enabled: true,
}

const STORAGE_KEY = 'grid-paper-ai-config'

export function loadAiConfig(): AiConfig {
  try {
    return { ...DEFAULT_AI_CONFIG, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  } catch {
    return DEFAULT_AI_CONFIG
  }
}

export function saveAiConfig(config: AiConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}
