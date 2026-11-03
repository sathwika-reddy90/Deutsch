/** Drawn flag – the 🇩🇪 emoji doesn't render on every platform (e.g. Windows). */
export function GermanFlag({ className = '', decorative = false }: { className?: string; decorative?: boolean }) {
  return (
    <span
      className={`german-flag ${className}`}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': 'German flag' })}
    >
      <span />
      <span />
      <span />
    </span>
  );
}
