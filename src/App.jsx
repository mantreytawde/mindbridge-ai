import { useCallback, useState } from 'react'
import Header from './components/Header'
import Disclaimer from './components/Disclaimer'
import ChatWindow from './components/ChatWindow'
import {
  CRISIS_RESPONSE,
  getBotResponse,
  isCrisisMessage,
  QUICK_ACTIONS,
  WELCOME_MESSAGE,
} from './utils/chatbot'
import { runMindBridgePipeline } from './utils/orchestrate'
import { useTheme } from './hooks/useTheme'
import './App.css'

let messageId = 1
function createMessage(role, content) {
  return {
    id: String(++messageId),
    role,
    content,
    timestamp: Date.now(),
  }
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = useCallback(async (text) => {
    const userMessage = createMessage('user', text)
    const conversation = [...messages, userMessage]
    setMessages(conversation)
    setIsTyping(true)

    try {
      if (isCrisisMessage(text)) {
        setMessages((prev) => [...prev, createMessage('assistant', CRISIS_RESPONSE)])
        return
      }

      const reply = await runMindBridgePipeline(conversation)
      setMessages((prev) => [...prev, createMessage('assistant', reply)])
    } catch {
      const reply = getBotResponse(text)
      setMessages((prev) => [...prev, createMessage('assistant', reply)])
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
