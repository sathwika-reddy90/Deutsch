import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  buildTest,
  gradeTest,
  KIND_LABELS,
  PASS_MARK,
  TEST_LENGTHS,
  type TestLength,
  type TestQuestion,
  type TestResult,
} from '../data/unitTest';
import { germanTerm, type Unit, type VocabWord } from '../data/vocabulary';
import type { useGermanSpeech } from '../hooks/useGermanSpeech';
import type { TestHistory } from '../hooks/useTestHistory';
import { AudioButton } from './AudioButton';
import { ProgressBar } from './ProgressBar';
import './UnitTest.css';

interface UnitTestProps {
  unit: Unit;
  words: VocabWord[];
  speech: ReturnType<typeof useGermanSpeech>;
  history: TestHistory | null;
  onRecord: (result: TestResult) => void;
  onExit: () => void;
}

/** Speech id of the test's own play buttons. */
const SPEECH_ID = 'unit-test';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const wordLabel = (word: VocabWord) =>
  word.say ? `${word.english} – ${word.german}` : `${germanTerm(word)} – ${word.english}`;

const PLACEHOLDERS: Record<TestQuestion['kind'], string> = {
  'en-de': 'Type the German…',
  'de-en': 'Type the English…',
  phrase: 'Type the missing word…',
  'letter-name': 'Type the letter name…',
  'letter-audio': 'Type the letter…',
};

/** Holding Enter must never skip questions or submit: only the first key press counts. */
const ignoreRepeatedEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && event.repeat) event.preventDefault();
};

/**
 * Fill-in-the-blank test for one unit: choose a length, type every answer,
 * move back and forth, submit, then see the score and every answer.
 */
export function UnitTest({ unit, words, speech, history, onRecord, onExit }: UnitTestProps) {
  const [length, setLength] = useState<TestLength>('quick');
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [mistakesOnly, setMistakesOnly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { cancel, speak, speaking, supported } = speech;

  const phase = result ? 'results' : questions.length ? 'running' : 'start';
  const question = questions[index];
  const unanswered = answers.filter((a) => !a.trim()).length;

  useEffect(() => {
    if (phase === 'running') inputRef.current?.focus();
    else headingRef.current?.focus();
  }, [phase, index]);

  // Stop a playing letter when the test closes.
  useEffect(() => () => cancel(), [cancel]);

  const start = (id: TestLength) => {
    const count = TEST_LENGTHS.find((l) => l.id === id)!.count;
    const next = buildTest(words, count, supported);
    cancel();
    setLength(id);
    setQuestions(next);
    setAnswers(next.map(() => ''));
    setIndex(0);
    setResult(null);
    setMistakesOnly(false);
  };

  const goTo = (next: number) => {
    cancel();
    setIndex(next);
  };

  const submit = () => {
    if (
      unanswered > 0 &&
      !window.confirm(`${unanswered} of ${questions.length} questions have no answer. Submit the test anyway?`)
    )
      return;
    cancel();
    const graded = gradeTest(questions, answers);
    setResult(graded);
    onRecord(graded);
  };

  const exitRunning = () => {
    if (answers.some((a) => a.trim()) && !window.confirm('Leave this test? Your answers will not be saved.')) return;
    onExit();
  };

  // Enter in the answer box goes to the next question; it never submits the test.
  const handleAnswerKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (event.repeat || !answers[index].trim()) return; // no skipping by holding Enter or on an empty box
    if (index < questions.length - 1) goTo(index + 1);
    else submitRef.current?.focus(); // last question: submitting stays a separate step
  };

  const questionCount = (count: number) => Math.min(count, words.length);
  const mistakes = result ? result.graded.filter((g) => !g.correct) : [];
  const practise = [...new Map(mistakes.map((g) => [g.question.word.id, g.question.word])).values()];
  const reviewed = result ? (mistakesOnly ? mistakes : result.graded) : [];

  return (
    <section className="test" aria-labelledby="test-title" data-testid="unit-test" data-phase={phase}>
      <div className="test__head">
        <div>
          <p className="test__eyebrow">Fill in the blanks</p>
          <h3 id="test-title" className="test__title" ref={headingRef} tabIndex={-1}>
            {unit.name} Test
          </h3>
        </div>
        {phase !== 'running' && (
          <button type="button" className="pill-button pill-button--quiet" onClick={onExit}>
            ← Back to cards
          </button>
        )}
      </div>

      {phase === 'start' && (
        <>
          <p className="test__intro">
            Type every answer yourself. Nothing is marked until you submit, and you can go back and change any answer
            before then.
          </p>
          <div className="test__lengths" role="group" aria-label="Choose a test">
            {TEST_LENGTHS.map((option) => (
              <button key={option.id} type="button" className="test-length" onClick={() => start(option.id)}>
                <span className="test-length__name">{option.label}</span>
                <span className="test-length__count">{questionCount(option.count)} questions</span>
              </button>
            ))}
          </div>
          {history ? (
            <div className="test-history" data-testid="test-history">
              <h4 className="test-history__title">Your results in {unit.name}</h4>
              <dl className="test-stats">
                <div>
                  <dt>Latest</dt>
                  <dd>
                    {history.latest.percent}%{' '}
                    <span>
                      ({history.latest.correct}/{history.latest.total})
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Best</dt>
                  <dd>
                    {history.best.percent}%{' '}
                    <span>
                      ({history.best.correct}/{history.best.total})
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Attempts</dt>
                  <dd>{history.attempts}</dd>
                </div>
                <div>
                  <dt>Last attempt</dt>
                  <dd>{formatDate(history.latest.date)}</dd>
                </div>
              </dl>
              {history.mistakes.length > 0 && (
                <>
                  <h5 className="test-history__subtitle">Mistakes last time</h5>
                  <ul className="test-chips">
                    {history.mistakes.map((m, i) => (
                      <li key={`${m.wordId}-${i}`}>{m.word}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : (
            <p className="test-history__none">No attempts yet – your scores will be saved here.</p>
          )}
        </>
      )}

      {phase === 'running' && question && (
        <>
          <ProgressBar
            label="Test progress"
            value={index + 1}
            max={questions.length}
            caption={
              <span>
                Question <strong>{index + 1}</strong> of <strong>{questions.length}</strong> ·{' '}
                {questions.length - unanswered} answered
              </span>
            }
          />
          <div className="test-question" data-kind={question.kind} data-word-id={question.word.id}>
            <p className="test-question__kind">{KIND_LABELS[question.kind]}</p>
            <p className="test-question__prompt" id="test-prompt">
              {question.prompt}
            </p>
            {question.phrase && (
              <p className="test-question__phrase" lang="de" id="test-phrase">
                “{question.phrase}”
              </p>
            )}
            {question.meaning && <p className="test-question__meaning">({question.meaning})</p>}
            {question.audio && (
              <div className="test-question__audio">
                {(['normal', 'slow'] as const).map((mode) => (
                  <AudioButton
                    key={mode}
                    text="this letter"
                    mode={mode}
                    isSpeaking={speaking?.id === SPEECH_ID && speaking.mode === mode}
                    onSpeak={() => speak(SPEECH_ID, question.audio!, mode)}
                  />
                ))}
              </div>
            )}
            <input
              ref={inputRef}
              className="test-question__input"
              type="text"
              value={answers[index]}
              onChange={(event) => {
                const value = event.target.value;
                setAnswers((current) => current.map((a, i) => (i === index ? value : a)));
              }}
              onKeyDown={handleAnswerKeyDown}
              aria-labelledby={question.phrase ? 'test-prompt test-phrase' : 'test-prompt'}
              placeholder={PLACEHOLDERS[question.kind]}
              lang={question.answerLanguage}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint={index < questions.length - 1 ? 'next' : 'done'}
            />
            <p className="test-question__help">
              <kbd>Enter</kbd> goes to the next question. Submit the test when you are ready.
            </p>
          </div>
          <div className="test__nav" onKeyDown={ignoreRepeatedEnter}>
            <button
              type="button"
              className="pill-button pill-button--quiet"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
            >
              ← Previous
            </button>
            <button
              type="button"
              className="pill-button pill-button--quiet"
              onClick={() => goTo(index + 1)}
              disabled={index === questions.length - 1}
            >
              Next →
            </button>
            <button ref={submitRef} type="button" className="pill-button test__submit" onClick={submit}>
              Submit Test
            </button>
          </div>
          <button type="button" className="text-button test__exit" onClick={exitRunning}>
            Exit test without saving
          </button>
        </>
      )}

      {phase === 'results' && result && (
        <div className="test-results" data-testid="test-results">
          <p className={`test-results__verdict ${result.passed ? 'is-pass' : 'is-fail'}`}>
            {result.passed ? '✓ Passed' : 'Not passed yet'} – {result.percent}%{' '}
            <span>(pass mark {PASS_MARK * 100}%)</span>
          </p>
          <dl className="test-stats">
            <div>
              <dt>Questions</dt>
              <dd data-stat="total">{result.total}</dd>
            </div>
            <div>
              <dt>Correct</dt>
              <dd data-stat="correct">{result.correct}</dd>
            </div>
            <div>
              <dt>Incorrect</dt>
              <dd data-stat="incorrect">{result.total - result.correct}</dd>
            </div>
            <div>
              <dt>Score</dt>
              <dd data-stat="score">
                {result.correct} / {result.total} · {result.percent}%
              </dd>
            </div>
          </dl>

          <div className="test-results__practise">
            <h4 className="test-history__subtitle">Words to practise again</h4>
            {practise.length ? (
              <ul className="test-chips" data-testid="practise-again">
                {practise.map((word) => (
                  <li key={word.id}>{wordLabel(word)}</li>
                ))}
              </ul>
            ) : (
              <p className="test-history__none">None – every answer was right. 🎉</p>
            )}
          </div>

          <div className="test-results__actions">
            <button
              type="button"
              className="pill-button pill-button--quiet"
              onClick={() => setMistakesOnly((v) => !v)}
              disabled={mistakes.length === 0}
              aria-pressed={mistakesOnly}
            >
              {mistakesOnly ? 'Show All Answers' : 'Review Mistakes'}
            </button>
            <button type="button" className="pill-button" onClick={() => start(length)}>
              Retake Test
            </button>
            <button type="button" className="pill-button pill-button--quiet" onClick={onExit}>
              Return to Unit
            </button>
          </div>

          <ol className="test-review">
            {reviewed.map((g) => {
              const number = result.graded.indexOf(g) + 1;
              return (
                <li
                  key={number}
                  value={number}
                  className={`test-review__item ${g.correct ? 'is-correct' : 'is-wrong'}`}
                  data-correct={g.correct}
                >
                  <p className="test-review__question">
                    <span className="test-review__mark" aria-label={g.correct ? 'Correct' : 'Incorrect'}>
                      {g.correct ? '✓' : '✗'}
                    </span>
                    <span>
                      {g.question.prompt}
                      {g.question.phrase && <> “{g.question.phrase}”</>}
                      {g.question.meaning && <> ({g.question.meaning})</>}
                    </span>
                  </p>
                  <p className="test-review__line">
                    <span>Your answer</span>
                    <strong className="test-review__answer">{g.answer || '(no answer)'}</strong>
                  </p>
                  <p className="test-review__line">
                    <span>Correct answer</span>
                    <strong className="test-review__expected">{g.question.answer}</strong>
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}
