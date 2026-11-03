import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { germanTerm, type Category, type VocabWord } from '../data/vocabulary';

export type CategoryFilterValue = Category | 'All';

const STORAGE_KEY = 'deutsch-lernen:learned';
/** How long a just-learned card stays visible when "only unlearned" is on. */
const LINGER_MS = 1100;

/*
 * Learned words of all units are stored in one list of word ids. Each unit
 * reads and writes only its own ids, so progress is tracked per unit.
 * Ids saved before units existed ("der-platz") map to "u3-der-platz".
 */
const UNIT_PREFIX = /^u\d+-/;
const bareId = (id: string) => id.replace(UNIT_PREFIX, '');

function readStoredIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function loadLearned(unitIds: Set<string>): Set<string> {
  const byBareId = new Map([...unitIds].map((id) => [bareId(id), id]));
  const learned = new Set<string>();
  for (const id of readStoredIds()) {
    if (unitIds.has(id)) learned.add(id);
    else if (!UNIT_PREFIX.test(id) && byBareId.has(id)) learned.add(byBareId.get(id)!); // legacy id
  }
  return learned;
}

/** Case-, accent- and ß-insensitive form used for searching ("Gebaude" finds "Gebäude"). */
export function normalizeForSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function saveLearned(learned: Set<string>, unitIds: Set<string>) {
  const unitBareIds = new Set([...unitIds].map(bareId));
  // Keep other units' progress; replace this unit's (incl. legacy ids of its words).
  const others = readStoredIds().filter(
    (id) => !unitIds.has(id) && !(!UNIT_PREFIX.test(id) && unitBareIds.has(id)),
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...others, ...learned]));
  } catch {
    // Storage unavailable (private mode etc.) – progress just won't persist.
  }
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function useFlashcardDeck(vocabulary: VocabWord[]) {
  const originalOrder = useMemo(() => vocabulary.map((w) => w.id), [vocabulary]);
  const byId = useMemo(() => new Map(vocabulary.map((w) => [w.id, w])), [vocabulary]);

  const [category, setCategoryState] = useState<CategoryFilterValue>('All');
  const [order, setOrder] = useState<string[]>(originalOrder);
  const [learned, setLearned] = useState<Set<string>>(() => loadLearned(new Set(byId.keys())));
  const [query, setQueryState] = useState('');
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [onlyUnlearned, setOnlyUnlearned] = useState(false);
  const [lingering, setLingering] = useState<Set<string>>(new Set());
  /** Words kept visible regardless of "only unlearned" (a running Speaking Practice snapshot). */
  const [pinned, setPinned] = useState<Set<string> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  /** Changes whenever the deck is re-dealt, so the grid can replay its entrance. */
  const [dealKey, setDealKey] = useState(0);
  const lingerTimers = useRef(new Map<string, number>());

  useEffect(() => saveLearned(learned, new Set(byId.keys())), [learned, byId]);

  useEffect(() => {
    const timers = lingerTimers.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  /** Every word in the selected category, regardless of learned state. */
  const categoryWords = useMemo(
    () =>
      order
        .map((id) => byId.get(id)!)
        .filter((w) => category === 'All' || w.category === category),
    [order, byId, category],
  );

  /** Words matching the search query (English meaning or German term). */
  const matchingWords = useMemo(() => {
    const needle = normalizeForSearch(query);
    if (!needle) return categoryWords;
    return categoryWords.filter(
      (w) =>
        normalizeForSearch(w.english).includes(needle) || normalizeForSearch(germanTerm(w)).includes(needle),
    );
  }, [categoryWords, query]);

  /** The cards actually shown. */
  const deck = useMemo(
    () =>
      onlyUnlearned
        ? matchingWords.filter((w) => !learned.has(w.id) || lingering.has(w.id) || pinned?.has(w.id))
        : matchingWords,
    [matchingWords, onlyUnlearned, learned, lingering, pinned],
  );

  const safeActiveIndex = deck.length ? Math.min(activeIndex, deck.length - 1) : 0;
  const activeId = deck[safeActiveIndex]?.id;
  const learnedTotal = vocabulary.filter((w) => learned.has(w.id)).length;

  const learnedCountByCategory = useMemo(() => {
    const counts = new Map<CategoryFilterValue, { learned: number; total: number }>();
    const bump = (key: CategoryFilterValue, isLearned: boolean) => {
      const c = counts.get(key) ?? { learned: 0, total: 0 };
      c.total++;
      if (isLearned) c.learned++;
      counts.set(key, c);
    };
    for (const w of vocabulary) {
      bump(w.category, learned.has(w.id));
      bump('All', learned.has(w.id));
    }
    return counts;
  }, [vocabulary, learned]);

  const redeal = () => {
    setFlipped(new Set());
    setActiveIndex(0);
    setDealKey((k) => k + 1);
  };

  const setCategory = (next: CategoryFilterValue) => {
    if (next === category) return;
    setCategoryState(next);
    redeal();
  };

  const toggleFlip = useCallback((id: string) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /** Puts a card on a specific side (used by hover-out and Speaking Practice). */
  const setFlip = useCallback((id: string, toGerman: boolean) => {
    setFlipped((prev) => {
      if (prev.has(id) === toGerman) return prev;
      const next = new Set(prev);
      if (toGerman) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const goTo = useCallback(
    (index: number) => setActiveIndex(Math.max(0, Math.min(index, deck.length - 1))),
    [deck.length],
  );

  const next = useCallback(() => goTo(safeActiveIndex + 1), [goTo, safeActiveIndex]);
  const previous = useCallback(() => goTo(safeActiveIndex - 1), [goTo, safeActiveIndex]);

  const activate = useCallback(
    (id: string) => {
      const index = deck.findIndex((w) => w.id === id);
      if (index >= 0) setActiveIndex(index);
    },
    [deck],
  );

  /** Idempotent: marking an already-learned word again never double-counts. */
  const markLearned = useCallback(
    (id: string) => {
      if (learned.has(id)) return;
      setLearned((prev) => new Set(prev).add(id));
      // Keep the card on screen briefly so the confirmation is visible
      // even when unlearned-only filtering would hide it immediately.
      setLingering((prev) => new Set(prev).add(id));
      window.clearTimeout(lingerTimers.current.get(id));
      lingerTimers.current.set(
        id,
        window.setTimeout(() => {
          lingerTimers.current.delete(id);
          setLingering((prev) => {
            const copy = new Set(prev);
            copy.delete(id);
            return copy;
          });
        }, LINGER_MS),
      );
    },
    [learned],
  );

  const unmarkLearned = useCallback((id: string) => {
    setLearned((prev) => {
      const copy = new Set(prev);
      copy.delete(id);
      return copy;
    });
  }, []);

  const shuffle = () => {
    setOrder((prev) => shuffled(prev));
    redeal();
  };

  /** All cards back to the English side. */
  const unflipAll = useCallback(() => setFlipped(new Set()), []);

  /** Restores the original order and clears all learning progress. */
  const reset = () => {
    setOrder(originalOrder);
    setLearned(new Set());
    setLingering(new Set());
    setOnlyUnlearned(false);
    setQueryState('');
    redeal();
  };

  const setQuery = (next: string) => {
    setQueryState(next);
    setActiveIndex(0);
  };

  const toggleOnlyUnlearned = () => {
    setOnlyUnlearned((v) => !v);
    setActiveIndex(0);
  };

  return {
    category,
    setCategory,
    deck,
    categoryWords,
    matchingWords,
    query,
    setQuery,
    activeIndex: safeActiveIndex,
    activeId,
    flipped,
    learned,
    learnedTotal,
    learnedCountByCategory,
    onlyUnlearned,
    dealKey,
    toggleFlip,
    setFlip,
    unflipAll,
    setPinned,
    markLearned,
    unmarkLearned,
    toggleOnlyUnlearned,
    activate,
    next,
    previous,
    shuffle,
    reset,
  };
}
