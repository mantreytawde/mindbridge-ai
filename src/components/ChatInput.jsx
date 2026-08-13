import { useEffect, useRef, useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [disabled])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Share what's on your mind..."
        aria-label="Message input"
        autoComplete="off"
        autoFocus
      />
      <button type="submit" disabled={disabled || !input.trim()} aria-label="Send message">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  )
}
