import type { ReactNode } from 'react';
import { GermanFlag } from './GermanFlag';
import { ProgressBar } from './ProgressBar';
import './Header.css';

interface HeaderProps {
  position: number;
  deckSize: number;
  learned: number;
  total: number;
  /** Unit selector shown under the title. */
  unitNav?: ReactNode;
  /** What one card is called: "word" or "letter". */
  noun?: string;
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function Header({ position, deckSize, learned, total, unitNav, noun = 'word' }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">
        <h1 className="header__title">
          Deutsch Lernen <GermanFlag className="german-flag--title" />
        </h1>
        <p className="header__subtitle">Learn German one word at a time</p>
        {unitNav}
      </div>

      <div className="header__progress">
        <ProgressBar
          label={`Current ${noun}`}
          value={position}
          max={deckSize}
          caption={
            <span>
              {`${capitalize(noun)} `}
              <strong>{position}</strong> of <strong>{deckSize}</strong>
            </span>
          }
        />
        <ProgressBar
          label={`${capitalize(noun)}s learned`}
          tone="green"
          value={learned}
          max={total}
          caption={
            <>
              <span>
                <strong>
                  {learned} / {total}
                </strong>{' '}
                {`${noun}s learned`}
              </span>
              {total > 0 && learned === total && <span className="header__done">Super! 🎉</span>}
            </>
          }
        />
      </div>
    </header>
  );
}
