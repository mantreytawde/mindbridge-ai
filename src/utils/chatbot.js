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

const HELP_PATTERNS = [
  /\b(help|what can you do|features|commands|options)\b/i,
]

const THANKS_PATTERNS = [/\b(thank|thanks|ty|appreciate)\b/i]

const CRISIS_PATTERNS = [
  /\b(suicid(al|e)?|kill myself|killing myself|end my life|ending my life)\b/i,
  /\b(self[-\s]?harm|hurt myself|harm myself|cut(ting)? myself)\b/i,
  /\b(want to die|wanna die|better off dead|no reason to live)\b/i,
  /\b(take my (own )?life|end it all|overdose on purpose)\b/i,
]

export function isCrisisMessage(text) {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text))
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

Try the quick-action buttons below, or just type how you're feeling!`,
  thanks: [
    "You're welcome. Remember, taking care of your mental well-being is a strength, not a weakness.",
    "Happy to help. I'm here whenever you need to reflect or learn something new.",
  ],
  fallback: `Thank you for sharing. While I'm designed for wellness support and psychoeducation, I may not fully understand every message.

**Try asking about:**
- Anxiety or stress coping
- CBT and thought reframing
- Breathing exercises
- Sleep tips
- Mood check-ins

Or use the quick-action buttons below. How can I support you?`,
}

export const CRISIS_RESPONSE = `It sounds like you may be going through something very difficult. **MindBridge AI is not a crisis service** and cannot provide emergency help.

**Please reach out now:**
- **India:** iCall — 9152987821 | Vandrevala Foundation — 1860-2662-345
- **Emergency:** 112 or your local emergency number

You deserve real support from a trained professional. Please contact one of these services.`

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
  if (matchesAny(text, ANXIETY_PATTERNS)) return RESPONSES.anxiety
  if (matchesAny(text, SAD_PATTERNS)) return RESPONSES.sadness
  if (matchesAny(text, SLEEP_PATTERNS)) return RESPONSES.sleep
  if (matchesAny(text, CBT_PATTERNS)) return RESPONSES.cbt
  if (matchesAny(text, BREATHING_PATTERNS)) return RESPONSES.breathing
  if (matchesAny(text, COPING_PATTERNS)) return RESPONSES.coping
  if (matchesAny(text, MOOD_PATTERNS)) return RESPONSES.mood

  return RESPONSES.fallback
}

export const QUICK_ACTIONS = [
  { label: 'Feeling anxious', message: "I'm feeling anxious and overwhelmed" },
  { label: 'Coping tips', message: 'What coping strategies can help me?' },
  { label: 'What is CBT?', message: 'Explain CBT to me' },
  { label: 'Breathing exercise', message: 'Guide me through a breathing exercise' },
  { label: 'Mood check-in', message: 'Help me with a mood check-in' },
  { label: 'Sleep tips', message: "I can't sleep well lately" },
]

export const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: `Welcome to **MindBridge AI** — *Connecting minds to clarity*.

I'm your wellness companion for reflection, coping strategies, and psychology education. I'm not a therapist, but I can sit with you, help you explore thoughts, learn about CBT, and practice grounding techniques.

**How are you feeling today?**`,
  timestamp: Date.now(),
}
