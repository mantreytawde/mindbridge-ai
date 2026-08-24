import { useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import QuickActions from './QuickActions'
import ChatInput from './ChatInput'

export default function ChatWindow({ messages, onSend, isTyping, quickActions }) {
  const [expanded, setExpanded] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, expanded])

  useEffect(() => {
    document.body.classList.toggle('chat-expanded', expanded)

    if (!expanded) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setExpanded(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('chat-expanded')
    }
  }, [expanded])

  return (
    <section
      className={`chat-window${expanded ? ' chat-window--expanded' : ''}`}
      aria-label="Chat conversation"
    >
      <div
        className="session-bar"
        onClick={() => {
          if (!expanded) setExpanded(true)
        }}
      >
        <span className="session-dot" aria-hidden="true" />
        <p>{isTyping ? 'MindBridge is reflecting…' : 'Private session · educational support'}</p>
        <button
          type="button"
          className="chat-expand"
          onClick={(e) => {
            e.stopPropagation()
            setExpanded((open) => !open)
          }}
          aria-label={expanded ? 'Exit fullscreen chat' : 'Expand chat to fullscreen'}
          aria-pressed={expanded}
          title={expanded ? 'Exit fullscreen' : 'Expand chat'}
        >
          {expanded ? (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 9H5V5M15 9h4V5M9 15H5v4M15 15h4v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 5H5v4M15 5h4v4M9 19H5v-4M15 19h4v-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      <div
        className="messages"
        onClick={() => {
          if (!expanded) setExpanded(true)
        }}
      >
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
