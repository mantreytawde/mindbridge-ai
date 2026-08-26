/**
 * Offline regression check for the local crisis intercept. No network, no
 * model calls. A false negative here is dangerous, so real intent must keep
 * matching even when a negation appears elsewhere in the same message.
 */
import { CRISIS_RESPONSE, isCrisisMessage } from '../server/chatbot.js'

const MUST_MATCH = [
  'i want to kill myself',
  'i am going to end my life tonight',
  "i can't stop thinking about killing myself",
  'i hurt myself last night',
  'i feel suicidal',
  'there is no reason to live',
  "i don't want to live anymore",
  "i don't want to die but i'm going to kill myself",
  "i'm not suicidal but i self-harm to cope",
  'i took a lot of pills and i want to die',
]

const MUST_NOT_MATCH = [
  'i do not want to die, it just appears and terrifies me',
  "i don't want to die, the thought scares me",
  "i'm not suicidal, i just feel flat",
  'i am not going to kill myself, i am just tired',
  'i never want to die, i love my life',
  'i failed my exam and feel awful',
  'my grandmother died last year',
  'i broke up with my girlfriend',
]

let failures = 0

for (const text of MUST_MATCH) {
  if (!isCrisisMessage(text)) {
    console.log(`MISSED CRISIS: ${text}`)
    failures += 1
  }
}

for (const text of MUST_NOT_MATCH) {
  if (isCrisisMessage(text)) {
    console.log(`FALSE ALARM  : ${text}`)
    failures += 1
  }
}

const BANNED = ['it sounds like', 'thank you for sharing', 'you deserve support']
for (const phrase of BANNED) {
  if (CRISIS_RESPONSE.toLowerCase().includes(phrase)) {
    console.log(`BANNED PHRASE in CRISIS_RESPONSE: "${phrase}"`)
    failures += 1
  }
}

console.log(
  failures === 0
    ? `PASS — ${MUST_MATCH.length} crisis, ${MUST_NOT_MATCH.length} non-crisis, crisis copy clean`
    : `FAIL — ${failures} problem(s)`,
)
process.exit(failures === 0 ? 0 : 1)
