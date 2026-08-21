import { getGroqReply } from './groq'
import { getEmotion } from './sentiment'
import { getCbtNotes, getCopingNotes, getReflectorNotes } from './specialists'

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

function formatNotes({ emotion, reflector, cbt, coping }) {
  const parts = []

  if (emotion?.label) {
    const score = Number.isFinite(emotion.score) ? ` (${emotion.score.toFixed(2)})` : ''
    parts.push(`mood: ${emotion.label}${score}`)
  }
  if (reflector) parts.push(`reflection:\n${reflector}`)
  if (cbt) parts.push(`cbt:\n${cbt}`)
  if (coping) parts.push(`coping:\n${coping}`)

  return parts.join('\n\n')
}

export async function runMindBridgePipeline(conversation) {
  const [emotionResult, reflectorResult, cbtResult, copingResult] = await Promise.allSettled([
    getEmotion(lastUserText(conversation)),
    getReflectorNotes(conversation),
    getCbtNotes(conversation),
    getCopingNotes(conversation),
  ])

  const notes = formatNotes({
    emotion: settledValue(emotionResult),
    reflector: settledValue(reflectorResult),
    cbt: settledValue(cbtResult),
    coping: settledValue(copingResult),
  })

  return getGroqReply(conversation, { notes })
}
