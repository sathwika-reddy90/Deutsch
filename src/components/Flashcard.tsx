import { memo, useEffect, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { germanTerm, spokenText, type VocabWord } from '../data/vocabulary';
import type { SpeechMode } from '../hooks/useGermanSpeech';
import { PRACTICE, type RunningPracticeState } from '../hooks/useSpeakingPractice';
import { FlashcardBack } from './FlashcardBack';
import { FlashcardFront } from './FlashcardFront';
import { GermanFlag } from './GermanFlag';
import './Flashcard.css';

/** Delay before a card flips back to English after the mouse leaves it. */
export const FLIP_BACK_DELAY_MS = 200;

interface FlashcardProps {
  word: VocabWord;
  number: number;
  isFlipped: boolean;
  isLearned: boolean;
  isActive: boolean;
  /** Position in the deal animation. */
  dealIndex: number;
  speechSupported: boolean;
  speakingMode: SpeechMode | null;
  /** Speaking Practice lesson state, if this card is the word being practised. */
  practice: RunningPracticeState | null;
  onFlip: (id: string) => void;
  /** Flip back to English (mouse left the card). */
  onUnflip: (id: string) => void;
  onStopPractice: () => void;
  onActivate: (id: string) => void;
  onMarkLearned: (id: string) => void;
  onUnmarkLearned: (id: string) => void;
  onSpeak: (id: string, text: string, mode: SpeechMode) => void;
}

/** Small deterministic tilt so cards look casually placed on a table. */
function tiltFor(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return ((Math.abs(hash) % 13) - 6) / 8; // -0.75deg … 0.75deg
}

/**
 * One vocabulary card with an English front and a German back that flips in 3D.
 * Each face has its own full-size flip button; the hidden face is `inert`, so
 * keyboard and screen-reader users only ever reach the visible side.
 */
export const Flashcard = memo(function Flashcard({
  word,
  number,
  isFlipped,
  isLearned,
  isActive,
  dealIndex,
  speechSupported,
  speakingMode,
  practice,
  onFlip,
  onUnflip,
  onStopPractice,
  onActivate,
  onMarkLearned,
  onUnmarkLearned,
  onSpeak,
}: FlashcardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frontFlipRef = useRef<HTMLButtonElement>(null);
  const backFlipRef = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);
  const pointerTypeRef = useRef('mouse');
  const leaveTimerRef = useRef<number | undefined>(undefined);
  const isPracticing = practice !== null;
  // Latest values for the delayed hover-out callback.
  const latestRef = useRef({ isFlipped, isPracticing });
  useEffect(() => {
    latestRef.current = { isFlipped, isPracticing };
  }, [isFlipped, isPracticing]);
  useEffect(() => () => window.clearTimeout(leaveTimerRef.current), []);

  // The face that had focus becomes inert after a flip – hand focus to the other side.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (isFlipped ? backFlipRef : frontFlipRef).current?.focus({ preventScroll: true });
  }, [isFlipped]);

  const flip = () => {
    moveFocus.current = !!cardRef.current?.contains(document.activeElement);
    onActivate(word.id);
    onFlip(word.id);
  };

  // Desktop: the card flips back to English when the mouse leaves it.
  // Touch has no hover, so only real mouse pointers count (tap toggles instead).
  const rememberPointer = (event: PointerEvent) => {
    pointerTypeRef.current = event.pointerType;
    window.clearTimeout(leaveTimerRef.current);
  };
  const handleMouseLeave = () => {
    if (pointerTypeRef.current !== 'mouse' || !isFlipped || isPracticing) return;
    window.clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = window.setTimeout(() => {
      const latest = latestRef.current;
      if (!latest.isFlipped || latest.isPracticing) return;
      moveFocus.current = !!cardRef.current?.contains(document.activeElement);
      onUnflip(word.id);
    }, FLIP_BACK_DELAY_MS);
  };

  const frontStatus =
    practice?.stage === 'english' ? (
      <>🔊 Speaking English…</>
    ) : practice?.stage === 'pause' ? (
      <>⏱ {PRACTICE.pauseAfterEnglish / 1000}-second pause…</>
    ) : practice?.stage === 'next' ? (
      <>Moving to next word…</>
    ) : null;
  const backStatus =
    practice?.stage === 'german' ? (
      <>
        <GermanFlag decorative /> German pronunciation {practice.repetition} / {PRACTICE.germanRepetitions}
      </>
    ) : null;

  const term = germanTerm(word);
  const listen = (mode: SpeechMode) => {
    onActivate(word.id);
    onSpeak(word.id, spokenText(word), mode);
  };

  // Enter on the English side flips the card (the flip button's own click). Enter on
  // the German side plays Listen instead of flipping back – Space still flips back.
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || !isFlipped || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!(event.target instanceof HTMLElement) || !event.target.classList.contains('card__flip')) return; // Listen keeps its own Enter
    event.preventDefault();
    if (!event.repeat && speechSupported && !isPracticing) listen('normal');
  };

  return (
    <article
      className={`card-slot${isActive ? ' is-active' : ''}${isLearned ? ' is-learned' : ''}${isPracticing ? ' is-practicing' : ''}`}
      style={{ '--tilt': `${tiltFor(word.id)}deg`, '--deal-index': dealIndex } as CSSProperties}
      aria-label={`Card ${number}: ${word.english}`}
      aria-current={isActive ? 'true' : undefined}
      data-word-id={word.id}
      data-unit={word.unit}
    >
      <div
        className="card-scene"
        onPointerEnter={rememberPointer}
        onPointerDown={rememberPointer}
        onMouseEnter={() => window.clearTimeout(leaveTimerRef.current)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          className={`card${isFlipped ? ' is-flipped' : ''}`}
          onFocus={() => onActivate(word.id)}
          onKeyDown={handleKeyDown}
        >
          <div className="card__inner">
            <FlashcardFront
              word={word}
              number={number}
              hidden={isFlipped}
              flipRef={frontFlipRef}
              onFlip={flip}
              status={frontStatus}
              statusTone="active"
            />
            <FlashcardBack
              word={word}
              hidden={!isFlipped}
              flipRef={backFlipRef}
              onFlip={flip}
              speechSupported={speechSupported}
              speakingMode={speakingMode}
              audioDisabled={isPracticing}
              status={backStatus}
              onSpeak={listen}
            />
          </div>
        </div>
      </div>

      <div className="card-actions">
        {isPracticing ? (
          <button
            type="button"
            className="stop-practice-button"
            onClick={onStopPractice}
            aria-label={`Stop speaking practice for ${term}`}
          >
            <span aria-hidden="true">■</span> Stop Practice
          </button>
        ) : isLearned ? (
          <div className="learned-status" role="group" aria-label={`${term} is learned`}>
            <span className="learned-pill">
              <span aria-hidden="true">✓</span> Learned
            </span>
            <button
              type="button"
              className="text-button"
              onClick={() => onUnmarkLearned(word.id)}
              aria-label={`Undo: mark ${term} as not learned`}
            >
              Undo
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="learn-button"
            onClick={() => {
              onActivate(word.id);
              onMarkLearned(word.id);
            }}
            aria-label={`Mark ${term} as learned`}
          >
            <span aria-hidden="true">✓</span> Mark as Learned
          </button>
        )}
      </div>
    </article>
  );
});
