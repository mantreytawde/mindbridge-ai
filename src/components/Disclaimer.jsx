export default function Disclaimer() {
  return (
    <aside className="disclaimer" role="note">
      <span className="disclaimer-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1" fill="currentColor" />
        </svg>
      </span>
      <p>
        <strong>Important — not therapy.</strong> MindBridge AI is an educational prototype for
        academic purposes. It is not a substitute for professional mental health care. If you are in
        distress, contact a qualified professional or a crisis helpline.
      </p>
    </aside>
  )
}
