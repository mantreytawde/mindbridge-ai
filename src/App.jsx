import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Disclaimer from './components/Disclaimer'
import ChatWindow from './components/ChatWindow'
import { QUICK_ACTIONS, WELCOME_MESSAGE } from './utils/chatbot'
import { useTheme } from './hooks/useTheme'
import './App.css'

const STORAGE_KEY = 'mindbridge-conversation'
const NETWORK_ERROR_REPLY =
  'I could not reach the local chat service. Make sure `npm run dev` is running, then try again.'

function loadStoredMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [WELCOME_MESSAGE]
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return [WELCOME_MESSAGE]
    const valid = parsed.filter(
      (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
    )
    return valid.length ? valid : [WELCOME_MESSAGE]
  } catch {
    return [WELCOME_MESSAGE]
  }
}

function maxNumericId(list) {
  return list.reduce((max, message) => {
    const n = Number.parseInt(message.id, 10)
    return Number.isFinite(n) && n > max ? n : max
  }, 0)
}

let messageId = 0
function createMessage(role, content) {
  return {
    id: String(++messageId),
    role,
    content,
    timestamp: Date.now(),
  }
}

async function requestChatReply(conversation) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: conversation.map(({ role, content }) => ({ role, content })),
    }),
  })

  if (!res.ok) {
    throw new Error(`Chat request failed (${res.status})`)
  }

  const data = await res.json()
  if (typeof data?.reply !== 'string' || !data.reply.trim()) {
    throw new Error('Empty chat reply')
  }

  return data.reply
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const [messages, setMessages] = useState(() => {
    const stored = loadStoredMessages()
    messageId = maxNumericId(stored)
    return stored
  })
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      // Ignore quota / private-mode failures.
    }
  }, [messages])

  const handleSend = useCallback(async (text) => {
    const userMessage = createMessage('user', text)
    const conversation = [...messages, userMessage]
    setMessages(conversation)
    setIsTyping(true)

    try {
      const reply = await requestChatReply(conversation)
      setMessages((prev) => [...prev, createMessage('assistant', reply)])
    } catch {
      setMessages((prev) => [...prev, createMessage('assistant', NETWORK_ERROR_REPLY)])
    } finally {
      setIsTyping(false)
    }
  }, [messages])

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <figure className="session-hero">
        <img
          src="/images/session-hero.png"
          alt="A calm therapy room with two chairs, plants, and a painting of a bridge"
        />
        <figcaption className="session-hero-copy">
          <p className="session-hero-kicker">Your session space</p>
          <h2>Sit down. Say what's on your mind.</h2>
          <p>
            MindBridge listens, reflects, and teaches coping skills. It is a wellness companion —
            not a licensed therapist.
          </p>
        </figcaption>
      </figure>

      <Disclaimer />
      <ChatWindow
        messages={messages}
        onSend={handleSend}
        isTyping={isTyping}
        quickActions={QUICK_ACTIONS}
      />
    </div>
  )
}

export default App
