import type { SpeechMode } from '../hooks/useGermanSpeech';
import './AudioButton.css';

interface AudioButtonProps {
  /** German text to speak, e.g. "der Platz". */
  text: string;
  mode?: SpeechMode;
  isSpeaking: boolean;
  disabled?: boolean;
  onSpeak: () => void;
}

const LABELS: Record<SpeechMode, { idle: string; speaking: string; title: string; aria: string }> = {
  normal: {
    idle: 'Listen',
    speaking: 'Speaking…',
    title: 'Listen to German pronunciation',
    aria: 'Listen to German pronunciation of',
  },
  slow: {
    idle: 'Slow Listen',
    speaking: 'Speaking slowly…',
    title: 'Listen to slow German pronunciation',
    aria: 'Listen slowly to German pronunciation of',
  },
};

/** 🔊 Listen (primary) or 🐢 Slow Listen (secondary). */
export function AudioButton({ text, mode = 'normal', isSpeaking, disabled = false, onSpeak }: AudioButtonProps) {
  const label = LABELS[mode];
  return (
    <button
      type="button"
      className={`audio-button audio-button--${mode}${isSpeaking ? ' is-speaking' : ''}`}
      onClick={onSpeak}
      disabled={disabled}
      aria-label={`${label.aria} ${text}`}
      aria-busy={isSpeaking}
      title={label.title}
    >
      {mode === 'slow' ? (
        <span className="audio-button__icon audio-button__icon--emoji" aria-hidden="true">
          🐢
        </span>
      ) : (
        <svg className="audio-button__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4Z" />
          <path
            className="audio-button__wave audio-button__wave--1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M16 9.5a3.5 3.5 0 0 1 0 5"
          />
          <path
            className="audio-button__wave audio-button__wave--2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M18.5 7a7 7 0 0 1 0 10"
          />
        </svg>
      )}
      <span className="audio-button__label">{isSpeaking ? label.speaking : label.idle}</span>
      <span className="audio-button__bars" aria-hidden="true">
        {isSpeaking && (
          <>
            <span />
            <span />
            <span />
          </>
        )}
      </span>
    </button>
  );
}

/** Shown instead of the audio buttons when the browser has no speech synthesis. */
export function AudioUnavailable() {
  return (
    <p className="audio-unavailable" role="note">
      Audio is not available in this browser.
    </p>
  );
}
