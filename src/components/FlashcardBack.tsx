import type { ReactNode, Ref } from 'react';
import { germanTerm, type VocabWord } from '../data/vocabulary';
import type { SpeechMode } from '../hooks/useGermanSpeech';
import { AudioButton, AudioUnavailable } from './AudioButton';
import { CardImage } from './CardImage';
import { GermanFlag } from './GermanFlag';
import { LearnedStamp } from './LearnedStamp';
import { fitTextStyle } from './fitText';

interface FlashcardBackProps {
  word: VocabWord;
  hidden: boolean;
  flipRef: Ref<HTMLButtonElement>;
  onFlip: () => void;
  speechSupported: boolean;
  /** Which audio button of this card is playing, if any. */
  speakingMode: SpeechMode | null;
  onSpeak: (mode: SpeechMode) => void;
  /** Listen buttons are paused while Speaking Practice runs on this card. */
  audioDisabled?: boolean;
  /** Speaking Practice status shown in place of the hint. */
  status?: ReactNode;
}

/** German side: article + word, pronunciation guide and audio. */
export function FlashcardBack({
  word,
  hidden,
  flipRef,
  onFlip,
  speechSupported,
  speakingMode,
  onSpeak,
  audioDisabled = false,
  status,
}: FlashcardBackProps) {
  // Audio always says the real German term (with article), never the guide.
  const term = germanTerm(word);
  return (
    <div className="card__face card__face--back" inert={hidden}>
      <button
        ref={flipRef}
        type="button"
        className="card__flip"
        onClick={onFlip}
        aria-label={`${germanTerm(word)}. Flip card back to English`}
      />
      <div className="card__top">
        <span className="card__language">
          German <GermanFlag />
        </span>
        {word.note && <span className="card__note">{word.note}</span>}
      </div>
      <CardImage images={word.images} category={word.category} size="small" glyph={word.glyph} />
      <div className="card__word-block card__word-block--german">
        <h4 lang="de" className="term">
          {word.article && (
            <>
              <span className={`term__article term__article--${word.article}`}>{word.article}</span>{' '}
            </>
          )}
          <span
            className={`term__word${word.german.includes(' ') ? ' term__word--phrase' : ''}`}
            style={fitTextStyle(word.german, 2.25)}
          >
            {word.german}
          </span>
        </h4>
        {word.pronunciation && (
          <p className="card__pronunciation">
            <span className="sr-only">Pronunciation guide: </span>“{word.pronunciation}”
          </p>
        )}
        <div className="card__audio">
          {speechSupported ? (
            <>
              <AudioButton
                text={term}
                isSpeaking={speakingMode === 'normal'}
                disabled={audioDisabled}
                onSpeak={() => onSpeak('normal')}
              />
              <AudioButton
                text={term}
                mode="slow"
                isSpeaking={speakingMode === 'slow'}
                disabled={audioDisabled}
                onSpeak={() => onSpeak('slow')}
              />
            </>
          ) : (
            <AudioUnavailable />
          )}
        </div>
      </div>
      {status ? (
        <p className="card__hint card__hint--status is-active" aria-hidden="true">
          {status}
        </p>
      ) : (
        <p className="card__hint" aria-hidden="true">
          <span className="hint-pointer">Click to flip back</span>
          <span className="hint-touch">Tap to flip back</span>
        </p>
      )}
      <LearnedStamp />
    </div>
  );
}
