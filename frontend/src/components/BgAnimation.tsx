export function BgAnimation() {
  const particles = ['✅', '📋', '⏰', '🎯', '📝', '⚡', '📊', '📌']
  return (
    <div className="bg-animation" aria-hidden="true">
      {particles.map((p, i) => <span key={i} className="bg-particle">{p}</span>)}
      <div className="bg-line" />
      <div className="bg-line" />
      <div className="bg-line" />
      <div className="bg-line" />
    </div>
  )
}
