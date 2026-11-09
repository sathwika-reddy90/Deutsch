import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CategoryFilter } from './components/CategoryFilter';
import { FlashcardGrid } from './components/FlashcardGrid';
import { Header } from './components/Header';
import { NavigationControls } from './components/NavigationControls';
import { SearchBar } from './components/SearchBar';
import { SpeakingPractice } from './components/SpeakingPractice';
import { Toggle } from './components/Toggle';
import { UnitHeader } from './components/UnitHeader';
import { UnitTest } from './components/UnitTest';
import { CATEGORIES, germanTerm, type Unit, type VocabWord } from './data/vocabulary';
import { useFlashcardDeck, type CategoryFilterValue } from './hooks/useFlashcardDeck';
import { useGermanSpeech, type SpeechMode } from './hooks/useGermanSpeech';
import { useSpeakingPractice } from './hooks/useSpeakingPractice';
import { useTestHistory } from './hooks/useTestHistory';
import './App.css';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scrolls a card into view (clear of the floating dock) if it isn't fully visible. */
function scrollCardIntoView(id: string) {
  const slot = document.querySelector<HTMLElement>(`[data-word-id="${id}"]`);
  if (!slot) return null;
  const rect = slot.getBoundingClientRect();
  const dockSpace = 110;
  if (rect.top < 0 || rect.bottom > window.innerHeight - dockSpace) {
    slot.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' });
  }
  return slot;
}

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/** Buttons, links and fields keep their own Enter (a focused card handles Enter itself). */
const isControl = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest('button, a[href], input, select, textarea, summary, [contenteditable="true"]');

interface UnitWorkspaceProps {
  unit: Unit;
  /** The selected unit's words – everything below works only on these. */
  words: VocabWord[];
  /** The unit selector, shown in the header. */
  unitNav: ReactNode;
  /** Unit offered from an empty unit (the default unit if it has vocabulary). */
  suggestedUnit?: Unit;
  onSelectUnit: (unit: number) => void;
}

/**
 * The study experience for one unit: cards, search, categories, progress,
 * Listen, Speaking Practice and the unit's test. It is re-created when the unit changes, so no
 * state (or running speech) carries over between units.
 */
export function UnitWorkspace({ unit, words, unitNav, suggestedUnit, onSelectUnit }: UnitWorkspaceProps) {
  const deck = useFlashcardDeck(words);
  // Only the categories this unit uses; a unit with just one (Alphabets) needs no filter.
  const filters = useMemo<CategoryFilterValue[]>(
    () => ['All', ...CATEGORIES.filter((c) => words.some((w) => w.category === c))],
    [words],
  );
  const speech = useGermanSpeech();
  const practice = useSpeakingPractice({ say: speech.say, cancel: speech.cancel, setFlip: deck.setFlip });
  const [announcement, setAnnouncement] = useState('');
  const scrollPending = useRef(false);
  // The unit's fill-in-the-blank test is shown in place of the cards.
  const [mode, setMode] = useState<'cards' | 'test'>('cards');
  const tests = useTestHistory(unit.number);
  const testButtonRef = useRef<HTMLButtonElement>(null);

  // After Previous / Next, bring the newly active card into view (and keep
  // keyboard focus on the cards if that's where it was).
  useEffect(() => {
    if (!scrollPending.current || !deck.activeId) return;
    scrollPending.current = false;
    const slot = scrollCardIntoView(deck.activeId);
    if (slot && document.activeElement?.closest('.card')) {
      slot.querySelector<HTMLElement>('.card__face:not([inert]) .card__flip')?.focus({ preventScroll: true });
    }
  }, [deck.activeId]);

  // ---- Speaking Practice -------------------------------------------------
  // One click runs the whole unit: the lesson moves the current card itself
  // (Word 1 → 28) and every card ignores manual flips / hover while it runs.
  const { stop: stopPractice, isRunning: lessonRunning } = practice;
  const lessonWordId = practice.state?.status === 'running' ? practice.state.id : undefined;
  const activateRef = useRef(deck.activate);
  useEffect(() => {
    activateRef.current = deck.activate;
  });
  useEffect(() => {
    if (!lessonWordId) return;
    activateRef.current(lessonWordId);
    scrollCardIntoView(lessonWordId);
  }, [lessonWordId]);

  // The lesson practises exactly the cards currently shown (category, search,
  // "only unlearned" and shuffle all apply), as a snapshot taken at Start.
  const startPractice = () => {
    if (!deck.deck.length) return;
    deck.unflipAll();
    void practice.start(deck.deck);
  };
  // Keep the snapshot's cards on screen while the lesson runs, even if one is
  // marked learned with "only unlearned" on.
  const { setPinned } = deck;
  const lessonWords = practice.words;
  useEffect(() => {
    setPinned(lessonRunning ? new Set(lessonWords.map((w) => w.id)) : null);
  }, [lessonRunning, lessonWords, setPinned]);

  const { activate, toggleFlip, setFlip } = deck;
  const handleActivate = useCallback(
    (id: string) => {
      if (lessonRunning) return; // the lesson decides which card is current
      activate(id);
    },
    [lessonRunning, activate],
  );
  const handleFlip = useCallback(
    (id: string) => {
      if (lessonRunning) return;
      toggleFlip(id);
    },
    [lessonRunning, toggleFlip],
  );
  const handleUnflip = useCallback(
    (id: string) => {
      if (lessonRunning) return; // mouseleave must not interrupt the lesson
      setFlip(id, false);
    },
    [lessonRunning, setFlip],
  );
  const { speak } = speech;
  const handleSpeak = useCallback(
    (id: string, text: string, mode: SpeechMode, rate?: number) => {
      if (lessonRunning) return; // never overlap the lesson's speech
      speak(id, text, mode, rate);
    },
    [lessonRunning, speak],
  );
  /** Runs a deck-changing action (filter, search, shuffle…) after ending any practice. */
  const withPracticeStopped =
    <A extends unknown[]>(action: (...args: A) => void) =>
    (...args: A) => {
      stopPractice();
      action(...args);
    };

  const { next, previous, activeIndex } = deck;
  const deckSize = deck.deck.length;
  const goNext = useCallback(() => {
    if (activeIndex >= deckSize - 1) return;
    stopPractice();
    scrollPending.current = true;
    next();
  }, [next, activeIndex, deckSize, stopPractice]);
  const goPrevious = useCallback(() => {
    if (activeIndex <= 0) return;
    stopPractice();
    scrollPending.current = true;
    previous();
  }, [previous, activeIndex, stopPractice]);

  // Enter with no button focused works on the current card: the first press
  // reveals the German side, the next one presses that card's Listen button.
  const { activeId, flipped } = deck;
  const enterOnActiveCard = useCallback(() => {
    if (lessonRunning || !activeId) return;
    const slot = scrollCardIntoView(activeId);
    if (!slot) return;
    if (flipped.has(activeId)) {
      slot.querySelector<HTMLButtonElement>('.card__face--back .audio-button--normal')?.click();
    } else {
      const flipButton = slot.querySelector<HTMLButtonElement>('.card__face--front .card__flip');
      flipButton?.focus({ preventScroll: true }); // as if the card was clicked: focus follows to the German side
      flipButton?.click();
    }
  }, [lessonRunning, activeId, flipped]);

  useEffect(() => {
    if (mode !== 'cards') return; // the test has its own keys
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) return;
      if (event.key === 'ArrowRight') goNext();
      else if (event.key === 'ArrowLeft') goPrevious();
      else if (event.key === 'Enter' && !isControl(event.target)) {
        event.preventDefault();
        if (!event.repeat) enterOnActiveCard(); // one press, one action
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrevious, mode, enterOnActiveCard]);

  const openTest = () => {
    stopPractice();
    speech.cancel();
    setMode('test');
  };
  const closeTest = () => {
    speech.cancel();
    setMode('cards');
    requestAnimationFrame(() => testButtonRef.current?.focus());
  };

  const { markLearned, unmarkLearned } = deck;
  const handleMarkLearned = useCallback(
    (id: string) => {
      const word = words.find((w) => w.id === id);
      markLearned(id);
      if (word) setAnnouncement(`${germanTerm(word)} (${word.english}) marked as learned.`);
    },
    [markLearned, words],
  );
  const handleUnmarkLearned = useCallback(
    (id: string) => {
      const word = words.find((w) => w.id === id);
      unmarkLearned(id);
      if (word) setAnnouncement(`${germanTerm(word)} marked as not learned.`);
    },
    [unmarkLearned, words],
  );


  const handleShuffle = () => {
    stopPractice();
    deck.shuffle();
    setAnnouncement('Cards shuffled.');
  };

  const handleReset = () => {
    if (
      deck.learned.size > 0 &&
      !window.confirm(`Reset the card order and clear all learned ${unit.noun}s in ${unit.name}?`)
    )
      return;
    stopPractice();
    deck.reset();
    setAnnouncement('Cards reset. Learning progress cleared.');
  };

  const categoryLabel =
    deck.category === 'All' ? `All ${unit.noun.charAt(0).toUpperCase()}${unit.noun.slice(1)}s` : deck.category;
  const noSearchResults = deck.query.trim() !== '' && deck.matchingWords.length === 0;
  const allLearned = !noSearchResults && deck.onlyUnlearned && deck.deck.length === 0 && deck.categoryWords.length > 0;
  const wordCount = deck.deck.length;
  const isEmptyUnit = words.length === 0;

  const voiceNote = !speech.supported
    ? 'Audio is not available in this browser.'
    : speech.voice
      ? `Pronunciation voice: ${speech.voice.name} (${speech.voice.lang})`
      : 'No German voice found – your browser will use its default voice with German (de-DE) pronunciation.';

  return (
    <div className="app">
      <a className="skip-link" href="#cards">
        Skip to flashcards
      </a>

      <Header
        position={wordCount ? deck.activeIndex + 1 : 0}
        deckSize={wordCount}
        learned={deck.learnedTotal}
        total={words.length}
        unitNav={unitNav}
        noun={unit.noun}
      />

      <main className="main">
        <UnitHeader unit={unit} wordCount={words.length} learned={deck.learnedTotal}>
          {mode === 'cards' && (
            <SpeakingPractice
              supported={speech.supported}
              unitName={unit.name}
              noun={unit.noun}
              readsFront={words.some((w) => !w.silentFront)}
              unitEmpty={isEmptyUnit}
              state={practice.state}
              lessonWords={practice.words}
              shownCount={wordCount}
              onStart={startPractice}
              onStop={stopPractice}
            />
          )}
        </UnitHeader>

        {isEmptyUnit ? (
          <div className="empty-state empty-state--unit" data-testid="unit-empty">
            <p className="empty-state__emoji" aria-hidden="true">
              📭
            </p>
            <h3>Coming Soon</h3>
            <p>No vocabulary available yet for {unit.name}.</p>
            {suggestedUnit && (
              <button type="button" className="pill-button" onClick={() => onSelectUnit(suggestedUnit.number)}>
                Go to {suggestedUnit.name} ({suggestedUnit.wordCount} {suggestedUnit.noun}s)
              </button>
            )}
          </div>
        ) : mode === 'test' ? (
          <UnitTest
            unit={unit}
            words={words}
            speech={speech}
            history={tests.history}
            onRecord={tests.record}
            onExit={closeTest}
          />
        ) : (
          <>
            <div className="toolbar">
              <div className="toolbar__row">
                <SearchBar
                  value={deck.query}
                  onChange={withPracticeStopped(deck.setQuery)}
                  resultCount={deck.matchingWords.length}
                />
                <div className="toolbar__actions">
                  <Toggle
                    label="Show only unlearned"
                    checked={deck.onlyUnlearned}
                    onChange={withPracticeStopped(deck.toggleOnlyUnlearned)}
                  />
                  <button ref={testButtonRef} type="button" className="pill-button test-button" onClick={openTest}>
                    <span aria-hidden="true">📝</span> Test
                    {tests.history && <span className="test-button__best"> · best {tests.history.best.percent}%</span>}
                  </button>
                </div>
              </div>
              {filters.length > 2 && (
                <CategoryFilter
                  categories={filters}
                  selected={deck.category}
                  counts={deck.learnedCountByCategory}
                  onSelect={withPracticeStopped(deck.setCategory)}
                />
              )}
            </div>

            <div className="section-head">
              <h3 className="section-head__title">
                {categoryLabel}
                <span className="section-head__count">
                  {wordCount} {wordCount === 1 ? unit.noun : `${unit.noun}s`}
                  {deck.query.trim() && <> matching “{deck.query.trim()}”</>}
                </span>
              </h3>
            </div>

            <div id="cards" key={deck.dealKey} className="deal">
              {noSearchResults ? (
                <div className="empty-state">
                  <p className="empty-state__emoji" aria-hidden="true">
                    🔍
                  </p>
                  <h3>Nichts gefunden</h3>
                  <p>
                    No words match “{deck.query.trim()}”
                    {deck.category !== 'All' && <> in {deck.category}</>}. Try an English or German word.
                  </p>
                  <div className="empty-state__actions">
                    {deck.category !== 'All' && (
                      <button type="button" className="pill-button" onClick={() => deck.setCategory('All')}>
                        Search all words
                      </button>
                    )}
                    <button type="button" className="pill-button pill-button--quiet" onClick={() => deck.setQuery('')}>
                      Clear search
                    </button>
                  </div>
                </div>
              ) : allLearned ? (
                <div className="empty-state">
                  <p className="empty-state__emoji" aria-hidden="true">
                    🎉
                  </p>
                  <h3>Alles gelernt!</h3>
                  <p>You've learned every word in {deck.category === 'All' ? 'the deck' : `“${deck.category}”`}.</p>
                  <button type="button" className="pill-button" onClick={deck.toggleOnlyUnlearned}>
                    Show all cards again
                  </button>
                </div>
              ) : (
                <FlashcardGrid
                  words={deck.deck}
                  activeId={deck.activeId}
                  flipped={deck.flipped}
                  learned={deck.learned}
                  speechSupported={speech.supported}
                  speaking={speech.speaking}
                  practice={practice.state}
                  locked={lessonRunning}
                  onFlip={handleFlip}
                  onUnflip={handleUnflip}
                  onStopPractice={stopPractice}
                  onActivate={handleActivate}
                  onMarkLearned={handleMarkLearned}
                  onUnmarkLearned={handleUnmarkLearned}
                  onSpeak={handleSpeak}
                />
              )}
            </div>

            <p className="keyboard-tip">
              Tip: press <kbd>Enter</kbd> to reveal the German side and <kbd>Enter</kbd> again to hear it;{' '}
              <kbd>Space</kbd> flips a card back, <kbd>Tab</kbd> reaches a card and <kbd>←</kbd> <kbd>→</kbd> move between
              cards.
            </p>
          </>
        )}
      </main>

      <footer className="footer">
        <p className="footer__voice" data-testid="voice-note">
          {voiceNote}
        </p>
        <p>
          Illustrations: <a href="https://github.com/microsoft/fluentui-emoji">Fluent Emoji</a> by Microsoft (MIT
          License).
        </p>
      </footer>

      {mode === 'cards' && (
        <NavigationControls
          position={wordCount ? deck.activeIndex + 1 : 0}
          total={wordCount}
          onPrevious={goPrevious}
          onNext={goNext}
          onShuffle={handleShuffle}
          onReset={handleReset}
          resetDisabled={isEmptyUnit}
        />
      )}

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
