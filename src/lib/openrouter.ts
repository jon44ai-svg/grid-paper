import type { GraderMarkType, GraderStampType } from '../types'

export interface GeneratedSceneConfig {
  text: string
  graderMark: GraderMarkType
  graderStamp: GraderStampType
  promptHeadline: string
  memeConcept: string
  suggestedFont?: string
  suggestedColor?: string
}

export interface GenerateSceneOptions {
  prompt: string
  apiKey?: string
  model?: string
}

export const FALLBACK_SCENES: GeneratedSceneConfig[] = [
  {
    promptHeadline: 'Linear Algebra Exam Disaster',
    memeConcept: 'Zero determinant leads to emotional singularity',
    text: 'det(A) = 0\nאיפה הפיבוט?! -15',
    graderMark: 'strike_through',
    graderStamp: 'zero',
    suggestedFont: "'Caveat', cursive",
    suggestedColor: '#D91414',
  },
  {
    promptHeadline: 'Calculus TA Total Roast',
    memeConcept: 'Dividing by zero in a derivative proof',
    text: 'חילוק באפס?!\nמי לימד אותך חדווא? 0/100',
    graderMark: 'cross',
    graderStamp: 'fail',
    suggestedFont: "'Permanent Marker', cursive",
    suggestedColor: '#DC2626',
  },
  {
    promptHeadline: 'Data Structures & Algorithms Meltdown',
    memeConcept: 'O(N!) complexity solution on quicksort question',
    text: 'סיבוכיות O(N!)\nהמחשב נשרף... בדיקה מחדש?',
    graderMark: 'question_mark',
    graderStamp: 'recheck',
    suggestedFont: "'VT323', monospace",
    suggestedColor: '#EA580C',
  },
  {
    promptHeadline: 'Midnight Homework Miracle',
    memeConcept: 'Accidentally getting 100 on an impossible assignment',
    text: 'ציון 100!\nעבודה מושלמת למרות הבלגן ✨',
    graderMark: 'checkmark',
    graderStamp: 'hundred',
    suggestedFont: "'Caveat', cursive",
    suggestedColor: '#16A34A',
  },
  {
    promptHeadline: 'Physics Quantum Exam Confusion',
    memeConcept: 'Schrodinger exam grade: both passed and failed',
    text: 'החלקיק מנהר דרך התשובה...\n-10 נקודות על ספקולציה',
    graderMark: 'circle',
    graderStamp: 'minus_ten',
    suggestedFont: "'Kalam', cursive",
    suggestedColor: '#D91414',
  },
  {
    promptHeadline: 'Barely Passed Relief',
    memeConcept: 'Getting exactly 56 on the hardest finals',
    text: 'ציון: 56. עובר זה עובר!\nנתראה בסמסטר הבא 👋',
    graderMark: 'circle',
    graderStamp: 'pass',
    suggestedFont: "'Heebo', sans-serif",
    suggestedColor: '#2563EB',
  },
]

function getFallbackScene(prompt?: string): GeneratedSceneConfig {
  if (!prompt || !prompt.trim()) {
    return FALLBACK_SCENES[Math.floor(Math.random() * FALLBACK_SCENES.length)]
  }

  const query = prompt.toLowerCase()
  if (query.includes('alg') || query.includes('linear') || query.includes('לינארית')) {
    return FALLBACK_SCENES[0]
  }
  if (query.includes('calc') || query.includes('חדווא') || query.includes('אינפי') || query.includes('roast')) {
    return FALLBACK_SCENES[1]
  }
  if (query.includes('data') || query.includes('structure') || query.includes('algo') || query.includes('מבני נתונים')) {
    return FALLBACK_SCENES[2]
  }
  if (query.includes('100') || query.includes('perfect') || query.includes('מושלם') || query.includes('success')) {
    return FALLBACK_SCENES[3]
  }
  if (query.includes('physics') || query.includes('פיזיקה') || query.includes('quantum')) {
    return FALLBACK_SCENES[4]
  }
  if (query.includes('pass') || query.includes('56') || query.includes('עובר') || query.includes('relief')) {
    return FALLBACK_SCENES[5]
  }

  // Pick random fallback scene
  return FALLBACK_SCENES[Math.floor(Math.random() * FALLBACK_SCENES.length)]
}

export async function generateExamScene(options: GenerateSceneOptions): Promise<GeneratedSceneConfig> {
  const { prompt } = options
  const finalPrompt = prompt.trim() || 'university exam grader roast'

  try {
    const response = await fetch('/api/generate-scene', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: finalPrompt }),
    })

    if (!response.ok) {
      return getFallbackScene(finalPrompt)
    }

    return (await response.json()) as GeneratedSceneConfig
  } catch (err) {
    console.warn('Error fetching scene from OpenRouter, falling back to local scene:', err)
    return getFallbackScene(finalPrompt)
  }
}
