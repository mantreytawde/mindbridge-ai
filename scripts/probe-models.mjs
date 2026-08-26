import 'dotenv/config'
import { SYSTEM_PROMPT } from '../server/systemPrompt.js'

const key = process.env.GROQ_API_KEY?.trim()
const MODELS = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'qwen/qwen3.6-27b']

console.log(`system prompt: ${SYSTEM_PROMPT.length} chars (~${Math.round(SYSTEM_PROMPT.length / 4)} tokens)\n`)

// A real composer-sized request, so the answer reflects whether an actual chat
// turn fits in the remaining daily budget.
for (const model of MODELS) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      max_tokens: 300,
      reasoning_effort: 'low',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'my husband checks my phone every night and i am scared of him. should i confront him about it?' },
      ],
    }),
  })
  const text = await res.text()
  const tpd = /tokens per day \(TPD\): Limit (\d+), Used (\d+)/.exec(text)
  const data = res.ok ? JSON.parse(text) : null
  const used = data?.usage?.total_tokens
  console.log(
    `${model.padEnd(22)} ${res.status} ${tpd ? `DAILY EXHAUSTED (${tpd[2]}/${tpd[1]})` : res.ok ? `ok, turn cost ${used} tokens` : text.slice(0, 200)}`,
  )
}
