const ACTION_ICONS = {
  'Feeling anxious': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 14c2-4 4-6 8-6s6 2 8 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M8 18c1.2-2 2.4-3 4-3s2.8 1 4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  'Coping tips': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4c2 3 6 5 6 9a6 6 0 1 1-12 0c0-4 4-6 6-9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  'What is CBT?': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 8h10a4 4 0 0 1 0 8H9l-4 3V8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  'Breathing exercise': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12h3l2-5 3 10 2-5h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  'Mood check-in': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 14.5c1 1.4 2.6 2 3.5 2s2.5-.6 3.5-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
  'Sleep tips': (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 6a7 7 0 1 0 5 11 7 7 0 0 1-5-11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

export default function QuickActions({ actions, onSelect, disabled }) {
  return (
    <div className="quick-actions" role="group" aria-label="Quick actions">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className="quick-action-btn"
          onClick={() => onSelect(action.message)}
          disabled={disabled}
        >
          {ACTION_ICONS[action.label]}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  )
}
