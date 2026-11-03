import type { VocabWord } from '../data/vocabulary';
import { PRACTICE, type PracticeState } from '../hooks/useSpeakingPractice';
import { GermanFlag } from './GermanFlag';
import './SpeakingPractice.css';

interface SpeakingPracticeProps {
  supported: boolean;
  /** "Unit 3" or "Alphabets". */
  unitName: string;
  /** What one card is called: "word" or "letter". */
  noun: string;
  /** False when no card's front is read aloud (letters). */
  readsFront: boolean;
  /** The selected unit has no vocabulary at all. */
  unitEmpty: boolean;
  state: PracticeState | null;
  /** Snapshot of the words of the running / last lesson. */
  lessonWords: VocabWord[];
  /** How many cards are currently shown – what a new lesson would practise. */
  shownCount: number;
  onStart: () => void;
  onStop: () => void;
}

const displayEnglish = (word: VocabWord) => {
  const primary = word.english.split(' / ')[0];
  return primary.charAt(0).toUpperCase() + primary.slice(1);
};

const PAUSE_SECONDS = PRACTICE.pauseAfterEnglish / 1000;

/** One click practises every card currently shown: English ×1, 3 s pause, German ×5. */
export function SpeakingPractice({
  supported,
  unitName,
  noun,
  readsFront,
  unitEmpty,
  state,
  lessonWords,
  shownCount,
  onStart,
  onStop,
}: SpeakingPracticeProps) {
  const running = state?.status === 'running' ? state : null;
  const complete = state?.status === 'complete';
  const total = state ? state.total : shownCount;
  const current = running ? lessonWords[running.index] : undefined;
  const progress = complete ? 1 : running ? running.index / running.total : 0;
  const nouns = `${noun}s`;
  const englishOnce = readsFront ? 'English once, ' : '';
  const englishOnceTitle = readsFront ? `English once, ${PAUSE_SECONDS}-second pause, ` : `${PAUSE_SECONDS}-second pause, `;

  let stage = null;
  if (running?.stage === 'english') stage = <>🔊 Speaking English…</>;
  else if (running?.stage === 'pause') stage = <>⏱ {PAUSE_SECONDS}-second pause…</>;
  else if (running?.stage === 'german')
    stage = (
      <>
        <GermanFlag decorative /> German pronunciation {running.repetition} / {PRACTICE.germanRepetitions}
      </>
    );
  else if (running?.stage === 'next') stage = <>Moving to next {noun}…</>;

  return (
    <div className={`practice${running ? ' is-running' : ''}${complete ? ' is-complete' : ''}`}>
      {running ? (
        <button type="button" className="practice__button is-running" onClick={onStop}>
          <span aria-hidden="true">■</span> Stop Practice
        </button>
      ) : (
        <button
          type="button"
          className="practice__button"
          onClick={onStart}
          disabled={!supported || unitEmpty || shownCount === 0}
          title={`The ${shownCount} ${nouns} shown: ${englishOnceTitle}German ${PRACTICE.germanRepetitions} times`}
        >
          {complete ? (
            <span aria-hidden="true" className="practice__again">
              🔄
            </span>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4Z" />
              <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M16 9.5a3.5 3.5 0 0 1 0 5" />
              <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M18.5 7a7 7 0 0 1 0 10" />
            </svg>
          )}
          {complete ? 'Practice Again' : 'Speaking Practice'}
        </button>
      )}

      <div className="practice__status" data-testid="practice-status">
        {unitEmpty ? (
          <p className="practice__line">No vocabulary available for this unit.</p>
        ) : !supported ? (
          <p className="practice__line">Audio is not available in this browser.</p>
        ) : running && current ? (
          <>
            <p className="practice__line practice__line--word">
              <strong>
                {noun.charAt(0).toUpperCase() + noun.slice(1)} {running.index + 1} / {running.total}
              </strong>{' '}
              <span className="practice__word">· {displayEnglish(current)}</span>{' '}
            </p>
            <p className="practice__line practice__line--stage">{stage}</p>
          </>
        ) : complete ? (
          <>
            <p className="practice__line practice__line--done">✓ {unitName} Speaking Practice Complete </p>
            <p className="practice__line">
              {total} / {total} {nouns} completed
            </p>
          </>
        ) : (
          <p className="practice__line">
            {shownCount} {shownCount === 1 ? noun : nouns} shown · {englishOnce}German {PRACTICE.germanRepetitions}×
          </p>
        )}
        {(running || complete) && (
          <div className="practice__progress" aria-hidden="true">
            <div className="practice__progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </div>

      {/* Announce word changes and completion only – not every repetition. */}
      <p className="sr-only" role="status">
        {running && current
          ? `Speaking Practice: ${noun} ${running.index + 1} of ${running.total}, ${current.english}`
          : complete
            ? `${unitName} Speaking Practice complete. ${total} of ${total} ${nouns} completed.`
            : ''}
      </p>
    </div>
  );
}
