export const QUICK_ACTIONS = [
  { label: 'Feeling anxious', message: "I'm feeling anxious and overwhelmed" },
  { label: 'Coping tips', message: 'What coping strategies can help me?' },
  { label: 'Breathing exercise', message: 'Guide me through a breathing exercise' },
  { label: 'Mood check-in', message: 'Help me with a mood check-in' },
  { label: 'Sleep tips', message: "I can't sleep well lately" },
]

export const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: `Welcome to **MindBridge AI** — *Connecting minds to clarity*.

I'm your wellness companion for reflection, coping strategies, and psychology education. I'm not a therapist, but I can sit with you, help you explore thoughts, and practice grounding techniques.

**How are you feeling today?**`,
  timestamp: Date.now(),
}
