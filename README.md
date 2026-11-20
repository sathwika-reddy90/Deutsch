# Deutsch Lernen 🇩🇪

German vocabulary flashcards, organised in units — one page with a unit selector
(**Unit 1 · Unit 2 · Unit 3 · Unit 4 · Unit 5 · Unit 6 · Alphabets**). Unit 1 has 61 words and phrases, Unit 2
has 68, Unit 3 has 28, Unit 4 ("Guten Appetit!") has 43, Unit 5 ("Alltag und Familie") has 42,
Unit 6 ("Zeit mit Freunden") has 49, and Alphabets has the letters A–Z.
Each card shows the English meaning
and an illustration and flips in 3D to reveal the German word with its article
(der/die/das), a pronunciation guide, and two audio buttons that speak the full German
term with a German (de-DE) browser voice: 🔊 Listen (normal) and 🐢 Slow Listen.
Under them, **Example Sentences** shows two short A1 sentences using the word, each with
its English translation and its own 🔊 (normal) and 🐢 (slow) button that reads the whole
sentence aloud with the same German voice (rates in `SENTENCE_RATES`, `src/hooks/useGermanSpeech.ts`).
Hover (or tap, on phones) any word of a sentence to see its English in a small tooltip.

## Units

All vocabulary is in [`src/data/vocabulary.ts`](src/data/vocabulary.ts):

```ts
const UNIT_DEFINITIONS = [
  { number: 1, title: 'German Vocabulary', words: UNIT_1_WORDS }, // the 61 words and phrases
  { number: 2, title: 'German Vocabulary', words: UNIT_2_WORDS }, // the 68 words
  { number: 3, title: 'German Vocabulary', words: UNIT_3_WORDS }, // the 28 words
  { number: 4, title: 'Guten Appetit!', words: UNIT_4_WORDS }, // the 43 words
  { number: 5, title: 'Alltag und Familie', words: UNIT_5_WORDS }, // the 42 words
  { number: 6, title: 'Zeit mit Freunden', words: UNIT_6_WORDS }, // the 49 words
  { number: 0, name: 'Alphabets', tag: 'A–Z', noun: 'letter', title: 'German Alphabet', words: ALPHABET_WORDS },
];
```

To add Unit 7: create `UNIT_7_WORDS` (same entry format as Unit 6) and add
`{ number: 7, title: '…', words: UNIT_7_WORDS }`. A unit with an empty
`words` array shows "Coming Soon". Nothing else needs changing — the selector, word counts,
categories, search, Speaking Practice and progress all follow the selected unit
(`DEFAULT_UNIT` = 3 is selected when the site opens).

- Word ids are unit-scoped (`u3-der-platz`), so progress is tracked **per unit**
  (Unit 3: x / 28, an empty unit: 0 / 0). German that occurs twice in a unit gets its English
  added (`u2-sie-she`, `u2-sie-they`). Progress saved before units existed is migrated
  to Unit 3 automatically.
- Switching units starts that unit's view fresh and stops any Speaking Practice.
- Empty units hide search and category filters, and Speaking Practice shows
  "No vocabulary available for this unit." Category chips show only the categories a unit uses,
  and are hidden when there is just one (Alphabets).

## Alphabets

`LETTER_NAMES` in `vocabulary.ts` lists each letter, its name as it sounds to an English speaker
(shown on the back: A → "Ah", V → "Fow", W → "Veh") and the German spelling of the name that is
spoken (`say`: "Fau", "Weh", "Jott", "Ix", "Ypsilon", "Zett"). German voices read a bare capital
"A" as "Großbuchstabe A" and "Veh" as "Feh", so audio never uses either. The front shows the
letter, with "Aa" in the picture panel. Speaking Practice skips the English audio for letters
(it would be the English letter name): letter shown → 3-second pause → flip → German ×5.
Alphabets uses unit number 0, so Unit 7, 8 … stay free.

## Theme

A dark, low-visibility study theme: dark cards (`#18181B`) on a near-black page (`#0D0D0F`),
moderate text contrast, muted copper accents and slightly dimmed illustrations — comfortable
head-on, unobtrusive from across a room. All colours are tokens at the top of
[`src/index.css`](src/index.css) (`--bg`, `--surface`, `--text-strong`, `--accent`, …).

## Card interaction

- **Mouse:** click → German; moving the mouse off the card flips it back to English
  (after 200 ms, `FLIP_BACK_DELAY_MS` in `Flashcard.tsx`). Moving inside the card never flips it.
- **Touch:** tap → German, tap again → English (no hover behaviour).
- **Keyboard:** `Enter` reveals the German side, `Enter` again plays that card's Listen; `Space`
  toggles. Moving to another card starts again with reveal.

## Speaking Practice

One click on **🔊 Speaking Practice** (next to the Unit 3 heading) practises **the cards
currently shown** — category, search, "only unlearned" and shuffle all apply — in their
shown order, with no further clicks. The list is a snapshot taken at Start ("Word n / N").

For each word: English side → English meaning ×1 → **when the English audio has finished
(`onend`), a 3-second pause** → 3D flip → 400 ms → German term ×5 (de-DE, the same detected
German voice as Listen, rate 0.7, 250 ms after each) → 500 ms → flip back → 500 ms → next
word (the current card moves and scrolls automatically).

Every step waits for the utterance's `onend`; there is only ever one utterance at a time.
At the end: "✓ Unit 3 Speaking Practice Complete · N / N words completed" and a
**🔄 Practice Again** button (starts again at Word 1 with the cards shown then).

While it runs the button becomes **■ Stop Practice** (also under the current card), all
cards ignore manual flips and hover, and the status shows "Word n / N" plus the stage
(Speaking English… / ⏱ 3-second pause… / German pronunciation n / 5 / Moving to next word…).
Words marked learned mid-lesson stay on screen until it ends. Stop, Next/Previous, search,
filters, Shuffle or Reset end the lesson immediately (speech cancelled, timers cleared,
card back to English). Timings live in `PRACTICE` in `src/hooks/useSpeakingPractice.ts`.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
```

## Adding words

All vocabulary lives in [`src/data/vocabulary.ts`](src/data/vocabulary.ts), grouped by unit
(see **Units** above). Append an entry to the unit's word list:

```ts
{ article: 'der', german: 'Tisch', english: 'table', pronunciation: 'tish', category: 'Objects', images: ['Desk'] },
```

- `german` is the word without its article; nouns get `article`. Verbs/adverbs use `note: 'verb'`.
- English alternatives separated by `" / "` (e.g. `'town hall / city hall'`) are shown smaller.
- `images` are [Fluent Emoji](https://github.com/microsoft/fluentui-emoji/tree/main/assets) folder names —
  one, two or four of them (several are shown as a small group, e.g. the four seasons).
  Run `npm run fetch-images` to download missing ones into `public/vocab/`
  (`npm run fetch-images -- --prune` also deletes images no word uses).
  `fork.png` is cropped from "Fork and knife" because there is no fork-only emoji.
- New categories go in `CATEGORIES` (plus an icon in `CategoryFilter.tsx` and a
  `.panel--<name>` colour in `Flashcard.css`).
- Every new word also needs two example sentences in
  [`src/data/examples.ts`](src/data/examples.ts), keyed by the word's id
  (`u<unit>-<slug of the German term>`, e.g. `u3-das-meer`):

  ```ts
  'u3-das-meer': [
    ['Ich sehe das Meer.', 'I see the sea.'],
    ['Das Meer ist blau.', 'The sea is blue.'],
  ],
  ```

  Each word in a sentence gets its English from [`src/data/glossary.ts`](src/data/glossary.ts)
  (add any new word form there). Where a word means something else in that sentence, add
  a third element: `['Ich warte auf den Bus.', 'I am waiting for the bus.', { auf: 'for | warten auf = to wait for' }]`.

  `npm run test:e2e` fails if a word has no sentences, a sentence word has no English, or an entry matches no word.

## Structure

```
src/
  App.tsx                       selected unit + unit selector
  UnitWorkspace.tsx             everything for one unit (cards, filters, practice, progress)
  data/vocabulary.ts            units + word lists (no UI code)
  data/examples.ts              two example sentences per word (German + English), by word id
  data/glossary.ts              English of every word form used in the sentences (hover / tap tooltips)
  hooks/useFlashcardDeck.ts     deck state: category, search, order, flips, learned, current card
  hooks/useGermanSpeech.ts      Web Speech API: voice detection, one utterance at a time
  hooks/useSpeakingPractice.ts  lesson over the shown cards: English ×1 → 3 s → flip → German ×5 → flip back → next
  components/
    Flashcard.tsx               one card: 3D flip container + learned button
    FlashcardFront.tsx          English side
    FlashcardBack.tsx           German side (article + word, pronunciation, Listen, example sentences)
    ExampleSentences.tsx        "Example Sentences": the two sentences with their English and 🔊 / 🐢
    GlossedSentence.tsx         a sentence whose words show their English on hover / focus / tap
    WordTooltip.tsx             the one tooltip for that (rendered on <body>, kept inside the viewport)
    AudioButton.tsx             🔊 Listen / 🐢 Slow Listen, speaking states, unavailable message
    UnitSelector.tsx            [ Unit 1 ] [ Unit 2 ] [ Unit 3 ]
    UnitHeader.tsx              "UNIT 3 · German Vocabulary · 28 words · x / 28 learned"
    SpeakingPractice.tsx        Speaking Practice / Stop Practice + status
    CardImage.tsx               one illustration or a small group
    FlashcardGrid.tsx           responsive grid of cards
    SearchBar.tsx               English/German search (accent-insensitive)
    CategoryFilter.tsx          category chips
    ProgressBar.tsx             accessible progress bar
    NavigationControls.tsx      Previous / Next / Shuffle / Reset dock
    Header.tsx, Toggle.tsx, GermanFlag.tsx, LearnedStamp.tsx
```

Learned words are saved in `localStorage`.

## Pronunciation audio

Both audio buttons use `window.speechSynthesis` with `lang = "de-DE"` and speak the full
German term including its article (e.g. "das Gebäude") — never the pronunciation guide.
Listen uses rate 0.85, Slow Listen rate 0.55 (pitch 1); rates live in `SPEECH_RATES` in
`useGermanSpeech.ts`.

The voice is detected from whatever the browser offers (no voice names are hard-coded):
`de-DE` first, then any `de-*` voice; within each group the system default voice wins,
otherwise the browser's order. Both buttons use that same voice, and it is shown in the
footer. Without a German voice the browser default is used with `de-DE`; without speech
synthesis the card shows "Audio is not available in this browser."

Only one utterance ever plays: any Listen/Slow Listen click cancels whatever is speaking
(also normal ⇄ slow on the same card), and repeated clicks on the playing button are ignored.

## Keyboard

- `Enter` on the current card (focused, or nothing focused): first press reveals the German side, the
  next press clicks that card's Listen button. Holding `Enter` counts as one press; buttons, links and
  text boxes keep their own `Enter`; nothing happens while Speaking Practice runs.
- `Space` flips a focused card either way; `Tab` reaches a card and then its Listen buttons
- `←` / `→` previous / next card

## Unit test (fill in the blanks)

**📝 Test** next to "Show only unlearned" opens the unit's own test in place of the cards
(`src/components/UnitTest.tsx`, questions and answer checking in `src/data/unitTest.ts`).

- Quick (10), Standard (20) or Full (every word once) questions, in random order and format:
  English → German, German → English, "Complete the phrase" (the last word of a phrase is the gap);
  Alphabets: "The German name of J is ___" and a letter played in German, typed as the letter.
- Every answer is typed. German needs the right letters (ä ö ü ß) and the article; spaces, capitals
  and a final . ! ? don't matter – except the polite *Sie / Ihnen / Ihre*. English accepts any of the
  card's alternatives, with or without "the / a / to".
- `Enter` in the answer box goes to the next question; it never submits (on the last question it moves
  to Submit Test), and an empty box or a held key never skips. Unanswered questions are confirmed.
- Results: score, %, pass mark 80 %, every answer with the correct one, words to practise again,
  Review Mistakes, Retake Test, Return to Unit.
- History per unit (latest, best, attempts, last date, last mistakes) is kept in localStorage under
  `deutsch-lernen:tests`.

## Tests

With the dev server running: `BASE_URL=http://localhost:5173 npm run test:e2e`
(uses Playwright with the locally installed Chrome; set `PW_CHANNEL=chromium` to use Playwright's own browser).
Speech is checked against a recording stub (text, `de-DE`, voice choice, cancel-before-speak,
no overlap) and also against the browser's real voice list.

## Credits

Illustrations: [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) © Microsoft, MIT License.
