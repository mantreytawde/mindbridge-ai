import 'dotenv/config'

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value = 'true'] = arg.replace(/^--/, '').split('=')
    return [key, value]
  }),
)

if (args.model) process.env.GROQ_MODEL = args.model

const { getChatReply } = await import('../server/chatHandler.js')

const text = args.text || 'i failed my exam and my parents keep comparing me to my cousin'
const thread = [
  { role: 'assistant', content: 'Welcome to MindBridge AI — how are you feeling today?' },
  { role: 'user', content: text },
]

const started = Date.now()
const result = await getChatReply(thread)
console.log(`model  : ${process.env.GROQ_MODEL || 'default'}`)
console.log(`source : ${result.source} in ${Date.now() - started}ms`)
if (result.error) console.log(`error  : ${result.error}`)
console.log(`words  : ${result.reply.trim().split(/\s+/).length}`)
console.log(`\n${result.reply}`)
