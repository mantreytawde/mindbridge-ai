import ThemeToggle from './ThemeToggle'

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-brand">
        <img
          className="logo-image"
          src="/images/companion-avatar.png"
          alt=""
          width="52"
          height="52"
        />
        <div>
          <h1>MindBridge AI</h1>
          <p className="tagline">A quiet space to talk things through</p>
        </div>
      </div>
      <div className="header-actions">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <span className="badge">Wellness session</span>
      </div>
    </header>
  )
}
