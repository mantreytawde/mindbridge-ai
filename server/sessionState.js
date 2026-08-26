/**
 * Repetition was the most common quality failure in simulated conversations:
 * the same grounding exercise offered twice, and the helpline block repeated
 * every turn of a crisis. The model cannot reliably audit its own history, so
 * the pipeline detects what has already been used and states it explicitly.
 */

const SKILLS = {
  '5-4-3-2-1 grounding': /5-?4-?3-?2-?1|five things you can see/i,
  'box breathing': /box breathing/i,
  '4-7-8 breathing': /4-?7-?8/i,
  'a longer exhale': /(longer|slower) exhale|exhale (slowly|longer|for)/i,
  'feet on the floor': /feet (flat )?on the (floor|ground)/i,
  'a worry window': /worry (window|time)/i,
  'delaying a message': /(delay|wait) before (sending|replying|texting)|put the phone/i,
  'an I-statement': /i-?statement/i,
  'water or standing up': /(glass of water|drink (some )?water|stand up)/i,
  'naming the feeling vs the story': /name the feeling|feeling (vs|versus|apart from) the story/i,
  'body scan': /body[-\s]?scan/i,
  'journalling': /journal(ling|ing)?\b/i,
}

const HELPLINE = /(14416|9152987821|1860-?2662-?345|9820466726|tele-?manas|icall|vandrevala|aasra|findahelpline)/i

function assistantText(conversation) {
  return conversation.filter((m) => m.role === 'assistant').map((m) => m.content || '')
}

export function usedSkills(conversation) {
  const replies = assistantText(conversation)
  return Object.entries(SKILLS)
    .filter(([, pattern]) => replies.some((reply) => pattern.test(reply)))
    .map(([name]) => name)
}

export function helplineMentions(conversation) {
  return assistantText(conversation).filter((reply) => HELPLINE.test(reply)).length
}

export function buildTurnGuidance(conversation) {
  const parts = []

  const skills = usedSkills(conversation)
  if (skills.length) {
    parts.push(
      `Already offered earlier in this chat: ${skills.join(', ')}. Do not offer these again — choose a different kind of help or none at all.`,
    )
  }

  const helplines = helplineMentions(conversation)
  if (helplines >= 2) {
    parts.push(
      'Helpline numbers have already been given more than once in this chat. Do not list them again unless the risk clearly increases; refer to the numbers already shared instead.',
    )
  }

  const lastReply = assistantText(conversation).at(-1)
  if (lastReply) {
    parts.push(
      `Your previous reply opened with: "${lastReply.trim().slice(0, 60)}". Do not reuse that opening, structure, or phrasing.`,
    )
  }

  if (!parts.length) return ''
  return `Turn notes for you only (never mention them): ${parts.join(' ')}`
}
