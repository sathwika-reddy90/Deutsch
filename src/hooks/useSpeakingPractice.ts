import { useCallback, useEffect, useRef, useState } from 'react';
import { spokenText, type VocabWord } from '../data/vocabulary';
import type { SayOptions } from './useGermanSpeech';

/** Speeds, repetitions and pauses for the Speaking Practice lesson. */
export const PRACTICE = {
  germanRepetitions: 5,
  englishRate: 1,
  germanRate: 0.7,
  /** Starts only once the English utterance has ended (onend) → flip to German */
  pauseAfterEnglish: 3000,
  /** Flip started → first German repetition */
  pauseAfterFlip: 400,
  /** After each German repetition */
  pauseBetweenRepetitions: 250,
  /** Last German repetition → flip back to English */
  pauseBeforeFlipBack: 500,
  /** Flipped back → next word */
  pauseBeforeNextWord: 500,
};

interface RunningBase {
  status: 'running';
  /** 0-based position in the lesson. */
  index: number;
  total: number;
  /** Id of the word being practised. */
  id: string;
}

export type PracticeState =
  | (RunningBase & { stage: 'english' })
  | (RunningBase & { stage: 'pause' })
  | (RunningBase & { stage: 'german'; repetition: number })
  | (RunningBase & { stage: 'next' })
  | { status: 'complete'; total: number };

export type RunningPracticeState = Extract<PracticeState, { status: 'running' }>;

/** "town hall / city hall" → "town hall, city hall" (spoken once, as one phrase). */
export const englishSpeechText = (word: VocabWord) => word.english.split(' / ').join(', ');

interface Options {
  /** Speaks once; resolves when `onend` fires (`false` if interrupted). */
  say: (text: string, options: SayOptions) => Promise<boolean>;
  cancel: () => void;
  setFlip: (id: string, toGerman: boolean) => void;
}

/**
 * Speaking Practice, started with one click, for a snapshot of words (the cards
 * shown when it starts). For every word, in order: English ×1 → 3 s pause →
 * flip → German ×5 → flip back → next word, until the last word, then
 * "complete". Letters skip the English audio (it would be the English letter name). Each step waits for the speech to actually end (onend).
 * `stop()` cancels speech and timers, ends the lesson and returns the card to English.
 */
export function useSpeakingPractice({ say, cancel, setFlip }: Options) {
  const [state, setState] = useState<PracticeState | null>(null);
  /** The words of the current/last lesson (snapshot taken at start). */
  const [words, setWords] = useState<VocabWord[]>([]);
  const stateRef = useRef<PracticeState | null>(null);
  const runRef = useRef(0);
  const timersRef = useRef(new Set<number>());

  const update = useCallback((next: PracticeState | null) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current.clear();
  }, []);

  /** A pause between steps; resolves `false` if the lesson was stopped meanwhile. */
  const delay = useCallback(
    (ms: number, run: number) =>
      new Promise<boolean>((resolve) => {
        const timer = window.setTimeout(() => {
          timersRef.current.delete(timer);
          resolve(runRef.current === run);
        }, ms);
        timersRef.current.add(timer);
      }),
    [],
  );

  const stop = useCallback(() => {
    runRef.current++; // any step still waiting sees it is no longer current
    clearTimers();
    const current = stateRef.current;
    if (current?.status !== 'running') return;
    cancel();
    setFlip(current.id, false);
    update(null);
  }, [cancel, setFlip, update, clearTimers]);

  const start = useCallback(
    async (snapshot: VocabWord[]) => {
      stop();
      const words = [...snapshot];
      setWords(words);
      const run = ++runRef.current;
      const isCurrent = () => runRef.current === run;
      const total = words.length;
      let currentId = words[0]?.id;
      // Speech failed or was interrupted by something other than Stop.
      const abort = () => {
        if (!isCurrent()) return;
        runRef.current++;
        clearTimers();
        if (currentId) setFlip(currentId, false);
        update(null);
      };

      cancel(); // nothing else may be speaking when the lesson starts

      for (let index = 0; index < total; index++) {
        const word = words[index];
        currentId = word.id;
        const base = { status: 'running', index, total, id: word.id } as const;

        // 1. English side, English meaning once.
        setFlip(word.id, false);
        if (!word.silentFront) {
          update({ ...base, stage: 'english' });
          if (!(await say(englishSpeechText(word), { language: 'en', rate: PRACTICE.englishRate }))) return abort();
        }

        // 2–3. Only after the English audio has ended (or right away for letters): a 3-second pause, then flip to German.
        update({ ...base, stage: 'pause' });
        if (!(await delay(PRACTICE.pauseAfterEnglish, run))) return;
        update({ ...base, stage: 'german', repetition: 1 });
        setFlip(word.id, true);
        if (!(await delay(PRACTICE.pauseAfterFlip, run))) return;

        // 4. The full German term, five times – each waits for onend.
        const term = spokenText(word);
        for (let repetition = 1; repetition <= PRACTICE.germanRepetitions; repetition++) {
          update({ ...base, stage: 'german', repetition });
          if (!(await say(term, { language: 'de', rate: PRACTICE.germanRate }))) return abort();
          if (!(await delay(PRACTICE.pauseBetweenRepetitions, run))) return;
        }

        // 5–6. Pause, flip back to English.
        if (!(await delay(PRACTICE.pauseBeforeFlipBack, run))) return;
        setFlip(word.id, false);

        // 7–8. Pause, then the next word.
        if (index < total - 1) {
          update({ ...base, stage: 'next' });
          if (!(await delay(PRACTICE.pauseBeforeNextWord, run))) return;
        }
      }

      if (!isCurrent()) return;
      runRef.current++;
      cancel(); // the lesson is over – make sure nothing keeps speaking
      update({ status: 'complete', total });
    },
    [say, cancel, setFlip, delay, stop, update, clearTimers],
  );

  // Stop on unmount.
  useEffect(
    () => () => {
      runRef.current++;
      clearTimers();
    },
    [clearTimers],
  );

  const isRunning = state?.status === 'running';
  return { state, words, isRunning, start, stop };
}
