import { getGroqReply } from './groq.js'
import { getEmotion } from './sentiment.js'
import { getSessionNotes } from './specialists.js'

function lastUserText(conversation) {
  for (let i = conversation.length - 1; i >= 0; i -= 1) {
    const message = conversation[i]
    if (message?.role === 'user' && message.content?.trim()) {
      return message.content
    }
  }
  return ''
}

function settledValue(result) {
  return result.status === 'fulfilled' ? result.value : null
}

const TRIVIAL_PATTERNS = [
  /^(hi|hey|hello|yo|sup|good (morning|afternoon|evening))\b/i,
  /^(thanks|thank you|ty|ok(ay)?|k|cool|got it|sure|yes|no|nope|yeah)\b[\s.!]*$/i,
  /^(test|testing|hmm+|idk|nvm|never mind)\b[\s.!]*$/i,
]

/**
 * Note-taking costs a second Groq call, and the free tier only allows 8000
 * tokens per minute. Greetings, acknowledgements and one-word replies gain
 * nothing from CBT notes, so they skip straight to the composer.
 */
function needsNotes(text) {
  const clean = text.trim()
  if (clean.length < 25) return false
  return !TRIVIAL_PATTERNS.some((pattern) => pattern.test(clean))
}

function formatNotes({ emotion, notes }) {
  const parts = []

  if (emotion?.label) {
    const score = Number.isFinite(emotion.score) ? ` (${emotion.score.toFixed(2)})` : ''
    parts.push(`mood: ${emotion.label}${score}`)
  }
  if (notes) parts.push(notes)

  return parts.join('\n\n')
}

export async function runMindBridgePipeline(conversation) {
  const userText = lastUserText(conversation)

  const [emotionResult, notesResult] = await Promise.allSettled([
    getEmotion(userText),
    needsNotes(userText) ? getSessionNotes(conversation) : Promise.resolve(null),
  ])

  const notes = formatNotes({
    emotion: settledValue(emotionResult),
    notes: settledValue(notesResult),
  })

  return getGroqReply(conversation, { notes })
}
