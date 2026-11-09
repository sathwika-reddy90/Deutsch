import type { MouseEvent } from 'react';
import type { ExampleSentence } from '../data/vocabulary';
import { sentenceSpeechId, type SpeakingState, type SpeechMode } from '../hooks/useGermanSpeech';
import { SpeakerIcon } from './AudioButton';
import { GlossedSentence } from './GlossedSentence';

interface ExampleSentencesProps {
  wordId: string;
  sentences: ExampleSentence[];
  speechSupported: boolean;
  /** Which sentence of this card is playing, if any. */
  speaking: SpeakingState | null;
  /** Paused while Speaking Practice runs on this card. */
  audioDisabled: boolean;
  onSpeak: (index: number, mode: SpeechMode) => void;
  /** Clicks here still flip the card (the panel sits above the flip button so it can scroll). */
  onFlip: () => void;
}

const LABELS: Record<SpeechMode, { title: string; aria: string }> = {
  normal: { title: 'Listen to German sentence', aria: 'Listen to German sentence:' },
  slow: { title: 'Listen to German sentence slowly', aria: 'Listen slowly to German sentence:' },
};

/**
 * "Example Sentences" on the German side: each German sentence (hover / tap a word for
 * its English) with 🔊 / 🐢 and the English translation underneath.
 */
export function ExampleSentences({ wordId, sentences, speechSupported, speaking, audioDisabled, onSpeak, onFlip }: ExampleSentencesProps) {
  return (
    <section className="card__examples" aria-label="Example sentences" onClick={onFlip}>
      <h5 className="card__examples-title">Example Sentences</h5>
      <ol className="card__examples-list">
        {sentences.map(({ german, english, words }, index) => (
          <li key={german} className="card__example">
            <p lang="de" className="card__example-german">
              <GlossedSentence words={words} />
            </p>
            {speechSupported && (
              <span className="card__example-audio">
                {(['normal', 'slow'] as const).map((mode) => {
                  const isSpeaking = speaking?.id === sentenceSpeechId(wordId, index) && speaking.mode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      className={`sentence-audio sentence-audio--${mode}${isSpeaking ? ' is-speaking' : ''}`}
                      onClick={(event: MouseEvent) => {
                        event.stopPropagation(); // play, don't flip the card
                        onSpeak(index, mode);
                      }}
                      disabled={audioDisabled}
                      aria-label={`${LABELS[mode].aria} ${german}`}
                      aria-busy={isSpeaking}
                      title={LABELS[mode].title}
                    >
                      {mode === 'normal' ? (
                        <SpeakerIcon className="sentence-audio__icon" size={16} />
                      ) : (
                        <span className="sentence-audio__icon sentence-audio__icon--emoji" aria-hidden="true">
                          🐢
                        </span>
                      )}
                    </button>
                  );
                })}
              </span>
            )}
            <p className="card__example-english">{english}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
