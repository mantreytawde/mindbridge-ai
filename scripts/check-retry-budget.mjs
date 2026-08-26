/**
 * Offline check: how many Groq calls a single failing turn costs. An empty
 * reply once cost up to 9 full-price calls (3 retries x 3 history sizes),
 * which is how a 200k daily budget disappeared in ~10 turns. Stubbed fetch,
 * so this costs nothing to run.
 */
process.env.GROQ_API_KEY = 'test-key-not-used'
process.env.GROQ_MODEL = 'test/model'

const scenarios = {
  empty: () => ({ ok: true, json: async () => ({ choices: [{ message: { content: '' } }] }) }),
  truncatedThinking: () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content: '<think>reasoning that never ends' } }] }),
  }),
  badRequest: () => ({ ok: false, status: 400, text: async () => '{"error":{"message":"bad request"}}' }),
  rateLimited: () => ({
    ok: false,
    status: 429,
    text: async () => '{"error":{"message":"Rate limit reached ... try again in 10ms"}}',
  }),
}

const { getGroqReply } = await import('../server/groq.js')

const conversation = [
  { role: 'assistant', content: 'Welcome to MindBridge AI.' },
  { role: 'user', content: 'first message' },
  { role: 'assistant', content: 'earlier reply' },
  { role: 'user', content: 'latest message' },
]

for (const [name, makeResponse] of Object.entries(scenarios)) {
  let calls = 0
  globalThis.fetch = async () => {
    calls += 1
    return makeResponse()
  }

  try {
    await getGroqReply(conversation, { notes: 'mood: sadness' })
    console.log(`${name.padEnd(19)} unexpectedly succeeded`)
  } catch (err) {
    console.log(`${name.padEnd(19)} ${String(calls).padStart(2)} calls  ${err.message.slice(0, 48)}`)
  }
}
