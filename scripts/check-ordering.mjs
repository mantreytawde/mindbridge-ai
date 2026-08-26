/**
 * Offline check: the request Groq receives must end with a user message, and
 * the internal notes must sit immediately before it. Uses a stubbed fetch, so
 * nothing leaves the machine.
 */
process.env.GROQ_API_KEY = 'test-key-not-used'

let captured = null
globalThis.fetch = async (_url, init) => {
  captured = JSON.parse(init.body)
  return {
    ok: true,
    json: async () => ({ choices: [{ message: { content: 'stubbed reply' } }] }),
  }
}

const { getGroqReply } = await import('../server/groq.js')

const conversation = [
  { role: 'assistant', content: 'Welcome to MindBridge AI.' },
  { role: 'user', content: 'first message' },
  { role: 'assistant', content: 'Try box breathing: in for 4, hold 4, out 4.' },
  { role: 'user', content: 'latest message' },
]

await getGroqReply(conversation, { notes: 'mood: sadness (0.80)\nreflection: test note' })

const roles = captured.messages.map((m) => m.role)
const last = captured.messages.at(-1)
const notesIndex = captured.messages.findIndex((m) => m.content.includes('specialist_notes'))
const guidanceIndex = captured.messages.findIndex((m) => m.content.includes('Turn notes for you only'))

console.log('roles           :', roles.join(' > '))
console.log('last role       :', last.role, last.role === 'user' ? 'PASS' : 'FAIL')
console.log('last content    :', JSON.stringify(last.content))
console.log('notes before end:', notesIndex === captured.messages.length - 3 ? 'PASS' : `at ${notesIndex}`)
console.log('guidance present:', guidanceIndex > -1 ? 'PASS' : 'FAIL')
console.log('skill detected  :', captured.messages[guidanceIndex]?.content.includes('box breathing') ? 'PASS' : 'FAIL')
