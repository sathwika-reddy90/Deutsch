import './NavigationControls.css';

interface NavigationControlsProps {
  position: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onReset: () => void;
  resetDisabled?: boolean;
}

export function NavigationControls({
  position,
  total,
  onPrevious,
  onNext,
  onShuffle,
  onReset,
  resetDisabled = false,
}: NavigationControlsProps) {
  const empty = total === 0;
  return (
    <div className="dock" role="toolbar" aria-label="Flashcard navigation">
      <button
        type="button"
        className="dock__button"
        onClick={onPrevious}
        disabled={empty || position <= 1}
        aria-label="Previous card"
      >
        <span aria-hidden="true">←</span>
        <span className="dock__label">Previous</span>
      </button>

      <span className="dock__position" aria-live="polite">
        {empty ? '0 / 0' : `${position} / ${total}`}
      </span>

      <button
        type="button"
        className="dock__button dock__button--primary"
        onClick={onNext}
        disabled={empty || position >= total}
        aria-label="Next card"
      >
        <span className="dock__label">Next</span>
        <span aria-hidden="true">→</span>
      </button>

      <span className="dock__divider" aria-hidden="true" />

      <button type="button" className="dock__button" onClick={onShuffle} disabled={total < 2} aria-label="Shuffle cards">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
          />
        </svg>
        <span className="dock__label">Shuffle</span>
      </button>

      <button
        type="button"
        className="dock__button"
        onClick={onReset}
        disabled={resetDisabled}
        aria-label="Reset order and progress"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"
          />
        </svg>
        <span className="dock__label">Reset</span>
      </button>
    </div>
  );
}
