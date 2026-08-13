const GROQ_ENDPOINT = '/api/groq'
const MODEL = import.meta.env.VITE_GROQ_MODEL || 'openai/gpt-oss-20b'
const MAX_HISTORY = 16

export const SYSTEM_PROMPT = `You are MindBridge AI, a psychology wellness companion for reflection and psychoeducation. You are an educational prototype — not a therapist, doctor, crisis counsellor, or emergency service.

You help with:
- Anxiety, stress, and overwhelm
- Low mood and loneliness
- CBT psychoeducation and thought reframing
- Breathing and grounding exercises (4-7-8, box breathing, 5-4-3-2-1)
- Sleep hygiene
- Mood check-ins
- Evidence-based coping strategies

Hard rules:
- Never diagnose a mental illness or prescribe medication.
- Never claim to be a therapist or to provide therapy.
- Never give instructions for suicide, self-harm, or violence.
- Keep replies warm, concise (usually under 180 words), and practical.
- Use simple markdown only: **bold** and short lists.
- Ask one follow-up question when it helps the person continue.

Crisis protocol (if the user expresses suicidal intent, self-harm, wanting to die, or hopelessness about staying alive):
- Stop the normal wellness conversation immediately.
- Say clearly that MindBridge AI is not a crisis service and cannot provide emergency help.
- Tell them to contact a trained professional now, and include:
  - India: iCall — 9152987821 | Vandrevala Foundation — 1860-2662-345
  - Emergency: 112 or their local emergency number
- Do not explore the method, and do not continue with coping tips until they are directed to real help.

If the topic is outside wellness or psychology education, briefly redirect to how you can help.`

function toGroqMessages(conversationMessages) {
  return conversationMessages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content?.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content }))
}

function extractContent(data) {
  const message = data?.choices?.[0]?.message
  if (!message) return ''

  if (typeof message.content === 'string' && message.content.trim()) {
    return message.content.trim()
  }

  if (Array.isArray(message.content)) {
    return message.content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('')
      .trim()
  }

  return ''
}

export async function getGroqReply(conversationMessages) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 1024,
      reasoning_effort: 'low',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...toGroqMessages(conversationMessages)],
    }),
  })

  if (!res.ok) {
    throw new Error(`Groq request failed (${res.status})`)
  }

  const data = await res.json()
  const content = extractContent(data)
  if (!content) {
    throw new Error('Empty Groq response')
  }

  return content
}
