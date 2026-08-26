import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { PERSONAS } from './personas.mjs'

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value = 'true'] = arg.replace(/^--/, '').split('=')
    return [key, value]
  }),
)

const model = args.model || 'openai/gpt-oss-20b'
const shard = Number.parseInt(args.shard ?? '0', 10)
const shards = Number.parseInt(args.shards ?? '1', 10)
// Free Groq keys allow 8000 tokens/minute per model and a turn costs roughly
// 3500, so pace the run instead of burning attempts on 429 retries.
const delayMs = Number.parseInt(args.delay ?? '28000', 10)

process.env.GROQ_MODEL = model

const { getChatReply } = await import('../server/chatHandler.js')

const outDir = path.join(process.cwd(), args.out || 'results')
fs.mkdirSync(outDir, { recursive: true })
const outFile = path.join(outDir, `run-${model.replace(/[^a-z0-9]+/gi, '-')}.jsonl`)

const WELCOME = `Welcome to **MindBridge AI** — *Connecting minds to clarity*.

I'm your wellness companion for reflection, coping strategies, and psychology education. I'm not a therapist, but I can sit with you, help you explore thoughts, and practice grounding techniques.

**How are you feeling today?**`

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Stamped on every row so an abandoned run's rows can be told apart from a
// later one appending to the same file.
const runId = new Date().toISOString()

const only = args.only ? args.only.split(',').map((n) => Number.parseInt(n, 10)) : null

const assigned = PERSONAS.map((persona, index) => ({ persona, index })).filter(({ index }) =>
  only ? only.includes(index) : index % shards === shard,
)

console.log(
  `[${model}] shard ${shard + 1}/${shards}: ${assigned.length} conversations, ${assigned.reduce((n, a) => n + a.persona.messages.length, 0)} turns, ~${delayMs / 1000}s pacing`,
)

let turnCount = 0
let fallbackCount = 0

for (const { persona, index } of assigned) {
  const thread = [{ role: 'assistant', content: WELCOME }]

  for (let turn = 0; turn < persona.messages.length; turn += 1) {
    const { text, tags } = persona.messages[turn]
    thread.push({ role: 'user', content: text })

    const started = Date.now()
    let result
    try {
      result = await getChatReply(thread)
    } catch (err) {
      result = { reply: '', source: 'error', error: err?.message || String(err) }
    }
    const ms = Date.now() - started

    thread.push({ role: 'assistant', content: result.reply || '(no reply)' })
    turnCount += 1
    if (result.source !== 'groq' && result.source !== 'crisis') fallbackCount += 1

    // A spent daily budget does not recover within a run, so stop rather than
    // spending hours recording canned fallback text.
    if (result.error?.includes('tokens per day')) {
      console.log(`[${model}] daily token budget exhausted after ${turnCount} turns — stopping`)
      fs.appendFileSync(
        outFile,
        `${JSON.stringify({ runId, model, personaIndex: index, persona: persona.title, turn: turn + 1, turns: persona.messages.length, threadMessages: thread.length, userText: text, tags, reply: result.reply, source: result.source, error: result.error, ms })}\n`,
      )
      process.exit(0)
    }

    fs.appendFileSync(
      outFile,
      `${JSON.stringify({
        runId,
        model,
        personaIndex: index,
        persona: persona.title,
        turn: turn + 1,
        turns: persona.messages.length,
        threadMessages: thread.length,
        userText: text,
        tags,
        reply: result.reply,
        source: result.source,
        error: result.error || '',
        ms,
      })}\n`,
    )

    if (turn < persona.messages.length - 1) await sleep(delayMs)
  }

  console.log(
    `[${model}] done ${index + 1}. ${persona.title} — ${turnCount} turns so far, ${fallbackCount} non-Groq`,
  )
  await sleep(delayMs)
}

console.log(`[${model}] FINISHED ${turnCount} turns, ${fallbackCount} non-Groq → ${outFile}`)
