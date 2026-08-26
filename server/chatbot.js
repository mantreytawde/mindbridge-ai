const GREETING_PATTERNS = [
  /^(hi|hello|hey|good morning|good evening|good afternoon)\b/i,
  /^(how are you|what's up|whats up)\b/i,
]

const ANXIETY_PATTERNS = [
  /\b(anxious|anxiety|worried|worry|nervous|panic|overwhelm|stress(ed)?)\b/i,
]

const SAD_PATTERNS = [
  /\b(sad|depressed|depression|down|lonely|hopeless|empty|cry|crying)\b/i,
]

const SLEEP_PATTERNS = [
  /\b(sleep|insomnia|tired|fatigue|rest|can't sleep|cant sleep)\b/i,
]

const CBT_PATTERNS = [
  /\b(cbt|cognitive behavioral|negative thought|reframe|thinking pattern)\b/i,
]

const COPING_PATTERNS = [
  /\b(coping| cope|deal with|handle|manage|strategy|strategies|tips)\b/i,
]

const BREATHING_PATTERNS = [
  /\b(breath|breathing|calm down|relax|grounding)\b/i,
]

const MOOD_PATTERNS = [
  /\b(mood|feeling|feel today|how do i feel|track mood)\b/i,
]

const BREAKUP_PATTERNS = [
  /\b(broke? up|breakup|break-up|dumped|left me|ex[- ]?(girlfriend|boyfriend|partner)|girlfriend|boyfriend|divorce|cheated on me)\b/i,
]

const GRIEF_PATTERNS = [
  /\b(died|death|passed away|funeral|grief|grieving|lost my (mum|mom|dad|father|mother|brother|sister|friend|grandma|grandpa|dog|cat|pet))\b/i,
]

const STUDY_WORK_PATTERNS = [
  /\b(exam|exams|test tomorrow|failed|failing|marks|grades|placement|interview|job|boss|manager|deadline|semester|assignment|burnout|burnt out)\b/i,
]

const LONELY_PATTERNS = [
  /\b(alone|lonely|loneliness|no friends|nobody (likes|talks)|left out|ignored|homesick)\b/i,
]

const ANGER_PATTERNS = [
  /\b(angry|anger|furious|rage|yelled|shouted|snapped|punched|hate (him|her|them|myself))\b/i,
]

const FAMILY_PATTERNS = [
  /\b(parents|mother|father|mom|mum|dad|family|brother|sister|relatives|comparing me)\b/i,
]

const HELP_PATTERNS = [
  /\b(help|what can you do|features|commands|options)\b/i,
]

const THANKS_PATTERNS = [/\b(thank|thanks|ty|appreciate)\b/i]

const CRISIS_PATTERNS = [
  /\b(suicid(al|e)?|kill myself|killing myself|end my life|ending my life)\b/i,
  /\b(self[-\s]?harm|hurt myself|harm myself|cut(ting)? myself)\b/i,
  /\b(want to die|wanna die|better off dead|no reason to live)\b/i,
  /\b(take my (own )?life|end it all|overdose on purpose)\b/i,
  /\b(do ?n'?t|dont|no longer) want to (live|be here|exist)\b/i,
]

// "I do not want to die" is the opposite of intent, and firing the emergency
// block on it derails people describing intrusive thoughts or panic. Only
// negation attached directly to the intent verb counts, so "I can't stop
// thinking about killing myself" is untouched.
const NEGATED_INTENT = [
  /\b(do not|don'?t|dont|never|not)\s+(want|wanna|going|gonna|plan(ning)?|intend)\s+(to\s+)?(die|kill myself|killing myself|end my life|hurt myself|harm myself)\b/gi,
  /\b(i'?m|i am|im)\s+not\s+suicidal\b/gi,
]

export function isCrisisMessage(text) {
  // The negated phrase is removed rather than short-circuiting, so a message
  // carrying both ("I don't want to die but I'm going to kill myself") still
  // matches on the part that was never negated.
  const remaining = NEGATED_INTENT.reduce((acc, pattern) => acc.replace(pattern, ' '), text)
  return CRISIS_PATTERNS.some((pattern) => pattern.test(remaining))
}

const RESPONSES = {
  greeting: [
    "Hello! I'm MindBridge AI — your wellness companion for reflection and psychoeducation. How are you feeling today?",
    "Hi there. I'm here to listen, share coping strategies, and help you explore your thoughts. What's on your mind?",
  ],
  anxiety: `I hear that you're feeling anxious — that's a very human response, especially during stressful times.

**Try this grounding exercise (5-4-3-2-1):**
- **5** things you can see
- **4** things you can touch
- **3** things you can hear
- **2** things you can smell
- **1** thing you can taste

Anxiety often peaks and then subsides. Would you like a breathing exercise or more coping tips?`,
  sadness: `Thank you for sharing that with me. Feeling sad or low can be exhausting, and acknowledging it takes courage.

**A few gentle reminders:**
- Emotions are temporary — even when they feel permanent
- Small actions (a short walk, drinking water, texting a friend) can help
- You don't have to face this alone

Would you like coping strategies, or information about when to seek professional support?`,
  sleep: `Sleep and mental well-being are deeply connected. Poor sleep can worsen anxiety and low mood.

**Sleep hygiene tips:**
- Keep a consistent bedtime, even on weekends
- Avoid screens 30–60 minutes before bed
- Limit caffeine after 2 PM
- Try a wind-down routine: reading, light stretching, or journaling

Would you like a relaxation breathing exercise before bed?`,
  cbt: `**Cognitive Behavioral Therapy (CBT)** is one of the most evidence-based approaches in psychology. It focuses on the link between **thoughts → feelings → behaviors**.

**Core idea:** Not every thought is true or helpful. CBT teaches you to:
1. **Identify** automatic negative thoughts ("I'll fail", "Nobody likes me")
2. **Challenge** them with evidence
3. **Reframe** into balanced thoughts

**Example:**
- Negative: "I made one mistake — I'm worthless"
- Reframed: "I made a mistake, but that doesn't define my worth. I can learn from this."

Want to try reframing a thought together?`,
  coping: `Here are **evidence-based coping strategies** you can try:

**Immediate relief**
- Box breathing: inhale 4s → hold 4s → exhale 4s → hold 4s
- Progressive muscle relaxation (tense & release each muscle group)
- 10-minute walk or movement

**Daily wellness**
- Journaling (3 things you're grateful for)
- Limit social media when overwhelmed
- Maintain social connection — even one message counts

**Cognitive**
- Ask: "What would I tell a friend in this situation?"
- Separate facts from assumptions

Which area would you like to explore further — breathing, CBT, or sleep?`,
  breathing: `Let's do a **4-7-8 breathing exercise** together:

1. **Inhale** through your nose for **4 seconds**
2. **Hold** your breath for **7 seconds**
3. **Exhale** slowly through your mouth for **8 seconds**
4. Repeat **3–4 times**

This activates your parasympathetic nervous system — your body's "rest and digest" mode.

Take your time. When you're ready, tell me how you feel.`,
  mood: `Tracking your mood helps you notice patterns over time — a key skill in psychology and self-awareness.

**Quick mood check-in:** On a scale of 1–10, where are you right now?
- 1–3: Struggling — consider reaching out to someone you trust
- 4–6: Mixed or moderate — small self-care actions can help
- 7–10: Doing okay — great time to note what's working well

What's your number today, and what's contributing to it?`,
  help: `I'm **MindBridge AI** — a psychology wellness prototype. Here's what I can help with:

- **Anxiety & stress** — grounding and coping techniques
- **Low mood** — supportive reflections and reminders
- **CBT basics** — understanding and reframing thoughts
- **Breathing exercises** — 4-7-8 and box breathing
- **Sleep tips** — sleep hygiene guidance
- **Mood check-ins** — self-awareness prompts
- **Maths & general knowledge** — short working and factual study answers

Try the quick-action buttons below, or just type how you're feeling!`,
  thanks: [
    "You're welcome. Remember, taking care of your mental well-being is a strength, not a weakness.",
    "Happy to help. I'm here whenever you need to reflect or learn something new.",
  ],
  breakup: `A relationship ending is a real loss, even when part of you knew it was coming. The replaying and the checking are normal parts of that.

**Two things that usually help early on:**
- When the urge to reread old messages hits, put the phone in another room for ten minutes — the urge passes faster than it feels like it will
- Write the sentence you wish you had said. Keep it; you do not have to send it

There is no schedule for this. What has been the hardest part of today specifically?`,
  grief: `I'm sorry. Losing someone changes the shape of ordinary days, and there is no timeline for it.

Grief tends to come in waves rather than steadily fading. On the heavy days, the goal is smaller than "feel better" — it is water, food, and some rest.

You do not have to explain or justify how you are grieving. Would it help to talk about them, or about getting through today?`,
  studyWork: `Exam and work pressure has a way of turning one result into a verdict on you. Effort and worth are not the same measurement.

**One recoverable next step, not five:**
- Pick the smallest useful block — 25 minutes on one topic, then stop
- Or, if you are past exhaustion, sleep first; a tired brain cannot revise

What is the next actual deadline you are facing?`,
  lonely: `Loneliness is painful in a way people underestimate, and it is not evidence that something is wrong with you.

One small move usually beats a big plan: message one person something ordinary, or spend ten minutes somewhere with other people around — a library, a shop, a walk.

Who is the one person you would least dread hearing from?`,
  anger: `Anger usually means something mattered and got crossed. Feeling it is not the problem; where it lands is.

**If it is still hot:** leave the room, cold water on your hands, and wait before replying to anyone.

Underneath anger there is usually a need — respect, rest, fairness, or space. Which of those got missed?`,
  family: `Family pressure is hard precisely because you cannot walk away from it the way you can from strangers.

Loyalty and self-respect can both be real at once. One small boundary, said calmly and once, is usually more sustainable than a big confrontation.

What was said this time?`,
  fallback: `I'm listening. Tell me a bit more about what happened and how it landed for you.

If it is easier, you can start with just the facts — what happened, when, and who was involved — and we can go from there. I can also help with coping skills, thinking things through, or a maths or study question.`,
}

export const CRISIS_RESPONSE = `What you're describing sounds serious, and I'm not equipped to be your only support right now. **MindBridge AI is not a crisis service.**

**Please reach out now:**
- **India:** Tele-MANAS — 14416 | iCall — 9152987821 | Vandrevala Foundation — 1860-2662-345 | AASRA — 9820466726
- **Emergency:** 112 or your local emergency number

If there is someone who could be with you tonight, please ask them. You should not have to hold this on your own.`

function matchesAny(text, patterns) {
  return patterns.some((p) => p.test(text))
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getBotResponse(userMessage) {
  const text = userMessage.trim()
  if (!text) return "I'm listening — feel free to share what's on your mind."

  if (isCrisisMessage(text)) return CRISIS_RESPONSE

  if (matchesAny(text, GREETING_PATTERNS)) return pickRandom(RESPONSES.greeting)
  if (matchesAny(text, THANKS_PATTERNS)) return pickRandom(RESPONSES.thanks)
  if (matchesAny(text, HELP_PATTERNS)) return RESPONSES.help

  // Specific incidents before generic mood words, so "I broke up with my
  // girlfriend and feel sad" gets the breakup reply rather than the sad one.
  if (matchesAny(text, GRIEF_PATTERNS)) return RESPONSES.grief
  if (matchesAny(text, BREAKUP_PATTERNS)) return RESPONSES.breakup
  if (matchesAny(text, ANGER_PATTERNS)) return RESPONSES.anger
  if (matchesAny(text, STUDY_WORK_PATTERNS)) return RESPONSES.studyWork
  if (matchesAny(text, LONELY_PATTERNS)) return RESPONSES.lonely
  if (matchesAny(text, FAMILY_PATTERNS)) return RESPONSES.family

  if (matchesAny(text, ANXIETY_PATTERNS)) return RESPONSES.anxiety
  if (matchesAny(text, SAD_PATTERNS)) return RESPONSES.sadness
  if (matchesAny(text, SLEEP_PATTERNS)) return RESPONSES.sleep
  if (matchesAny(text, CBT_PATTERNS)) return RESPONSES.cbt
  if (matchesAny(text, BREATHING_PATTERNS)) return RESPONSES.breathing
  if (matchesAny(text, COPING_PATTERNS)) return RESPONSES.coping
  if (matchesAny(text, MOOD_PATTERNS)) return RESPONSES.mood

  return RESPONSES.fallback
}
