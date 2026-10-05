import type { GeneratorSettings } from '../types'
import type { AiConfig } from './aiConfig'

const SURPRISE_THEMES = [
  'Calculus 1 exam disaster with limit dividing by zero',
  'Discrete math graph theory TA having a mental breakdown over hand-waving proof',
  'Computer science data structures exam student inventing O(N!) algorithm',
  'Physics mechanics exam student ignoring gravity and conservation of energy',
  'Linear algebra student claiming matrix inversion is just 1/matrix',
  'Organic chemistry student inventing a carbon with 5 bonds',
  'Midnight cramming for university final on 4 cans of energy drink with zero sleep',
  'Student asking TA for 4 points on exam to reach 56 pass threshold',
]

export interface AiSceneResult {
  text: string
  patch: Partial<GeneratorSettings>
  roastReason: string
}

export async function generateAiExamScene(
  prompt: string,
  userApiKey = '',
  config?: AiConfig,
): Promise<AiSceneResult> {
  const finalPrompt = prompt.trim() || SURPRISE_THEMES[Math.floor(Math.random() * SURPRISE_THEMES.length)]

  try {
    const endpoint = userApiKey ? 'https://openrouter.ai/api/v1/chat/completions' : '/api/generate-scene'
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userApiKey ? { Authorization: `Bearer ${userApiKey}` } : {}),
      },
      body: userApiKey
        ? JSON.stringify({
            model: config?.model || 'deepseek/deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'Return JSON with text, graderMark, graderStamp, fontFamily, textColor, roastReason for a funny university exam grader sticker.',
              },
              { role: 'user', content: `${config?.promptPrefix || ''}\n${finalPrompt}` },
            ],
            response_format: { type: 'json_object' },
          })
        : JSON.stringify({ prompt: `${config?.promptPrefix || ''}\n${finalPrompt}`, model: config?.model }),
    })

    if (!res.ok) {
      throw new Error(`Scene service unavailable (${res.status})`)
    }

    const data = await res.json()
    if (userApiKey) {
      const raw = data.choices?.[0]?.message?.content || '{}'
      const scene = JSON.parse(raw.replace(/^```json\s*/i, '').replace(/\s*```$/, ''))
      return {
        text: scene.text || 'אוי ואבוי\n0/100',
        patch: {
          text: scene.text,
          graderMark: scene.graderMark || 'circle',
          graderStamp: scene.graderStamp || 'zero',
          fontFamily: scene.fontFamily || "'Permanent Marker', cursive",
          textColor: scene.textColor || '#DC2626',
        },
        roastReason: scene.roastReason || 'The TA has questions.',
      }
    }
    return data as AiSceneResult
  } catch (err: unknown) {
    console.warn('Secure scene service unavailable; using local fallback:', err)
    return getLocalFallbackRoast(finalPrompt)
  }
}

/*
 * Kept as a compatibility adapter for callers that still pass a legacy key.
 * The key is deliberately ignored; secrets must never be sent from the browser.
 */
export async function generateAiExamSceneLegacy(
  prompt: string,
  _ignoredClientKey: string,
): Promise<AiSceneResult> {
  return generateAiExamScene(prompt, _ignoredClientKey)
}

export function getRandomSurprisePrompt(): string {
  return SURPRISE_THEMES[Math.floor(Math.random() * SURPRISE_THEMES.length)]
}

function getLocalFallbackRoast(theme: string): AiSceneResult {
  const lower = theme.toLowerCase()
  if (lower.includes('algebra') || lower.includes('matrix')) {
    return {
      text: 'det(A) = 0\nאינה הפיכה לעולם!',
      patch: {
        graderMark: 'strike_through',
        graderStamp: 'minus_ten',
        fontFamily: "'Caveat', cursive",
        textColor: '#B91C1C',
      },
      roastReason: 'You claimed a singular matrix can be inverted by dividing each coordinate.',
    }
  }

  if (lower.includes('calc') || lower.includes('limit') || lower.includes('zero') || lower.includes('div')) {
    return {
      text: 'חילוק באפס?!\nאינפי 1 קורס עליך',
      patch: {
        graderMark: 'question_mark',
        graderStamp: 'zero',
        fontFamily: "'Permanent Marker', cursive",
        textColor: '#DC2626',
      },
      roastReason: 'Dividing by zero is punishable by a mandatory retake in Moed Bet.',
    }
  }

  if (lower.includes('cheating') || lower.includes('discipline')) {
    return {
      text: 'העתקה במבחן!\nועדת משמעת ביום א׳',
      patch: {
        graderMark: 'cross',
        graderStamp: 'fail',
        fontFamily: "'Heebo', sans-serif",
        textColor: '#991B1B',
      },
      roastReason: 'Identical handwriting and identical mistake down to the decimal point.',
    }
  }

  const genericRoasts: AiSceneResult[] = [
    {
      text: '0 / 100\nהמתרגל עזב את החדר',
      patch: {
        graderMark: 'circle',
        graderStamp: 'zero',
        fontFamily: "'Permanent Marker', cursive",
        textColor: '#DC2626',
      },
      roastReason: 'The derivation defied all known axioms of mathematics and logic.',
    },
    {
      text: 'לא ברור מה ניסית\nלהוכיח פה בכלל ?!',
      patch: {
        graderMark: 'question_mark',
        graderStamp: 'minus_ten',
        fontFamily: "'Caveat', cursive",
        textColor: '#E11D48',
      },
      roastReason: 'Wrote three pages of symbols that have no grammatical or logical meaning.',
    },
    {
      text: 'ערעור נדחה:\n"הציון הוגן ומפנק"',
      patch: {
        graderMark: 'cross',
        graderStamp: 'recheck',
        fontFamily: "'Heebo', sans-serif",
        textColor: '#991B1B',
      },
      roastReason: 'Appealing a 32 was a brave tactical error.',
    },
    {
      text: 'בסדר נזרום...\n56 עובר גבולי',
      patch: {
        graderMark: 'checkmark',
        graderStamp: 'pass',
        fontFamily: "'Caveat', cursive",
        textColor: '#15803D',
      },
      roastReason: 'The grader was tired and had mercy on your suffering.',
    },
  ]

  return genericRoasts[Math.floor(Math.random() * genericRoasts.length)]
}
