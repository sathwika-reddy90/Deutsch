/**
 * Fill-in-the-blank unit tests: every answer is typed. One question per word,
 * in one of the formats that fits the word:
 *   - English → German   Translate “Breakfast” into German.          → das Frühstück
 *   - German → English   What does “die Banane” mean in English?     → banana
 *   - Complete a phrase  Complete the phrase: “Ich verstehe ______.” → nicht
 *   - Letter name        The German name of J is ______.             → Yott (or Jott, Jot)
 *   - Letter by ear      🔊 (German name played) Type the letter.    → J
 */
import { germanTerm, spokenText, type VocabWord } from './vocabulary';

export type QuestionKind = 'en-de' | 'de-en' | 'phrase' | 'letter-name' | 'letter-audio';

export interface TestQuestion {
  kind: QuestionKind;
  word: VocabWord;
  /** The question, e.g. 'Translate “Breakfast” into German.' */
  prompt: string;
  /** Phrase with its gap, e.g. 'Ich verstehe ______.' */
  phrase?: string;
  /** English meaning of the phrase, so the gap has one answer. */
  meaning?: string;
  /** What the play buttons say (letter by ear). */
  audio?: string;
  /** Language of the typed answer. */
  answerLanguage: 'de' | 'en';
  /** The correct answer as shown after the test. */
  answer: string;
  /** Every answer that counts as correct. */
  accepted: string[];
}

export const TEST_LENGTHS = [
  { id: 'quick', label: 'Quick Test', count: 10 },
  { id: 'standard', label: 'Standard Test', count: 20 },
  { id: 'full', label: 'Full Test', count: Infinity },
] as const;

export type TestLength = (typeof TEST_LENGTHS)[number]['id'];

export const PASS_MARK = 0.8;

export const KIND_LABELS: Record<QuestionKind, string> = {
  'en-de': 'English → German',
  'de-en': 'German → English',
  phrase: 'Complete the phrase',
  'letter-name': 'Letter name',
  'letter-audio': 'Listen',
};

const GAP = '______';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
/** Quotes a prompt, switching to ‘…’ when it already contains “…”. */
const quote = (text: string) => (text.includes('“') ? `‘${text}’` : `“${text}”`);

// German letter names as dictionaries spell them, accepted besides the card's names.
const DICTIONARY_LETTER_NAMES: Record<string, string> = {
  B: 'Be', C: 'Ce', D: 'De', F: 'Ef', G: 'Ge', H: 'Ha', J: 'Jot', K: 'Ka', L: 'El', M: 'Em', N: 'En',
  P: 'Pe', Q: 'Ku', R: 'Er', S: 'Es', T: 'Te', V: 'Vau', W: 'We', X: 'Ix', Y: 'Ypsilon', Z: 'Zet',
};

/** "Ich verstehe nicht." → "Ich verstehe ______." / "nicht": the last word is the gap. */
function phraseGap(german: string) {
  const words = german.split(' ');
  if (words.length < 2) return null;
  const [, answer, punctuation] = words[words.length - 1].match(/^(.*?)([.!?]*)$/)!;
  if (!/\p{L}/u.test(answer)) return null;
  return { phrase: [...words.slice(0, -1), GAP + punctuation].join(' '), answer };
}

/** "town hall / city hall", "how are you? (formal)", ". (dot)", 'neutral “the”' → every fair English answer. */
function englishAnswers(english: string) {
  const answers = new Set<string>();
  for (const alternative of english.split(' / ')) {
    answers.add(alternative);
    const bare = alternative.replace(/\s*\([^)]*\)/g, '').trim();
    if (bare) answers.add(bare);
    // ". (dot)": the word in brackets is the answer too.
    if (!/\p{L}/u.test(bare)) for (const [, inner] of alternative.matchAll(/\(([^)]*)\)/g)) answers.add(inner);
    // 'neutral “the”': so is the quoted word.
    for (const [, inner] of alternative.matchAll(/“([^”]*)”/g)) answers.add(inner);
  }
  return [...answers];
}

/** The questions a word can be asked as (letters by ear only where speech works). */
function questionsFor(word: VocabWord, unitWords: VocabWord[], speech: boolean): TestQuestion[] {
  if (word.say) {
    const letter = word.english;
    const names = [...new Set([word.german, word.say, DICTIONARY_LETTER_NAMES[letter]].filter(Boolean))];
    const questions: TestQuestion[] = [
      {
        kind: 'letter-name',
        word,
        prompt: `The German name of ${letter} is ${GAP}.`,
        answerLanguage: 'de',
        answer: word.german === word.say ? word.german : `${word.german} / ${word.say}`,
        accepted: names,
      },
    ];
    if (speech)
      questions.push({
        kind: 'letter-audio',
        word,
        prompt: 'Play the German letter name, then type the letter you hear.',
        audio: spokenText(word),
        answerLanguage: 'en',
        answer: letter,
        accepted: [letter],
      });
    return questions;
  }

  const term = germanTerm(word);
  // "sie" is she and they in Unit 2: either English counts.
  const sameGerman = unitWords.filter((w) => !w.say && germanTerm(w) === term);
  const questions: TestQuestion[] = [
    {
      kind: 'en-de',
      word,
      prompt: `Translate ${quote(capitalize(word.english))} into German.`,
      answerLanguage: 'de',
      answer: term,
      accepted: [term],
    },
    {
      kind: 'de-en',
      word,
      prompt: `What does ${quote(term)} mean in English?`,
      answerLanguage: 'en',
      answer: word.english,
      accepted: [...new Set(sameGerman.flatMap((w) => englishAnswers(w.english)))],
    },
  ];
  const gap = !word.article && phraseGap(word.german);
  if (gap)
    questions.push({
      kind: 'phrase',
      word,
      prompt: 'Complete the phrase:',
      phrase: gap.phrase,
      meaning: capitalize(word.english),
      answerLanguage: 'de',
      answer: gap.answer,
      accepted: [gap.answer],
    });
  return questions;
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** A new random test: `count` different words, each asked once in a random format. */
export function buildTest(unitWords: VocabWord[], count: number, speech: boolean): TestQuestion[] {
  return shuffle(unitWords)
    .slice(0, count)
    .map((word) => {
      const options = questionsFor(word, unitWords, speech);
      return options[Math.floor(Math.random() * options.length)];
    });
}

/** Ignores surrounding spaces, quotes, final . ! ? and the kind of apostrophe. */
const normalize = (text: string) => {
  let clean = text
    .normalize('NFC')
    .replace(/[’‘ʼ`´]/g, "'")
    .replace(/[“”„"«»]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (/[\p{L}\p{N}]/u.test(clean)) clean = clean.replace(/\s*[.!?]+$/, '').trim();
  return clean;
};

// Polite "Sie / Ihnen / Ihre …": lower case would change the meaning (sie = she / they).
const FORMAL = /^(Sie|Ihnen|Ihr|Ihre|Ihrem|Ihren|Ihrer|Ihres)$/;

/** Exact German spelling – umlauts, ß and the article included – in any capitalisation except the polite Sie. */
function matchesGerman(answer: string, expected: string) {
  const a = normalize(answer);
  const e = normalize(expected);
  if (a.toLowerCase() !== e.toLowerCase()) return false;
  const typed = a.split(' ');
  return e.split(' ').every((word, i) => !FORMAL.test(word) || typed[i] === word);
}

/** English with or without a leading "the / a / an / to". */
const englishCore = (text: string) => normalize(text).toLowerCase().replace(/^(the|a|an|to) /, '');

export function isCorrect(question: TestQuestion, answer: string) {
  if (!normalize(answer)) return false;
  switch (question.kind) {
    case 'de-en':
      return question.accepted.some((e) => englishCore(e) === englishCore(answer));
    case 'letter-name':
    case 'letter-audio':
      return question.accepted.some((e) => normalize(e).toLowerCase() === normalize(answer).toLowerCase());
    default:
      return question.accepted.some((e) => matchesGerman(answer, e));
  }
}

export interface GradedAnswer {
  question: TestQuestion;
  answer: string;
  correct: boolean;
}

export function gradeTest(questions: TestQuestion[], answers: string[]) {
  const graded: GradedAnswer[] = questions.map((question, i) => ({
    question,
    answer: answers[i]?.trim() ?? '',
    correct: isCorrect(question, answers[i] ?? ''),
  }));
  const correct = graded.filter((g) => g.correct).length;
  const total = questions.length;
  return {
    graded,
    correct,
    total,
    percent: total ? Math.round((correct / total) * 100) : 0,
    passed: total > 0 && correct / total >= PASS_MARK,
  };
}

export type TestResult = ReturnType<typeof gradeTest>;
