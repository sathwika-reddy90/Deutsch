import type { ReactNode } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  /** Visible text, e.g. "12 / 20 words learned". */
  caption: ReactNode;
  tone?: 'amber' | 'green';
}

export function ProgressBar({ label, value, max, caption, tone = 'amber' }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={`progress progress--${tone}`}>
      <div className="progress__caption">{caption}</div>
      <div
        className="progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} of ${max}`}
      >
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
