import type { ReactNode, Ref } from 'react';
import type { VocabWord } from '../data/vocabulary';
import { CardImage } from './CardImage';
import { GermanFlag } from './GermanFlag';
import { LearnedStamp } from './LearnedStamp';
import { fitTextStyle } from './fitText';

interface FlashcardFrontProps {
  word: VocabWord;
  number: number;
  hidden: boolean;
  flipRef: Ref<HTMLButtonElement>;
  onFlip: () => void;
  /** Speaking Practice status shown in place of the hint. */
  status?: ReactNode;
  statusTone?: 'active' | 'done';
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** English side: category, picture, meaning. */
export function FlashcardFront({ word, number, hidden, flipRef, onFlip, status, statusTone }: FlashcardFrontProps) {
  // "town hall / city hall" → main meaning large, alternatives smaller.
  const [primary, ...alternatives] = word.english.split(' / ');

  return (
    <div className="card__face card__face--front" inert={hidden}>
      <button
        ref={flipRef}
        type="button"
        className="card__flip"
        onClick={onFlip}
        aria-label={`${capitalize(word.english)}. Flip card to reveal the German word`}
      />
      <div className="card__top">
        <span className="card__category">{word.category}</span>
        <span className="card__number">№ {String(number).padStart(2, '0')}</span>
      </div>
      <CardImage images={word.images} category={word.category} glyph={word.glyph} />
      <div className="card__word-block">
        <h4 className="card__english" style={fitTextStyle(primary, 1.9)}>
          {capitalize(primary)}
        </h4>
        {alternatives.length > 0 && <p className="card__alternatives">/ {alternatives.join(' / ')}</p>}
      </div>
      {status ? (
        <p className={`card__hint card__hint--status is-${statusTone}`} aria-hidden="true">
          {status}
        </p>
      ) : (
        <p className="card__hint" aria-hidden="true">
          <span className="hint-pointer">Click to reveal German</span>
          <span className="hint-touch">Tap to reveal German</span>
          <GermanFlag decorative />
        </p>
      )}
      <LearnedStamp />
    </div>
  );
}
