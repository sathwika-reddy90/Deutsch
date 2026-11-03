import { useCallback, useState } from 'react';
import { germanTerm } from '../data/vocabulary';
import type { TestResult } from '../data/unitTest';

const STORAGE_KEY = 'deutsch-lernen:tests';

export interface TestScore {
  correct: number;
  total: number;
  percent: number;
  /** ISO date-time of the attempt. */
  date: string;
}

export interface TestMistake {
  wordId: string;
  /** "das Frühstück – breakfast" */
  word: string;
  question: string;
  answer: string;
  expected: string;
}

export interface TestHistory {
  attempts: number;
  latest: TestScore;
  best: TestScore;
  /** Mistakes of the latest attempt. */
  mistakes: TestMistake[];
}

type AllHistory = Record<string, TestHistory>;

function readAll(): AllHistory {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** Test history of one unit (latest, best, attempts, mistakes), kept in localStorage per unit. */
export function useTestHistory(unit: number) {
  const key = String(unit);
  const [history, setHistory] = useState<TestHistory | null>(() => readAll()[key] ?? null);

  /** Adds a submitted attempt; earlier results are kept. */
  const record = useCallback(
    (result: TestResult) => {
      const score: TestScore = {
        correct: result.correct,
        total: result.total,
        percent: result.percent,
        date: new Date().toISOString(),
      };
      const all = readAll();
      const previous = all[key];
      const best =
        !previous ||
        score.percent > previous.best.percent ||
        (score.percent === previous.best.percent && score.correct > previous.best.correct)
          ? score
          : previous.best;
      const next: TestHistory = {
        attempts: (previous?.attempts ?? 0) + 1,
        latest: score,
        best,
        mistakes: result.graded
          .filter((g) => !g.correct)
          .map(({ question, answer }) => ({
            wordId: question.word.id,
            word: question.word.say
              ? `${question.word.english} – ${question.word.german}`
              : `${germanTerm(question.word)} – ${question.word.english}`,
            question: question.phrase ? `${question.prompt} ${question.phrase}` : question.prompt,
            answer,
            expected: question.answer,
          })),
      };
      all[key] = next;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      } catch {
        // Storage full or blocked: the result still shows, it just isn't kept.
      }
      setHistory(next);
    },
    [key],
  );

  return { history, record };
}
