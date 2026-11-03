import type { ReactNode } from 'react';
import type { Unit } from '../data/vocabulary';
import './UnitHeader.css';

interface UnitHeaderProps {
  unit: Unit;
  wordCount: number;
  learned: number;
  /** Unit-level controls (Speaking Practice). */
  children?: ReactNode;
}

/** "UNIT 3 · German Vocabulary · 28 words · 0 / 28 learned" above the deck. */
export function UnitHeader({ unit, wordCount, learned, children }: UnitHeaderProps) {
  const done = wordCount > 0 && learned === wordCount;
  const empty = wordCount === 0;
  return (
    <section className="unit" aria-labelledby="unit-title" data-unit={unit.number}>
      <div className="unit__intro">
        <p className="unit__label">{unit.name}</p>
        <h2 id="unit-title" className="unit__title">
          {empty ? 'No vocabulary available yet' : unit.title}
        </h2>
        {empty ? (
          <p className="unit__meta">
            <span className="unit__soon">Coming Soon</span>
            <span className="unit__learned">0 / 0 learned</span>
          </p>
        ) : (
          <p className="unit__meta">
            <span className="unit__count">
              {wordCount} {wordCount === 1 ? unit.noun : `${unit.noun}s`}
            </span>
            <span className="unit__dot" aria-hidden="true">
              ·
            </span>
            <span className={`unit__learned${done ? ' is-done' : ''}`}>
              <span aria-hidden="true">✓</span> {learned} / {wordCount} learned
            </span>
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
