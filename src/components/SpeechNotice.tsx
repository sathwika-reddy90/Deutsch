import { useEffect } from 'react';
import type { SpeechNotice as Notice } from '../hooks/useGermanSpeech';
import './SpeechNotice.css';

interface SpeechNoticeProps {
  notice: Notice | null;
  onDismiss: () => void;
}

const ICONS: Record<Notice['tone'], string> = { error: '🔇', warning: '⚠️', tip: '🔈' };
/** Tips fade by themselves; problems stay until dismissed or audio works again. */
const TIP_MS = 9000;

/** A small message above the card controls when audio fails or needs a hint. */
export function SpeechNotice({ notice, onDismiss }: SpeechNoticeProps) {
  useEffect(() => {
    if (notice?.tone !== 'tip') return;
    const timer = window.setTimeout(onDismiss, TIP_MS);
    return () => window.clearTimeout(timer);
  }, [notice, onDismiss]);

  return (
    <div className="speech-notice-region" role={notice?.tone === 'error' ? 'alert' : 'status'} aria-live="polite">
      {notice && (
        <div key={notice.key} className={`speech-notice speech-notice--${notice.tone}`} data-testid="speech-notice">
          <span className="speech-notice__icon" aria-hidden="true">
            {ICONS[notice.tone]}
          </span>
          <p className="speech-notice__text">
            <strong>{notice.title}</strong>
            {notice.detail && <> {notice.detail}</>}
          </p>
          <button type="button" className="speech-notice__close" onClick={onDismiss} aria-label="Dismiss audio message">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
