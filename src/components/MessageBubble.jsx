function renderMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ))
  })
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      {!isUser && (
        <img
          className="avatar avatar-bot"
          src="/images/companion-avatar.png"
          alt=""
          width="40"
          height="40"
        />
      )}
      <div className="bubble">
        {!isUser && <p className="bubble-name">MindBridge</p>}
        <div className="bubble-content">{renderMarkdown(message.content)}</div>
        <time className="bubble-time" dateTime={new Date(message.timestamp).toISOString()}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      </div>
      {isUser && (
        <img
          className="avatar avatar-user"
          src="/images/user-avatar.png"
          alt=""
          width="40"
          height="40"
        />
      )}
    </div>
  )
}
