const SYSTEM_PROMPT = `You are a sarcastic university teaching assistant grading an exam on vintage grid paper.
Return JSON only with this exact shape:
{
  "text": "1 to 3 punchy lines in Hebrew or English",
  "graderMark": "none | circle | strike_through | question_mark | cross | checkmark",
  "graderStamp": "none | zero | hundred | minus_ten | fail | pass | recheck",
  "fontFamily": "'Caveat', cursive | 'Permanent Marker', cursive | 'Heebo', sans-serif | 'Kalam', cursive",
  "textColor": "#DC2626 | #B91C1C | #E11D48",
  "roastReason": "one short hilarious explanation"
}`

const allowedMarks = new Set(['none', 'circle', 'strike_through', 'question_mark', 'cross', 'checkmark'])
const allowedStamps = new Set(['none', 'zero', 'hundred', 'minus_ten', 'fail', 'pass', 'recheck'])

function json(res: any, status: number, body: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(body))
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim().slice(0, 500) : ''
  const requestedModel = typeof req.body?.model === 'string' ? req.body.model : ''
  const allowedModels = new Set([
    'deepseek/deepseek-chat',
    'google/gemini-2.0-flash-001',
    'meta-llama/llama-3.3-70b-instruct',
  ])
  if (!prompt) return json(res, 400, { error: 'A scene prompt is required' })

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return json(res, 503, { error: 'AI scene generation is not configured' })

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.PUBLIC_APP_URL || 'https://stickergrade.app',
        'X-Title': 'StickerGrade',
      },
      body: JSON.stringify({
        model: allowedModels.has(requestedModel) ? requestedModel : process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Create an exam grader meme scene for: ${prompt}` },
        ],
        temperature: 0.85,
        max_tokens: 350,
      }),
    })

    if (!upstream.ok) {
      return json(res, 502, { error: 'OpenRouter request failed' })
    }

    const data = await upstream.json()
    const raw = data.choices?.[0]?.message?.content?.trim() || '{}'
    const parsed = JSON.parse(raw.replace(/^```json\s*/i, '').replace(/\s*```$/, ''))

    return json(res, 200, {
      text: typeof parsed.text === 'string' && parsed.text.trim() ? parsed.text.trim() : 'אוי ואבוי\n0/100',
      patch: {
        text: parsed.text,
        graderMark: allowedMarks.has(parsed.graderMark) ? parsed.graderMark : 'circle',
        graderStamp: allowedStamps.has(parsed.graderStamp) ? parsed.graderStamp : 'zero',
        fontFamily: parsed.fontFamily || "'Permanent Marker', cursive",
        textColor: /^#[0-9A-F]{6}$/i.test(parsed.textColor || '') ? parsed.textColor : '#DC2626',
        showMarginLine: true,
        showBinderHoles: true,
        inkBleed: true,
      },
      roastReason: parsed.roastReason || 'The TA has questions.',
    })
  } catch {
    return json(res, 502, { error: 'Could not generate a scene' })
  }
}
