import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import QuickActions from './QuickActions'
import ChatInput from './ChatInput'

export default function ChatWindow({ messages, onSend, isTyping, quickActions }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <section className="chat-window" aria-label="Chat conversation">
      <div className="session-bar">
        <span className="session-dot" aria-hidden="true" />
        <p>{isTyping ? 'MindBridge is reflecting…' : 'Private session · educational support'}</p>
      </div>

      <div className="messages">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="message message-assistant">
            <img
              className="avatar avatar-bot"
              src="/images/companion-avatar.png"
              alt=""
              width="40"
              height="40"
            />
            <div className="bubble typing-indicator" aria-label="MindBridge is typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <QuickActions actions={quickActions} onSelect={onSend} disabled={isTyping} />
      <ChatInput onSend={onSend} disabled={isTyping} />
    </section>
  )
}
