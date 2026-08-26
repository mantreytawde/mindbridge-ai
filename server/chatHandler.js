import { CRISIS_RESPONSE, getBotResponse, isCrisisMessage } from './chatbot.js'
import { runMindBridgePipeline } from './orchestrate.js'

function lastUserText(messages) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i]
    if (message?.role === 'user' && message.content?.trim()) {
      return message.content
    }
  }
  return ''
}

function normalizeMessages(raw) {
  if (!Array.isArray(raw)) return null
  return raw
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim(),
    )
    .map((m) => ({ role: m.role, content: m.content }))
}

export async function getChatReply(rawMessages) {
  const messages = normalizeMessages(rawMessages)
  if (!messages?.length) {
    const error = new Error('Expected { messages: [{ role, content }, ...] }')
    error.status = 400
    throw error
  }

  const userText = lastUserText(messages)
  if (!userText) {
    const error = new Error('Expected a user message in the conversation')
    error.status = 400
    throw error
  }

  if (isCrisisMessage(userText)) {
    return { reply: CRISIS_RESPONSE, source: 'crisis' }
  }

  try {
    const reply = await runMindBridgePipeline(messages)
    return { reply, source: 'groq' }
  } catch (err) {
    const detail = err?.message || String(err)
    console.warn(
      `[chat] pipeline failed after ${messages.length} messages, using keyword fallback:`,
      detail,
    )
    return { reply: getBotResponse(userText), source: 'fallback', error: detail }
  }
}

export async function chatHandler(req, res) {
  try {
    const { reply, source } = await getChatReply(req.body?.messages)
    res.json({ reply, source })
  } catch (err) {
    const status = err?.status === 400 ? 400 : 500
    res.status(status).json({
      error: status === 400 ? err.message : 'Chat failed',
    })
  }
}
