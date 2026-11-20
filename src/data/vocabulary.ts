/**
 * Vocabulary, organised by unit. Everything in the app (cards, counts,
 * categories, search, progress, Speaking Practice) follows the selected unit.
 *
 * To add a unit: create its word list (like `UNIT_3_WORDS`) and add one entry
 * to `UNIT_DEFINITIONS` at the bottom – e.g. `{ number: 4, title: 'German
 * Vocabulary', words: UNIT_4_WORDS }`. Units with no words show "Coming Soon".
 *
 * Each word entry:
 *   - `german` is the word without its article; `article` is der/die/das for nouns.
 *   - `english` is the meaning. Alternatives separated by " / " are shown smaller.
 *   - `images` are Fluent Emoji asset names (1, 2 or 4 of them). Run
 *     `npm run fetch-images` to download any that are missing into public/vocab/.
 *   - Two example sentences per word live in examples.ts, keyed by the word's id;
 *     the English of each word in them comes from glossary.ts.
 */
import { EXAMPLES, type WordGlosses } from './examples.ts';
import { GLOSSARY } from './glossary.ts';

export const CATEGORIES = ['Places', 'Travel', 'Directions', 'Time', 'Objects', 'Food', 'Other', 'Letters'] as const;

export type Category = (typeof CATEGORIES)[number];

/** Grammatical gender shown with nouns on the German side. */
export type Article = 'der' | 'die' | 'das';

export interface VocabWord {
  id: string;
  /** Unit number the word belongs to, e.g. 3. */
  unit: number;
  english: string;
  german: string;
  article?: Article;
  /** Short grammar hint, e.g. "plural" or "verb". */
  note?: string;
  /** Learner-friendly pronunciation guide (letters have none). Audio always uses de-DE speech synthesis. */
  pronunciation?: string;
  category: Category;
  /** Fluent Emoji asset names; files live in /public/vocab as <slug>.png. */
  images: string[];
  /** Shown large in the picture panel instead of `images`, e.g. "Aa". */
  glyph?: string;
  /** What Listen / Speaking Practice say when it differs from the German shown (a letter's name). */
  say?: string;
  /** Speaking Practice shows the front without reading it aloud (an English voice would say the English letter name). */
  silentFront?: boolean;
  /** Two short A1 example sentences, shown under Listen on the German side (letters have none). */
  sentences?: ExampleSentence[];
}

export interface ExampleSentence {
  german: string;
  english: string;
  /** The sentence split into words (with their English) and the text between them. */
  words: SentenceToken[];
}

export interface SentenceToken {
  text: string;
  /** English meaning of a word in this sentence, "meaning | note"; spaces, punctuation and numbers have none. */
  gloss?: string;
}

/** A word: letters, optionally joined by an apostrophe or hyphen ("geht's", "E-Mail"). */
const WORD = /\p{L}+(?:['’-]\p{L}+)*/gu;

/** Splits a sentence into words and the text between them; punctuation never sticks to a word. */
export function glossSentence(german: string, overrides: WordGlosses = {}): SentenceToken[] {
  const tokens: SentenceToken[] = [];
  let last = 0;
  for (const match of german.matchAll(WORD)) {
    const word = match[0];
    if (match.index > last) tokens.push({ text: german.slice(last, match.index) });
    tokens.push({ text: word, gloss: overrides[word] ?? GLOSSARY[word] ?? GLOSSARY[word.toLowerCase()] });
    last = match.index + word.length;
  }
  if (last < german.length) tokens.push({ text: german.slice(last) });
  return tokens;
}

type WordInput = Omit<VocabWord, 'id' | 'unit' | 'sentences'>;

export interface Unit {
  number: number;
  /** "Unit 3", or a section's own name ("Alphabets"). */
  name: string;
  title: string;
  /** Number of words in the unit (0 = "Coming Soon"). */
  wordCount: number;
  /** Badge in the unit selector: the word count, "soon", or e.g. "A–Z". */
  tag: string;
  /** What one card is called: "word" or "letter". */
  noun: string;
}

const UNIT_1_WORDS: WordInput[] = [
  { article: 'das', german: 'Butterbrot', english: 'butter bread', pronunciation: 'BUT-ter-broht', category: 'Food', images: ['Bread', 'Butter'] },
  { article: 'der', german: 'Kranke', english: 'sick person', pronunciation: 'KRAHN-kuh', category: 'Other', images: ['Face with thermometer'] },
  { german: 'italienisch', note: 'adjective', english: 'Italian', pronunciation: 'ee-tahl-YAY-nish', category: 'Other', images: ['Spaghetti'] },
  { article: 'das', german: 'Frühstück', english: 'breakfast', pronunciation: 'FRÜ-shtük', category: 'Food', images: ['Cooking'] },
  { article: 'die', german: 'Autobahn', english: 'highway', pronunciation: 'OW-toh-bahn', category: 'Travel', images: ['Motorway'] },
  { article: 'das', german: 'Würstchen', english: 'sausage', pronunciation: 'VÜRST-khen', category: 'Food', images: ['Hot dog'] },
  { article: 'der', german: 'Walzer', english: 'dance / waltz', pronunciation: 'VAHL-tser', category: 'Other', images: ['Woman dancing', 'Man dancing'] },
  { article: 'der', german: 'Rucksack', english: 'backpack', pronunciation: 'ROOK-zahk', category: 'Travel', images: ['Backpack'] },
  { article: 'der', german: 'Anzug', english: 'suit / formal', pronunciation: 'AHN-tsook', category: 'Objects', images: ['Necktie'] },
  { german: 'Ihre Sprache', note: 'formal', english: 'your language', pronunciation: 'EE-ruh SHPRAH-khuh', category: 'Other', images: ['Speaking head'] },
  { article: 'die', german: 'Wörter', note: 'plural', english: 'words', pronunciation: 'VUR-ter', category: 'Other', images: ['Memo'] },
  { german: 'Wer bist du?', note: 'informal', english: 'who are you?', pronunciation: 'vehr bist doo', category: 'Other', images: ['Face with monocle'] },
  { german: 'hören', note: 'verb', english: 'hear', pronunciation: 'HUR-en', category: 'Other', images: ['Ear'] },
  { german: 'lesen', note: 'verb', english: 'read', pronunciation: 'LAY-zen', category: 'Other', images: ['Open book'] },
  { german: 'wie', note: 'question word', english: 'how', pronunciation: 'vee', category: 'Other', images: ['Thinking face'] },
  { german: 'heißen', note: 'verb', english: 'called / named', pronunciation: 'HY-sen', category: 'Other', images: ['Label'] },
  { article: 'die', german: 'Person', english: 'person', pronunciation: 'per-ZOHN', category: 'Other', images: ['Bust in silhouette'] },
  { german: "Wie geht's?", note: 'informal', english: 'how are you? (informal)', pronunciation: 'vee gayts', category: 'Other', images: ['Slightly smiling face'] },
  { german: 'auch', note: 'adverb', english: 'also', pronunciation: 'owkh', category: 'Other', images: ['Plus'] },
  { german: 'berühmt', note: 'adjective', english: 'famous', pronunciation: 'beh-RÜMT', category: 'Other', images: ['Glowing star'] },
  { german: 'Personen', note: 'plural', english: 'persons / people', pronunciation: 'per-ZOH-nen', category: 'Other', images: ['Busts in silhouette'] },
  { german: 'Auf Wiedersehen', note: 'formal', english: 'goodbye / see you later', pronunciation: 'owf VEE-der-zay-en', category: 'Other', images: ['Waving hand'] },
  { german: 'Wie heißen Sie?', note: 'formal', english: 'what is your name? (formal)', pronunciation: 'vee HY-sen zee', category: 'Other', images: ['Name badge'] },
  { german: 'Wie geht es Ihnen?', note: 'formal', english: 'how are you? (formal)', pronunciation: 'vee gayt es EE-nen', category: 'Other', images: ['Handshake'] },
  { article: 'die', german: 'Kollegin', english: 'female colleague', pronunciation: 'ko-LAY-gin', category: 'Other', images: ['Woman office worker'] },
  { article: 'die', german: 'Sprache', english: 'language', pronunciation: 'SHPRAH-khuh', category: 'Other', images: ['Left speech bubble'] },
  { german: 'wohnen', note: 'verb', english: 'live / reside', pronunciation: 'VOH-nen', category: 'Places', images: ['House'] },
  { german: 'Wo wohnen Sie?', note: 'formal', english: 'where do you live?', pronunciation: 'voh VOH-nen zee', category: 'Directions', images: ['Round pushpin', 'House'] },
  {
    german: 'Wer ist das?',
    english: 'who is this?',
    pronunciation: 'vehr ist dahs',
    category: 'Other',
    images: ['Backhand index pointing right', 'Bust in silhouette'],
  },
  { article: 'die', german: 'Zahlen', note: 'plural', english: 'numbers', pronunciation: 'TSAH-len', category: 'Objects', images: ['Input numbers'] },
  { german: 'hungrig', note: 'adjective', english: 'hungry', pronunciation: 'HOONG-rikh', category: 'Food', images: ['Fork and knife with plate'] },
  { german: 'durstig', note: 'adjective', english: 'thirsty', pronunciation: 'DOOR-stikh', category: 'Food', images: ['Cup with straw'] },
  { german: 'müde', note: 'adjective', english: 'tired', pronunciation: 'MÜ-duh', category: 'Other', images: ['Yawning face'] },
  { german: 'Ich verstehe nicht.', english: "I don't understand", pronunciation: 'ikh fer-SHTAY-uh nikht', category: 'Other', images: ['Confused face'] },
  { german: 'Können Sie helfen?', note: 'formal', english: 'can you help?', pronunciation: 'KUN-en zee HEL-fen', category: 'Other', images: ['Ring buoy'] },
  { german: 'Bis später.', english: 'see you later', pronunciation: 'bis SHPAY-ter', category: 'Time', images: ['Hourglass not done'] },
  { article: 'das', german: 'Alphabet', english: 'alphabet', pronunciation: 'ahl-fah-BAYT', category: 'Objects', images: ['Input latin uppercase'] },
  { article: 'die', german: 'Buchstaben', note: 'plural', english: 'letters', pronunciation: 'BOOKH-shtah-ben', category: 'Objects', images: ['Input latin letters'] },
  { german: 'at', english: '@', pronunciation: 'et', category: 'Objects', images: ['E-mail'] },
  { article: 'der', german: 'Punkt', english: '. (dot)', pronunciation: 'poonkt', category: 'Objects', images: ['Black circle'] },
  { german: 'Minus', english: '- (minus)', pronunciation: 'MEE-noos', category: 'Objects', images: ['Minus'] },
  { article: 'der', german: 'Unterstrich', english: '_ (underscore)', pronunciation: 'OON-ter-shtrikh', category: 'Objects', images: ['Keyboard'] },
  { german: 'buchstabieren', note: 'verb', english: 'spelling', pronunciation: 'bookh-shtah-BEE-ren', category: 'Other', images: ['Pencil'] },
  { german: 'kann', note: 'verb', english: 'can', pronunciation: 'kahn', category: 'Other', images: ['Flexed biceps'] },
  { german: 'noch einmal', english: 'once again', pronunciation: 'nokh INE-mahl', category: 'Time', images: ['Repeat button'] },
  { german: 'Ich verstehe Sie nicht.', note: 'formal', english: "I don't understand you", pronunciation: 'ikh fer-SHTAY-uh zee nikht', category: 'Other', images: ['Person shrugging'] },
  { german: 'Ein bisschen langsamer.', english: 'a little slower', pronunciation: 'ine BIS-khen LAHNG-zah-mer', category: 'Other', images: ['Snail'] },
  { article: 'das', german: 'Land', english: 'country', pronunciation: 'lahnt', category: 'Places', images: ['Globe showing europe-africa'] },
  { article: 'die', german: 'Länder', note: 'plural', english: 'countries', pronunciation: 'LEN-der', category: 'Places', images: ['World map'] },
  { article: 'die', german: 'Sprachen', note: 'plural', english: 'languages', pronunciation: 'SHPRAH-khen', category: 'Other', images: ['Globe with meridians'] },
  { german: 'Deutschland', english: 'Germany', pronunciation: 'DOYCH-lahnt', category: 'Places', images: ['Pretzel'] },
  { german: 'Österreich', english: 'Austria', pronunciation: 'UR-ster-rykh', category: 'Places', images: ['Snow-capped mountain'] },
  { article: 'die', german: 'Schweiz', english: 'Switzerland', pronunciation: 'shvyts', category: 'Places', images: ['Cheese wedge'] },
  { german: 'Frankreich', english: 'France', pronunciation: 'FRAHNK-rykh', category: 'Places', images: ['Croissant'] },
  { german: 'Italien', english: 'Italy', pronunciation: 'ee-TAH-lee-en', category: 'Places', images: ['Pizza'] },
  { german: 'Spanien', english: 'Spain', pronunciation: 'SHPAH-nee-en', category: 'Places', images: ['Shallow pan of food'] },
  { german: 'Polen', english: 'Poland', pronunciation: 'POH-len', category: 'Places', images: ['Dumpling'] },
  { article: 'die', german: 'Türkei', english: 'Turkey', pronunciation: 'tür-KY', category: 'Places', images: ['Nazar amulet'] },
  { german: 'Russland', english: 'Russia', pronunciation: 'ROOS-lahnt', category: 'Places', images: ['Nesting dolls'] },
  { german: 'Brasilien', english: 'Brazil', pronunciation: 'brah-ZEE-lee-en', category: 'Places', images: ['Parrot'] },
  { german: 'lang', note: 'adjective', english: 'long', pronunciation: 'lahng', category: 'Other', images: ['Straight ruler'] },
];

// "Freunde, Kollegen und ich". "die Straße" (road #25, street #56) is one card.
const UNIT_2_WORDS: WordInput[] = [
  { article: 'die', german: 'Arbeit', english: 'work', pronunciation: 'AR-byte', category: 'Other', images: ['Briefcase'] },
  { article: 'der', german: 'Beruf', english: 'profession / occupation', pronunciation: 'beh-ROOF', category: 'Other', images: ['Office worker'] },
  { german: 'fotografieren', note: 'verb', english: 'take photos / photograph', pronunciation: 'foh-toh-grah-FEE-ren', category: 'Other', images: ['Camera with flash'] },
  { german: 'singen', note: 'verb', english: 'sing', pronunciation: 'ZING-en', category: 'Other', images: ['Microphone'] },
  { german: 'kochen', note: 'verb', english: 'cook', pronunciation: 'KOKH-en', category: 'Food', images: ['Cook'] },
  { german: 'schwimmen', note: 'verb', english: 'swim', pronunciation: 'SHVIM-en', category: 'Other', images: ['Person swimming'] },
  { german: 'reisen', note: 'verb', english: 'travel', pronunciation: 'RY-zen', category: 'Travel', images: ['Luggage'] },
  { german: 'tanzen', note: 'verb', english: 'dance', pronunciation: 'TAHN-tsen', category: 'Other', images: ['Mirror ball'] },
  { german: 'Musik hören', note: 'verb', english: 'listen to music', pronunciation: 'moo-ZEEK HUR-en', category: 'Other', images: ['Musical notes'] },
  { article: 'das', german: 'Kino', english: 'cinema / movies', pronunciation: 'KEE-noh', category: 'Places', images: ['Clapper board'] },
  { article: 'die', german: 'Frage', english: 'question', pronunciation: 'FRAH-guh', category: 'Other', images: ['Red question mark'] },
  { german: 'antworten', note: 'verb', english: 'to answer', pronunciation: 'AHNT-vor-ten', category: 'Other', images: ['Speech balloon'] },
  { german: 'lieben', note: 'verb', english: 'love', pronunciation: 'LEE-ben', category: 'Other', images: ['Red heart'] },
  { article: 'die', german: 'Stadt', english: 'city', pronunciation: 'shtaht', category: 'Places', images: ['Cityscape'] },
  { article: 'das', german: 'Wochenende', english: 'weekend', pronunciation: 'VOKH-en-en-duh', category: 'Time', images: ['Beach with umbrella'] },
  { german: 'Montag', english: 'Monday', pronunciation: 'MOHN-tahk', category: 'Time', images: ['Tear-off calendar'] },
  { article: 'der', german: 'Arzt', english: 'doctor', pronunciation: 'ahrtst', category: 'Other', images: ['Health worker'] },
  { article: 'die', german: 'Klinik', english: 'clinic', pronunciation: 'KLEE-nik', category: 'Places', images: ['Stethoscope'] },
  { article: 'der', german: 'Patient', english: 'patient', pronunciation: 'pah-TSYENT', category: 'Other', images: ['Bed'] },
  { article: 'die', german: 'Woche', english: 'week', pronunciation: 'VOKH-uh', category: 'Time', images: ['Calendar'] },
  { german: 'Menschen', note: 'plural', english: 'people', pronunciation: 'MEN-shen', category: 'Other', images: ['Busts in silhouette'] },
  { article: 'der', german: 'Taxifahrer', english: 'taxi driver', pronunciation: 'TAHK-see-fah-rer', category: 'Travel', images: ['Oncoming taxi'] },
  { article: 'das', german: 'Buch', english: 'the book', pronunciation: 'bookh', category: 'Objects', images: ['Closed book'] },
  { article: 'das', german: 'Geld', english: 'the money', pronunciation: 'gelt', category: 'Objects', images: ['Euro banknote'] },
  { article: 'die', german: 'Straße', english: 'street / road', pronunciation: 'SHTRAH-suh', category: 'Directions', images: ['Vertical traffic light'] },
  { article: 'der', german: 'Stift', english: 'the pen', pronunciation: 'shtift', category: 'Objects', images: ['Pen'] },
  { article: 'das', german: 'Medikament', english: 'the medicine', pronunciation: 'meh-dee-kah-MENT', category: 'Objects', images: ['Syringe', 'Pill'] },
  { article: 'die', german: 'Rechnung', english: 'the bill / check', pronunciation: 'REKH-noong', category: 'Objects', images: ['Receipt'] },
  { article: 'der', german: 'Schlüssel', english: 'the key', pronunciation: 'SHLÜS-el', category: 'Objects', images: ['Key'] },
  { article: 'die', german: 'Tablette', english: 'the tablet / pill', pronunciation: 'tah-BLET-uh', category: 'Objects', images: ['Pill'] },
  {
    german: '22 Jahre alt',
    english: '22 years old',
    pronunciation: 'TSVY-oont-tsvahn-tsikh YAH-ruh ahlt',
    category: 'Other',
    images: ['Keycap 2', 'Keycap 2'],
  },
  { article: 'das', german: 'Seminar', english: 'seminar', pronunciation: 'zeh-mee-NAHR', category: 'Other', images: ['Teacher'] },
  { article: 'der', german: 'Kurs', english: 'course', pronunciation: 'koors', category: 'Other', images: ['Books'] },
  { article: 'der', german: 'Student', english: 'male student', pronunciation: 'shtoo-DENT', category: 'Other', images: ['Man', 'Graduation cap'] },
  { article: 'die', german: 'Studentin', english: 'female student', pronunciation: 'shtoo-DEN-tin', category: 'Other', images: ['Woman', 'Graduation cap'] },
  { article: 'die', german: 'Fahrt', english: 'journey / travel', pronunciation: 'fahrt', category: 'Travel', images: ['Oncoming automobile'] },
  { german: 'warten', note: 'verb', english: 'wait', pronunciation: 'VAR-ten', category: 'Other', images: ['Hourglass done'] },
  { german: 'pro Woche', english: 'per week', pronunciation: 'proh VOKH-uh', category: 'Time', images: ['Repeat button'] },
  { article: 'das', german: 'Krankenhaus', english: 'hospital', pronunciation: 'KRAHN-ken-howss', category: 'Places', images: ['Hospital'] },
  { article: 'das', german: 'Zimmer', english: 'room', pronunciation: 'TSIM-er', category: 'Places', images: ['Door'] },
  { article: 'der', german: 'Platz', english: 'place', pronunciation: 'platz', category: 'Places', images: ['Fountain'] },
  { article: 'die', german: 'Nacht', english: 'night', pronunciation: 'nahkht', category: 'Time', images: ['Crescent moon'] },
  { article: 'die', german: 'Vorlesungen', note: 'plural', english: 'classes / lectures', pronunciation: 'FOR-lay-zoong-en', category: 'Other', images: ['School'] },
  { article: 'die', german: 'Seminare', note: 'plural', english: 'seminars', pronunciation: 'zeh-mee-NAH-ruh', category: 'Other', images: ['Teacher', 'Teacher'] },
  // Pronouns
  { german: 'ich', note: 'pronoun', english: 'I', pronunciation: 'ikh', category: 'Other', images: ['Woman raising hand'] },
  { german: 'du', note: 'informal', english: 'you (informal)', pronunciation: 'doo', category: 'Other', images: ['Backhand index pointing right'] },
  { german: 'er', note: 'pronoun', english: 'he', pronunciation: 'air', category: 'Other', images: ['Man'] },
  { german: 'sie', note: 'pronoun', english: 'she', pronunciation: 'zee', category: 'Other', images: ['Woman'] },
  { german: 'es', note: 'pronoun', english: 'it', pronunciation: 'es', category: 'Other', images: ['Teddy bear'] },
  { german: 'wir', note: 'pronoun', english: 'we', pronunciation: 'veer', category: 'Other', images: ['People hugging'] },
  {
    german: 'ihr',
    note: 'pronoun',
    english: 'you all',
    pronunciation: 'eer',
    category: 'Other',
    images: ['Backhand index pointing right', 'Busts in silhouette'],
  },
  { german: 'sie', note: 'pronoun', english: 'they', pronunciation: 'zee', category: 'Other', images: ['Man', 'Woman'] },
  { german: 'Sie', note: 'formal', english: 'you (formal)', pronunciation: 'zee', category: 'Other', images: ['Person in tuxedo'] },
  { german: 'das', note: 'article', english: 'neutral “the”', pronunciation: 'dahs', category: 'Other', images: ['Package'] },
  // Seasons & personal information
  { article: 'der', german: 'Sommer', english: 'summer', pronunciation: 'ZOM-er', category: 'Time', images: ['Sun'] },
  { article: 'der', german: 'Herbst', english: 'autumn / fall', pronunciation: 'hairpst', category: 'Time', images: ['Fallen leaf'] },
  { article: 'der', german: 'Winter', english: 'winter', pronunciation: 'VIN-ter', category: 'Time', images: ['Snowflake'] },
  { article: 'der', german: 'Frühling', english: 'spring', pronunciation: 'FRÜ-ling', category: 'Time', images: ['Cherry blossom'] },
  { article: 'der', german: 'Nachname', english: 'surname / last name', pronunciation: 'NAHKH-nah-muh', category: 'Other', images: ['Identification card'] },
  { article: 'der', german: 'Vorname', english: 'first name', pronunciation: 'FOR-nah-muh', category: 'Other', images: ['Name badge'] },
  { article: 'das', german: 'Geburtsdatum', english: 'date of birth', pronunciation: 'geh-BOORTS-dah-toom', category: 'Time', images: ['Baby', 'Calendar'] },
  { article: 'der', german: 'Geburtsort', english: 'place of birth', pronunciation: 'geh-BOORTS-ort', category: 'Places', images: ['Baby', 'Round pushpin'] },
  { article: 'die', german: 'Adresse', english: 'address', pronunciation: 'ah-DRESS-uh', category: 'Directions', images: ['Envelope'] },
  { article: 'die', german: 'Telefonnummer', english: 'telephone number', pronunciation: 'teh-leh-FOHN-noom-er', category: 'Other', images: ['Telephone'] },
  { article: 'die', german: 'Handynummer', english: 'mobile number', pronunciation: 'HEN-dee-noom-er', category: 'Other', images: ['Mobile phone'] },
  { article: 'die', german: 'Hausnummer', english: 'house number', pronunciation: 'HOWSS-noom-er', category: 'Directions', images: ['House', 'Input numbers'] },
  { article: 'die', german: 'Postleitzahl', english: 'postcode / postal code', pronunciation: 'POST-lite-tsahl', category: 'Directions', images: ['Postbox'] },
  { article: 'der', german: 'Wohnort', english: 'residence / place of residence', pronunciation: 'VOHN-ort', category: 'Places', images: ['House with garden'] },
];

const UNIT_3_WORDS: WordInput[] = [
  { article: 'der', german: 'Platz', english: 'place', pronunciation: 'platz', category: 'Places', images: ['Fountain'] },
  { article: 'das', german: 'Gebäude', english: 'building', pronunciation: 'geh-BOY-duh', category: 'Places', images: ['Office building'] },
  { german: 'benennen', note: 'verb', english: 'to name', pronunciation: 'beh-NEN-en', category: 'Other', images: ['Label'] },
  {
    article: 'das',
    german: 'Verkehrsmittel',
    english: 'transport',
    pronunciation: 'fer-KEHRS-mit-tel',
    category: 'Travel',
    images: ['Bus', 'High-speed train', 'Bicycle', 'Airplane'],
  },
  {
    article: 'die',
    german: 'Dinge',
    note: 'plural',
    english: 'things',
    pronunciation: 'DING-uh',
    category: 'Objects',
    images: ['Package', 'Books', 'Key', 'Light bulb'],
  },
  {
    article: 'die',
    german: 'Jahreszeiten',
    note: 'plural',
    english: 'seasons',
    pronunciation: 'YAH-res-tsy-ten',
    category: 'Time',
    images: ['Cherry blossom', 'Sun', 'Fallen leaf', 'Snowflake'],
  },
  { article: 'die', german: 'Monate', note: 'plural', english: 'months', pronunciation: 'MOH-nah-tuh', category: 'Time', images: ['Spiral calendar'] },
  { article: 'das', german: 'Rathaus', english: 'town hall / city hall', pronunciation: 'RAHT-howss', category: 'Places', images: ['Classical building'] },
  { article: 'das', german: 'Schiff', english: 'ship', pronunciation: 'shif', category: 'Travel', images: ['Ship'] },
  { article: 'das', german: 'Meer', english: 'sea', pronunciation: 'mehr', category: 'Places', images: ['Water wave'] },
  { article: 'der', german: 'See', english: 'lake', pronunciation: 'zay', category: 'Places', images: ['National park'] },
  { article: 'der', german: 'Fluss', english: 'river', pronunciation: 'flooss', category: 'Places', images: ['Bridge at night'] },
  { german: 'fahren', note: 'verb', english: 'to travel / go by vehicle', pronunciation: 'FAH-ren', category: 'Travel', images: ['Automobile'] },
  { article: 'die', german: 'Stunden', note: 'plural', english: 'hours', pronunciation: 'SHTOON-den', category: 'Time', images: ['Mantelpiece clock'] },
  { article: 'die', german: 'Breite', english: 'width', pronunciation: 'BRY-tuh', category: 'Objects', images: ['Left-right arrow'] },
  { article: 'die', german: 'Höhe', english: 'height', pronunciation: 'HOH-uh', category: 'Objects', images: ['Up-down arrow'] },
  { article: 'der', german: 'Turm', english: 'tower', pronunciation: 'toorm', category: 'Places', images: ['Tokyo tower'] },
  { article: 'die', german: 'Kunsthalle', english: 'art hall', pronunciation: 'KUNST-hal-uh', category: 'Places', images: ['Framed picture'] },
  { article: 'das', german: 'Glück', english: 'luck', pronunciation: 'glük', category: 'Other', images: ['Four leaf clover'] },
  { german: 'links', note: 'adverb', english: 'left', pronunciation: 'links', category: 'Directions', images: ['Left arrow'] },
  { german: 'rechts', note: 'adverb', english: 'right', pronunciation: 'rekhts', category: 'Directions', images: ['Right arrow'] },
  { german: 'geradeaus', note: 'adverb', english: 'straight', pronunciation: 'geh-RAH-duh-owss', category: 'Directions', images: ['Up arrow'] },
  {
    article: 'die',
    german: 'Wegbeschreibung',
    english: 'directions / route description',
    pronunciation: 'VAYK-beh-SHRY-boong',
    category: 'Directions',
    images: ['World map'],
  },
  { article: 'die', german: 'Jahreszeit', english: 'season', pronunciation: 'YAH-res-tsyte', category: 'Time', images: ['Fallen leaf'] },
  { article: 'das', german: 'Messer', english: 'knife', pronunciation: 'MESS-er', category: 'Food', images: ['Kitchen knife'] },
  // fork.png is cropped from Fluent's "Fork and knife" (there is no fork-only emoji).
  { article: 'die', german: 'Gabel', english: 'fork', pronunciation: 'GAH-bel', category: 'Food', images: ['Fork'] },
  { article: 'der', german: 'Löffel', english: 'spoon', pronunciation: 'LUFF-el', category: 'Food', images: ['Spoon'] },
  {
    article: 'die',
    german: 'Tassen',
    note: 'plural',
    english: 'cups',
    pronunciation: 'TAHS-en',
    category: 'Food',
    images: ['Hot beverage', 'Hot beverage'],
  },
];

// "Guten Appetit!"
const UNIT_4_WORDS: WordInput[] = [
  { article: 'die', german: 'Mahlzeit', english: 'meal', pronunciation: 'MAHL-tsyte', category: 'Food', images: ['Fork and knife with plate'] },
  { article: 'der', german: 'Appetit', english: 'appetite', pronunciation: 'ah-peh-TEET', category: 'Food', images: ['Face savoring food'] },
  { article: 'das', german: 'Gespräch', english: 'conversation', pronunciation: 'geh-SHPREKH', category: 'Other', images: ['Speech balloon', 'Left speech bubble'] },
  { article: 'die', german: 'Vorlieben', note: 'plural', english: 'preferences', pronunciation: 'FOR-lee-ben', category: 'Other', images: ['Thumbs up'] },
  { article: 'das', german: 'Ei', english: 'egg', pronunciation: 'eye', category: 'Food', images: ['Egg'] },
  { article: 'der', german: 'Käse', english: 'cheese', pronunciation: 'KAY-zuh', category: 'Food', images: ['Cheese wedge'] },
  { article: 'der', german: 'Orangensaft', english: 'orange juice', pronunciation: 'oh-RAHN-zhen-zahft', category: 'Food', images: ['Tangerine', 'Beverage box'] },
  { article: 'die', german: 'Marmelade', english: 'jam', pronunciation: 'mar-meh-LAH-duh', category: 'Food', images: ['Strawberry', 'Jar'] },
  { article: 'die', german: 'Banane', english: 'banana', pronunciation: 'bah-NAH-nuh', category: 'Food', images: ['Banana'] },
  { article: 'das', german: 'Brötchen', english: 'bun / bread roll', pronunciation: 'BRÖT-khen', category: 'Food', images: ['Baguette bread'] },
  { article: 'das', german: 'Mittagessen', english: 'lunch', pronunciation: 'MIT-tahk-ess-en', category: 'Food', images: ['Sun', 'Fork and knife'] },
  { article: 'das', german: 'Frühstück', english: 'breakfast', pronunciation: 'FRÜ-shtük', category: 'Food', images: ['Cooking'] },
  { article: 'der', german: 'Apfelsaft', english: 'apple juice', pronunciation: 'AHP-fel-zahft', category: 'Food', images: ['Red apple', 'Beverage box'] },
  { article: 'die', german: 'Kartoffel', english: 'potato', pronunciation: 'kar-TOF-el', category: 'Food', images: ['Potato'] },
  { article: 'das', german: 'Gemüse', english: 'vegetables', pronunciation: 'geh-MÜ-zuh', category: 'Food', images: ['Carrot', 'Broccoli'] },
  { article: 'das', german: 'Öl', english: 'oil', pronunciation: 'öl', category: 'Food', images: ['Olive'] },
  { article: 'der', german: 'Kuchen', english: 'cake', pronunciation: 'KOO-khen', category: 'Food', images: ['Shortcake'] },
  { article: 'die', german: 'Sahne', english: 'cream', pronunciation: 'ZAH-nuh', category: 'Food', images: ['Soft ice cream'] },
  { article: 'die', german: 'Schokolade', english: 'chocolate', pronunciation: 'shoh-koh-LAH-duh', category: 'Food', images: ['Chocolate bar'] },
  { article: 'der', german: 'Keks', english: 'cookie', pronunciation: 'kayks', category: 'Food', images: ['Cookie'] },
  { article: 'der', german: 'Zucker', english: 'sugar', pronunciation: 'TSOOK-er', category: 'Food', images: ['Candy'] },
  { article: 'das', german: 'Abendessen', english: 'dinner', pronunciation: 'AH-bent-ess-en', category: 'Food', images: ['Crescent moon', 'Fork and knife'] },
  { article: 'die', german: 'Suppe', english: 'soup', pronunciation: 'ZOO-puh', category: 'Food', images: ['Bowl with spoon'] },
  { article: 'die', german: 'Gurke', english: 'cucumber', pronunciation: 'GOOR-kuh', category: 'Food', images: ['Cucumber'] },
  {
    article: 'die',
    german: 'Lebensmittel',
    note: 'plural',
    english: 'groceries / food items',
    pronunciation: 'LAY-bens-mit-tel',
    category: 'Food',
    images: ['Carrot', 'Bread', 'Cheese wedge', 'Red apple'],
  },
  { german: 'Das ist alles.', english: "that's all", pronunciation: 'dahs ist AHL-es', category: 'Other', images: ['Shopping bags'] },
  { german: 'kaufen', note: 'verb', english: 'buy', pronunciation: 'KOW-fen', category: 'Other', images: ['Shopping cart'] },
  { article: 'die', german: 'Getränke', note: 'plural', english: 'drinks', pronunciation: 'geh-TREN-kuh', category: 'Food', images: ['Cup with straw', 'Hot beverage'] },
  { german: 'alles', note: 'pronoun', english: 'all / everything', pronunciation: 'AHL-es', category: 'Other', images: ['Infinity'] },
  { german: 'mehr', note: 'adverb', english: 'more', pronunciation: 'mair', category: 'Other', images: ['Plus'] },
  { german: 'Stimmt.', english: "that's right / correct", pronunciation: 'shtimt', category: 'Other', images: ['Check mark button'] },
  { article: 'das', german: 'Bild', english: 'picture', pronunciation: 'bilt', category: 'Objects', images: ['Framed picture'] },
  { article: 'der', german: 'Einkaufswagen', english: 'shopping cart', pronunciation: 'INE-kowfs-vah-gen', category: 'Objects', images: ['Shopping cart'] },
  { article: 'das', german: 'Wechselgeld', english: 'change (money)', pronunciation: 'VEK-sel-gelt', category: 'Objects', images: ['Coin'] },
  { german: 'dran', note: 'adverb', english: 'your turn', pronunciation: 'drahn', category: 'Other', images: ['Backhand index pointing right'] },
  { german: 'Sonst noch etwas?', english: 'anything else?', pronunciation: 'zonst nokh ET-vahs', category: 'Other', images: ['Red question mark'] },
  { article: 'der', german: 'Reis', english: 'rice', pronunciation: 'rice', category: 'Food', images: ['Cooked rice'] },
  { article: 'die', german: 'Tüte', english: 'bag', pronunciation: 'TÜ-tuh', category: 'Objects', images: ['Shopping bags'] },
  { article: 'der', german: 'Kassenzettel', english: 'receipt', pronunciation: 'KAHS-en-tset-el', category: 'Objects', images: ['Receipt'] },
  { german: 'Gleichfalls!', english: 'same to you', pronunciation: 'GLYKH-fahls', category: 'Other', images: ['Handshake'] },
  { german: 'schmeckt', note: 'verb', english: 'tastes', pronunciation: 'shmekt', category: 'Other', images: ['Face savoring food'] },
  { german: 'satt', note: 'adjective', english: 'full (not hungry)', pronunciation: 'zaht', category: 'Other', images: ['Face exhaling'] },
  { german: 'Mahlzeit!', note: 'greeting', english: 'meal time (greeting)', pronunciation: 'MAHL-tsyte', category: 'Other', images: ['Waving hand', 'Fork and knife'] },
];

// "Alltag und Familie" – the 42 words in the order given. Nachrichten (6, 25) and ergänzen (15, 19)
// appear twice, as in the list; each card keeps its own English.
const UNIT_5_WORDS: WordInput[] = [
  { article: 'die', german: 'Uhrzeit', english: 'time / time of day', pronunciation: 'OOR-tsyte', category: 'Time', images: ['Alarm clock'] },
  { article: 'das', german: 'Alter', english: 'age', pronunciation: 'AHL-ter', category: 'Other', images: ['Birthday cake'] },
  { german: 'treffen', note: 'verb', english: 'meet', pronunciation: 'TREF-en', category: 'Other', images: ['Handshake'] },
  { german: 'duschen', note: 'verb', english: 'take a shower', pronunciation: 'DOO-shen', category: 'Other', images: ['Shower'] },
  { german: 'besuchen', note: 'verb', english: 'visit', pronunciation: 'beh-ZOO-khen', category: 'Other', images: ['House', 'Waving hand'] },
  { article: 'die', german: 'Nachrichten', note: 'plural', english: 'news / messages', pronunciation: 'NAHKH-rikh-ten', category: 'Other', images: ['Newspaper', 'Envelope'] },
  { german: 'lange schlafen', note: 'verb', english: 'sleep late', pronunciation: 'LAHNG-uh SHLAH-fen', category: 'Other', images: ['Sleeping face'] },
  { german: 'Wie spät ist es?', english: 'what time is it?', pronunciation: 'vee shpayt ist es', category: 'Time', images: ['Watch', 'Red question mark'] },
  { german: 'aufstehen', note: 'verb', english: 'get up', pronunciation: 'OWF-shtay-en', category: 'Other', images: ['Sunrise'] },
  { german: 'ordnen', note: 'verb', english: 'arrange / put in order', pronunciation: 'ORT-nen', category: 'Other', images: ['Card index dividers'] },
  { article: 'die', german: 'Bilder', note: 'plural', english: 'pictures', pronunciation: 'BIL-der', category: 'Objects', images: ['Framed picture', 'Framed picture'] },
  { german: 'offiziell', note: 'adverb', english: 'officially', pronunciation: 'oh-fee-TSYELL', category: 'Other', images: ['Classical building'] },
  { german: 'sehen', note: 'verb', english: 'see', pronunciation: 'ZAY-en', category: 'Other', images: ['Eyes'] },
  { article: 'die', german: 'Eltern', note: 'plural', english: 'parents', pronunciation: 'EL-tern', category: 'Other', images: ['Woman', 'Man'] },
  { german: 'ergänzen', note: 'verb', english: 'add to / supplement', pronunciation: 'er-GEN-tsen', category: 'Other', images: ['Plus'] },
  { article: 'der', german: 'Satz', english: 'sentence', pronunciation: 'zahts', category: 'Other', images: ['Memo'] },
  { german: 'sagt', note: 'verb', english: 'says', pronunciation: 'zahkt', category: 'Other', images: ['Speaking head'] },
  { german: 'ankreuzen', note: 'verb', english: 'cross / tick a box', pronunciation: 'AHN-kroy-tsen', category: 'Other', images: ['Ballot box with ballot'] },
  { german: 'ergänzen', note: 'verb', english: 'add / supplement', pronunciation: 'er-GEN-tsen', category: 'Other', images: ['Puzzle piece'] },
  { german: 'bleiben', note: 'verb', english: 'remain / stay', pronunciation: 'BLY-ben', category: 'Other', images: ['Couch and lamp'] },
  { german: 'beschreibt', note: 'verb', english: 'describes', pronunciation: 'beh-SHRYPT', category: 'Other', images: ['Writing hand'] },
  { german: 'ledig', note: 'adjective', english: 'single / unmarried', pronunciation: 'LAY-dikh', category: 'Other', images: ['Person standing'] },
  { article: 'das', german: 'Motorrad', english: 'motorcycle', pronunciation: 'MOH-tor-raht', category: 'Travel', images: ['Motorcycle'] },
  { article: 'die', german: 'Geige', english: 'violin', pronunciation: 'GY-guh', category: 'Objects', images: ['Violin'] },
  { article: 'die', german: 'Nachrichten', note: 'plural', english: 'news', pronunciation: 'NAHKH-rikh-ten', category: 'Other', images: ['Television'] },
  { article: 'der', german: 'Termin', english: 'appointment', pronunciation: 'ter-MEEN', category: 'Time', images: ['Calendar'] },
  { german: 'können', note: 'modal verb', english: 'can / be able to', pronunciation: 'KÖN-en', category: 'Other', images: ['Flexed biceps'] },
  { german: 'würde', note: 'verb', english: 'would', pronunciation: 'VÜR-duh', category: 'Other', images: ['Thought balloon'] },
  { german: 'wollen', note: 'modal verb', english: 'want', pronunciation: 'VOL-en', category: 'Other', images: ['Smiling face with heart-eyes'] },
  { article: 'die', german: 'Hausaufgaben', note: 'plural', english: 'homework', pronunciation: 'HOWSS-owf-gah-ben', category: 'Objects', images: ['Notebook', 'Pencil'] },
  { german: 'leider', note: 'adverb', english: 'unfortunately', pronunciation: 'LY-der', category: 'Other', images: ['Pensive face'] },
  { german: 'fast', note: 'adverb', english: 'almost', pronunciation: 'fahst', category: 'Other', images: ['Pinching hand'] },
  { german: 'gerade', note: 'adverb', english: 'right now', pronunciation: 'geh-RAH-duh', category: 'Time', images: ['Stopwatch'] },
  { article: 'der', german: 'Berg', english: 'mountain', pronunciation: 'bairk', category: 'Places', images: ['Mountain'] },
  { german: 'nächste Woche', english: 'next week', pronunciation: 'NEKHS-tuh VOKH-uh', category: 'Time', images: ['Tear-off calendar', 'Right arrow'] },
  { german: 'schade', english: 'too bad / what a pity', pronunciation: 'SHAH-duh', category: 'Other', images: ['Disappointed face'] },
  { article: 'die', german: 'Kneipe', english: 'pub', pronunciation: 'KNY-puh', category: 'Places', images: ['Beer mug'] },
  { german: 'vereinbaren', note: 'verb', english: 'arrange / make an appointment', pronunciation: 'fer-INE-bah-ren', category: 'Time', images: ['Handshake', 'Calendar'] },
  { article: 'die', german: 'Rollenkarte', english: 'role card', pronunciation: 'ROL-en-kar-tuh', category: 'Objects', images: ['Performing arts'] },
  { german: 'spielen', note: 'verb', english: 'play', pronunciation: 'SHPEE-len', category: 'Other', images: ['Soccer ball'] },
  { article: 'das', german: 'Büro', english: 'office', pronunciation: 'bü-ROH', category: 'Places', images: ['Desktop computer'] },
  { article: 'die', german: 'Verspätung', english: 'delay', pronunciation: 'fer-SHPAY-toong', category: 'Travel', images: ['Hourglass not done'] },
];

// "Zeit mit Freunden" – the 49 words in the order given. "zusammen" (31, 35) appears twice, as in the
// list: #35 sits with "getrennt" (paying), so it is "together (one bill)" and gets its own id.
const UNIT_6_WORDS: WordInput[] = [
  { article: 'der', german: 'Geburtstag', english: 'birthday', pronunciation: 'geh-BOORTS-tahk', category: 'Time', images: ['Birthday cake'] },
  { article: 'die', german: 'Einladung', english: 'invitation', pronunciation: 'INE-lah-doong', category: 'Other', images: ['Envelope', 'Balloon'] },
  { article: 'das', german: 'Fenster', english: 'window', pronunciation: 'FEN-ster', category: 'Objects', images: ['Window'] },
  { german: 'glauben', note: 'verb', english: 'to believe', pronunciation: 'GLOW-ben', category: 'Other', images: ['Thinking face'] },
  { german: 'vielleicht', note: 'adverb', english: 'maybe', pronunciation: 'fee-LYKHT', category: 'Other', images: ['Face with raised eyebrow'] },
  { article: 'das', german: 'Klettern', english: 'climbing', pronunciation: 'KLET-tern', category: 'Other', images: ['Person climbing'] },
  { article: 'das', german: 'Fahrrad', english: 'bicycle', pronunciation: 'FAHR-raht', category: 'Travel', images: ['Bicycle'] },
  { german: 'feiern', note: 'verb', english: 'to celebrate', pronunciation: 'FY-ern', category: 'Other', images: ['Party popper'] },
  {
    article: 'die',
    german: 'Freizeitaktivitäten',
    note: 'plural',
    english: 'leisure activities',
    pronunciation: 'FRY-tsyte-ahk-tee-vee-TAY-ten',
    category: 'Other',
    images: ['Person biking', 'Person swimming', 'Soccer ball', 'Guitar'],
  },
  { article: 'die', german: 'Überraschung', english: 'surprise', pronunciation: 'ü-ber-RAH-shoong', category: 'Other', images: ['Astonished face'] },
  { german: 'Alles klar?', english: 'everything okay?', pronunciation: 'AHL-es klahr', category: 'Other', images: ['Ok hand'] },
  { article: 'die', german: 'Idee', english: 'idea', pronunciation: 'ee-DAY', category: 'Other', images: ['Light bulb'] },
  { article: 'die', german: 'Eltern', note: 'plural', english: 'parents', pronunciation: 'EL-tern', category: 'Other', images: ['Woman', 'Man'] },
  { german: 'Klingt gut.', english: 'sounds good', pronunciation: 'klingt goot', category: 'Other', images: ['Thumbs up'] },
  // "besonders" is the adverb (especially); "special" alone would be "besonder-".
  { german: 'besonders', note: 'adverb', english: 'special / especially', pronunciation: 'beh-ZON-ders', category: 'Other', images: ['Sparkles'] },
  { german: 'versuchen', note: 'verb', english: 'to try', pronunciation: 'fer-ZOO-khen', category: 'Other', images: ['Bullseye'] },
  { article: 'das', german: 'Thema', english: 'topic / subject', pronunciation: 'TAY-mah', category: 'Other', images: ['Bookmark tabs'] },
  { article: 'das', german: 'Geschenk', english: 'gift', pronunciation: 'geh-SHENK', category: 'Objects', images: ['Wrapped gift'] },
  { german: 'beginnt', note: 'verb', english: 'begins', pronunciation: 'beh-GINT', category: 'Time', images: ['Play button'] },
  {
    article: 'der',
    german: 'Treffpunkt',
    english: 'meeting point',
    pronunciation: 'TREF-poonkt',
    category: 'Places',
    images: ['Round pushpin', 'Busts in silhouette'],
  },
  { article: 'der', german: 'Ausflug', english: 'trip / excursion', pronunciation: 'OWS-flook', category: 'Travel', images: ['Camping'] },
  { article: 'das', german: 'Sammeln', english: 'collecting', pronunciation: 'ZAHM-eln', category: 'Other', images: ['Spiral shell', 'Coin'] },
  { article: 'der', german: 'Regen', english: 'rain', pronunciation: 'RAY-gen', category: 'Other', images: ['Cloud with rain'] },
  { german: 'schicken', note: 'verb', english: 'to send', pronunciation: 'SHIK-en', category: 'Other', images: ['Outbox tray'] },
  { article: 'die', german: 'Nachricht', english: 'message', pronunciation: 'NAHKH-rikht', category: 'Other', images: ['Mobile phone with arrow'] },
  { article: 'die', german: 'Achtung', english: 'attention / caution', pronunciation: 'AHKH-toong', category: 'Other', images: ['Warning'] },
  { article: 'die', german: 'Küche', english: 'kitchen', pronunciation: 'KÜ-khuh', category: 'Places', images: ['Pot of food', 'Cooking'] },
  { german: 'gesund', note: 'adjective', english: 'healthy', pronunciation: 'geh-ZOONT', category: 'Food', images: ['Green salad'] },
  { german: 'Bilden Sie Sätze.', note: 'formal', english: 'make sentences', pronunciation: 'BIL-den zee ZET-suh', category: 'Other', images: ['Pencil', 'Memo'] },
  { german: 'anfangen', note: 'verb', english: 'to begin / start', pronunciation: 'AHN-fahng-en', category: 'Time', images: ['Rocket'] },
  { german: 'zusammen', note: 'adverb', english: 'together', pronunciation: 'tsoo-ZAHM-en', category: 'Other', images: ['People hugging'] },
  { german: 'abholen', note: 'verb', english: 'to pick up', pronunciation: 'AHP-hoh-len', category: 'Travel', images: ['Automobile', 'Waving hand'] },
  {
    article: 'die',
    german: 'Bestellung',
    english: 'order (e.g. in a restaurant)',
    pronunciation: 'beh-SHTEL-oong',
    category: 'Food',
    images: ['Clipboard', 'Fork and knife'],
  },
  { german: 'bezahlen', note: 'verb', english: 'to pay', pronunciation: 'beh-TSAH-len', category: 'Other', images: ['Credit card'] },
  { german: 'zusammen', note: 'adverb', english: 'together (one bill)', pronunciation: 'tsoo-ZAHM-en', category: 'Other', images: ['Receipt'] },
  { german: 'getrennt', note: 'adverb', english: 'separate / separately', pronunciation: 'geh-TRENT', category: 'Other', images: ['Receipt', 'Receipt'] },
  { german: 'Stimmt so.', english: 'keep the change', pronunciation: 'shtimt zoh', category: 'Other', images: ['Coin', 'Palms up together'] },
  { article: 'das', german: 'Abendessen', english: 'dinner', pronunciation: 'AH-bent-ess-en', category: 'Food', images: ['Crescent moon', 'Fork and knife'] },
  { german: 'durstig', note: 'adjective', english: 'thirsty', pronunciation: 'DOOR-stikh', category: 'Food', images: ['Cup with straw'] },
  { article: 'der', german: 'Spaß', english: 'fun', pronunciation: 'shpahs', category: 'Other', images: ['Grinning squinting face'] },
  { article: 'das', german: 'Kaffeehaus', english: 'coffeehouse', pronunciation: 'KAH-fay-howss', category: 'Places', images: ['Hot beverage', 'Shortcake'] },
  { german: 'bestellen', note: 'verb', english: 'to order', pronunciation: 'beh-SHTEL-en', category: 'Food', images: ['Person raising hand'] },
  {
    article: 'die',
    german: 'Menschen',
    note: 'plural',
    english: 'people',
    pronunciation: 'MEN-shen',
    category: 'Other',
    images: ['Man', 'Woman', 'Boy', 'Girl'],
  },
  { german: 'sitzt', note: 'verb', english: 'sits', pronunciation: 'zitst', category: 'Other', images: ['Chair'] },
  { german: 'selbst', note: 'pronoun', english: 'self / oneself', pronunciation: 'zelpst', category: 'Other', images: ['Mirror'] },
  {
    article: 'die',
    german: 'Selbstbedienung',
    english: 'self-service',
    pronunciation: 'ZELPST-beh-dee-noong',
    category: 'Food',
    images: ['Takeout box', 'Cup with straw'],
  },
  { german: 'voll', note: 'adjective', english: 'full', pronunciation: 'fol', category: 'Other', images: ['Battery'] },
  {
    article: 'die',
    german: 'Gerichte',
    note: 'plural',
    english: 'dishes / meals',
    pronunciation: 'geh-RIKH-tuh',
    category: 'Food',
    images: ['Spaghetti', 'Curry rice', 'Shallow pan of food', 'Steaming bowl'],
  },
  { article: 'die', german: 'Kneipe', english: 'pub', pronunciation: 'KNY-puh', category: 'Places', images: ['Clinking beer mugs'] },
];

// German letter names: [letter, as it sounds to an English speaker (shown), German spelling (spoken)].
// German voices read a bare capital "A" as "Großbuchstabe A" and "Veh" as "Feh", so audio uses the
// German spelling – the same sound the voice gives the letter itself.
const LETTER_NAMES: [string, string, string][] = [
  ['A', 'Ah', 'Ah'],
  ['B', 'Beh', 'Beh'],
  ['C', 'Tseh', 'Zeh'],
  ['D', 'Deh', 'Deh'],
  ['E', 'Eh', 'Eh'],
  ['F', 'Eff', 'Eff'],
  ['G', 'Geh', 'Geh'],
  ['H', 'Hah', 'Hah'],
  ['I', 'Ih', 'Ih'],
  ['J', 'Yott', 'Jott'],
  ['K', 'Kah', 'Kah'],
  ['L', 'Ell', 'Ell'],
  ['M', 'Emm', 'Emm'],
  ['N', 'Enn', 'Enn'],
  ['O', 'Oh', 'Oh'],
  ['P', 'Peh', 'Peh'],
  ['Q', 'Kuh', 'Kuh'],
  ['R', 'Err', 'Err'],
  ['S', 'Ess', 'Ess'],
  ['T', 'Teh', 'Teh'],
  ['U', 'Uh', 'Uh'],
  ['V', 'Fow', 'Fau'],
  ['W', 'Veh', 'Weh'],
  ['X', 'Iks', 'Ix'],
  ['Y', 'Üpsilon', 'Ypsilon'],
  ['Z', 'Tsett', 'Zett'],
];

const ALPHABET_WORDS: WordInput[] = LETTER_NAMES.map(([letter, name, say]) => ({
  german: name,
  english: letter,
  say,
  glyph: `${letter}${letter.toLowerCase()}`,
  silentFront: true,
  category: 'Letters',
  images: [],
}));

const TRANSLITERATION: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[äöüß]/g, (ch) => TRANSLITERATION[ch])
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** The full German term as it should be shown and spoken, e.g. "der Platz". */
export const germanTerm = (word: Pick<VocabWord, 'article' | 'german'>) =>
  word.article ? `${word.article} ${word.german}` : word.german;

/** What Listen and Speaking Practice say: the German term, or a letter's spoken name. */
export const spokenText = (word: VocabWord) => word.say ?? germanTerm(word);

export const imageFile = (source: string) => `${slugify(source)}.png`;

// ---------------------------------------------------------------- units
// Add future units here (Unit 7, 8 …). Alphabets is number 0 so those numbers stay free.
const UNIT_DEFINITIONS: {
  number: number;
  name?: string;
  tag?: string;
  noun?: string;
  title: string;
  words: WordInput[];
}[] = [
  { number: 1, title: 'German Vocabulary', words: UNIT_1_WORDS },
  { number: 2, title: 'German Vocabulary', words: UNIT_2_WORDS },
  { number: 3, title: 'German Vocabulary', words: UNIT_3_WORDS },
  { number: 4, title: 'Guten Appetit!', words: UNIT_4_WORDS },
  { number: 5, title: 'Alltag und Familie', words: UNIT_5_WORDS },
  { number: 6, title: 'Zeit mit Freunden', words: UNIT_6_WORDS },
  { number: 0, name: 'Alphabets', tag: 'A–Z', noun: 'letter', title: 'German Alphabet', words: ALPHABET_WORDS },
];

/** The unit selected when the site opens. */
export const DEFAULT_UNIT = 3;

export const UNITS: Unit[] = UNIT_DEFINITIONS.map(({ number, name, tag, noun, title, words }) => ({
  number,
  name: name ?? `Unit ${number}`,
  title,
  wordCount: words.length,
  tag: tag ?? (words.length ? String(words.length) : 'soon'),
  noun: noun ?? 'word',
}));

/**
 * A word's id is unique across units (e.g. "u3-der-platz"), so progress is per unit.
 * German that occurs more than once in a unit (sie = she / they, Sie = you) also gets
 * its English: "u2-sie-she", "u2-sie-they", "u2-sie-you-formal".
 */
const wordIds = (unit: number, words: WordInput[]) => {
  const base = words.map((word) => `u${unit}-${slugify(germanTerm(word))}`);
  return base.map((id, i) => (base.indexOf(id) === base.lastIndexOf(id) ? id : `${id}-${slugify(words[i].english)}`));
};

/** Every word of every unit. */
export const VOCABULARY: VocabWord[] = UNIT_DEFINITIONS.flatMap(({ number, words }) => {
  const ids = wordIds(number, words);
  return words.map((word, i) => ({
    ...word,
    unit: number,
    id: ids[i],
    sentences: EXAMPLES[ids[i]]?.map(([german, english, glosses]) => ({
      german,
      english,
      words: glossSentence(german, glosses),
    })),
  }));
});

export const wordsInUnit = (unit: number) => VOCABULARY.filter((word) => word.unit === unit);
