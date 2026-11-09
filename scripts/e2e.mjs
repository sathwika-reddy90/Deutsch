// End-to-end check of the flashcard app using the locally installed Chrome.
// Usage: start the app (npm run dev) then `npm run test:e2e`.
// Env: BASE_URL (default http://localhost:5173), SHOTS_DIR (optional, saves screenshots),
//      PW_CHANNEL (default "chrome"; use "chromium" for Playwright's bundled browser),
//      ONLY (regex: run only matching independent checks, e.g. ONLY="real browser").
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { UNITS, VOCABULARY, germanTerm, spokenText, wordsInUnit } from '../src/data/vocabulary.ts';
import { EXAMPLES } from '../src/data/examples.ts';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173';
const SHOTS = process.env.SHOTS_DIR;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

// The exact list the deck must contain, in order: [German, English, pronunciation].
const EXPECTED = [
  ['der Platz', 'place', 'platz'],
  ['das Gebäude', 'building', 'geh-BOY-duh'],
  ['benennen', 'to name', 'beh-NEN-en'],
  ['das Verkehrsmittel', 'transport', 'fer-KEHRS-mit-tel'],
  ['die Dinge', 'things', 'DING-uh'],
  ['die Jahreszeiten', 'seasons', 'YAH-res-tsy-ten'],
  ['die Monate', 'months', 'MOH-nah-tuh'],
  ['das Rathaus', 'town hall / city hall', 'RAHT-howss'],
  ['das Schiff', 'ship', 'shif'],
  ['das Meer', 'sea', 'mehr'],
  ['der See', 'lake', 'zay'],
  ['der Fluss', 'river', 'flooss'],
  ['fahren', 'to travel / go by vehicle', 'FAH-ren'],
  ['die Stunden', 'hours', 'SHTOON-den'],
  ['die Breite', 'width', 'BRY-tuh'],
  ['die Höhe', 'height', 'HOH-uh'],
  ['der Turm', 'tower', 'toorm'],
  ['die Kunsthalle', 'art hall', 'KUNST-hal-uh'],
  ['das Glück', 'luck', 'glük'],
  ['links', 'left', 'links'],
  ['rechts', 'right', 'rekhts'],
  ['geradeaus', 'straight', 'geh-RAH-duh-owss'],
  ['die Wegbeschreibung', 'directions / route description', 'VAYK-beh-SHRY-boong'],
  ['die Jahreszeit', 'season', 'YAH-res-tsyte'],
  ['das Messer', 'knife', 'MESS-er'],
  ['die Gabel', 'fork', 'GAH-bel'],
  ['der Löffel', 'spoon', 'LUFF-el'],
  ['die Tassen', 'cups', 'TAHS-en'],
];

// Unit 1, in order: [German, English]. The source list had "Who are you? — Wer bist du?"
// twice; it is one card.
const EXPECTED_UNIT_1 = [
  ['das Butterbrot', 'butter bread'],
  ['der Kranke', 'sick person'],
  ['italienisch', 'Italian'],
  ['das Frühstück', 'breakfast'],
  ['die Autobahn', 'highway'],
  ['das Würstchen', 'sausage'],
  ['der Walzer', 'dance / waltz'],
  ['der Rucksack', 'backpack'],
  ['der Anzug', 'suit / formal'],
  ['Ihre Sprache', 'your language'],
  ['die Wörter', 'words'],
  ['Wer bist du?', 'who are you?'],
  ['hören', 'hear'],
  ['lesen', 'read'],
  ['wie', 'how'],
  ['heißen', 'called / named'],
  ['die Person', 'person'],
  ["Wie geht's?", 'how are you? (informal)'],
  ['auch', 'also'],
  ['berühmt', 'famous'],
  ['Personen', 'persons / people'],
  ['Auf Wiedersehen', 'goodbye / see you later'],
  ['Wie heißen Sie?', 'what is your name? (formal)'],
  ['Wie geht es Ihnen?', 'how are you? (formal)'],
  ['die Kollegin', 'female colleague'],
  ['die Sprache', 'language'],
  ['wohnen', 'live / reside'],
  ['Wo wohnen Sie?', 'where do you live?'],
  ['Wer ist das?', 'who is this?'],
  ['die Zahlen', 'numbers'],
  ['hungrig', 'hungry'],
  ['durstig', 'thirsty'],
  ['müde', 'tired'],
  ['Ich verstehe nicht.', "I don't understand"],
  ['Können Sie helfen?', 'can you help?'],
  ['Bis später.', 'see you later'],
  ['das Alphabet', 'alphabet'],
  ['die Buchstaben', 'letters'],
  ['at', '@'],
  ['der Punkt', '. (dot)'],
  ['Minus', '- (minus)'],
  ['der Unterstrich', '_ (underscore)'],
  ['buchstabieren', 'spelling'],
  ['kann', 'can'],
  ['noch einmal', 'once again'],
  ['Ich verstehe Sie nicht.', "I don't understand you"],
  ['Ein bisschen langsamer.', 'a little slower'],
  ['das Land', 'country'],
  ['die Länder', 'countries'],
  ['die Sprachen', 'languages'],
  ['Deutschland', 'Germany'],
  ['Österreich', 'Austria'],
  ['die Schweiz', 'Switzerland'],
  ['Frankreich', 'France'],
  ['Italien', 'Italy'],
  ['Spanien', 'Spain'],
  ['Polen', 'Poland'],
  ['die Türkei', 'Turkey'],
  ['Russland', 'Russia'],
  ['Brasilien', 'Brazil'],
  ['lang', 'long'],
];

// Unit 2, in order: [German, English]. "die Straße" (road #25, street #56) is one card.
const EXPECTED_UNIT_2 = [
  ['die Arbeit', 'work'],
  ['der Beruf', 'profession / occupation'],
  ['fotografieren', 'take photos / photograph'],
  ['singen', 'sing'],
  ['kochen', 'cook'],
  ['schwimmen', 'swim'],
  ['reisen', 'travel'],
  ['tanzen', 'dance'],
  ['Musik hören', 'listen to music'],
  ['das Kino', 'cinema / movies'],
  ['die Frage', 'question'],
  ['antworten', 'to answer'],
  ['lieben', 'love'],
  ['die Stadt', 'city'],
  ['das Wochenende', 'weekend'],
  ['Montag', 'Monday'],
  ['der Arzt', 'doctor'],
  ['die Klinik', 'clinic'],
  ['der Patient', 'patient'],
  ['die Woche', 'week'],
  ['Menschen', 'people'],
  ['der Taxifahrer', 'taxi driver'],
  ['das Buch', 'the book'],
  ['das Geld', 'the money'],
  ['die Straße', 'street / road'],
  ['der Stift', 'the pen'],
  ['das Medikament', 'the medicine'],
  ['die Rechnung', 'the bill / check'],
  ['der Schlüssel', 'the key'],
  ['die Tablette', 'the tablet / pill'],
  ['22 Jahre alt', '22 years old'],
  ['das Seminar', 'seminar'],
  ['der Kurs', 'course'],
  ['der Student', 'male student'],
  ['die Studentin', 'female student'],
  ['die Fahrt', 'journey / travel'],
  ['warten', 'wait'],
  ['pro Woche', 'per week'],
  ['das Krankenhaus', 'hospital'],
  ['das Zimmer', 'room'],
  ['der Platz', 'place'],
  ['die Nacht', 'night'],
  ['die Vorlesungen', 'classes / lectures'],
  ['die Seminare', 'seminars'],
  ['ich', 'I'],
  ['du', 'you (informal)'],
  ['er', 'he'],
  ['sie', 'she'],
  ['es', 'it'],
  ['wir', 'we'],
  ['ihr', 'you all'],
  ['sie', 'they'],
  ['Sie', 'you (formal)'],
  ['das', 'neutral “the”'],
  ['der Sommer', 'summer'],
  ['der Herbst', 'autumn / fall'],
  ['der Winter', 'winter'],
  ['der Frühling', 'spring'],
  ['der Nachname', 'surname / last name'],
  ['der Vorname', 'first name'],
  ['das Geburtsdatum', 'date of birth'],
  ['der Geburtsort', 'place of birth'],
  ['die Adresse', 'address'],
  ['die Telefonnummer', 'telephone number'],
  ['die Handynummer', 'mobile number'],
  ['die Hausnummer', 'house number'],
  ['die Postleitzahl', 'postcode / postal code'],
  ['der Wohnort', 'residence / place of residence'],
];

// Unit 4 "Guten Appetit!", in order: [German, English].
const EXPECTED_UNIT_4 = [
  ['die Mahlzeit', 'meal'],
  ['der Appetit', 'appetite'],
  ['das Gespräch', 'conversation'],
  ['die Vorlieben', 'preferences'],
  ['das Ei', 'egg'],
  ['der Käse', 'cheese'],
  ['der Orangensaft', 'orange juice'],
  ['die Marmelade', 'jam'],
  ['die Banane', 'banana'],
  ['das Brötchen', 'bun / bread roll'],
  ['das Mittagessen', 'lunch'],
  ['das Frühstück', 'breakfast'],
  ['der Apfelsaft', 'apple juice'],
  ['die Kartoffel', 'potato'],
  ['das Gemüse', 'vegetables'],
  ['das Öl', 'oil'],
  ['der Kuchen', 'cake'],
  ['die Sahne', 'cream'],
  ['die Schokolade', 'chocolate'],
  ['der Keks', 'cookie'],
  ['der Zucker', 'sugar'],
  ['das Abendessen', 'dinner'],
  ['die Suppe', 'soup'],
  ['die Gurke', 'cucumber'],
  ['die Lebensmittel', 'groceries / food items'],
  ['Das ist alles.', "that's all"],
  ['kaufen', 'buy'],
  ['die Getränke', 'drinks'],
  ['alles', 'all / everything'],
  ['mehr', 'more'],
  ['Stimmt.', "that's right / correct"],
  ['das Bild', 'picture'],
  ['der Einkaufswagen', 'shopping cart'],
  ['das Wechselgeld', 'change (money)'],
  ['dran', 'your turn'],
  ['Sonst noch etwas?', 'anything else?'],
  ['der Reis', 'rice'],
  ['die Tüte', 'bag'],
  ['der Kassenzettel', 'receipt'],
  ['Gleichfalls!', 'same to you'],
  ['schmeckt', 'tastes'],
  ['satt', 'full (not hungry)'],
  ['Mahlzeit!', 'meal time (greeting)'],
];

// Alphabets: [letter, name shown on the back, German spelling the voice speaks].
const EXPECTED_LETTERS = [
  ['A', 'Ah', 'Ah'], ['B', 'Beh', 'Beh'], ['C', 'Tseh', 'Zeh'], ['D', 'Deh', 'Deh'], ['E', 'Eh', 'Eh'],
  ['F', 'Eff', 'Eff'], ['G', 'Geh', 'Geh'], ['H', 'Hah', 'Hah'], ['I', 'Ih', 'Ih'], ['J', 'Yott', 'Jott'],
  ['K', 'Kah', 'Kah'], ['L', 'Ell', 'Ell'], ['M', 'Emm', 'Emm'], ['N', 'Enn', 'Enn'], ['O', 'Oh', 'Oh'],
  ['P', 'Peh', 'Peh'], ['Q', 'Kuh', 'Kuh'], ['R', 'Err', 'Err'], ['S', 'Ess', 'Ess'], ['T', 'Teh', 'Teh'],
  ['U', 'Uh', 'Uh'], ['V', 'Fow', 'Fau'], ['W', 'Veh', 'Weh'], ['X', 'Iks', 'Ix'], ['Y', 'Üpsilon', 'Ypsilon'],
  ['Z', 'Tsett', 'Zett'],
];

/** Replaces the Web Speech API with a recorder so speech calls can be asserted. */
const DEFAULT_VOICES = [
  { name: 'Samantha', lang: 'en-US', localService: true, default: true },
  { name: 'Helga', lang: 'de-AT', localService: true, default: false },
  { name: 'Anna', lang: 'de-DE', localService: true, default: false },
  { name: 'Markus', lang: 'de-DE', localService: true, default: false },
  { name: 'Thomas', lang: 'fr-FR', localService: true, default: false },
];

const FAKE_SPEECH = ({ voices, autoFinishMs = 0 }) => {
  const calls = [];
  window.__autoFinishMs = autoFinishMs;
  let current = null;
  const synth = {
    speaking: false,
    pending: false,
    paused: false,
    getVoices: () => voices,
    speak(u) {
      calls.push({
        type: 'speak',
        speakingAtCall: synth.speaking, // true would mean two voices at once
        t: Math.round(performance.now()),
        text: u.text,
        lang: u.lang,
        rate: u.rate,
        pitch: u.pitch,
        voice: u.voice?.name ?? null,
        voiceLang: u.voice?.lang ?? null,
      });
      current = u;
      synth.speaking = true;
      if (window.__autoFinishMs) setTimeout(() => current === u && window.__finishSpeech(), window.__autoFinishMs);
    },
    cancel() {
      calls.push({ type: 'cancel' });
      if (current) {
        const u = current;
        current = null;
        synth.speaking = false;
        u.onerror?.({ error: 'interrupted' });
      }
    },
    resume() {},
    pause() {},
    addEventListener() {},
    removeEventListener() {},
  };
  class FakeUtterance {
    constructor(text) {
      this.text = text;
      this.lang = '';
      this.voice = null;
    }
  }
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  window.SpeechSynthesisUtterance = FakeUtterance;
  window.__speechCalls = calls;
  window.__speechEnds = [];
  window.__finishSpeech = () => {
    if (current) window.__speechEnds.push({ text: current.text, t: Math.round(performance.now()) });
    if (!current) return;
    const u = current;
    current = null;
    synth.speaking = false;
    u.onend?.({});
  };
};

const NO_SPEECH = () => {
  Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true });
  window.SpeechSynthesisUtterance = undefined;
};

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
const errors = [];
let passed = 0;

const ONLY = process.env.ONLY ? new RegExp(process.env.ONLY, 'i') : null;

async function step(name, fn) {
  if (ONLY && !ONLY.test(name)) return;
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}\n    ${err.message.split('\n').slice(0, 30).join('\n    ')}`);
    process.exitCode = 1;
  }
}

const shot = (page, name) => SHOTS && page.screenshot({ path: `${SHOTS}/${name}.png` });

async function openApp({
  viewport = { width: 1440, height: 1000 },
  init,
  initArg,
  mobile = false,
  touch = mobile,
} = {}) {
  const context = await browser.newContext({ viewport, hasTouch: touch, isMobile: mobile });
  if (init === FAKE_SPEECH) await context.addInitScript(init, { voices: DEFAULT_VOICES, ...initArg });
  else if (init) await context.addInitScript(init);
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(`${e.message}`));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE_URL);
  await page.waitForSelector('.card');
  return page;
}

// Helpers bound to a page
const helpers = (page) => {
  const slots = page.locator('.card-slot');
  const slot = (i) => slots.nth(i);
  return {
    slots,
    slot,
    frontFlip: (i) => slot(i).locator('.card__face--front .card__flip'),
    backFlip: (i) => slot(i).locator('.card__face--back .card__flip'),
    listen: (i) => slot(i).locator('.audio-button--normal'),
    slowListen: (i) => slot(i).locator('.audio-button--slow'),
    flipped: async (i) => (await slot(i).locator('.card').getAttribute('class')).includes('is-flipped'),
    dock: page.locator('.dock__position'),
    learnedCaption: page.locator('.progress--green .progress__caption'),
    wordCaption: page.locator('.header .progress').first(),
    rotationOf: (i) =>
      slot(i)
        .locator('.card__inner')
        .evaluate((el) => {
          const m = new DOMMatrix(getComputedStyle(el).transform);
          return Math.abs(Math.round((Math.atan2(-m.m13, m.m11) * 180) / Math.PI));
        }),
    speechCalls: () => page.evaluate(() => window.__speechCalls.slice()),
  };
};

// ============================================================ unit data
console.log('Units – data');
await step('data: Units 1–4 and Alphabets – 61, 68, exactly the 28 Unit 3 words, 43, A–Z', async () => {
  assert.deepEqual(
    UNITS.map((u) => [u.number, u.name, u.wordCount, u.tag, u.title]),
    [
      [1, 'Unit 1', 61, '61', 'German Vocabulary'],
      [2, 'Unit 2', 68, '68', 'German Vocabulary'],
      [3, 'Unit 3', 28, '28', 'German Vocabulary'],
      [4, 'Unit 4', 43, '43', 'Guten Appetit!'],
      [0, 'Alphabets', 26, 'A–Z', 'German Alphabet'],
    ],
  );
  const letters = wordsInUnit(0);
  assert.deepEqual(
    letters.map((w) => [w.english, w.german, w.say]),
    EXPECTED_LETTERS,
    'exactly A–Z, each with its German name',
  );
  assert.deepEqual(letters.map((w) => w.english).join(''), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  assert.ok(letters.every((w) => w.category === 'Letters' && w.silentFront && !w.article && !w.pronunciation));
  assert.ok(letters.every((w) => w.id.startsWith('u0-')), 'letter ids are unit-scoped');
  assert.ok(VOCABULARY.filter((w) => w.unit !== 0).every((w) => w.category !== 'Letters' && !w.say), 'no letter fields on words');
  assert.equal(wordsInUnit(1).length, 61);
  assert.equal(wordsInUnit(2).length, 68);
  assert.equal(wordsInUnit(3).length, 28);
  assert.equal(VOCABULARY.length, 61 + 68 + 28 + 43 + 26, 'no duplicated words');
  assert.equal(new Set(VOCABULARY.map((w) => w.id)).size, 61 + 68 + 28 + 43 + 26, 'unique ids');
  for (const [n, expected] of [
    [1, EXPECTED_UNIT_1],
    [2, EXPECTED_UNIT_2],
    [4, EXPECTED_UNIT_4],
  ]) {
    const words = wordsInUnit(n);
    assert.equal(new Set(words.map((w) => w.english)).size, words.length, `no duplicate English fronts in Unit ${n}`);
    assert.ok(words.every((w) => w.id.startsWith(`u${n}-`)), `Unit ${n} ids are unit-scoped`);
    assert.deepEqual(words.map(germanTerm), expected.map(([g]) => g));
    assert.deepEqual(
      words.map((w) => w.english),
      expected.map(([, e]) => e),
    );
    assert.ok(words.every((w) => w.pronunciation && w.images.length), `every Unit ${n} word has a guide and a picture`);
  }
  assert.equal(new Set(wordsInUnit(1).map(germanTerm)).size, 61, 'no duplicate German terms in Unit 1');
  assert.equal(new Set(wordsInUnit(4).map(germanTerm)).size, 43, 'no duplicate German terms in Unit 4');
  // Example sentences: exactly two (German + English) for every word of Units 1–4, none for letters.
  const vocabWords = VOCABULARY.filter((w) => w.unit !== 0);
  assert.equal(vocabWords.length, 61 + 68 + 28 + 43);
  for (const w of vocabWords) {
    assert.equal(w.sentences?.length, 2, `${w.id} has two example sentences`);
    assert.ok(w.sentences.every((s) => s.german.trim() && s.english.trim()), `${w.id}: German and English for both`);
  }
  assert.ok(letters.every((w) => !w.sentences), 'letters have no example sentences');
  assert.equal(new Set(vocabWords.flatMap((w) => w.sentences.map((s) => s.german))).size, 400, 'no example sentence repeated');
  assert.deepEqual(Object.keys(EXAMPLES).filter((id) => !VOCABULARY.some((w) => w.id === id)), [], 'every example entry belongs to a word');
  // Only the pronouns sie (she) / sie (they) / Sie (you) share German in Unit 2.
  assert.deepEqual(
    wordsInUnit(2).filter((w) => w.id.startsWith('u2-sie')).map((w) => w.id),
    ['u2-sie-she', 'u2-sie-they', 'u2-sie-you-formal'],
  );
  assert.ok(wordsInUnit(1).every((w) => !w.id.includes('--')) && wordsInUnit(1)[0].id === 'u1-das-butterbrot');
  assert.ok(wordsInUnit(3).every((w) => w.id.startsWith('u3-')), 'Unit 3 ids are unit-scoped');
  assert.deepEqual(
    VOCABULARY.filter((w) => ![0, 1, 2, 3, 4].includes(w.unit)).map(germanTerm),
    [],
    'words outside Units 1–4 and Alphabets',
  );
  assert.deepEqual(wordsInUnit(3).map(germanTerm), EXPECTED.map(([g]) => g));
  assert.deepEqual(
    wordsInUnit(3).map((w) => w.english),
    EXPECTED.map(([, e]) => e),
  );
  assert.deepEqual(
    wordsInUnit(3).map((w) => w.pronunciation),
    EXPECTED.map(([, , p]) => p),
  );
});

// =========================================================== main flow
console.log('Vocabulary & cards');
const page = await openApp({ init: FAKE_SPEECH });
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.waitForSelector('.card');
const h = helpers(page);

await step('UI: Unit 3 heading with 28 words and learned progress', async () => {
  const unit = page.locator('section.unit');
  assert.equal(await unit.locator('.unit__label').innerText(), 'UNIT 3');
  assert.equal(await unit.getByRole('heading', { level: 2 }).textContent(), 'German Vocabulary');
  assert.match(await unit.locator('.unit__meta').innerText(), /28 words/);
  assert.match(await unit.locator('.unit__meta').innerText(), /0 \/ 28 learned/);
  // Heading sits above the vocabulary section.
  const unitBox = await unit.boundingBox();
  const gridBox = await page.locator('.card-grid').boundingBox();
  assert.ok(unitBox.y + unitBox.height < gridBox.y);
  const units = await page.$$eval('.card-slot', (slots) => [...new Set(slots.map((s) => s.dataset.unit))]);
  assert.deepEqual(units, ['3'], 'every card is a Unit 3 card');
});

await step('all 28 words appear, exactly as specified', async () => {
  assert.equal(await h.slots.count(), 28);
  const data = await page.$$eval('.card-slot', (slots) =>
    slots.map((s) => ({
      term: s.querySelector('.term').textContent,
      english: [s.querySelector('.card__english'), s.querySelector('.card__alternatives')]
        .filter(Boolean)
        .map((e) => e.textContent)
        .join(' '),
      pron: s.querySelector('.card__pronunciation').textContent.replace('Pronunciation guide: ', ''),
    })),
  );
  data.forEach((d, i) => {
    const [german, english, pron] = EXPECTED[i];
    assert.equal(d.term, german, `card ${i + 1} German`);
    const [primary, ...alts] = english.split(' / ');
    const shown = primary.charAt(0).toUpperCase() + primary.slice(1) + (alts.length ? ` / ${alts.join(' / ')}` : '');
    assert.equal(d.english, shown, `card ${i + 1} English`);
    assert.equal(d.pron, `“${pron}”`, `card ${i + 1} pronunciation`);
  });
  assert.match(await h.wordCaption.innerText(), /Word 1 of 28/);
  assert.match(await h.learnedCaption.innerText(), /0 \/ 28 words learned/);
  assert.equal(await h.dock.textContent(), '1 / 28');
});

await step('every illustration file loads', async () => {
  const broken = await page.evaluate(async () => {
    const srcs = [...new Set([...document.querySelectorAll('.card__image img')].map((img) => img.src))];
    const bad = await Promise.all(
      srcs.map(async (src) => {
        const res = await fetch(src);
        return res.ok && (res.headers.get('content-type') ?? '').includes('image') ? null : src;
      }),
    );
    return bad.filter(Boolean);
  });
  assert.deepEqual(broken, []);
});

await step('English front: image, meaning and hint', async () => {
  const front = h.slot(0).locator('.card__face--front');
  assert.equal(await front.locator('.card__english').textContent(), 'Place');
  assert.match(await front.locator('.card__hint').innerText(), /Click to reveal German/);
  assert.ok(await front.locator('img').first().evaluate((img) => img.complete && img.naturalWidth > 0));
  assert.equal(await h.flipped(0), false);
});

await step('click flips the card in 3D to the German side', async () => {
  await h.frontFlip(0).click();
  await page.waitForTimeout(150);
  const mid = await h.rotationOf(0);
  assert.ok(mid > 5 && mid < 175, `mid-flip angle should be partial, got ${mid}`);
  await page.waitForTimeout(650);
  assert.equal(await h.rotationOf(0), 180);
  const back = h.slot(0).locator('.card__face--back');
  const styles = await back.evaluate((el) => ({
    backface: getComputedStyle(el).backfaceVisibility,
    preserve: getComputedStyle(el.parentElement).transformStyle,
    perspective: getComputedStyle(el.parentElement.parentElement).perspective,
  }));
  assert.deepEqual(styles, { backface: 'hidden', preserve: 'preserve-3d', perspective: '1400px' });
  assert.equal(await back.locator('.term__article').textContent(), 'der');
  assert.equal(await back.locator('.term__word').textContent(), 'Platz');
  assert.match(await back.locator('.card__language').innerText(), /German/i);
  assert.ok(await h.listen(0).isVisible(), 'Listen button visible');
  assert.match(await back.locator('.card__hint').innerText(), /Click to flip back/);
  // The hidden face must not be reachable.
  assert.equal(await h.slot(0).locator('.card__face--front').getAttribute('inert'), '');
  await shot(page, '01-back');
});

await step('click again flips back to English', async () => {
  await h.backFlip(0).click();
  await page.waitForTimeout(700);
  assert.equal(await h.rotationOf(0), 0);
  assert.equal(await h.flipped(0), false);
});

console.log('Mouse: click → German, leave → English');
/** Centre a card in the viewport first: if Playwright had to scroll mid-interaction,
 *  the card would slide out from under the mouse – a real mouseleave. */
const centerCard = async (i) => {
  await h.slot(i).evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(100);
};
const sceneBox = (i) => h.slot(i).locator('.card-scene').boundingBox();
const moveTo = (box, fx, fy) => page.mouse.move(box.x + box.width * fx, box.y + box.height * fy, { steps: 4 });

await step('click flips to German; moving the mouse inside the card never flips it', async () => {
  await page.mouse.move(5, 5);
  await centerCard(0);
  const box = await sceneBox(0);
  await moveTo(box, 0.5, 0.3);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(700);
  assert.equal(await h.flipped(0), true);
  for (const [fx, fy] of [[0.08, 0.08], [0.92, 0.15], [0.5, 0.62], [0.12, 0.97], [0.9, 0.9], [0.5, 0.5], [0.97, 0.5]]) {
    await moveTo(box, fx, fy);
  }
  await h.listen(0).hover();
  await h.slowListen(0).hover();
  await page.waitForTimeout(500);
  assert.equal(await h.flipped(0), true, 'still German after moving around inside');
});

await step('mouse leaving the card flips it back to English after a short delay', async () => {
  const box = await sceneBox(0);
  await page.mouse.move(box.x + box.width + 14, box.y + box.height / 2, { steps: 4 }); // grid gap
  await page.waitForTimeout(60);
  assert.equal(await h.flipped(0), true, 'not instant (short delay)');
  await page.waitForTimeout(450);
  assert.equal(await h.flipped(0), false, 'flipped back to English');
  await page.waitForTimeout(400);
  assert.equal(await h.rotationOf(0), 0, '3D flip completed');
});

await step('leaving and quickly coming back keeps German', async () => {
  const box = await sceneBox(0);
  await moveTo(box, 0.5, 0.3);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(650);
  await page.mouse.move(box.x - 12, box.y + box.height / 2);
  await page.waitForTimeout(60);
  await moveTo(box, 0.4, 0.5);
  await page.waitForTimeout(500);
  assert.equal(await h.flipped(0), true);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(500);
  assert.equal(await h.flipped(0), false);
});

console.log('Pronunciation audio');
await step('Listen speaks the German term with a German de-DE voice', async () => {
  await h.frontFlip(0).click();
  await page.waitForTimeout(650);
  assert.equal(await h.listen(0).getAttribute('title'), 'Listen to German pronunciation');
  assert.equal(await h.listen(0).getAttribute('aria-label'), 'Listen to German pronunciation of der Platz');
  await h.listen(0).click();
  const speaks = (await h.speechCalls()).filter((c) => c.type === 'speak');
  assert.equal(speaks.length, 1);
  assert.equal(speaks[0].text, 'der Platz');
  assert.equal(speaks[0].lang, 'de-DE');
  assert.equal(speaks[0].voice, 'Anna', 'first de-DE voice (de-DE preferred over the earlier de-AT one)');
  assert.match(speaks[0].voiceLang, /^de/);
  assert.equal(speaks[0].rate, 0.85, 'normal rate');
  assert.equal(speaks[0].pitch, 1);
  assert.equal(await h.flipped(0), true, 'Listen must not flip the card');
});

await step('shows "Speaking…" while playing, then "Listen" again', async () => {
  assert.match(await h.listen(0).innerText(), /Speaking…/);
  assert.ok(await h.listen(0).locator('.audio-button__bars').isVisible(), 'animated speaking state');
  await page.evaluate(() => window.__finishSpeech());
  await page.waitForTimeout(50);
  assert.match(await h.listen(0).innerText(), /^Listen$/m);
});

await step('rapid repeated clicks never overlap; previous speech is cancelled', async () => {
  await page.evaluate(() => (window.__speechCalls.length = 0));
  await h.listen(0).click();
  await h.listen(0).click();
  await h.listen(0).click();
  let calls = await h.speechCalls();
  assert.equal(calls.filter((c) => c.type === 'speak').length, 1, 'only one utterance for rapid clicks');
  assert.equal(calls[0].type, 'cancel', 'cancel() runs before speak()');
  // Start another word while the first is speaking.
  await h.frontFlip(1).click();
  await page.waitForTimeout(650);
  await h.listen(1).click();
  await page.waitForTimeout(150);
  calls = await h.speechCalls();
  const tail = calls.slice(-2);
  assert.deepEqual(tail.map((c) => c.type), ['cancel', 'speak']);
  assert.equal(tail[1].text, 'das Gebäude');
  assert.match(await h.listen(0).innerText(), /^Listen$/m, 'first card no longer speaking');
  assert.match(await h.listen(1).innerText(), /Speaking…/);
  await page.evaluate(() => window.__finishSpeech());
  assert.equal(await h.flipped(0), false, 'card 1 flipped back when the mouse moved to card 2');
  await page.mouse.move(5, 5);
  await page.waitForTimeout(700);
  assert.equal(await h.flipped(1), false);
});

await step('Slow Listen: same term, de-DE, same voice, rate 0.55, "Speaking slowly…"', async () => {
  await h.frontFlip(0).click();
  await page.waitForTimeout(650);
  const slow = h.slowListen(0);
  assert.match(await slow.innerText(), /🐢\s*Slow Listen/);
  assert.equal(await slow.getAttribute('title'), 'Listen to slow German pronunciation');
  assert.equal(await slow.getAttribute('aria-label'), 'Listen slowly to German pronunciation of der Platz');
  // Stacked directly below Listen, both under the pronunciation guide.
  const [guide, normalBox, slowBox] = await Promise.all([
    h.slot(0).locator('.card__pronunciation').boundingBox(),
    h.listen(0).boundingBox(),
    slow.boundingBox(),
  ]);
  assert.ok(normalBox.y > guide.y + guide.height - 1 && slowBox.y >= normalBox.y + normalBox.height, 'layout order');
  await page.evaluate(() => (window.__speechCalls.length = 0));
  await slow.click();
  const calls = await h.speechCalls();
  assert.deepEqual(calls.map((c) => c.type), ['cancel', 'speak']);
  assert.deepEqual(
    { text: calls[1].text, lang: calls[1].lang, rate: calls[1].rate, pitch: calls[1].pitch, voice: calls[1].voice },
    { text: 'der Platz', lang: 'de-DE', rate: 0.55, pitch: 1, voice: 'Anna' },
  );
  assert.match(await slow.innerText(), /Speaking slowly…/);
  assert.match(await h.listen(0).innerText(), /^Listen$/m, 'normal button stays idle');
  await page.evaluate(() => window.__finishSpeech());
  await page.waitForTimeout(50);
  assert.match(await slow.innerText(), /Slow Listen/);
});

await step('switching Listen ⇄ Slow Listen cancels the other – never both at once', async () => {
  await page.evaluate(() => (window.__speechCalls.length = 0));
  // normal → slow
  await h.listen(0).click();
  await h.slowListen(0).click();
  await page.waitForTimeout(150);
  let calls = await h.speechCalls();
  assert.deepEqual(calls.map((c) => c.type), ['cancel', 'speak', 'cancel', 'speak']);
  assert.deepEqual(calls.filter((c) => c.type === 'speak').map((c) => c.rate), [0.85, 0.55]);
  assert.match(await h.listen(0).innerText(), /^Listen$/m);
  assert.match(await h.slowListen(0).innerText(), /Speaking slowly…/);
  // slow → normal
  await page.evaluate(() => (window.__speechCalls.length = 0));
  await h.listen(0).click();
  await page.waitForTimeout(150);
  calls = await h.speechCalls();
  assert.deepEqual(calls.map((c) => c.type), ['cancel', 'speak']);
  assert.equal(calls[1].rate, 0.85);
  assert.match(await h.listen(0).innerText(), /Speaking…/);
  assert.match(await h.slowListen(0).innerText(), /Slow Listen/);
  assert.equal(await page.locator('.audio-button.is-speaking').count(), 1, 'only one button is ever speaking');
  // Rapid clicks on the slow button don't stack up either.
  await page.evaluate(() => (window.__speechCalls.length = 0));
  await h.slowListen(0).click();
  await h.slowListen(0).click();
  await page.waitForTimeout(150);
  assert.equal((await h.speechCalls()).filter((c) => c.type === 'speak').length, 1);
  await page.evaluate(() => window.__finishSpeech());
  await h.backFlip(0).click();
  await page.waitForTimeout(700);
});

await step('all 28 cards speak the German term (never the pronunciation guide), both speeds', async () => {
  const spoken = await page.evaluate(() => {
    const result = [];
    for (const slot of document.querySelectorAll('.card-slot')) {
      for (const sel of ['.audio-button--normal', '.audio-button--slow']) {
        window.__speechCalls.length = 0;
        slot.querySelector(sel).click();
        const call = window.__speechCalls.find((c) => c.type === 'speak');
        result.push(call && { text: call.text, rate: call.rate, lang: call.lang, voice: call.voice });
        window.__finishSpeech();
      }
    }
    return result;
  });
  const expected = EXPECTED.flatMap(([german]) => [
    { text: german, rate: 0.85, lang: 'de-DE', voice: 'Anna' },
    { text: german, rate: 0.55, lang: 'de-DE', voice: 'Anna' },
  ]);
  assert.deepEqual(spoken, expected);
});

console.log('Keyboard');
await step('Enter / Space flip; focus follows to the visible side; Tab reaches Listen', async () => {
  await h.frontFlip(2).focus();
  await page.keyboard.press('Enter');
  assert.equal(await h.flipped(2), true);
  assert.ok(await h.backFlip(2).evaluate((el) => el === document.activeElement), 'focus moved to back face');
  await page.keyboard.press('Tab');
  assert.ok(await h.listen(2).evaluate((el) => el === document.activeElement), 'Tab reaches Listen');
  await page.evaluate(() => (window.__speechCalls.length = 0));
  await page.keyboard.press('Enter');
  assert.equal((await h.speechCalls()).find((c) => c.type === 'speak')?.text, 'benennen');
  await page.evaluate(() => window.__finishSpeech());
  await page.keyboard.press('Shift+Tab');
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.keyboard.press('Space');
  assert.equal(await h.flipped(2), false);
  assert.ok(await h.frontFlip(2).evaluate((el) => el === document.activeElement), 'focus back on front');
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => window.scrollY), scrollBefore, 'Space must not scroll the page');
});

console.log('Speaking Practice');
const practiceButton = page.locator('.practice__button');
const practiceStatus = page.getByTestId('practice-status');
/** Status as displayed (its parts are flex items, so normalise whitespace). */
const statusText = async () => (await practiceStatus.innerText()).replace(/\s+/g, ' ').trim();
const speaks = async () => (await h.speechCalls()).filter((c) => c.type === 'speak');
const finishSpeech = () => page.evaluate(() => window.__finishSpeech());
const clearCalls = () => page.evaluate(() => (window.__speechCalls.length = 0));
const goToCard = async (n) => {
  while (Number((await h.dock.textContent()).split(' / ')[0]) > n)
    await page.getByRole('button', { name: 'Previous card' }).click();
  while (Number((await h.dock.textContent()).split(' / ')[0]) < n)
    await page.getByRole('button', { name: 'Next card' }).click();
  await page.mouse.move(5, 5);
  await page.waitForTimeout(400);
};

const englishOf = (n) => EXPECTED[n - 1][1].split(' / ').join(', ');
const germanOf = (n) => EXPECTED[n - 1][0];
const stopButton = () => page.getByRole('button', { name: /Stop Practice/ }).first();

await step('one Speaking Practice control next to the Unit 3 heading', async () => {
  assert.equal(await practiceButton.count(), 1);
  assert.match(await practiceButton.innerText(), /Speaking Practice/);
  assert.ok(await page.locator('section.unit .practice__button').isVisible(), 'inside the Unit 3 header');
  assert.match(await statusText(), /28 words shown/);
});

await step('ONE click starts the lesson for the cards shown (All Words → 28) at Word 1, English once', async () => {
  await goToCard(5);
  assert.match(await page.locator('.chip.is-selected').innerText(), /All Words/);
  assert.equal(await h.slots.count(), 28);
  await clearCalls();
  await practiceButton.click();
  await page.waitForTimeout(150);
  assert.equal(await h.slots.count(), 28);
  assert.equal(await h.dock.textContent(), '1 / 28');
  assert.equal(await page.locator('.card-slot[aria-current="true"] .card__english').textContent(), 'Place');
  const calls = await h.speechCalls();
  assert.equal(calls[0].type, 'cancel', 'speechSynthesis.cancel() before the lesson');
  const s1 = await speaks();
  assert.equal(s1.length, 1);
  assert.deepEqual([s1[0].text, s1[0].lang, s1[0].rate, s1[0].voice], ['place', 'en-US', 1, 'Samantha']);
  assert.equal(await h.flipped(0), false, 'English side while English is spoken');
  assert.match(await statusText(), /Word 1 \/ 28 · Place/);
  assert.match(await statusText(), /Speaking English…/);
  assert.match(await practiceButton.innerText(), /■\s*Stop Practice/);
  assert.ok(await h.slot(0).getByRole('button', { name: /Stop speaking practice/ }).isVisible(), 'card-level stop');
});

await step('Word 1: English onend → exactly 3 s pause → flip → German ×5 (de-DE, 0.7) → flip back', async () => {
  // The English voice keeps "speaking" for 3.5 s: the pause must not start yet.
  await page.waitForTimeout(3500);
  assert.equal((await speaks()).length, 1, 'nothing more until English has ended');
  assert.equal(await h.flipped(0), false, 'no flip while English is still speaking');
  assert.match(await statusText(), /Speaking English…/);
  await finishSpeech(); // English onend → the 3-second pause starts now
  await page.waitForTimeout(150);
  assert.match(await statusText(), /3-second pause…/);
  await page.waitForTimeout(2650); // ≈2.8 s after onend
  assert.equal(await h.flipped(0), false, 'still pausing at ~2.8 s');
  assert.equal((await speaks()).length, 1, 'no German during the pause');
  await page.waitForTimeout(450); // ≈3.25 s after onend
  assert.equal(await h.flipped(0), true, 'flipped to German after the 3 s pause');
  assert.match(await statusText(), /German pronunciation 1 \/ 5/);
  await page.waitForTimeout(400);
  for (let rep = 1; rep <= 5; rep++) {
    const all = await speaks();
    assert.equal(all.length, 1 + rep, `repetition ${rep} started only after the previous ended`);
    const g = all.at(-1);
    assert.deepEqual([g.text, g.lang, g.rate, g.pitch, g.voice], [germanOf(1), 'de-DE', 0.7, 1, 'Anna']);
    assert.match(await statusText(), new RegExp(`Word 1 / 28 .*German pronunciation ${rep} / 5`));
    if (rep === 3) {
      // Hover / clicks must not interfere while the lesson runs.
      const box = await sceneBox(0);
      await moveTo(box, 0.5, 0.5);
      await page.mouse.move(5, 5, { steps: 3 });
      await h.frontFlip(1).click({ force: true });
      await page.waitForTimeout(350);
      assert.equal(await h.flipped(0), true, 'mouseleave ignored');
      assert.equal(await h.flipped(1), false, 'other cards cannot be flipped during the lesson');
      assert.equal(await h.dock.textContent(), '1 / 28');
      assert.ok(await h.listen(0).isDisabled(), 'Listen paused during the lesson');
    }
    await page.waitForTimeout(150);
    assert.equal((await speaks()).length, 1 + rep, 'never two utterances at once');
    await finishSpeech();
    await page.waitForTimeout(rep < 5 ? 330 : 100);
  }
  await page.waitForTimeout(500);
  assert.equal(await h.flipped(0), true, 'pause before flipping back');
  await page.waitForTimeout(300);
  assert.equal(await h.flipped(0), false, 'flipped back to English');
  assert.match(await statusText(), /Moving to next word…/);
});

await step('automatically moves to Word 2 – no Next click – and practises it the same way', async () => {
  await page.waitForTimeout(650);
  assert.equal(await h.dock.textContent(), '2 / 28', 'active card advanced');
  assert.equal(await page.locator('.card-slot[aria-current="true"] .card__english').textContent(), 'Building');
  assert.match(await statusText(), /Word 2 \/ 28 · Building/);
  let all = await speaks();
  assert.deepEqual([all.at(-1).text, all.at(-1).lang], [englishOf(2), 'en-US']);
  assert.equal(all.filter((c) => c.text === englishOf(2)).length, 1, 'English once');
  await finishSpeech();
  await page.waitForTimeout(2700);
  assert.equal(await h.flipped(1), false, '3 s pause after English');
  await page.waitForTimeout(850);
  assert.equal(await h.flipped(1), true);
  for (let rep = 1; rep <= 5; rep++) {
    assert.equal((await speaks()).filter((c) => c.text === germanOf(2)).length, rep);
    await finishSpeech();
    await page.waitForTimeout(330);
  }
  all = await speaks();
  const word2 = all.filter((c) => c.text === germanOf(2));
  assert.equal(word2.length, 5, 'German ×5');
  assert.ok(word2.every((c) => c.lang === 'de-DE' && c.rate === 0.7 && c.voice === 'Anna'));
  await page.waitForTimeout(1250);
  assert.equal(await h.flipped(1), false);
  assert.equal(await h.dock.textContent(), '3 / 28', 'on to Word 3 by itself');
  assert.equal((await speaks()).at(-1).text, englishOf(3));
  assert.ok((await speaks()).every((c) => c.speakingAtCall === false), 'no overlapping speech');
});

await step('Stop genuinely stops: speech cancelled, no more words, card back to English', async () => {
  await finishSpeech();
  await page.waitForTimeout(3600);
  assert.equal(await h.flipped(2), true);
  await stopButton().click();
  assert.equal((await h.speechCalls()).at(-1).type, 'cancel', 'speechSynthesis.cancel()');
  assert.equal(await h.flipped(2), false, 'card returned to English');
  assert.match(await practiceButton.innerText(), /Speaking Practice/);
  await page.waitForTimeout(100);
  assert.match(await statusText(), /28 words shown/);
  const count = (await speaks()).length;
  await page.waitForTimeout(2500);
  assert.equal((await speaks()).length, count, 'no further speech (timers stopped)');
  assert.equal(await h.dock.textContent(), '3 / 28', 'no further automatic progression');
  // Normal card interaction is back.
  await centerCard(2);
  await h.frontFlip(2).click();
  await page.waitForTimeout(650);
  assert.equal(await h.flipped(2), true);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(500);
  assert.equal(await h.flipped(2), false);
});

await step('starting again restarts from Word 1; card-level Stop and Next also stop it', async () => {
  await clearCalls();
  await practiceButton.click();
  assert.equal((await speaks())[0].text, 'place', 'restarts at Word 1, not where it stopped');
  await page.waitForTimeout(150);
  assert.equal(await h.dock.textContent(), '1 / 28');
  await h.slot(0).getByRole('button', { name: /Stop speaking practice/ }).click();
  assert.match(await practiceButton.innerText(), /Speaking Practice/);
  await practiceButton.click();
  await page.getByRole('button', { name: 'Next card' }).click(); // user takes over
  assert.equal((await h.speechCalls()).at(-1).type, 'cancel');
  await page.waitForTimeout(150);
  assert.match(await practiceButton.innerText(), /Speaking Practice/);
  assert.equal(await h.dock.textContent(), '2 / 28');
  const count = (await speaks()).length;
  await page.waitForTimeout(1500);
  assert.equal((await speaks()).length, count);
  await goToCard(1);
});

await step('Listen and Slow Listen still work normally after practice', async () => {
  await clearCalls();
  await centerCard(0);
  await h.frontFlip(0).click();
  await page.waitForTimeout(650);
  await h.listen(0).click();
  await finishSpeech();
  await h.slowListen(0).click();
  await finishSpeech();
  assert.deepEqual(
    (await speaks()).map((c) => [c.text, c.rate]),
    [
      ['der Platz', 0.85],
      ['der Platz', 0.55],
    ],
  );
  await page.mouse.move(5, 5);
  await page.waitForTimeout(500);
});

console.log('Navigation');
await step('Next / Previous move through the deck and highlight the current card', async () => {
  await goToCard(1);
  assert.equal(await h.dock.textContent(), '1 / 28');
  assert.ok(await page.getByRole('button', { name: 'Previous card' }).isDisabled());
  await page.getByRole('button', { name: 'Next card' }).click();
  await page.getByRole('button', { name: 'Next card' }).click();
  assert.equal(await h.dock.textContent(), '3 / 28');
  assert.match(await h.wordCaption.innerText(), /Word 3 of 28/);
  assert.equal(await page.locator('.card-slot[aria-current="true"] .card__english').textContent(), 'To name');
  await page.getByRole('button', { name: 'Previous card' }).click();
  assert.equal(await h.dock.textContent(), '2 / 28');
  await page.locator('body').press('ArrowRight');
  assert.equal(await h.dock.textContent(), '3 / 28');
  await page.locator('body').press('ArrowLeft');
  await page.locator('body').press('ArrowLeft');
  assert.equal(await h.dock.textContent(), '1 / 28');
});

await step('Next scrolls far cards into view', async () => {
  for (let i = 0; i < 14; i++) await page.getByRole('button', { name: 'Next card' }).click();
  await page.waitForTimeout(900);
  const box = await page.locator('.card-slot.is-active').boundingBox();
  assert.ok(box && box.y >= 0 && box.y + box.height <= 1000, `active card visible (y=${box?.y})`);
  for (let i = 0; i < 14; i++) await page.getByRole('button', { name: 'Previous card' }).click();
  await page.waitForTimeout(900);
});

console.log('Progress');
await step('Mark as Learned → "✓ Learned", progress +1, no duplicates', async () => {
  const learn = h.slot(0).getByRole('button', { name: 'Mark der Platz as learned' });
  assert.match(await learn.innerText(), /✓\s*Mark as Learned/);
  await learn.dblclick();
  await page.waitForTimeout(400);
  assert.match(await h.learnedCaption.innerText(), /1 \/ 28 words learned/);
  assert.equal((await h.slot(0).locator('.learned-pill').textContent()).trim(), '✓ Learned');
  assert.ok(await h.slot(0).locator('.card__face--front .learned-stamp').isVisible());
  assert.equal(await page.locator('.chip.is-selected .chip__count').textContent(), '1/28');
  await shot(page, '02-learned');
});

await step('Undo, then more words; progress persists across reload', async () => {
  await page.getByRole('button', { name: 'Undo: mark der Platz as not learned' }).click();
  assert.match(await h.learnedCaption.innerText(), /0 \/ 28 words learned/);
  for (const t of ['der Platz', 'das Gebäude', 'das Schiff']) {
    await page.getByRole('button', { name: `Mark ${t} as learned` }).click();
  }
  assert.match(await h.learnedCaption.innerText(), /3 \/ 28 words learned/);
  assert.match(await page.locator('.unit__meta').innerText(), /3 \/ 28 learned/, 'Unit 3 progress updates');
  await page.reload();
  await page.waitForSelector('.card');
  assert.match(await h.learnedCaption.innerText(), /3 \/ 28 words learned/);
});

console.log('Search & categories');
const search = page.getByRole('searchbox', { name: /Search vocabulary/ });
const fronts = () => page.locator('.card__english').allTextContents();
const terms = () => page.locator('.term').allTextContents();

await step('search by English: "building" → das Gebäude', async () => {
  assert.equal(await search.getAttribute('placeholder'), 'Search vocabulary...');
  await search.fill('building');
  assert.deepEqual(await terms(), ['das Gebäude']);
  assert.equal(await h.dock.textContent(), '1 / 1');
});

await step('search by German: "Gebäude" → building (also "gebaude", "der see")', async () => {
  await search.fill('Gebäude');
  assert.deepEqual(await fronts(), ['Building']);
  await search.fill('gebaude');
  assert.deepEqual(await fronts(), ['Building']);
  await search.fill('der see');
  assert.deepEqual(await terms(), ['der See']);
  await search.fill('city hall');
  assert.deepEqual(await terms(), ['das Rathaus']);
});

await step('arrow keys typed in search do not change cards; Escape clears', async () => {
  await search.fill('jahres');
  assert.deepEqual(await terms(), ['die Jahreszeiten', 'die Jahreszeit']);
  await search.press('ArrowRight');
  assert.equal(await h.dock.textContent(), '1 / 2');
  await search.press('Escape');
  assert.equal(await search.inputValue(), '');
  assert.equal(await h.slots.count(), 28);
});

await step('no results → friendly empty state', async () => {
  await search.fill('xyz');
  assert.ok(await page.getByText('Nichts gefunden').isVisible());
  assert.ok(await page.getByRole('button', { name: 'Next card' }).isDisabled());
  await page.getByRole('button', { name: 'Clear search' }).first().click();
  assert.equal(await h.slots.count(), 28);
});

await step('category filter: each category shows only its words', async () => {
  const expected = { Places: 8, Travel: 3, Directions: 4, Time: 4, Objects: 3, Food: 4, Other: 2 };
  for (const [name, count] of Object.entries(expected)) {
    await page.locator('.chip', { hasText: name }).click();
    const chip = page.locator('.chip.is-selected');
    assert.equal(await chip.getAttribute('aria-pressed'), 'true');
    assert.match(await chip.innerText(), new RegExp(name));
    assert.equal(await h.slots.count(), count, name);
    const cats = await page.locator('.card__category').allTextContents();
    assert.ok(cats.every((c) => c === name), `${name}: ${cats}`);
    assert.equal(await h.dock.textContent(), `1 / ${count}`);
  }
  await page.locator('.chip', { hasText: 'Food' }).click();
  assert.deepEqual(await terms(), ['das Messer', 'die Gabel', 'der Löffel', 'die Tassen']);
  await shot(page, '03-food');
});

await step('search inside a category offers "Search all words"', async () => {
  await search.fill('building');
  assert.ok(await page.getByText('Nichts gefunden').isVisible());
  await page.getByRole('button', { name: 'Search all words' }).click();
  assert.deepEqual(await terms(), ['das Gebäude']);
  assert.match(await page.locator('.chip.is-selected').innerText(), /All Words/);
  await search.fill('');
});

await step('"Show only unlearned" hides learned words', async () => {
  const toggle = page.getByRole('switch', { name: /Show only unlearned/ });
  await toggle.click();
  assert.equal(await h.slots.count(), 25);
  await toggle.click();
  assert.equal(await h.slots.count(), 28);
});

console.log('Shuffle & reset');
await step('Shuffle re-orders all 28 cards and resets flips', async () => {
  await h.frontFlip(0).click();
  const before = await terms();
  let after = before;
  for (let i = 0; i < 3 && after.join() === before.join(); i++) {
    await page.getByRole('button', { name: 'Shuffle cards' }).click();
    after = await terms();
  }
  assert.notDeepEqual(after, before);
  assert.deepEqual([...after].sort(), [...before].sort());
  assert.equal(await page.locator('.card.is-flipped').count(), 0);
  assert.equal(await h.dock.textContent(), '1 / 28');
  await page.waitForTimeout(900);
  await shot(page, '04-shuffled');
});

await step('Reset (after confirm) restores order, clears progress and search', async () => {
  await search.fill('schiff');
  page.once('dialog', (d) => d.dismiss());
  await page.getByRole('button', { name: 'Reset order and progress' }).click();
  assert.match(await h.learnedCaption.innerText(), /3 \/ 28/, 'cancel keeps progress');
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'Reset order and progress' }).click();
  assert.match(await h.learnedCaption.innerText(), /0 \/ 28 words learned/);
  assert.equal(await search.inputValue(), '');
  assert.deepEqual(await terms(), EXPECTED.map(([g]) => g));
});

await page.context().close();

// ============================================================== units
console.log('Units – UI');
await step('one page with a unit selector; Unit 3 selected by default', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  const tabs = p.locator('.unit-selector .unit-tab');
  assert.deepEqual(
    (await tabs.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim().toUpperCase()),
    ['UNIT 1 61', 'UNIT 2 68', 'UNIT 3 28', 'UNIT 4 43', 'ALPHABETS A–Z'],
  );
  assert.equal(await p.getByRole('button', { name: 'Unit 3, 28 words' }).getAttribute('aria-pressed'), 'true');
  assert.equal(await p.locator('.unit__label').innerText(), 'UNIT 3');
  assert.equal(await p.locator('.unit__title').textContent(), 'German Vocabulary');
  assert.match(await p.locator('.unit__meta').innerText(), /28 words/);
  assert.equal(await p.locator('.card-slot').count(), 28);
  assert.equal(await p.locator('.chip').count(), 8, 'All Words + the 7 categories – no Letters chip');
  await p.context().close();
});

await step('filters, search and progress belong to the selected unit', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  await p.evaluate(() => localStorage.clear());
  await p.reload();
  await p.waitForSelector('.card');
  const learned = () => p.locator('.progress--green .progress__caption').innerText();
  await p.getByRole('button', { name: 'Mark der Platz as learned' }).click();
  await p.getByRole('button', { name: 'Mark das Schiff as learned' }).click();
  assert.match(await learned(), /2 \/ 28 words learned/);
  for (const [name, count] of Object.entries({ Places: 8, Travel: 3, Directions: 4, Time: 4, Objects: 3, Food: 4, Other: 2 })) {
    await p.locator('.chip', { hasText: name }).click();
    assert.equal(await p.locator('.card-slot').count(), count, `Unit 3 ${name}`);
  }
  await p.locator('.chip', { hasText: 'All Words' }).click();
  await p.getByRole('searchbox').fill('building');
  assert.deepEqual(await p.locator('.term').allTextContents(), ['das Gebäude']);
  // Unit 2 has its own progress …
  await p.getByRole('button', { name: 'Unit 2, 68 words' }).click();
  assert.match(await learned(), /0 \/ 68 words learned/);
  assert.match(await p.locator('.unit__meta').innerText(), /0 \/ 68 learned/);
  // … and Unit 3 keeps its own.
  await p.getByRole('button', { name: 'Unit 3, 28 words' }).click();
  assert.match(await learned(), /2 \/ 28 words learned/);
  assert.match(await p.locator('.unit__meta').innerText(), /2 \/ 28 learned/);
  assert.equal(await p.locator('.card-slot').count(), 28, 'view starts fresh in the unit');
  const stored = JSON.parse(await p.evaluate(() => localStorage.getItem('deutsch-lernen:learned')));
  assert.deepEqual(stored.sort(), ['u3-das-schiff', 'u3-der-platz']);
  await p.context().close();
});

await step('switching units during Speaking Practice stops it – no speech continues', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  await p.locator('.practice__button').click();
  assert.equal((await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak')[0].text, 'place');
  await p.getByRole('button', { name: 'Unit 2, 68 words' }).click();
  const calls = await p.evaluate(() => window.__speechCalls);
  assert.equal(calls.at(-1).type, 'cancel', 'speech cancelled on unit switch');
  const count = calls.length;
  await p.waitForTimeout(4500);
  assert.equal((await p.evaluate(() => window.__speechCalls)).length, count, 'lesson does not continue');
  // Keyboard focus stays on the unit selector after switching.
  assert.equal(await p.evaluate(() => document.activeElement?.dataset.unit), '2');
  await p.context().close();
});

await step('progress saved before units existed is kept (moved to Unit 3)', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('deutsch-lernen:learned', JSON.stringify(['der-platz', 'die-gabel']));
  });
  const p = await context.newPage();
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(BASE_URL);
  await p.waitForSelector('.card');
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /2 \/ 28 words learned/);
  await p.waitForTimeout(200);
  const stored = JSON.parse(await p.evaluate(() => localStorage.getItem('deutsch-lernen:learned')));
  assert.deepEqual(stored.sort(), ['u3-der-platz', 'u3-die-gabel']);
  await context.close();
});

// ========================================================= Units 1 & 2
const FILLED_UNITS = [
  { n: 1, expected: EXPECTED_UNIT_1, counts: { Places: 13, Travel: 2, Directions: 1, Time: 2, Objects: 8, Food: 5, Other: 30 } },
  { n: 2, expected: EXPECTED_UNIT_2, counts: { Places: 8, Travel: 3, Directions: 4, Time: 10, Objects: 7, Food: 1, Other: 35 } },
  { n: 4, expected: EXPECTED_UNIT_4, counts: { Objects: 5, Food: 25, Other: 13 } },
];
const openUnit = async (n, options) => {
  const p = await openApp({ init: FAKE_SPEECH, ...options });
  await p.getByRole('button', { name: `Unit ${n}, ${FILLED_UNITS.find((u) => u.n === n).expected.length} words` }).click();
  await p.waitForSelector(`.card-slot[data-unit="${n}"]`);
  return p;
};
const openUnit1 = (options) => openUnit(1, options);

for (const { n, expected, counts } of FILLED_UNITS) {
  console.log(`Unit ${n}`);
  const total = expected.length;
  await step(`Unit ${n}: all ${total} words on cards – English front, German back – exactly as specified`, async () => {
    const p = await openUnit(n);
    assert.equal(await p.getByRole('button', { name: `Unit ${n}, ${total} words` }).getAttribute('aria-pressed'), 'true');
    assert.equal(await p.locator('.unit__label').innerText(), `UNIT ${n}`);
    assert.match(await p.locator('.unit__meta').innerText(), new RegExp(`${total} words`));
    assert.equal(await p.locator('.card-slot').count(), total);
    const units = await p.$$eval('.card-slot', (slots) => [...new Set(slots.map((s) => s.dataset.unit))]);
    assert.deepEqual(units, [String(n)], `every card is a Unit ${n} card`);
    const data = await p.$$eval('.card-slot', (slots) =>
      slots.map((s) => ({
        term: s.querySelector('.term').textContent,
        english: [s.querySelector('.card__english'), s.querySelector('.card__alternatives')]
          .filter(Boolean)
          .map((e) => e.textContent)
          .join(' '),
      })),
    );
    data.forEach((d, i) => {
      const [german, english] = expected[i];
      assert.equal(d.term, german, `card ${i + 1} German`);
      const [primary, ...alts] = english.split(' / ');
      const shown = primary.charAt(0).toUpperCase() + primary.slice(1) + (alts.length ? ` / ${alts.join(' / ')}` : '');
      assert.equal(d.english, shown, `card ${i + 1} English`);
    });
    assert.match(await p.locator('.header__progress').innerText(), new RegExp(`Word 1 of ${total}`));
    assert.match(await p.locator('.header__progress').innerText(), new RegExp(`0 / ${total} words learned`));
    assert.equal(await p.locator('.dock__position').textContent(), `1 / ${total}`);
    const broken = await p.evaluate(async () => {
      const srcs = [...new Set([...document.querySelectorAll('.card__image img')].map((img) => img.src))];
      const bad = await Promise.all(
        srcs.map(async (src) => {
          const res = await fetch(src);
          return res.ok && (res.headers.get('content-type') ?? '').includes('image') ? null : src;
        }),
      );
      return bad.filter(Boolean);
    });
    assert.deepEqual(broken, [], `every Unit ${n} illustration loads`);
    assert.equal(await p.locator('.chip').count(), 1 + Object.keys(counts).length, 'All Words + the unit\'s categories – no Letters chip');
    assert.match(await p.locator('.section-head__title').innerText(), /^All Words/);
    for (const [name, count] of Object.entries(counts)) {
      await p.locator('.chip', { hasText: name }).click();
      assert.equal(await p.locator('.card-slot').count(), count, `Unit ${n} ${name}`);
    }
    await p.context().close();
  });

  for (const vp of [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'mobile-390', width: 390, height: 844, mobile: true },
  ]) {
    await step(`Unit ${n} ${vp.name}: words and phrases fit on both sides; Unit 3 words stay single-line`, async () => {
      const p = await openApp({
        viewport: { width: vp.width, height: vp.height },
        init: FAKE_SPEECH,
        mobile: !!vp.mobile,
      });
      assert.equal(await p.locator('.term__word--phrase').count(), 0, 'Unit 3 has no phrase styling');
      await p.getByRole('button', { name: `Unit ${n}, ${total} words` }).click();
      await p.waitForTimeout(1000);
      await p.evaluate(() => document.querySelectorAll('.card__face--front .card__flip').forEach((b) => b.click()));
      await p.waitForTimeout(800);
      const info = await p.evaluate((deviceWidth) => ({
        overflow: document.documentElement.scrollWidth - deviceWidth,
        overflowing: [...document.querySelectorAll('.term__word, .card__english')]
          .filter((el) => el.scrollWidth > el.parentElement.clientWidth + 1)
          .map((el) => el.textContent),
        collisions: [...document.querySelectorAll('.card__face--back')]
          .filter((face) => {
            const img = face.querySelector('.card__image').getBoundingClientRect();
            const term = face.querySelector('.term').getBoundingClientRect();
            const audio = face.querySelector('.card__audio').getBoundingClientRect();
            const hint = face.querySelector('.card__hint').getBoundingClientRect();
            // Example sentences sit between the audio buttons and the hint, fully shown (no scrolling).
            const examples = face.querySelector('.card__examples');
            const ex = examples?.getBoundingClientRect();
            return (
              term.top < img.bottom + 2 ||
              audio.bottom > hint.top + 6 ||
              hint.bottom > face.getBoundingClientRect().bottom ||
              (examples && (audio.bottom > ex.top || ex.bottom > hint.top + 6 || examples.scrollHeight > examples.clientHeight + 1))
            );
          })
          .map((face) => face.querySelector('.term').textContent),
      }), vp.width);
      assert.ok(info.overflow <= 0, `horizontal overflow ${info.overflow}px`);
      assert.deepEqual(info.overflowing, [], 'every word fits on its card');
      assert.deepEqual(info.collisions, [], 'German side content does not overlap');
      await shot(p, `u${n}-vp-${vp.name}`);
      await p.context().close();
    });
  }
}

console.log('Unit 1 – audio, practice, progress');

await step('Unit 1: click flips English → German; Listen / Slow Listen speak the German term (de-DE)', async () => {
  const p = await openUnit1();
  const hp = helpers(p);
  assert.equal(await hp.slot(0).locator('.card__english').textContent(), 'Butter bread');
  await hp.frontFlip(0).click();
  await p.waitForTimeout(800);
  assert.equal(await hp.rotationOf(0), 180);
  assert.equal(await hp.slot(0).locator('.card__face--back .term').textContent(), 'das Butterbrot');
  await hp.listen(0).click();
  await p.waitForTimeout(100);
  await p.evaluate(() => window.__finishSpeech());
  await hp.slowListen(0).click();
  await p.waitForTimeout(100);
  await p.evaluate(() => window.__finishSpeech());
  const speaks = (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak');
  assert.deepEqual(
    speaks.map((c) => [c.text, c.lang, c.voice, c.rate]),
    [
      ['das Butterbrot', 'de-DE', 'Anna', 0.85],
      ['das Butterbrot', 'de-DE', 'Anna', 0.55],
    ],
  );
  await hp.backFlip(0).click();
  await p.waitForTimeout(800);
  assert.equal(await hp.flipped(0), false, 'flips back to English');
  // A phrase card speaks the whole phrase.
  const i = EXPECTED_UNIT_1.findIndex(([g]) => g === 'Wie heißen Sie?');
  await hp.slot(i).evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await hp.frontFlip(i).click();
  await p.waitForTimeout(800);
  await hp.listen(i).click();
  await p.waitForTimeout(100);
  const last = (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak').at(-1);
  assert.deepEqual([last.text, last.lang, last.voice], ['Wie heißen Sie?', 'de-DE', 'Anna']);
  await shot(p, 'u1-back-phrase');
  await p.context().close();
});

await step('Unit 1: Speaking Practice runs on the Unit 1 cards – English ×1 → 3 s → German ×5', async () => {
  const p = await openUnit1();
  const hp = helpers(p);
  const speaks = async () => (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak');
  await p.locator('.practice__button').click();
  await p.waitForTimeout(150);
  assert.deepEqual(
    (await speaks()).map((c) => [c.text, c.lang]),
    [['butter bread', 'en-US']],
  );
  assert.match((await p.getByTestId('practice-status').textContent()).replace(/\s+/g, ' '), /Word 1 \/ 61/);
  await p.evaluate(() => window.__finishSpeech());
  await p.waitForTimeout(2800);
  assert.equal((await speaks()).length, 1, 'no German during the 3 s pause');
  await p.waitForTimeout(800);
  assert.equal(await hp.flipped(0), true, 'flipped to German');
  for (let rep = 1; rep <= 5; rep++) {
    const g = (await speaks()).at(-1);
    assert.deepEqual([g.text, g.lang, g.rate, g.voice], ['das Butterbrot', 'de-DE', 0.7, 'Anna'], `German ${rep} / 5`);
    await p.evaluate(() => window.__finishSpeech());
    await p.waitForTimeout(rep < 5 ? 330 : 100);
  }
  assert.equal((await speaks()).length, 6);
  await p.waitForTimeout(1600);
  assert.equal((await speaks()).at(-1).text, 'sick person', 'moves on to Word 2 by itself');
  assert.equal(await p.locator('.dock__position').textContent(), '2 / 61');
  await p.getByRole('button', { name: /Stop Practice/ }).first().click();
  await p.context().close();
});

await step('Unit 1: search and progress are its own; Unit 3 progress untouched', async () => {
  const p = await openUnit1();
  await p.evaluate(() => localStorage.clear());
  await p.reload();
  await p.waitForSelector('.card');
  await p.getByRole('button', { name: 'Unit 1, 61 words' }).click();
  await p.getByRole('searchbox').fill('schweiz');
  assert.deepEqual(await p.locator('.term').allTextContents(), ['die Schweiz']);
  await p.getByRole('searchbox').fill('how are you');
  assert.deepEqual(await p.locator('.term').allTextContents(), ["Wie geht's?", 'Wie geht es Ihnen?']);
  await p.getByRole('searchbox').fill('');
  await p.getByRole('button', { name: 'Mark das Butterbrot as learned' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /1 \/ 61 words learned/);
  await p.getByRole('button', { name: 'Unit 3, 28 words' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /0 \/ 28 words learned/);
  await p.getByRole('button', { name: 'Unit 1, 61 words' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /1 \/ 61 words learned/);
  const stored = JSON.parse(await p.evaluate(() => localStorage.getItem('deutsch-lernen:learned')));
  assert.deepEqual(stored, ['u1-das-butterbrot']);
  await p.context().close();
});

console.log('Unit 2 – audio, practice, progress');
await step('Unit 2: click flips English → German; Listen speaks it; sie / sie / Sie are separate cards', async () => {
  const p = await openUnit(2);
  const hp = helpers(p);
  const lastSpeak = async () => (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak').at(-1);
  assert.equal(await hp.slot(0).locator('.card__english').textContent(), 'Work');
  await hp.frontFlip(0).click();
  await p.waitForTimeout(800);
  assert.equal(await hp.rotationOf(0), 180);
  assert.equal(await hp.slot(0).locator('.card__face--back .term').textContent(), 'die Arbeit');
  await hp.listen(0).click();
  await p.waitForTimeout(100);
  const first = await lastSpeak();
  assert.deepEqual([first.text, first.lang, first.voice, first.rate], ['die Arbeit', 'de-DE', 'Anna', 0.85]);
  await p.evaluate(() => window.__finishSpeech());
  const at = (english) => EXPECTED_UNIT_2.findIndex(([, e]) => e === english);
  const ids = await p.$$eval('.card-slot', (slots) => slots.map((s) => s.dataset.wordId));
  assert.deepEqual(
    [at('she'), at('they'), at('you (formal)')].map((i) => ids[i]),
    ['u2-sie-she', 'u2-sie-they', 'u2-sie-you-formal'],
  );
  const i = at('you (formal)');
  await hp.slot(i).evaluate((el) => el.scrollIntoView({ block: 'center' }));
  assert.equal(await hp.slot(i).locator('.card__english').textContent(), 'You (formal)');
  await hp.frontFlip(i).click();
  await p.waitForTimeout(800);
  assert.equal(await hp.slot(i).locator('.card__face--back .term').textContent(), 'Sie');
  await hp.listen(i).click();
  await p.waitForTimeout(100);
  const last = await lastSpeak();
  assert.deepEqual([last.text, last.lang, last.voice], ['Sie', 'de-DE', 'Anna']);
  await p.context().close();
});

await step('Unit 2: Speaking Practice runs on the Unit 2 cards – English ×1 → 3 s → German', async () => {
  const p = await openUnit(2);
  const hp = helpers(p);
  const speaks = async () => (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak');
  await p.locator('.practice__button').click();
  await p.waitForTimeout(150);
  assert.deepEqual(
    (await speaks()).map((c) => [c.text, c.lang]),
    [['work', 'en-US']],
  );
  assert.match((await p.getByTestId('practice-status').textContent()).replace(/\s+/g, ' '), /Word 1 \/ 68/);
  await p.evaluate(() => window.__finishSpeech());
  await p.waitForTimeout(3600);
  assert.equal(await hp.flipped(0), true, 'flipped to German');
  const g = (await speaks()).at(-1);
  assert.deepEqual([g.text, g.lang, g.rate, g.voice], ['die Arbeit', 'de-DE', 0.7, 'Anna']);
  await p.getByRole('button', { name: /Stop Practice/ }).first().click();
  await p.context().close();
});

await step('Unit 2: search and progress are its own (she ≠ they); other units untouched', async () => {
  const p = await openUnit(2);
  await p.evaluate(() => localStorage.clear());
  await p.reload();
  await p.waitForSelector('.card');
  await p.getByRole('button', { name: 'Unit 2, 68 words' }).click();
  await p.getByRole('searchbox').fill('kino');
  assert.deepEqual(await p.locator('.term').allTextContents(), ['das Kino']);
  await p.getByRole('searchbox').fill('week');
  assert.deepEqual(await p.locator('.term').allTextContents(), ['das Wochenende', 'die Woche', 'pro Woche']);
  await p.getByRole('searchbox').fill('');
  const she = EXPECTED_UNIT_2.findIndex(([, e]) => e === 'she');
  await p.locator('.card-slot').nth(she).getByRole('button', { name: 'Mark sie as learned' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /1 \/ 68 words learned/);
  assert.equal(await p.locator('.card-slot.is-learned').count(), 1, 'only "she" is learned, not "they"');
  await p.getByRole('button', { name: 'Unit 1, 61 words' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /0 \/ 61 words learned/);
  await p.getByRole('button', { name: 'Unit 3, 28 words' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /0 \/ 28 words learned/);
  await p.getByRole('button', { name: 'Unit 2, 68 words' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /1 \/ 68 words learned/);
  const stored = JSON.parse(await p.evaluate(() => localStorage.getItem('deutsch-lernen:learned')));
  assert.deepEqual(stored, ['u2-sie-she']);
  await p.context().close();
});

// ============================================================ Unit 4
console.log('Unit 4 – title, audio, practice, controls');
await step('Unit 4: "Guten Appetit!"; flips English → German; Listen speaks umlaut words and phrases (de-DE)', async () => {
  const p = await openUnit(4);
  const hp = helpers(p);
  assert.equal(await p.locator('.unit__label').innerText(), 'UNIT 4');
  assert.equal(await p.locator('.unit__title').textContent(), 'Guten Appetit!');
  const at = (german) => EXPECTED_UNIT_4.findIndex(([g]) => g === german);
  const lastSpeak = async () => (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak').at(-1);
  for (const term of ['das Frühstück', 'der Käse', 'das Brötchen', 'das Gemüse', 'das Öl', 'das Gespräch', 'die Getränke', 'Das ist alles.', 'Stimmt.']) {
    const i = at(term);
    await hp.slot(i).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    assert.equal(await hp.flipped(i), false, `${term} starts on the English side`);
    await hp.frontFlip(i).click();
    await p.waitForTimeout(800);
    assert.equal(await hp.rotationOf(i), 180, `${term} flipped`);
    assert.equal(await hp.slot(i).locator('.card__face--back .term').textContent(), term);
    await hp.listen(i).click();
    await p.waitForTimeout(60);
    const s1 = await lastSpeak();
    assert.deepEqual([s1.text, s1.lang, s1.voice, s1.rate], [term, 'de-DE', 'Anna', 0.85], `Listen ${term}`);
    await p.evaluate(() => window.__finishSpeech());
    await hp.slowListen(i).click();
    await p.waitForTimeout(60);
    const s2 = await lastSpeak();
    assert.deepEqual([s2.text, s2.lang, s2.rate], [term, 'de-DE', 0.55], `Slow Listen ${term}`);
    await p.evaluate(() => window.__finishSpeech());
    await hp.backFlip(i).click();
    await p.waitForTimeout(800);
    assert.equal(await hp.flipped(i), false, `${term} flips back`);
  }
  await p.context().close();
});

await step('Unit 4: one click practises exactly its 43 words (English ×1 → German ×5) – nothing from other units', async () => {
  const p = await openUnit(4, { initArg: { autoFinishMs: 10 } });
  assert.match(await p.getByTestId('practice-status').innerText(), /43 words shown · English once, German 5×/);
  const t0 = Date.now();
  await p.locator('.practice__button').click();
  await p.waitForFunction(
    () => document.querySelector('[data-testid="practice-status"]')?.textContent.includes('Unit 4 Speaking Practice Complete'),
    null,
    { timeout: 360000 },
  );
  console.log(`    (lesson took ${((Date.now() - t0) / 1000).toFixed(0)}s with instant speech)`);
  const spoken = (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak');
  assert.deepEqual(
    spoken.map((c) => `${c.lang}|${c.rate}|${c.voice}|${c.text}`),
    EXPECTED_UNIT_4.flatMap(([german, english]) => [
      `en-US|1|Samantha|${english.split(' / ').join(', ')}`,
      ...Array(5).fill(`de-DE|0.7|Anna|${german}`),
    ]),
    'Unit 4 words only, in order',
  );
  assert.match((await p.getByTestId('practice-status').textContent()).replace(/\s+/g, ' '), /43 \/ 43 words completed/);
  await p.context().close();
});

await step('Unit 4: search, Food / Other filters, shuffle, reset and progress work on Unit 4 only', async () => {
  const p = await openUnit(4);
  await p.evaluate(() => localStorage.clear());
  await p.reload();
  await p.waitForSelector('.card');
  await p.getByRole('button', { name: 'Unit 4, 43 words' }).click();
  const terms = () => p.locator('.term').allTextContents();
  await p.getByRole('searchbox').fill('saft');
  assert.deepEqual(await terms(), ['der Orangensaft', 'der Apfelsaft']);
  await p.getByRole('searchbox').fill('kase');
  assert.deepEqual(await terms(), ['der Käse'], 'umlaut-insensitive search');
  await p.getByRole('searchbox').fill('juice');
  assert.deepEqual(await terms(), ['der Orangensaft', 'der Apfelsaft'], 'English search');
  await p.getByRole('searchbox').fill('');
  await p.locator('.chip', { hasText: 'Other' }).click();
  assert.deepEqual(await terms(), ['das Gespräch', 'die Vorlieben', 'Das ist alles.', 'kaufen', 'alles', 'mehr', 'Stimmt.', 'dran', 'Sonst noch etwas?', 'Gleichfalls!', 'schmeckt', 'satt', 'Mahlzeit!']);
  await p.locator('.chip', { hasText: 'Food' }).click();
  assert.equal(await p.locator('.card-slot').count(), 25);
  await p.locator('.chip', { hasText: 'All Words' }).click();
  const original = await terms();
  assert.deepEqual(original, EXPECTED_UNIT_4.map(([g]) => g));
  await p.getByRole('button', { name: 'Shuffle cards' }).click();
  await p.waitForTimeout(300);
  const shuffled = await terms();
  assert.notDeepEqual(shuffled, original, 'order changed');
  assert.deepEqual([...shuffled].sort(), [...original].sort(), 'same 43 Unit 4 words');
  await p.getByRole('button', { name: 'Mark der Käse as learned' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /1 \/ 43 words learned/);
  await p.getByRole('button', { name: 'Unit 3, 28 words' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /0 \/ 28 words learned/);
  assert.equal(await p.locator('.card-slot').count(), 28);
  await p.getByRole('button', { name: 'Unit 4, 43 words' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /1 \/ 43 words learned/);
  p.once('dialog', (d) => d.accept());
  await p.getByRole('button', { name: 'Reset order and progress' }).click();
  await p.waitForTimeout(300);
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /0 \/ 43 words learned/);
  assert.deepEqual(await terms(), original, 'reset restores the order');
  const stored = JSON.parse(await p.evaluate(() => localStorage.getItem('deutsch-lernen:learned')) ?? '[]');
  assert.ok(!stored.some((id) => id.startsWith('u4-')), 'Unit 4 progress cleared');
  await p.context().close();
});

// ================================================== example sentences
console.log('Example sentences');
await step('Example sentences: German side shows the word’s two sentences + English under Listen; Listen still says the word; clicking the English flips back', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  const hp = helpers(p);
  for (const id of ['u1-koennen-sie-helfen', 'u2-sie-they', 'u3-das-meer', 'u4-der-kassenzettel']) {
    const word = VOCABULARY.find((w) => w.id === id);
    const words = wordsInUnit(word.unit);
    await p.getByRole('button', { name: `Unit ${word.unit}, ${words.length} words` }).click();
    await p.waitForSelector(`.card-slot[data-unit="${word.unit}"]`);
    const i = words.indexOf(word);
    const back = hp.slot(i).locator('.card__face--back');
    await hp.slot(i).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    assert.equal(await hp.slot(i).locator('.card__face--front .card__examples').count(), 0, 'English side has no sentences');
    await hp.frontFlip(i).click();
    await p.waitForTimeout(800);
    assert.equal(await back.locator('.card__examples-title').textContent(), 'Example Sentences');
    assert.deepEqual(await back.locator('.card__example-german').allTextContents(), word.sentences.map((s) => s.german), id);
    assert.deepEqual(await back.locator('.card__example-english').allTextContents(), word.sentences.map((s) => s.english), id);
    assert.equal(await back.locator('.card__example-german').first().getAttribute('lang'), 'de');
    const [audio, examples] = await Promise.all([back.locator('.card__audio').boundingBox(), back.locator('.card__examples').boundingBox()]);
    assert.ok(examples.y >= audio.y + audio.height, 'sentences sit below Listen / Slow Listen');
    await hp.listen(i).click();
    await p.waitForTimeout(60);
    const spoken = (await hp.speechCalls()).filter((c) => c.type === 'speak').at(-1);
    assert.equal(spoken.text, germanTerm(word), 'Listen says the word, not a sentence');
    await p.evaluate(() => window.__finishSpeech());
    await back.locator('.card__example-english').first().click();
    await p.waitForTimeout(800);
    assert.equal(await hp.flipped(i), false, 'clicking a translation flips the card back');
  }
  await p.context().close();
});

await step('Sentence audio: every sentence has 🔊 + 🐢 (de-DE, 0.9 / 0.7); one voice at a time; repeat clicks ignored; never flips', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  const hp = helpers(p);
  // Every sentence of every unit has its own pair of buttons, labelled with that sentence.
  for (const n of [1, 2, 3, 4]) {
    const words = wordsInUnit(n);
    await p.getByRole('button', { name: `Unit ${n}, ${words.length} words` }).click();
    await p.waitForSelector(`.card-slot[data-unit="${n}"]`);
    const labels = await p.locator('.card__face--back .sentence-audio').evaluateAll((els) => els.map((el) => el.getAttribute('aria-label')));
    assert.deepEqual(
      labels,
      words.flatMap((w) => w.sentences.flatMap((s) => [`Listen to German sentence: ${s.german}`, `Listen slowly to German sentence: ${s.german}`])),
      `Unit ${n}: 🔊 and 🐢 for each of its ${words.length * 2} sentences`,
    );
  }
  const word = VOCABULARY.find((w) => w.id === 'u4-der-kassenzettel');
  const i = wordsInUnit(4).indexOf(word);
  const back = hp.slot(i).locator('.card__face--back');
  const [normal1, slow1, normal2, slow2] = await back.locator('.sentence-audio').all();
  const speaks = async () => (await hp.speechCalls()).filter((c) => c.type === 'speak');
  await hp.slot(i).evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await hp.frontFlip(i).click();
  await p.waitForTimeout(800);
  assert.equal(await normal1.getAttribute('title'), 'Listen to German sentence');

  await normal1.click();
  await p.waitForTimeout(100);
  let last = (await speaks()).at(-1);
  assert.deepEqual([last.text, last.lang, last.voice, last.rate], [word.sentences[0].german, 'de-DE', 'Anna', 0.9], 'normal speed');
  assert.match(await normal1.getAttribute('class'), /is-speaking/);
  assert.equal(await hp.flipped(i), true, 'the speaker does not flip the card');
  const count = (await speaks()).length;
  await normal1.click();
  await normal1.click();
  await p.waitForTimeout(150);
  assert.equal((await speaks()).length, count, 'repeat clicks while playing start nothing new');

  // Another sentence (slow) interrupts the first: cancel first, then speak – never two at once.
  await slow2.click();
  await p.waitForTimeout(150);
  last = (await speaks()).at(-1);
  assert.deepEqual([last.text, last.lang, last.voice, last.rate], [word.sentences[1].german, 'de-DE', 'Anna', 0.7], 'slow speed, same voice');
  assert.ok((await speaks()).every((c) => !c.speakingAtCall), 'no overlapping speech');
  assert.doesNotMatch(await normal1.getAttribute('class'), /is-speaking/);
  assert.match(await slow2.getAttribute('class'), /is-speaking/);
  await p.evaluate(() => window.__finishSpeech());
  await p.waitForTimeout(100);
  assert.equal(await back.locator('.sentence-audio.is-speaking').count(), 0, 'feedback ends with the speech');

  // The word's own Listen / Slow Listen are unchanged, and also stop a sentence.
  await slow1.click();
  await p.waitForTimeout(100);
  await hp.listen(i).click();
  await p.waitForTimeout(150);
  last = (await speaks()).at(-1);
  assert.deepEqual([last.text, last.rate], ['der Kassenzettel', 0.85], 'Listen still says the word at its own speed');
  assert.equal(await back.locator('.sentence-audio.is-speaking').count(), 0);
  await p.evaluate(() => window.__finishSpeech());
  // Keyboard: Enter on a sentence button plays it and keeps the card on the German side.
  await normal2.focus();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(150);
  assert.equal((await speaks()).at(-1).text, word.sentences[1].german, 'Enter plays the sentence');
  assert.equal(await hp.flipped(i), true);
  await p.context().close();

  // Touch: tapping a sentence speaker plays it without flipping the card back.
  const m = await openApp({ init: FAKE_SPEECH, viewport: { width: 390, height: 844 }, mobile: true });
  const mh = helpers(m);
  await mh.frontFlip(0).tap();
  await m.waitForTimeout(800);
  const tapTarget = mh.slot(0).locator('.card__face--back .sentence-audio').first();
  const box = await tapTarget.boundingBox();
  assert.ok(box.width >= 30 && box.height >= 28, `touch target ${box.width}×${box.height}`);
  await tapTarget.tap();
  await m.waitForTimeout(150);
  assert.equal((await mh.speechCalls()).filter((c) => c.type === 'speak').at(-1).text, wordsInUnit(3)[0].sentences[0].german);
  assert.equal(await mh.flipped(0), true, 'tap on the speaker keeps the German side');
  await m.context().close();
});

await step('Word meanings: hover / focus / tap any sentence word for its English; punctuation excluded; never flips or speaks', async () => {
  // Data: every word of every sentence has its meaning (punctuation and numbers are not words).
  const sentences = VOCABULARY.flatMap((w) => w.sentences ?? []);
  for (const s of sentences) {
    assert.equal(s.words.map((t) => t.text).join(''), s.german, 'tokens rebuild the sentence');
    for (const t of s.words) {
      if (/\p{L}/u.test(t.text)) assert.ok(t.gloss?.trim(), `“${t.text}” in “${s.german}” has a meaning`);
      else assert.equal(t.gloss, undefined, `“${t.text}” is not a word`);
    }
  }
  for (const [de, , glosses] of Object.values(EXAMPLES).flat()) {
    const words = sentences.find((s) => s.german === de).words.map((t) => t.text);
    for (const word of Object.keys(glosses ?? {})) assert.ok(words.includes(word), `override “${word}” is in “${de}”`);
  }

  const p = await openApp({ init: FAKE_SPEECH });
  const hp = helpers(p);
  const tooltip = p.locator('#word-gloss');
  // Real mouse moves: locator.hover() may scroll the clipped card face, which (rightly) closes the tooltip.
  const hoverAt = async (locator) => {
    const box = await locator.boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  };
  // Every word on every card is a word button with only letters in it.
  for (const n of [1, 2, 3, 4]) {
    const words = wordsInUnit(n);
    await p.getByRole('button', { name: `Unit ${n}, ${words.length} words` }).click();
    await p.waitForSelector(`.card-slot[data-unit="${n}"]`);
    const texts = await p.locator('.card__face--back .gloss-word').allTextContents();
    assert.equal(texts.length, words.flatMap((w) => w.sentences.flatMap((s) => s.words.filter((t) => t.gloss))).length, `Unit ${n}: every word`);
    assert.ok(texts.every((t) => /^\p{L}+(?:['’-]\p{L}+)*$/u.test(t)), `Unit ${n}: no punctuation inside a word`);
  }
  await p.getByRole('button', { name: 'Unit 3, 28 words' }).click();
  const i = wordsInUnit(3).findIndex((w) => w.id === 'u3-die-dinge');
  const back = hp.slot(i).locator('.card__face--back');
  const word = (text, n = 0) => back.locator('.gloss-word').filter({ hasText: new RegExp(`^${text}$`) }).nth(n);
  await hp.slot(i).evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await hp.frontFlip(i).click();
  await p.waitForTimeout(800);
  const before = (await hp.speechCalls()).length;

  // Hover: “Ich kaufe viele Dinge.” – word by word, the tooltip sits above the word.
  for (const [text, meaning] of [['Ich', 'I'], ['kaufe', 'am buying / buy'], ['viele', 'many'], ['Dinge', 'things']]) {
    await hoverAt(word(text));
    await p.waitForTimeout(80);
    assert.equal(await tooltip.locator('.word-tooltip__meaning').textContent(), meaning, `hover ${text}`);
    const [w, t] = await Promise.all([word(text).boundingBox(), tooltip.boundingBox()]);
    assert.ok(t.y + t.height <= w.y, `${text}: tooltip above the word`);
    assert.ok(t.x >= 0 && t.x + t.width <= 1440, `${text}: tooltip inside the viewport`);
    assert.equal(await word(text).getAttribute('aria-describedby'), 'word-gloss');
  }
  assert.equal(await tooltip.locator('.word-tooltip__note').count(), 0, '“Dinge” needs no grammar note');
  // Second sentence: “dem” explains the dative.
  await hoverAt(word('dem'));
  await p.waitForTimeout(80);
  assert.equal(await tooltip.locator('.word-tooltip__meaning').textContent(), 'the');
  assert.match(await tooltip.locator('.word-tooltip__note').textContent(), /dative/);
  // Leaving the word hides it (staying on the card, which would flip back if left); clicking a word neither flips nor pins.
  await back.locator('.card__examples-title').hover();
  await p.waitForTimeout(80);
  assert.equal(await tooltip.count(), 0, 'hidden after the cursor leaves');
  await word('Tisch').click();
  await p.waitForTimeout(300);
  assert.equal(await hp.flipped(i), true, 'clicking a word does not flip the card');
  assert.equal((await hp.speechCalls()).length, before, 'hovering / clicking words speaks nothing');

  // Keyboard: Tab from Slow Listen reaches the words; Enter pins, Escape closes.
  await hp.slowListen(i).focus();
  await p.keyboard.press('Tab');
  assert.equal(await tooltip.locator('.word-tooltip__meaning').textContent(), 'I', 'focus shows the meaning');
  await p.keyboard.press('Tab');
  assert.equal(await tooltip.locator('.word-tooltip__meaning').textContent(), 'am buying / buy');
  await p.keyboard.press('Enter');
  assert.equal(await tooltip.locator('.word-tooltip__close').count(), 1, 'Enter keeps it open');
  assert.equal(await hp.flipped(i), true, 'Enter on a word does not flip the card');
  await p.keyboard.press('Escape');
  assert.equal(await tooltip.count(), 0, 'Escape closes it');

  // Context: the same word means what it means in its sentence.
  for (const [id, text, meaning] of [
    ['u2-warten', 'auf', 'for'],
    ['u2-sie-she', 'Sie', 'she'],
    ['u2-sie-they', 'Sie', 'they'],
    ['u2-sie-you-formal', 'Sie', 'you'],
    ['u4-das-mittagessen', 'zum', 'for'],
  ]) {
    const w = VOCABULARY.find((v) => v.id === id);
    await p.getByRole('button', { name: `Unit ${w.unit}, ${wordsInUnit(w.unit).length} words` }).click();
    const k = wordsInUnit(w.unit).indexOf(w);
    await hp.slot(k).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await hp.frontFlip(k).click();
    await p.waitForTimeout(800);
    const target = hp.slot(k).locator('.card__face--back .gloss-word').filter({ hasText: new RegExp(`^${text}$`) }).first();
    await hoverAt(target);
    await p.waitForTimeout(80);
    assert.equal(await tooltip.locator('.word-tooltip__meaning').textContent(), meaning, `${id}: ${text}`);
    await p.mouse.move(5, 5);
  }
  // Sentence audio still plays the whole sentence.
  await p.getByRole('button', { name: 'Unit 3, 28 words' }).click();
  await hp.slot(i).evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await hp.frontFlip(i).click();
  await p.waitForTimeout(800);
  await back.locator('.sentence-audio--normal').first().click();
  await p.waitForTimeout(150);
  assert.equal((await hp.speechCalls()).filter((c) => c.type === 'speak').at(-1).text, 'Ich kaufe viele Dinge.');
  await p.context().close();

  // Touch: tap shows it until another word, the ×, or a tap elsewhere – which doesn't flip the card.
  const m = await openApp({ init: FAKE_SPEECH, viewport: { width: 390, height: 844 }, mobile: true });
  const mh = helpers(m);
  const mt = m.locator('#word-gloss');
  // Taps at the element's position: locator.tap() may scroll the clipped card face, which closes the tooltip.
  const tapAt = async (locator) => {
    const box = await locator.boundingBox();
    await m.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  };
  const mword = (text) => mh.slot(i).locator('.card__face--back .gloss-word').filter({ hasText: new RegExp(`^${text}$`) }).first();
  await mh.slot(i).evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await mh.frontFlip(i).tap();
  await m.waitForTimeout(800);
  await tapAt(mword('Dinge'));
  await m.waitForTimeout(150);
  assert.equal(await mt.locator('.word-tooltip__meaning').textContent(), 'things', 'tap shows the meaning');
  assert.equal(await mh.flipped(i), true, 'tapping a word keeps the German side');
  await m.waitForTimeout(400);
  assert.equal(await mt.count(), 1, 'stays open after the tap');
  await tapAt(mword('viele'));
  await m.waitForTimeout(150);
  assert.equal(await mt.locator('.word-tooltip__meaning').textContent(), 'many', 'another word replaces it');
  await tapAt(mt.locator('.word-tooltip__close'));
  await m.waitForTimeout(150);
  assert.equal(await mt.count(), 0, '× closes it');
  await tapAt(mword('Tisch'));
  await m.waitForTimeout(150);
  await tapAt(mh.slot(i).locator('.card__face--back .card__example-english').nth(1));
  await m.waitForTimeout(800);
  assert.equal(await mt.count(), 0, 'a tap elsewhere closes it');
  assert.equal(await mh.flipped(i), true, '…without flipping the card');
  await tapAt(mh.slot(i).locator('.card__face--back .card__example-english').nth(1));
  await m.waitForTimeout(800);
  assert.equal(await mh.flipped(i), false, 'the next tap flips as usual');
  await m.context().close();
});

// ========================================================== Alphabets
console.log('Alphabets');
const openAlphabets = async (options) => {
  const p = await openApp({ init: FAKE_SPEECH, ...options });
  await p.getByRole('button', { name: 'Alphabets, 26 letters' }).click();
  await p.waitForSelector('.card-slot[data-unit="0"]');
  return p;
};

await step('Alphabets: A–Z on 26 cards – letter on the front, its German name on the back', async () => {
  const p = await openAlphabets();
  assert.equal(await p.getByRole('button', { name: 'Alphabets, 26 letters' }).getAttribute('aria-pressed'), 'true');
  assert.equal(await p.locator('.unit__label').innerText(), 'ALPHABETS');
  assert.equal(await p.locator('.unit__title').textContent(), 'German Alphabet');
  assert.match(await p.locator('.unit__meta').innerText(), /26 letters/);
  assert.match(await p.locator('.header__progress').innerText(), /Letter 1 of 26/);
  assert.match(await p.locator('.header__progress').innerText(), /0 \/ 26 letters learned/);
  assert.match(await p.locator('.section-head__title').innerText(), /All Letters\s+26 letters/);
  assert.equal(await p.locator('.chip').count(), 0, 'one category – no filter chips');
  assert.equal(await p.locator('.card-slot').count(), 26);
  const cards = await p.$$eval('.card-slot', (slots) =>
    slots.map((s) => ({
      unit: s.dataset.unit,
      front: s.querySelector('.card__english').textContent,
      glyph: s.querySelector('.card__face--front .card__glyph')?.textContent,
      back: s.querySelector('.term').textContent,
      guide: s.querySelector('.card__pronunciation'),
      images: s.querySelectorAll('.card__image img').length,
      listen: s.querySelectorAll('.audio-button--normal').length,
    })),
  );
  cards.forEach((c, i) => {
    const [letter, name] = EXPECTED_LETTERS[i];
    assert.deepEqual(
      [c.unit, c.front, c.glyph, c.back, c.guide, c.images, c.listen],
      ['0', letter, `${letter}${letter.toLowerCase()}`, name, null, 0, 1],
      `card ${letter}`,
    );
  });
  // Flip: front letter → back name, and back again.
  const hp = helpers(p);
  await hp.frontFlip(0).click();
  await p.waitForTimeout(800);
  assert.equal(await hp.rotationOf(0), 180);
  assert.ok(await hp.listen(0).isVisible());
  await hp.backFlip(0).click();
  await p.waitForTimeout(800);
  assert.equal(await hp.flipped(0), false);
  await p.context().close();
});

await step('Alphabets: all 26 Listen buttons speak the German letter name (de-DE) – never English', async () => {
  const p = await openAlphabets();
  const hp = helpers(p);
  await p.evaluate(() => document.querySelectorAll('.card__face--front .card__flip').forEach((b) => b.click()));
  await p.waitForTimeout(800);
  for (let i = 0; i < 26; i++) {
    await hp.listen(i).click();
    await p.waitForTimeout(40);
    await p.evaluate(() => window.__finishSpeech());
  }
  // V flipped back to English when the mouse moved on (desktop behaviour) – flip it again.
  const v = EXPECTED_LETTERS.findIndex(([l]) => l === 'V');
  await hp.frontFlip(v).click();
  await p.waitForTimeout(800);
  await hp.slowListen(v).click();
  await p.waitForTimeout(40);
  const speaks = (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak');
  assert.deepEqual(
    speaks.map((c) => [c.text, c.lang, c.voice, c.rate]),
    [...EXPECTED_LETTERS.map(([, , say]) => [say, 'de-DE', 'Anna', 0.85]), ['Fau', 'de-DE', 'Anna', 0.55]],
  );
  assert.ok(speaks.every((c) => !/^[A-Z]$/.test(c.text)), 'never a bare capital letter ("Großbuchstabe …")');
  await p.context().close();
});

await step('Alphabets: one click practises only A–Z – letter shown, 3 s, German name ×5, no English', async () => {
  const p = await openAlphabets({ initArg: { autoFinishMs: 10 } });
  assert.match(await p.getByTestId('practice-status').innerText(), /26 letters shown · German 5×/);
  const t0 = Date.now();
  await p.locator('.practice__button').click();
  await p.waitForTimeout(300);
  assert.match((await p.getByTestId('practice-status').textContent()).replace(/\s+/g, ' '), /Letter 1 \/ 26 · A/);
  await p.waitForFunction(
    () => document.querySelector('[data-testid="practice-status"]')?.textContent.includes('Alphabets Speaking Practice Complete'),
    null,
    { timeout: 300000 },
  );
  console.log(`    (lesson took ${((Date.now() - t0) / 1000).toFixed(0)}s with instant speech)`);
  const spoken = (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak');
  assert.deepEqual(
    spoken.map((c) => `${c.lang}|${c.rate}|${c.voice}|${c.text}`),
    EXPECTED_LETTERS.flatMap(([, , say]) => Array(5).fill(`de-DE|0.7|Anna|${say}`)),
    'only the 26 German letter names, 5× each, in A–Z order – no English, no Unit 1–3 words',
  );
  const status = (await p.getByTestId('practice-status').textContent()).replace(/\s+/g, ' ');
  assert.match(status, /✓ Alphabets Speaking Practice Complete/);
  assert.match(status, /26 \/ 26 letters completed/);
  await p.context().close();
});

await step('Alphabets: progress and search are its own; Unit 3 untouched', async () => {
  const p = await openAlphabets();
  await p.evaluate(() => localStorage.clear());
  await p.reload();
  await p.waitForSelector('.card');
  await p.getByRole('button', { name: 'Alphabets, 26 letters' }).click();
  await p.getByRole('searchbox').fill('q');
  assert.deepEqual(await p.locator('.term').allTextContents(), ['Kuh']);
  await p.getByRole('searchbox').fill('');
  await p.getByRole('button', { name: 'Mark Ah as learned' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /1 \/ 26 letters learned/);
  await p.getByRole('button', { name: 'Unit 3, 28 words' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /0 \/ 28 words learned/);
  assert.equal(await p.locator('.card-slot').count(), 28);
  await p.getByRole('button', { name: 'Alphabets, 26 letters' }).click();
  assert.match(await p.locator('.progress--green .progress__caption').innerText(), /1 \/ 26 letters learned/);
  const stored = JSON.parse(await p.evaluate(() => localStorage.getItem('deutsch-lernen:learned')));
  assert.deepEqual(stored, ['u0-ah']);
  await p.context().close();
});

for (const vp of [
  { name: 'desktop-1440', width: 1440, height: 900, perRow: 4 },
  { name: 'tablet-820', width: 820, height: 1180, perRow: 2, touch: true },
  { name: 'mobile-360', width: 360, height: 740, perRow: 1, touch: true, mobile: true },
]) {
  await step(`Alphabets ${vp.name}: ${vp.perRow}/row, no horizontal scroll, letters fit, selector fits`, async () => {
    const p = await openApp({
      viewport: { width: vp.width, height: vp.height },
      init: FAKE_SPEECH,
      mobile: !!vp.mobile,
      touch: !!vp.touch,
    });
    await p.getByRole('button', { name: 'Alphabets, 26 letters' }).click();
    await p.waitForTimeout(1000);
    await p.evaluate(() => document.querySelectorAll('.card__face--front .card__flip').forEach((b) => b.click()));
    await p.waitForTimeout(800);
    const info = await p.evaluate((deviceWidth) => {
      const slots = [...document.querySelectorAll('.card-slot')];
      const firstTop = Math.round(slots[0].getBoundingClientRect().top);
      const list = document.querySelector('.unit-selector__list').getBoundingClientRect();
      const tabs = [...document.querySelectorAll('.unit-tab')].map((t) => t.getBoundingClientRect());
      return {
        overflow: document.documentElement.scrollWidth - deviceWidth,
        perRow: slots.filter((s) => Math.abs(s.getBoundingClientRect().top - firstTop) < 4).length,
        tabsInside: tabs.every((r) => r.left >= list.left - 1 && r.right <= list.right + 1),
        tabTextFits: [...document.querySelectorAll('.unit-tab')].every((t) => t.scrollWidth <= t.clientWidth + 1),
        overflowing: [...document.querySelectorAll('.term__word, .card__english, .card__glyph')]
          .filter((el) => el.scrollWidth > el.parentElement.clientWidth + 1)
          .map((el) => el.textContent),
        collisions: [...document.querySelectorAll('.card__face--back')]
          .filter((face) => {
            const img = face.querySelector('.card__image').getBoundingClientRect();
            const term = face.querySelector('.term').getBoundingClientRect();
            const audio = face.querySelector('.card__audio').getBoundingClientRect();
            const hint = face.querySelector('.card__hint').getBoundingClientRect();
            return term.top < img.bottom + 2 || audio.bottom > hint.top + 6;
          })
          .map((face) => face.querySelector('.term').textContent),
      };
    }, vp.width);
    assert.ok(info.overflow <= 0, `horizontal overflow ${info.overflow}px`);
    assert.equal(info.perRow, vp.perRow, 'cards per row');
    assert.ok(info.tabsInside && info.tabTextFits, 'unit selector fits');
    assert.deepEqual(info.overflowing, [], 'every letter fits on its card');
    assert.deepEqual(info.collisions, [], 'German side content does not overlap');
    await p.evaluate(() => window.scrollTo(0, 0));
    await shot(p, `abc-vp-${vp.name}`);
    await p.context().close();
  });
}

// ================================================== keyboard: Enter
console.log('Keyboard – Enter reveals, Enter again listens');
const speakCalls = async (p) => (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak');
const blur = (p) => p.evaluate(() => document.activeElement?.blur());
const isFlippedAt = (p, i) => p.locator('.card-slot').nth(i).locator('.card').evaluate((el) => el.classList.contains('is-flipped'));

await step('Enter (nothing focused): 1st press reveals the active card, 2nd plays its Listen – one action per press', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  await blur(p);
  await p.keyboard.press('Enter');
  await p.waitForTimeout(800);
  assert.equal(await isFlippedAt(p, 0), true, 'first Enter reveals German');
  assert.equal((await speakCalls(p)).length, 0, 'first Enter plays nothing');
  assert.ok(await p.locator('.card-slot').nth(0).locator('.card__face--back .card__flip').evaluate((el) => el === document.activeElement), 'focus follows to the German side');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(100);
  const calls = await speakCalls(p);
  assert.deepEqual(calls.map((c) => [c.text, c.lang, c.voice, c.rate]), [['der Platz', 'de-DE', 'Anna', 0.85]], 'second Enter: Listen, once, in German');
  assert.equal(await isFlippedAt(p, 0), true, 'second Enter does not flip back');
  assert.ok(await p.locator('.card-slot').nth(0).locator('.audio-button--normal.is-speaking').isVisible(), 'the card\'s own Listen button shows Speaking…');
  await p.evaluate(() => window.__finishSpeech());
  // Holding Enter: only the first key press counts.
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(300);
  await p.keyboard.down('Enter');
  await p.keyboard.down('Enter'); // auto-repeat
  await p.keyboard.down('Enter');
  await p.keyboard.up('Enter');
  await p.waitForTimeout(800);
  assert.equal(await isFlippedAt(p, 1), true, 'held Enter reveals card 2');
  assert.equal((await speakCalls(p)).length, 1, 'held Enter plays nothing extra');
  await p.context().close();
});

await step('moving to another card resets the sequence: Enter reveals the new card first, then plays it', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  await blur(p);
  await p.keyboard.press('Enter');
  await p.waitForTimeout(800);
  await p.keyboard.press('Enter');
  await p.waitForTimeout(100);
  await p.evaluate(() => window.__finishSpeech());
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(300);
  assert.equal(await p.locator('.dock__position').textContent(), '2 / 28');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(800);
  assert.equal(await isFlippedAt(p, 1), true, 'card 2 revealed');
  assert.equal((await speakCalls(p)).length, 1, 'no audio on the reveal');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(100);
  assert.deepEqual((await speakCalls(p)).map((c) => c.text), ['der Platz', 'das Gebäude'], 'then card 2 – not card 1');
  await p.context().close();
});

await step('focused card: Enter flips, Enter again plays Listen; Space flips back; Listen button Enter plays once', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  const hp = helpers(p);
  await hp.frontFlip(2).focus();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(800);
  assert.equal(await hp.flipped(2), true);
  await p.keyboard.press('Enter');
  await p.waitForTimeout(100);
  assert.deepEqual((await speakCalls(p)).map((c) => [c.text, c.lang]), [['benennen', 'de-DE']]);
  assert.equal(await hp.flipped(2), true, 'Enter on the German side does not flip back');
  await p.evaluate(() => window.__finishSpeech());
  await p.keyboard.press('Space');
  await p.waitForTimeout(800);
  assert.equal(await hp.flipped(2), false, 'Space still flips back');
  await hp.frontFlip(2).focus();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(800);
  await p.keyboard.press('Tab');
  assert.ok(await hp.listen(2).evaluate((el) => el === document.activeElement), 'Tab reaches Listen');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(100);
  assert.equal((await speakCalls(p)).length, 2, 'Enter on Listen plays exactly once');
  await p.context().close();
});

await step('Enter on other controls keeps their own action – no card flips, no audio', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  await p.getByRole('searchbox').focus();
  await p.keyboard.type('see');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(300);
  assert.equal(await p.locator('.card.is-flipped').count(), 0, 'Enter in search flips nothing');
  await p.getByRole('searchbox').fill('');
  await p.getByRole('switch', { name: /Show only unlearned/ }).focus();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(300);
  assert.equal(await p.locator('.card.is-flipped').count(), 0, 'Enter on the toggle flips nothing');
  await p.locator('.test-button').focus();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(300);
  assert.ok(await p.getByTestId('unit-test').isVisible(), 'Enter on Test opens the test');
  assert.equal((await speakCalls(p)).length, 0, 'no audio anywhere');
  await p.context().close();
});

await step('Enter does nothing to the cards while Speaking Practice runs', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  await p.locator('.practice__button').click();
  await p.waitForTimeout(150);
  await blur(p);
  await p.keyboard.press('Enter');
  await p.waitForTimeout(300);
  assert.deepEqual((await speakCalls(p)).map((c) => c.text), ['place'], 'only the lesson speaks');
  assert.equal(await isFlippedAt(p, 0), false, 'card not flipped by Enter');
  await p.getByRole('button', { name: /Stop Practice/ }).first().click();
  await p.context().close();
});

for (const [n, label, first] of [
  [1, 'Unit 1, 61 words', 'das Butterbrot'],
  [2, 'Unit 2, 68 words', 'die Arbeit'],
  [4, 'Unit 4, 43 words', 'die Mahlzeit'],
  [0, 'Alphabets, 26 letters', 'Ah'],
]) {
  await step(`Enter → reveal, Enter → Listen also in ${label.split(',')[0]} (says “${first}”)`, async () => {
    const p = await openApp({ init: FAKE_SPEECH });
    await p.getByRole('button', { name: label }).click();
    await p.waitForSelector(`.card-slot[data-unit="${n}"]`);
    await blur(p);
    await p.keyboard.press('Enter');
    await p.waitForTimeout(800);
    assert.equal(await isFlippedAt(p, 0), true);
    assert.equal((await speakCalls(p)).length, 0);
    await p.keyboard.press('Enter');
    await p.waitForTimeout(100);
    assert.deepEqual((await speakCalls(p)).map((c) => [c.text, c.lang]), [[first, 'de-DE']]);
    await p.context().close();
  });
}

// ================================================================ tests
console.log('Unit tests – fill in the blanks');
const TEST_UNITS = [
  { n: 1, label: 'Unit 1, 61 words', name: 'Unit 1' },
  { n: 2, label: 'Unit 2, 68 words', name: 'Unit 2' },
  { n: 3, label: 'Unit 3, 28 words', name: 'Unit 3' },
  { n: 4, label: 'Unit 4, 43 words', name: 'Unit 4' },
  { n: 0, label: 'Alphabets, 26 letters', name: 'Alphabets' },
];
const byId = new Map(VOCABULARY.map((w) => [w.id, w]));
/** The right answer for the question on screen, from the vocabulary data. */
const rightAnswer = (kind, word) =>
  ({
    'en-de': germanTerm(word),
    'de-en': word.english.split(' / ')[0].replace(/\s*\([^)]*\)/g, '').trim() || word.english,
    phrase: word.german.split(' ').at(-1).replace(/[.!?]+$/, ''),
    'letter-name': word.german,
    'letter-audio': word.english,
  })[kind];
const currentQuestion = async (p) => {
  const q = p.locator('.test-question');
  return { kind: await q.getAttribute('data-kind'), word: byId.get(await q.getAttribute('data-word-id')) };
};
const openTest = async (p, label) => {
  await p.getByRole('button', { name: label }).click();
  await p.waitForSelector('.card');
  await p.locator('.test-button').click();
  await p.getByTestId('unit-test').waitFor();
};

await step('answer checking: article, umlauts and ß required; spaces, case and final punctuation forgiven; polite Sie kept', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  const wrong = await p.evaluate(async () => {
    const { wordsInUnit } = await import('/src/data/vocabulary.ts');
    const { buildTest, isCorrect } = await import('/src/data/unitTest.ts');
    const find = (u, kind, pred) => {
      for (let i = 0; i < 500; i++) {
        const q = buildTest(wordsInUnit(u), 999, true).find((x) => x.kind === kind && pred(x));
        if (q) return q;
      }
      throw new Error(`no ${kind}`);
    };
    const cases = [
      [4, 'en-de', (q) => q.word.german === 'Frühstück', { 'das Frühstück': true, '  das frühstück  ': true, 'DAS FRÜHSTÜCK': true, Frühstück: false, 'der Frühstück': false, 'das Fruhstuck': false, 'das Fruehstueck': false }],
      [4, 'en-de', (q) => q.word.german === 'Käse', { 'der Käse': true, 'der Kase': false }],
      [4, 'en-de', (q) => q.word.german === 'Öl', { 'das Öl': true, 'das öl': true, 'das Ol': false }],
      [2, 'en-de', (q) => q.word.german === 'Straße', { 'die Straße': true, 'die Strasse': false }],
      [4, 'en-de', (q) => q.word.german === 'Das ist alles.', { 'Das ist alles.': true, 'das ist alles': true, 'Das ist alle.': false }],
      [1, 'en-de', (q) => q.word.german === 'Wie heißen Sie?', { 'Wie heißen Sie?': true, 'wie heißen Sie': true, 'Wie heißen sie?': false, 'Wie heissen Sie?': false }],
      [2, 'en-de', (q) => q.word.english === 'you (formal)', { Sie: true, sie: false }],
      [4, 'de-en', (q) => q.word.german === 'Banane', { banana: true, ' Banana ': true, 'a banana': true, bananas: false }],
      [3, 'de-en', (q) => q.word.german === 'Rathaus', { 'town hall': true, 'city hall': true, hall: false }],
      [2, 'de-en', (q) => q.word.english === 'she', { she: true, they: true, you: false }],
      [1, 'phrase', (q) => q.word.german === 'Ich verstehe nicht.', { nicht: true, Nicht: true, nich: false }],
      [1, 'phrase', (q) => q.word.german === 'Wo wohnen Sie?', { Sie: true, sie: false }],
      [0, 'letter-name', (q) => q.word.english === 'J', { Yott: true, jott: true, Jot: true, J: false }],
      [0, 'letter-audio', (q) => q.word.english === 'W', { w: true, W: true, Veh: false, '': false }],
    ];
    const out = [];
    for (const [u, kind, pred, answers] of cases) {
      const q = find(u, kind, pred);
      for (const [answer, expected] of Object.entries(answers))
        if (isCorrect(q, answer) !== expected) out.push(`${q.prompt} ${JSON.stringify(answer)} should be ${expected}`);
    }
    return out;
  });
  assert.deepEqual(wrong, []);
  await p.context().close();
});

await step('every unit has its own test: typed answers only, Quick 10 / Standard 20 / Full = every word once', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  for (const { n, label, name } of TEST_UNITS) {
    await p.getByRole('button', { name: label }).click();
    await p.waitForSelector(`.card-slot[data-unit="${n}"]`);
    await p.locator('.test-button').click();
    assert.equal(await p.locator('#test-title').textContent(), `${name} Test`);
    const total = wordsInUnit(n).length;
    assert.deepEqual(
      (await p.locator('.test-length').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()),
      ['Quick Test 10 questions', 'Standard Test 20 questions', `Full Test ${total} questions`],
    );
    assert.equal(await p.locator('.card-slot').count(), 0, 'cards are replaced by the test');
    assert.equal(await p.locator('.dock').count(), 0, 'card dock hidden during the test');
    await p.getByRole('button', { name: /Full Test/ }).click();
    const seen = [];
    for (let i = 0; i < total; i++) {
      assert.match(await p.locator('.test .progress__caption').innerText(), new RegExp(`Question ${i + 1} of ${total}`));
      const { kind, word } = await currentQuestion(p);
      seen.push(word.id);
      assert.equal(word.unit, n, `question ${i + 1} is from ${name}`);
      assert.ok(n === 0 ? kind.startsWith('letter') : !kind.startsWith('letter'), `format ${kind}`);
      assert.equal(await p.locator('.test-question input').count(), 1, 'one text box');
      assert.equal(await p.locator('.test-question input').getAttribute('type'), 'text');
      assert.equal(await p.locator('.test select, .test [type=radio], .test [type=checkbox], .test datalist, .test [role=listbox], .test [role=radio]').count(), 0, 'no options or word banks');
      assert.equal(await p.locator('.test-question input').inputValue(), '', 'empty box');
      if (i < total - 1) await p.getByRole('button', { name: 'Next →' }).click();
    }
    assert.equal(new Set(seen).size, total, 'every word once, no duplicates');
    p.once('dialog', (d) => d.accept());
    await p.getByRole('button', { name: 'Exit test without saving' }).click();
    for (const [length, count] of [['Quick Test', 10], ['Standard Test', 20]]) {
      await p.locator('.test-button').click();
      await p.getByRole('button', { name: new RegExp(length) }).click();
      assert.match(await p.locator('.test .progress__caption').innerText(), new RegExp(`Question 1 of ${count}`));
      await p.getByRole('button', { name: 'Exit test without saving' }).click();
    }
    assert.equal(await p.locator('.card-slot').count(), total, 'back on the cards');
  }
  await p.context().close();
});

await step('test Enter: next question only – empty box or held Enter never skips, last question never submits, no card actions', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  await openTest(p, 'Unit 4, 43 words');
  await p.getByRole('button', { name: /Quick Test/ }).click();
  const caption = () => p.locator('.test .progress__caption').innerText();
  await p.keyboard.press('Enter');
  assert.match(await caption(), /Question 1 of 10/, 'Enter on an empty box stays');
  await p.keyboard.type('erste Antwort');
  await p.keyboard.press('Enter');
  assert.match(await caption(), /Question 2 of 10/);
  assert.ok(await p.locator('.test-question input').evaluate((el) => el === document.activeElement), 'box focused');
  await p.keyboard.type('zweite');
  await p.keyboard.down('Enter');
  await p.keyboard.down('Enter'); // held
  await p.keyboard.down('Enter');
  await p.keyboard.up('Enter');
  assert.match(await caption(), /Question 3 of 10/, 'held Enter moves one question only');
  await p.getByRole('button', { name: '← Previous' }).click();
  assert.equal(await p.locator('.test-question input').inputValue(), 'zweite', 'answers are kept – review and change before submitting');
  for (let i = 2; i < 10; i++) {
    await p.getByRole('button', { name: 'Next →' }).click();
    await p.locator('.test-question input').fill(`antwort ${i}`);
  }
  assert.match(await caption(), /Question 10 of 10/);
  await p.locator('.test-question input').press('Enter');
  await p.waitForTimeout(200);
  assert.equal(await p.getByTestId('unit-test').getAttribute('data-phase'), 'running', 'Enter on the last question does not submit');
  assert.ok(await p.getByRole('button', { name: 'Submit Test' }).evaluate((el) => el === document.activeElement), 'Submit Test is focused instead');
  await p.keyboard.down('Enter');
  await p.keyboard.down('Enter'); // a held Enter on Submit must not submit by repeat
  await p.keyboard.up('Enter');
  await p.waitForTimeout(200);
  assert.equal(await p.getByTestId('unit-test').getAttribute('data-phase'), 'results', 'one deliberate Enter on Submit submits');
  assert.equal((await speakCalls(p)).length, 0, 'no audio');
  const stored = JSON.parse(await p.evaluate(() => localStorage.getItem('deutsch-lernen:tests')));
  assert.equal(stored['4'].attempts, 1, 'submitted exactly once');
  await p.context().close();
});

await step('unanswered questions: Submit asks first; cancelling keeps the test running', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  await openTest(p, 'Unit 3, 28 words');
  await p.getByRole('button', { name: /Quick Test/ }).click();
  await p.locator('.test-question input').fill('der Platz');
  let message = '';
  p.once('dialog', (d) => {
    message = d.message();
    d.dismiss();
  });
  await p.getByRole('button', { name: 'Submit Test' }).click();
  await p.waitForTimeout(200);
  assert.match(message, /9 of 10 questions have no answer/);
  assert.equal(await p.getByTestId('unit-test').getAttribute('data-phase'), 'running');
  await p.context().close();
});

await step('results: totals, correct / incorrect, score and % are exact; every answer and correct answer shown', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  await p.evaluate(() => localStorage.clear());
  await p.reload();
  await openTest(p, 'Unit 4, 43 words');
  await p.getByRole('button', { name: /Full Test/ }).click();
  const typed = [];
  let expectedCorrect = 0;
  for (let i = 0; i < 43; i++) {
    const { kind, word } = await currentQuestion(p);
    const right = rightAnswer(kind, word);
    let answer;
    if (i % 4 === 3) answer = kind === 'en-de' && word.article ? word.german : 'falsch'; // article missing / wrong
    else {
      answer = i % 2 ? `  ${right.toUpperCase()}  ` : right; // spaces and case forgiven
      expectedCorrect++;
    }
    typed.push({ answer: answer.trim(), right, correct: i % 4 !== 3, kind });
    await p.locator('.test-question input').fill(answer);
    if (i < 42) await p.keyboard.press('Enter');
  }
  await p.getByRole('button', { name: 'Submit Test' }).click();
  const results = p.getByTestId('test-results');
  await results.waitFor();
  const stat = (name) => results.locator(`[data-stat="${name}"]`).innerText();
  const percent = Math.round((expectedCorrect / 43) * 100);
  assert.equal(await stat('total'), '43');
  assert.equal(await stat('correct'), String(expectedCorrect));
  assert.equal(await stat('incorrect'), String(43 - expectedCorrect));
  assert.equal(await stat('score'), `${expectedCorrect} / 43 · ${percent}%`);
  assert.match(await results.locator('.test-results__verdict').innerText(), expectedCorrect / 43 >= 0.8 ? /Passed/ : /Not passed yet/);
  const items = results.locator('.test-review__item');
  assert.equal(await items.count(), 43);
  for (let i = 0; i < 43; i++) {
    const item = items.nth(i);
    assert.equal(await item.getAttribute('data-correct'), String(typed[i].correct), `question ${i + 1} marked`);
    assert.equal(await item.locator('.test-review__answer').innerText(), typed[i].answer, `question ${i + 1} your answer`);
  }
  assert.equal(await results.locator('.test-review__item.is-wrong').count(), 43 - expectedCorrect);
  assert.equal(await results.getByTestId('practise-again').locator('li').count(), 43 - expectedCorrect, 'words to practise again');
  // Review Mistakes shows only the wrong ones; Show All Answers brings the rest back.
  await p.getByRole('button', { name: 'Review Mistakes' }).click();
  assert.equal(await items.count(), 43 - expectedCorrect);
  assert.equal(await results.locator('.test-review__item.is-correct').count(), 0);
  await p.getByRole('button', { name: 'Show All Answers' }).click();
  assert.equal(await items.count(), 43);
  await shot(p, 'test-results');
  await p.context().close();
});

await step('history per unit: latest, best, attempts, date and mistakes kept; retakes and reloads keep them; units independent', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  await p.evaluate(() => localStorage.clear());
  await p.reload();
  await openTest(p, 'Unit 4, 43 words');
  assert.match(await p.getByTestId('unit-test').innerText(), /No attempts yet/);
  const runQuick = async (rightCount) => {
    for (let i = 0; i < 10; i++) {
      const { kind, word } = await currentQuestion(p);
      await p.locator('.test-question input').fill(i < rightCount ? rightAnswer(kind, word) : 'falsch');
      if (i < 9) await p.keyboard.press('Enter');
    }
    await p.getByRole('button', { name: 'Submit Test' }).click();
    await p.getByTestId('test-results').waitFor();
  };
  await p.getByRole('button', { name: /Quick Test/ }).click();
  await runQuick(9); // 90 %
  await p.getByRole('button', { name: 'Retake Test' }).click();
  assert.match(await p.locator('.test .progress__caption').innerText(), /Question 1 of 10/, 'retake: same length, fresh answers');
  assert.equal(await p.locator('.test-question input').inputValue(), '');
  await runQuick(4); // 40 %
  const stored = JSON.parse(await p.evaluate(() => localStorage.getItem('deutsch-lernen:tests')))['4'];
  assert.equal(stored.attempts, 2);
  assert.deepEqual([stored.latest.percent, stored.best.percent], [40, 90]);
  assert.equal(stored.mistakes.length, 6, 'mistakes of the latest attempt');
  assert.ok(Date.now() - Date.parse(stored.latest.date) < 600000, 'attempt date saved');
  await p.getByRole('button', { name: 'Return to Unit' }).click();
  assert.equal(await p.locator('.card-slot').count(), 43, 'Return to Unit shows the cards');
  assert.match(await p.locator('.test-button').innerText(), /best 90%/);
  // Starting and leaving a new attempt changes nothing.
  await p.locator('.test-button').click();
  await p.getByRole('button', { name: /Quick Test/ }).click();
  await p.getByRole('button', { name: 'Exit test without saving' }).click();
  await p.reload();
  await p.waitForSelector('.card');
  await openTest(p, 'Unit 4, 43 words');
  const history = (await p.getByTestId('test-history').innerText()).replace(/\s+/g, ' ');
  assert.match(history, /Latest 40% \(4\/10\)/i);
  assert.match(history, /Best 90% \(9\/10\)/i);
  assert.match(history, /Attempts 2/i);
  assert.match(history, /Last attempt \S+/i);
  assert.match(history, /Mistakes last time/);
  await p.getByRole('button', { name: '← Back to cards' }).click();
  await p.getByRole('button', { name: 'Unit 3, 28 words' }).click();
  await p.locator('.test-button').click();
  assert.match(await p.getByTestId('unit-test').innerText(), /No attempts yet/, 'Unit 3 has its own (empty) history');
  await p.context().close();
});

await step('Alphabets test: German letter names, and letters by ear from the German voice – all typed', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  await openTest(p, 'Alphabets, 26 letters');
  await p.getByRole('button', { name: /Full Test/ }).click();
  const kinds = new Set();
  for (let i = 0; i < 26; i++) {
    const { kind, word } = await currentQuestion(p);
    kinds.add(kind);
    if (kind === 'letter-name') {
      assert.equal(await p.locator('.test-question__prompt').innerText(), `The German name of ${word.english} is ______.`);
    } else {
      const prompt = await p.locator('.test-question').innerText();
      assert.ok(!prompt.includes(word.german) && !prompt.includes(word.say), 'the name is only heard, never shown');
      await p.locator('.test-question .audio-button--normal').click();
      await p.waitForTimeout(40);
      const last = (await speakCalls(p)).at(-1);
      assert.deepEqual([last.text, last.lang, last.voice], [spokenText(word), 'de-DE', 'Anna'], `plays the German name of ${word.english}`);
      await p.evaluate(() => window.__finishSpeech());
    }
    await p.locator('.test-question input').fill(rightAnswer(kind, word));
    if (i < 25) await p.keyboard.press('Enter');
  }
  assert.deepEqual([...kinds].sort(), ['letter-audio', 'letter-name']);
  await p.getByRole('button', { name: 'Submit Test' }).click();
  assert.equal(await p.getByTestId('test-results').locator('[data-stat="score"]').innerText(), '26 / 26 · 100%');
  await p.context().close();
});

for (const vp of [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-820', width: 820, height: 1180, touch: true },
  { name: 'mobile-360', width: 360, height: 740, touch: true, mobile: true },
]) {
  await step(`test layout ${vp.name}: no horizontal scroll; tappable buttons and answer box`, async () => {
    const p = await openApp({ viewport: { width: vp.width, height: vp.height }, init: FAKE_SPEECH, touch: !!vp.touch, mobile: !!vp.mobile });
    await p.locator('.test-button').click();
    const overflow = () => p.evaluate((w) => document.documentElement.scrollWidth - w, vp.width);
    assert.ok((await overflow()) <= 0, 'start screen fits');
    await p.getByRole('button', { name: /Quick Test/ }).click();
    assert.ok((await overflow()) <= 0, 'question fits');
    const heights = await p.evaluate(() =>
      [...document.querySelectorAll('.test-question__input, .test__nav button')].map((el) => Math.round(el.getBoundingClientRect().height)),
    );
    assert.ok(heights.every((h) => h >= 44), `tap targets ${heights}`);
    for (let i = 0; i < 10; i++) {
      await p.locator('.test-question input').fill('x');
      if (i < 9) await p.getByRole('button', { name: 'Next →' }).click();
    }
    await p.getByRole('button', { name: 'Submit Test' }).click();
    assert.ok((await overflow()) <= 0, 'results fit');
    await shot(p, `test-${vp.name}`);
    await p.context().close();
  });
}

// ============================================================== touch
console.log('Touch');
await step('tap → German, tap again → English; no hover flip-back on touch', async () => {
  const p = await openApp({ viewport: { width: 390, height: 844 }, init: FAKE_SPEECH, mobile: true });
  const t = helpers(p);
  await t.frontFlip(0).tap();
  await p.waitForTimeout(700);
  assert.equal(await t.flipped(0), true);
  await p.locator('.unit__title').tap(); // tap somewhere else
  await p.waitForTimeout(700);
  assert.equal(await t.flipped(0), true, 'stays German without hover');
  await t.slot(1).scrollIntoViewIfNeeded();
  await t.frontFlip(1).tap();
  await p.waitForTimeout(700);
  assert.equal(await t.flipped(1), true);
  assert.equal(await t.flipped(0), true, 'tapping another card does not flip the first back');
  await t.backFlip(0).tap();
  await p.waitForTimeout(700);
  assert.equal(await t.flipped(0), false, 'second tap → English');
  // Speaking Practice by touch
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.locator('.practice__button').tap();
  const first = (await p.evaluate(() => window.__speechCalls)).find((c) => c.type === 'speak');
  assert.deepEqual([first.text, first.lang], ['place', 'en-US']);
  await p.context().close();
});

console.log('Speaking Practice – the words currently shown');
await step('Travel category: exactly its 3 words, each English ×1 → 3 s → German ×5, then 3 / 3 complete', async () => {
  const p = await openApp({ init: FAKE_SPEECH, initArg: { autoFinishMs: 10 } });
  await p.locator('.chip', { hasText: 'Travel' }).click();
  assert.match((await p.getByTestId('practice-status').innerText()).replace(/\s+/g, ' '), /3 words shown/);
  await p.locator('.practice__button').click();
  await p.waitForTimeout(150);
  assert.match((await p.getByTestId('practice-status').innerText()).replace(/\s+/g, ' '), /Word 1 \/ 3 · Transport/);
  await p.waitForFunction(() => document.querySelector('[data-testid="practice-status"]')?.textContent.includes('Complete'), null, {
    timeout: 60000,
  });
  const spoken = (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak');
  assert.deepEqual(
    spoken.map((c) => c.text),
    [
      'transport', ...Array(5).fill('das Verkehrsmittel'),
      'ship', ...Array(5).fill('das Schiff'),
      'to travel, go by vehicle', ...Array(5).fill('fahren'),
    ],
  );
  const ends = await p.evaluate(() => window.__speechEnds);
  for (const w of [0, 1, 2]) {
    const englishEnd = ends.find((e) => e.text === spoken[w * 6].text).t;
    const gap = spoken[w * 6 + 1].t - englishEnd;
    assert.ok(gap >= 3390 && gap < 3800, `word ${w + 1}: 3 s pause after English onend (${gap}ms)`);
  }
  assert.match((await p.getByTestId('practice-status').innerText()).replace(/\s+/g, ' '), /3 \/ 3 words completed/);
  assert.equal(await p.locator('.card-slot').count(), 3, 'filter kept');
  assert.match(await p.locator('.chip.is-selected').innerText(), /Travel/);
  await p.context().close();
});

await step('search and "only unlearned" decide the words; the list is a snapshot taken at Start', async () => {
  const p = await openApp({ init: FAKE_SPEECH });
  const status = async () => (await p.getByTestId('practice-status').innerText()).replace(/\s+/g, ' ');
  // Search
  await p.getByRole('searchbox', { name: /Search vocabulary/ }).fill('jahres');
  assert.match(await status(), /2 words shown/);
  await p.locator('.practice__button').click();
  assert.match(await status(), /Word 1 \/ 2 · Seasons/);
  await p.getByRole('button', { name: /Stop Practice/ }).first().click();
  await p.getByRole('searchbox', { name: /Search vocabulary/ }).fill('');
  // Only unlearned
  await p.getByRole('button', { name: 'Mark der Platz as learned' }).click();
  await p.getByRole('switch', { name: /Show only unlearned/ }).click();
  await p.waitForTimeout(1300);
  assert.equal(await p.locator('.card-slot').count(), 27);
  await p.evaluate(() => (window.__speechCalls.length = 0));
  await p.locator('.practice__button').click();
  assert.equal((await p.evaluate(() => window.__speechCalls)).find((c) => c.type === 'speak').text, 'building');
  assert.match(await status(), /Word 1 \/ 27 · Building/);
  // Marking a lesson word learned mid-lesson keeps its card (snapshot) until the lesson ends.
  await p.getByRole('button', { name: 'Mark das Schiff as learned' }).click();
  await p.waitForTimeout(1500);
  assert.equal(await p.locator('.card-slot').count(), 27, 'snapshot cards stay while practising');
  assert.match(await status(), /Word 1 \/ 27/);
  await p.getByRole('button', { name: /Stop Practice/ }).first().click();
  await p.waitForTimeout(300);
  assert.equal(await p.locator('.card-slot').count(), 26, 'filter applies again after the lesson');
  await p.context().close();
});

console.log('Speaking Practice – complete Unit 3 lesson');
await step('one click plays all 28 words in order (English ×1 + German ×5 each), then Unit 3 Complete', async () => {
  const p = await openApp({ init: FAKE_SPEECH, initArg: { autoFinishMs: 10 } });
  // Record which card is current over time, to prove the UI follows the lesson.
  await p.evaluate(() => {
    window.__seen = [];
    setInterval(() => {
      const id = document.querySelector('.card-slot[aria-current="true"]')?.dataset.wordId;
      if (id && window.__seen.at(-1) !== id) window.__seen.push(id);
    }, 40);
  });
  const t0 = Date.now();
  await p.locator('.practice__button').click(); // the ONLY click
  await p.waitForFunction(
    () => document.querySelector('[data-testid="practice-status"]')?.textContent.includes('Unit 3 Speaking Practice Complete'),
    null,
    { timeout: 360000 },
  );
  console.log(`    (lesson took ${((Date.now() - t0) / 1000).toFixed(0)}s with instant speech)`);
  const spoken = (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak');
  const expected = EXPECTED.flatMap(([german, english]) => [
    `en-US|1|Samantha|${english.split(' / ').join(', ')}`,
    ...Array(5).fill(`de-DE|0.7|Anna|${german}`),
  ]);
  assert.equal(spoken.length, 28 * 6);
  assert.deepEqual(
    spoken.map((c) => `${c.lang}|${c.rate}|${c.voice}|${c.text}`),
    expected,
    'every word: English once, then its German term five times – in Unit 3 order',
  );
  assert.ok(spoken.every((c) => c.speakingAtCall === false), 'no overlapping speech');
  // Every word: German starts only after English onend + 3 s pause (+ 0.4 s after the flip).
  const ends = await p.evaluate(() => window.__speechEnds);
  for (let w = 0; w < 28; w++) {
    const englishEnd = ends.filter((e) => e.text === spoken[w * 6].text).at(-1).t;
    const gap = spoken[w * 6 + 1].t - englishEnd;
    assert.ok(gap >= 3390 && gap < 3800, `word ${w + 1}: English end → first German ${gap}ms`);
  }
  assert.deepEqual(await p.evaluate(() => window.__seen), wordsInUnit(3).map((w) => w.id), 'cards advanced 1 → 28');
  const status = (await p.getByTestId('practice-status').textContent()).replace(/\s+/g, ' ');
  assert.match(status, /✓ Unit 3 Speaking Practice Complete/);
  assert.match(status, /28 \/ 28 words completed/);
  assert.match(await p.locator('.practice__button').innerText(), /Practice Again/);
  assert.equal(await p.locator('.dock__position').textContent(), '28 / 28');
  assert.equal(await p.locator('.card.is-flipped').count(), 0, 'Word 28 flipped back to English');
  await p.waitForTimeout(1500);
  assert.equal(
    (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak').length,
    28 * 6,
    'speech stops after Word 28 – no restart',
  );
  // Practice Again restarts at Word 1.
  await p.evaluate(() => {
    window.__autoFinishMs = 0;
    window.__speechCalls.length = 0;
  });
  await p.locator('.practice__button').click();
  const again = (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak');
  assert.deepEqual(
    again.map((c) => c.text),
    ['place'],
  );
  await p.waitForTimeout(150);
  assert.match((await p.getByTestId('practice-status').textContent()).replace(/\s+/g, ' '), /Word 1 \/ 28/);
  assert.equal(await p.locator('.dock__position').textContent(), '1 / 28');
  await p.context().close();
});

// ======================================================== real voices
console.log('Real browser speech');
await step('the browser exposes a German voice and the app selects it', async () => {
  const p = await openApp();
  const voices = await p.evaluate(
    () =>
      new Promise((resolve) => {
        const list = speechSynthesis.getVoices();
        if (list.length) return resolve(list.map((v) => `${v.name}|${v.lang}`));
        speechSynthesis.addEventListener('voiceschanged', () =>
          resolve(speechSynthesis.getVoices().map((v) => `${v.name}|${v.lang}`)),
        );
        setTimeout(() => resolve([]), 3000);
      }),
  );
  const german = voices.filter((v) => /\|de/i.test(v));
  await p.waitForTimeout(300);
  const note = await p.getByTestId('voice-note').textContent();
  console.log(`    (${voices.length} voices, ${german.length} German; app: "${note}")`);
  if (german.length) assert.match(note, /Pronunciation voice: .+ \(de[-_]/i);
  else assert.match(note, /No German voice found/);
  // Real speak call: the button must return to "Listen" (end event or watchdog).
  await p.locator('.card__face--front .card__flip').first().click();
  await p.waitForTimeout(650);
  await p.locator('.audio-button--normal').first().click();
  await p.waitForFunction(() => document.querySelector('.audio-button--normal')?.textContent.includes('Listen'), null, {
    timeout: 25000,
  });
  await p.locator('.audio-button--slow').first().click();
  await p.waitForFunction(
    () => document.querySelector('.audio-button--slow')?.textContent.includes('Slow Listen'),
    null,
    { timeout: 25000 },
  );
  await p.context().close();
});

await step('real browser speech: lesson advances to Word 2 by itself; Stop silences it', async () => {
  const p = await openApp();
  await p.waitForTimeout(500);
  await p.locator('.practice__button').click();
  const seen = new Set();
  const deadline = Date.now() + 60000;
  let status = '';
  while (Date.now() < deadline && !/Word 2 \/ 28.*German pronunciation 1 \/ 5/.test(status)) {
    status = (await p.getByTestId('practice-status').innerText()).replace(/\s+/g, ' ').trim();
    seen.add(status);
    if (/words shown/.test(status)) break; // aborted
    await p.waitForTimeout(100);
  }
  const log = [...seen].join(' | ');
  assert.match(status, /Word 2 \/ 28/, `statuses seen: ${log}`);
  for (let rep = 1; rep <= 5; rep++)
    assert.ok([...seen].some((x) => x.includes(`Word 1 / 28 · Place German pronunciation ${rep} / 5`)), `Word 1, rep ${rep}`);
  assert.ok([...seen].some((x) => x.includes('Moving to next word')), 'moving to next word');
  assert.ok([...seen].some((x) => x.includes('Word 1 / 28 · Place ⏱ 3-second pause')), '3-second pause after English');
  await p.getByRole('button', { name: /Stop Practice/ }).first().click();
  await p.waitForTimeout(800);
  assert.deepEqual(await p.evaluate(() => [speechSynthesis.speaking, speechSynthesis.pending]), [false, false]);
  assert.match(await p.getByTestId('practice-status').textContent(), /words shown/);
  assert.equal(await p.locator('.card.is-flipped').count(), 0);
  await p.context().close();
});

await step('voice detection adapts to other computers (no hard-coded names)', async () => {
  const scenarios = [
    {
      name: 'Windows-style list',
      voices: [
        { name: 'Microsoft David - English (United States)', lang: 'en-US', localService: true, default: true },
        { name: 'Microsoft Michael - German (Austria)', lang: 'de-AT', localService: true, default: false },
        { name: 'Microsoft Katja - German (Germany)', lang: 'de-DE', localService: true, default: false },
      ],
      expected: 'Microsoft Katja - German (Germany)',
    },
    {
      name: 'only a non-de-DE German voice (Android-style de_AT)',
      voices: [
        { name: 'English', lang: 'en_US', localService: true, default: true },
        { name: 'Deutsch (Österreich)', lang: 'de_AT', localService: true, default: false },
      ],
      expected: 'Deutsch (Österreich)',
    },
    {
      name: 'system default German voice preferred',
      voices: [
        { name: 'Voice A', lang: 'de-DE', localService: true, default: false },
        { name: 'Voice B', lang: 'de-DE', localService: true, default: true },
      ],
      expected: 'Voice B',
    },
    { name: 'no German voice', voices: [{ name: 'Samantha', lang: 'en-US', localService: true, default: true }], expected: null },
  ];
  for (const sc of scenarios) {
    const p = await openApp({ init: FAKE_SPEECH, initArg: { voices: sc.voices } });
    await p.locator('.card__face--front .card__flip').first().click();
    await p.waitForTimeout(650);
    await p.locator('.audio-button--normal').first().click();
    await p.evaluate(() => window.__finishSpeech());
    await p.locator('.audio-button--slow').first().click();
    const speaks = (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak');
    assert.deepEqual(
      speaks.map((c) => [c.voice, c.lang]),
      [
        [sc.expected, 'de-DE'],
        [sc.expected, 'de-DE'],
      ],
      sc.name,
    );
    const note = await p.getByTestId('voice-note').textContent();
    if (sc.expected) assert.ok(note.includes(sc.expected), `${sc.name}: ${note}`);
    else assert.match(note, /No German voice found/);
    await p.context().close();
  }
});

await step('without speech support: message shown, cards still work', async () => {
  const p = await openApp({ init: NO_SPEECH });
  await p.locator('.card__face--front .card__flip').first().click();
  await p.waitForTimeout(650);
  assert.ok(await p.getByText('Audio is not available in this browser.').first().isVisible());
  assert.equal(await p.locator('.audio-button').count(), 0);
  await p.locator('.card__face--back .card__flip').first().click();
  await p.getByRole('button', { name: 'Next card' }).click();
  assert.equal(await p.locator('.dock__position').textContent(), '2 / 28');
  await p.context().close();
});

// ========================================================= responsive
console.log('Responsive');
const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, perRow: 4 },
  { name: 'laptop-1280', width: 1280, height: 800, perRow: 4 },
  { name: 'laptop-1024', width: 1024, height: 768, perRow: 3 },
  { name: 'tablet-820', width: 820, height: 1180, perRow: 2, touch: true },
  { name: 'mobile-390', width: 390, height: 844, perRow: 1, touch: true },
  { name: 'mobile-360', width: 360, height: 740, perRow: 1, touch: true },
];

for (const vp of viewports) {
  await step(`${vp.name}: ${vp.perRow}/row, no horizontal scroll, words fit, tappable`, async () => {
    const p = await openApp({
      viewport: { width: vp.width, height: vp.height },
      init: FAKE_SPEECH,
      mobile: !!vp.touch && vp.width < 700,
      touch: !!vp.touch,
    });
    await p.waitForTimeout(1000);
    // Flip everything so the German side is measured too.
    await p.evaluate(() => document.querySelectorAll('.card__face--front .card__flip').forEach((b) => b.click()));
    await p.waitForTimeout(800);
    const info = await p.evaluate((deviceWidth) => {
      const slots = [...document.querySelectorAll('.card-slot')];
      const firstTop = Math.round(slots[0].getBoundingClientRect().top);
      // Layout size (ignores the decorative tilt transform).
      const card = slots[0].querySelector('.card');
      const r = { width: card.offsetWidth, height: card.offsetHeight };
      const overflowing = [...document.querySelectorAll('.term__word, .card__english')]
        .filter((el) => el.scrollWidth > el.parentElement.clientWidth + 1 || el.getBoundingClientRect().height > 80)
        .map((el) => el.textContent);
      const search = document.querySelector('.search').getBoundingClientRect();
      return {
        // On phones an over-wide page silently enlarges the layout viewport,
        // so compare against the real device width rather than innerWidth.
        overflow: document.documentElement.scrollWidth - deviceWidth,
        layoutViewport: window.innerWidth,
        perRow: slots.filter((s) => Math.abs(s.getBoundingClientRect().top - firstTop) < 4).length,
        cardW: Math.round(r.width),
        cardH: Math.round(r.height),
        dockW: Math.round(document.querySelector('.dock').getBoundingClientRect().width),
        searchRight: Math.round(search.right),
        listenH: Math.round(document.querySelector('.audio-button--normal').getBoundingClientRect().height),
        slowH: Math.round(document.querySelector('.audio-button--slow').getBoundingClientRect().height),
        // What a tap on Listen / on the German word actually hits (first card in view).
        hits: (() => {
          const at = (el) => {
            el.scrollIntoView({ block: 'center' });
            const r = el.getBoundingClientRect();
            return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('button')?.className;
          };
          return {
            listen: at(document.querySelector('.audio-button--normal')),
            slow: at(document.querySelector('.audio-button--slow')),
            word: at(document.querySelector('.term__word')),
          };
        })(),
        overflowing,
        // German side: picture, word block and hint must not overlap.
        collisions: [...document.querySelectorAll('.card__face--back')]
          .filter((face) => {
            const img = face.querySelector('.card__image').getBoundingClientRect();
            const term = face.querySelector('.term').getBoundingClientRect();
            const audio = face.querySelector('.card__audio').getBoundingClientRect();
            const hint = face.querySelector('.card__hint').getBoundingClientRect();
            // Example sentences sit between the audio buttons and the hint, fully shown (no scrolling).
            const examples = face.querySelector('.card__examples');
            const ex = examples?.getBoundingClientRect();
            return (
              term.top < img.bottom + 2 ||
              audio.bottom > hint.top + 6 ||
              hint.bottom > face.getBoundingClientRect().bottom ||
              (examples && (audio.bottom > ex.top || ex.bottom > hint.top + 6 || examples.scrollHeight > examples.clientHeight + 1))
            );
          })
          .map((face) => face.querySelector('.term').textContent),
      };
    }, vp.width);
    assert.ok(info.overflow <= 0, `horizontal overflow ${info.overflow}px`);
    assert.equal(info.layoutViewport, vp.width, 'layout viewport matches device width');
    assert.ok(info.searchRight <= vp.width, `search fits (${info.searchRight})`);
    assert.equal(info.perRow, vp.perRow, `cards per row (${JSON.stringify(info)})`);
    assert.ok(info.dockW <= vp.width - 16, `dock fits (${info.dockW}px)`);
    assert.deepEqual(info.overflowing, [], 'every word fits on its card');
    assert.deepEqual(info.collisions, [], 'German side content does not overlap');
    const minTarget = vp.touch ? 44 : 36;
    assert.ok(info.listenH >= minTarget && info.slowH >= minTarget, `audio tap targets ${info.listenH}/${info.slowH}px`);
    assert.ok(info.slowH <= info.listenH, 'Slow Listen is not bigger than Listen');
    assert.deepEqual(
      info.hits,
      { listen: 'audio-button audio-button--normal', slow: 'audio-button audio-button--slow', word: 'card__flip' },
      'tap targets',
    );
    if (vp.width <= 480) {
      assert.equal(info.cardW, vp.width - 40, `mobile card = 100vw - 40px (${info.cardW})`);
    } else {
      assert.ok(info.cardW >= 270 && info.cardW <= 330, `card width ${info.cardW}`);
      assert.ok(info.cardH >= 470 && info.cardH <= 640, `card height ${info.cardH}`);
    }
    if (vp.touch) {
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.locator('.card__face--back .card__flip').first().tap();
      await p.waitForTimeout(700);
      await p.locator('.card__face--front .card__flip').first().tap();
      await p.waitForTimeout(700);
      assert.ok(await p.locator('.card__face--back .hint-touch').first().isVisible(), 'touch hint shown');
      await p.locator('.audio-button--normal').first().tap();
      await p.locator('.audio-button--slow').first().tap();
      await p.waitForTimeout(150);
      const rates = (await p.evaluate(() => window.__speechCalls)).filter((c) => c.type === 'speak').map((c) => c.rate);
      assert.deepEqual(rates, [0.85, 0.55], 'both audio buttons work by touch');
      const practiceH = await p.locator('.practice__button').evaluate((el) => el.getBoundingClientRect().height);
      assert.ok(practiceH >= 44, `Speaking Practice tap target ${practiceH}px`);
    }
    await p.evaluate(() => window.scrollTo(0, 0));
    await shot(p, `vp-${vp.name}`);
    await p.context().close();
  });
}

await browser.close();

if (errors.length) {
  console.error('Console / page errors:', errors);
  process.exitCode = 1;
} else {
  console.log('  ✓ no console errors');
}
console.log(`\n${passed} checks passed${process.exitCode ? ', some FAILED' : ''}.`);
