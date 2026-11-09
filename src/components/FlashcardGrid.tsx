import type { VocabWord } from '../data/vocabulary';
import type { SpeakingState, SpeechMode } from '../hooks/useGermanSpeech';
import type { PracticeState } from '../hooks/useSpeakingPractice';
import { Flashcard } from './Flashcard';
import './FlashcardGrid.css';

interface FlashcardGridProps {
  words: VocabWord[];
  activeId?: string;
  flipped: Set<string>;
  learned: Set<string>;
  speechSupported: boolean;
  speaking: SpeakingState | null;
  practice: PracticeState | null;
  /** Speaking Practice lesson running: cards ignore manual flips and hover. */
  locked: boolean;
  onFlip: (id: string) => void;
  onUnflip: (id: string) => void;
  onStopPractice: () => void;
  onActivate: (id: string) => void;
  onMarkLearned: (id: string) => void;
  onUnmarkLearned: (id: string) => void;
  onSpeak: (id: string, text: string, mode: SpeechMode, rate?: number) => void;
}

export function FlashcardGrid({ words, activeId, flipped, learned, speaking, practice, locked, ...rest }: FlashcardGridProps) {
  return (
    <section className={`card-grid${locked ? ' is-locked' : ''}`} aria-label="Flashcards" aria-busy={locked}>
      {words.map((word, index) => (
        <Flashcard
          key={word.id}
          word={word}
          number={index + 1}
          dealIndex={Math.min(index, 12)}
          isActive={word.id === activeId}
          isFlipped={flipped.has(word.id)}
          isLearned={learned.has(word.id)}
          speakingMode={speaking?.id === word.id ? speaking.mode : null}
          speakingSentence={speaking?.id.startsWith(`${word.id}#`) ? speaking : null}
          practice={practice?.status === 'running' && practice.id === word.id ? practice : null}
          {...rest}
        />
      ))}
    </section>
  );
}
