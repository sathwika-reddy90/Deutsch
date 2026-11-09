/**
 * Two short A1 example sentences for every word, shown under the audio buttons on
 * the German side of its card: [German, English, word meanings?].
 *
 * Keyed by word id (unit + slug of the German term, see `wordIds` in vocabulary.ts),
 * so a word that appears in two units can have its own sentences in each.
 * Letters (Alphabets) have none. The e2e test checks that every word has exactly two.
 *
 * Hovering / tapping a word shows its meaning from glossary.ts. The optional third
 * element gives the meaning in this sentence where it differs, e.g. "auf" in
 * "Ich warte auf den Bus." is "for", not "on". Same "meaning | note" format.
 */

export type WordGlosses = Record<string, string>;

export type ExamplePair = [german: string, english: string, glosses?: WordGlosses];

export const EXAMPLES: Record<string, [ExamplePair, ExamplePair]> = {
  // ------------------------------------------------------------- Unit 1
  'u1-das-butterbrot': [
    ['Ich esse ein Butterbrot.', 'I am eating bread and butter.'],
    ['Das Butterbrot ist für dich.', 'The bread and butter is for you.'],
  ],
  'u1-der-kranke': [
    ['Der Kranke liegt im Bett.', 'The sick man is lying in bed.', { liegt: 'is lying | liegen' }],
    ['Der Kranke trinkt Tee.', 'The sick man is drinking tea.'],
  ],
  'u1-italienisch': [
    ['Das Restaurant ist italienisch.', 'The restaurant is Italian.'],
    [
      'Wir essen heute italienisch.',
      'We are eating Italian today.',
      {
        italienisch: 'Italian (food) | italienisch essen = to eat Italian food',
      },
    ],
  ],
  'u1-das-fruehstueck': [
    ['Das Frühstück ist fertig.', 'Breakfast is ready.'],
    [
      'Ich trinke Kaffee zum Frühstück.',
      'I drink coffee for breakfast.',
      {
        zum: 'for | zum Frühstück = for breakfast',
      },
    ],
  ],
  'u1-die-autobahn': [
    ['Wir fahren auf der Autobahn.', 'We are driving on the highway.'],
    ['Die Autobahn ist heute voll.', 'The highway is busy today.', { voll: 'busy | literally: full' }],
  ],
  'u1-das-wuerstchen': [
    ['Ich esse ein Würstchen.', 'I am eating a sausage.'],
    ['Das Würstchen ist heiß.', 'The sausage is hot.'],
  ],
  'u1-der-walzer': [
    ['Wir tanzen einen Walzer.', 'We are dancing a waltz.'],
    ['Der Walzer ist schön.', 'The waltz is beautiful.'],
  ],
  'u1-der-rucksack': [
    ['Mein Rucksack ist schwer.', 'My backpack is heavy.'],
    ['Ich habe einen Rucksack.', 'I have a backpack.'],
  ],
  'u1-der-anzug': [
    ['Er trägt einen Anzug.', 'He is wearing a suit.'],
    ['Der Anzug ist schwarz.', 'The suit is black.'],
  ],
  'u1-ihre-sprache': [
    ['Was ist Ihre Sprache?', 'What is your language?'],
    ['Ihre Sprache ist schön.', 'Your language is beautiful.'],
  ],
  'u1-die-woerter': [
    ['Ich lerne neue Wörter.', 'I am learning new words.'],
    ['Die Wörter sind schwer.', 'The words are difficult.', { schwer: 'difficult | also: heavy' }],
  ],
  'u1-wer-bist-du': [
    ['Hallo! Wer bist du?', 'Hello! Who are you?'],
    ['Wer bist du? – Ich bin Lena.', 'Who are you? – I am Lena.'],
  ],
  'u1-hoeren': [
    ['Ich höre das Radio.', 'I hear the radio.'],
    ['Hörst du das?', 'Do you hear that?', { das: 'that' }],
  ],
  'u1-lesen': [
    ['Ich lese ein Buch.', 'I am reading a book.'],
    [
      'Sie liest die Zeitung.',
      'She is reading the newspaper.',
      {
        Sie: 'she | sie (capital at the start of the sentence)',
      },
    ],
  ],
  'u1-wie': [
    ['Wie alt bist du?', 'How old are you?'],
    ['Wie ist das Wetter?', 'How is the weather?', { Wie: 'how | Wie ist das Wetter? = What is the weather like?' }],
  ],
  'u1-heissen': [
    ['Ich heiße Anna.', 'My name is Anna.'],
    [
      'Wie heißt du?',
      'What is your name?',
      {
        Wie: 'what | literally “how”: Wie heißt du? = What is your name?',
        heißt: 'are called | heißen, du',
      },
    ],
  ],
  'u1-die-person': [
    ['Die Person ist nett.', 'The person is nice.'],
    [
      'Ein Zimmer für eine Person, bitte.',
      'A room for one person, please.',
      {
        eine: 'one | eine Person = one person',
      },
    ],
  ],
  'u1-wie-geht-s': [
    ["Hallo Tom, wie geht's?", 'Hi Tom, how are you?'],
    ["Wie geht's? – Gut, danke!", 'How are you? – Good, thanks!', { Gut: 'good / fine' }],
  ],
  'u1-auch': [
    ['Ich komme auch.', 'I am coming too.'],
    ['Er spricht auch Englisch.', 'He also speaks English.'],
  ],
  'u1-beruehmt': [
    ['Der Sänger ist berühmt.', 'The singer is famous.'],
    ['Berlin ist sehr berühmt.', 'Berlin is very famous.'],
  ],
  'u1-personen': [
    ['Wir sind vier Personen.', 'We are four people.'],
    ['Einen Tisch für zwei Personen, bitte.', 'A table for two people, please.'],
  ],
  'u1-auf-wiedersehen': [
    ['Auf Wiedersehen, Frau Müller!', 'Goodbye, Mrs Müller!', { Auf: 'until | Auf Wiedersehen = goodbye' }],
    ['Danke und auf Wiedersehen!', 'Thank you and goodbye!', { auf: 'until | Auf Wiedersehen = goodbye' }],
  ],
  'u1-wie-heissen-sie': [
    [
      'Guten Tag! Wie heißen Sie?',
      'Good day! What is your name?',
      {
        Tag: 'day | Guten Tag! = Good day / Hello',
        Wie: 'what | literally “how”: Wie heißen Sie? = What is your name?',
      },
    ],
    [
      'Wie heißen Sie, bitte?',
      'What is your name, please?',
      {
        Wie: 'what | literally “how”: Wie heißen Sie? = What is your name?',
      },
    ],
  ],
  'u1-wie-geht-es-ihnen': [
    ['Hallo! Wie geht es Ihnen?', 'Hello! How are you?', { geht: 'goes | Wie geht es Ihnen? = How are you?' }],
    ['Wie geht es Ihnen, Herr Braun?', 'How are you, Mr Braun?', { geht: 'goes | Wie geht es Ihnen? = How are you?' }],
  ],
  'u1-die-kollegin': [
    ['Das ist meine Kollegin.', 'This is my colleague.', { Das: 'this / that' }],
    ['Meine Kollegin heißt Maria.', 'My colleague is called Maria.'],
  ],
  'u1-die-sprache': [
    ['Deutsch ist eine schöne Sprache.', 'German is a beautiful language.'],
    ['Welche Sprache sprichst du?', 'Which language do you speak?'],
  ],
  'u1-wohnen': [
    ['Ich wohne in Berlin.', 'I live in Berlin.'],
    ['Meine Eltern wohnen in Hamburg.', 'My parents live in Hamburg.'],
  ],
  'u1-wo-wohnen-sie': [
    ['Wo wohnen Sie, Frau Klein?', 'Where do you live, Mrs Klein?'],
    ['Wo wohnen Sie? – In München.', 'Where do you live? – In Munich.'],
  ],
  'u1-wer-ist-das': [
    [
      'Wer ist das auf dem Foto?',
      'Who is that in the photo?',
      {
        das: 'that',
        auf: 'in | auf dem Foto = in the photo',
      },
    ],
    [
      'Wer ist das? – Das ist mein Bruder.',
      'Who is this? – This is my brother.',
      {
        das: 'this / that',
        Das: 'this / that',
      },
    ],
  ],
  'u1-die-zahlen': [
    ['Ich lerne die Zahlen.', 'I am learning the numbers.'],
    ['Die Zahlen sind einfach.', 'The numbers are easy.'],
  ],
  'u1-hungrig': [
    ['Ich bin sehr hungrig.', 'I am very hungry.'],
    ['Bist du hungrig?', 'Are you hungry?'],
  ],
  'u1-durstig': [
    ['Ich bin durstig.', 'I am thirsty.'],
    ['Die Kinder sind durstig.', 'The children are thirsty.'],
  ],
  'u1-muede': [
    ['Ich bin müde.', 'I am tired.'],
    ['Heute bin ich sehr müde.', 'Today I am very tired.'],
  ],
  'u1-ich-verstehe-nicht': [
    ['Ich verstehe nicht. Was ist das?', "I don't understand. What is that?", { das: 'that' }],
    [
      'Ich verstehe nicht. Wie bitte?',
      "I don't understand. Pardon?",
      {
        Wie: 'pardon? | Wie bitte? = Pardon?',
        bitte: 'please | Wie bitte? = Pardon?',
      },
    ],
  ],
  'u1-koennen-sie-helfen': [
    ['Bitte, können Sie helfen?', 'Please, can you help?'],
    ['Können Sie helfen, Herr Klein?', 'Can you help, Mr Klein?'],
  ],
  'u1-bis-spaeter': [
    ['Tschüss, bis später!', 'Bye, see you later!'],
    ['Bis später, Mama!', 'See you later, Mum!'],
  ],
  'u1-das-alphabet': [
    ['Das Alphabet hat 26 Buchstaben.', 'The alphabet has 26 letters.'],
    [
      'Kannst du das Alphabet?',
      'Do you know the alphabet?',
      {
        Kannst: 'can / do you know | können = also: to know (a language, the alphabet)',
      },
    ],
  ],
  'u1-die-buchstaben': [
    ['Mein Name hat fünf Buchstaben.', 'My name has five letters.'],
    ['Die Buchstaben sind groß.', 'The letters are big.'],
  ],
  'u1-at': [
    ['Meine E-Mail ist anna at web Punkt de.', 'My email is anna at web dot de.'],
    ['Schreiben Sie: max at gmx Punkt de.', 'Write: max at gmx dot de.', { Schreiben: 'write | instruction with Sie' }],
  ],
  'u1-der-punkt': [
    ['Der Satz endet mit einem Punkt.', 'The sentence ends with a full stop.'],
    ['Die Adresse ist web Punkt de.', 'The address is web dot de.'],
  ],
  'u1-minus': [
    ['Zehn minus drei ist sieben.', 'Ten minus three is seven.'],
    [
      'Heute sind es minus fünf Grad.',
      'Today it is minus five degrees.',
      {
        sind: 'are | Heute sind es … Grad = Today it is … degrees',
      },
    ],
  ],
  'u1-der-unterstrich': [
    ['Meine E-Mail hat einen Unterstrich.', 'My email has an underscore.'],
    ['Bitte mit Unterstrich schreiben.', 'Please write it with an underscore.'],
  ],
  'u1-buchstabieren': [
    ['Können Sie das buchstabieren?', 'Can you spell that?', { das: 'that' }],
    ['Ich buchstabiere meinen Namen.', 'I am spelling my name.'],
  ],
  'u1-kann': [
    ['Ich kann gut kochen.', 'I can cook well.', { gut: 'well' }],
    ['Er kann Deutsch sprechen.', 'He can speak German.'],
  ],
  'u1-noch-einmal': [
    [
      'Bitte noch einmal.',
      'Once again, please.',
      {
        noch: 'again | noch einmal = once more',
        einmal: 'once | noch einmal = once again',
      },
    ],
    [
      'Ich lese den Text noch einmal.',
      'I am reading the text once again.',
      {
        noch: 'again | noch einmal = once more',
        einmal: 'once | noch einmal = once again',
      },
    ],
  ],
  'u1-ich-verstehe-sie-nicht': [
    ['Ich verstehe Sie nicht gut.', "I don't understand you well.", { gut: 'well' }],
    ['Was? Ich verstehe Sie nicht.', "What? I don't understand you."],
  ],
  'u1-ein-bisschen-langsamer': [
    ['Ein bisschen langsamer, bitte.', 'A little slower, please.', { Ein: 'a | ein bisschen = a little' }],
    [
      'Bitte sprechen Sie ein bisschen langsamer.',
      'Please speak a little slower.',
      {
        ein: 'a | ein bisschen = a little',
      },
    ],
  ],
  'u1-das-land': [
    ['Kanada ist ein großes Land.', 'Canada is a big country.'],
    ['Aus welchem Land kommst du?', 'Which country are you from?'],
  ],
  'u1-die-laender': [
    ['Ich kenne viele Länder.', 'I know many countries.'],
    ['Welche Länder magst du?', 'Which countries do you like?'],
  ],
  'u1-die-sprachen': [
    ['Ich spreche zwei Sprachen.', 'I speak two languages.'],
    [
      'Sprachen lernen macht Spaß.',
      'Learning languages is fun.',
      {
        lernen: 'learning | Sprachen lernen = learning languages',
      },
    ],
  ],
  'u1-deutschland': [
    ['Ich wohne in Deutschland.', 'I live in Germany.'],
    ['Deutschland ist groß.', 'Germany is big.'],
  ],
  'u1-oesterreich': [
    ['Wien ist in Österreich.', 'Vienna is in Austria.'],
    ['Wir fahren nach Österreich.', 'We are going to Austria.', { fahren: 'are going (by car / train) | fahren' }],
  ],
  'u1-die-schweiz': [
    ['Ich komme aus der Schweiz.', 'I come from Switzerland.', { der: 'the | dative feminine (aus der Schweiz)' }],
    ['Die Schweiz hat viele Berge.', 'Switzerland has many mountains.'],
  ],
  'u1-frankreich': [
    ['Paris ist in Frankreich.', 'Paris is in France.'],
    ['Meine Freundin wohnt in Frankreich.', 'My friend lives in France.'],
  ],
  'u1-italien': [
    ['Ich mache Urlaub in Italien.', 'I am on holiday in Italy.', { mache: 'make | Urlaub machen = to be on holiday' }],
    ['Die Pizza kommt aus Italien.', 'Pizza comes from Italy.'],
  ],
  'u1-spanien': [
    ['Wir fliegen nach Spanien.', 'We are flying to Spain.'],
    ['In Spanien ist es warm.', 'It is warm in Spain.'],
  ],
  'u1-polen': [
    ['Mein Kollege kommt aus Polen.', 'My colleague comes from Poland.'],
    ['Polen liegt neben Deutschland.', 'Poland is next to Germany.', { liegt: 'is (located) | liegen' }],
  ],
  'u1-die-tuerkei': [
    ['Ich fliege in die Türkei.', 'I am flying to Turkey.', { in: 'to | in die Türkei = to Turkey' }],
    ['Die Türkei ist sehr schön.', 'Turkey is very beautiful.'],
  ],
  'u1-russland': [
    ['Russland ist sehr groß.', 'Russia is very big.'],
    ['Sie kommt aus Russland.', 'She comes from Russia.', { Sie: 'she | sie (capital at the start of the sentence)' }],
  ],
  'u1-brasilien': [
    ['Er kommt aus Brasilien.', 'He comes from Brazil.'],
    ['In Brasilien ist es heiß.', 'It is hot in Brazil.'],
  ],
  'u1-lang': [
    ['Der Film ist sehr lang.', 'The film is very long.'],
    ['Der Tag ist lang.', 'The day is long.'],
  ],

  // ------------------------------------------------------------- Unit 2
  'u2-die-arbeit': [
    ['Ich gehe zur Arbeit.', 'I am going to work.'],
    ['Die Arbeit macht Spaß.', 'The work is fun.'],
  ],
  'u2-der-beruf': [
    [
      'Was sind Sie von Beruf?',
      'What do you do for a living?',
      {
        Was: 'what | Was sind Sie von Beruf? = What do you do for a living?',
        von: 'by | von Beruf = by profession',
      },
    ],
    ['Ich bin Lehrer von Beruf.', 'I am a teacher by profession.', { von: 'by | von Beruf = by profession' }],
  ],
  'u2-fotografieren': [
    ['Ich fotografiere gern.', 'I like taking photos.'],
    ['Wir fotografieren den Turm.', 'We are photographing the tower.'],
  ],
  'u2-singen': [
    [
      'Sie singt sehr schön.',
      'She sings very beautifully.',
      {
        Sie: 'she | sie (capital at the start of the sentence)',
        schön: 'beautifully',
      },
    ],
    ['Wir singen zusammen.', 'We are singing together.'],
  ],
  'u2-kochen': [
    ['Ich koche heute Abend.', 'I am cooking this evening.', { heute: 'today | heute Abend = this evening' }],
    ['Mein Vater kocht gern.', 'My father likes to cook.'],
  ],
  'u2-schwimmen': [
    ['Ich schwimme im Sommer.', 'I swim in summer.'],
    ['Kannst du schwimmen?', 'Can you swim?'],
  ],
  'u2-reisen': [
    ['Ich reise gern.', 'I like to travel.'],
    ['Wir reisen nach Italien.', 'We are travelling to Italy.'],
  ],
  'u2-tanzen': [
    ['Wir tanzen am Samstag.', 'We are dancing on Saturday.'],
    ['Tanzt du gern?', 'Do you like to dance?'],
  ],
  'u2-musik-hoeren': [
    [
      'Ich möchte Musik hören.',
      'I would like to listen to music.',
      {
        hören: 'listen to | Musik hören = to listen to music',
      },
    ],
    [
      'Musik hören macht Spaß.',
      'Listening to music is fun.',
      {
        hören: 'listening to | Musik hören = listening to music',
      },
    ],
  ],
  'u2-das-kino': [
    ['Wir gehen ins Kino.', 'We are going to the cinema.'],
    ['Das Kino ist neu.', 'The cinema is new.'],
  ],
  'u2-die-frage': [
    ['Ich habe eine Frage.', 'I have a question.'],
    ['Die Frage ist einfach.', 'The question is easy.'],
  ],
  'u2-antworten': [
    ['Bitte antworten Sie.', 'Please answer.'],
    ['Er antwortet schnell.', 'He answers quickly.'],
  ],
  'u2-lieben': [
    ['Ich liebe dich.', 'I love you.'],
    ['Wir lieben Musik.', 'We love music.'],
  ],
  'u2-die-stadt': [
    ['Die Stadt ist sehr schön.', 'The city is very beautiful.'],
    ['Ich wohne in der Stadt.', 'I live in the city.'],
  ],
  'u2-das-wochenende': [
    ['Schönes Wochenende!', 'Have a nice weekend!'],
    [
      'Am Wochenende schlafe ich lange.',
      'At the weekend I sleep late.',
      {
        Am: 'at the | am Wochenende = at the weekend',
        lange: 'late | lange schlafen = to sleep in',
      },
    ],
  ],
  'u2-montag': [
    ['Am Montag arbeite ich.', 'On Monday I work.'],
    ['Heute ist Montag.', 'Today is Monday.'],
  ],
  'u2-der-arzt': [
    ['Ich gehe zum Arzt.', 'I am going to the doctor.'],
    ['Der Arzt ist sehr nett.', 'The doctor is very nice.'],
  ],
  'u2-die-klinik': [
    ['Die Klinik ist heute geschlossen.', 'The clinic is closed today.'],
    ['Er arbeitet in einer Klinik.', 'He works in a clinic.'],
  ],
  'u2-der-patient': [
    ['Der Patient wartet.', 'The patient is waiting.'],
    ['Der Arzt hilft dem Patienten.', 'The doctor helps the patient.'],
  ],
  'u2-die-woche': [
    ['Die Woche hat sieben Tage.', 'The week has seven days.'],
    ['Nächste Woche habe ich Urlaub.', 'Next week I am on holiday.'],
  ],
  'u2-menschen': [
    ['Hier wohnen viele Menschen.', 'Many people live here.'],
    ['Die Menschen sind freundlich.', 'The people are friendly.'],
  ],
  'u2-der-taxifahrer': [
    ['Der Taxifahrer ist freundlich.', 'The taxi driver is friendly.'],
    ['Mein Onkel ist Taxifahrer.', 'My uncle is a taxi driver.'],
  ],
  'u2-das-buch': [
    ['Ich kaufe ein Buch.', 'I am buying a book.'],
    ['Das Buch ist neu.', 'The book is new.'],
  ],
  'u2-das-geld': [
    ['Ich habe kein Geld.', 'I have no money.'],
    ['Das Geld ist auf dem Tisch.', 'The money is on the table.'],
  ],
  'u2-die-strasse': [
    ['Ich wohne in dieser Straße.', 'I live on this street.', { in: 'on | in dieser Straße = on this street' }],
    ['Die Straße ist sehr laut.', 'The street is very noisy.'],
  ],
  'u2-der-stift': [
    ['Hast du einen Stift?', 'Do you have a pen?'],
    ['Der Stift ist blau.', 'The pen is blue.'],
  ],
  'u2-das-medikament': [
    ['Ich nehme ein Medikament.', 'I am taking a medicine.'],
    ['Das Medikament hilft.', 'The medicine helps.'],
  ],
  'u2-die-rechnung': [
    ['Die Rechnung, bitte!', 'The bill, please!'],
    ['Die Rechnung ist hoch.', 'The bill is high.', { hoch: 'high' }],
  ],
  'u2-der-schluessel': [
    ['Wo ist mein Schlüssel?', 'Where is my key?'],
    ['Der Schlüssel ist in der Tasche.', 'The key is in the bag.', { der: 'the | dative feminine (in der Tasche)' }],
  ],
  'u2-die-tablette': [
    ['Ich nehme eine Tablette.', 'I am taking a pill.'],
    ['Die Tablette ist sehr klein.', 'The tablet is very small.'],
  ],
  'u2-22-jahre-alt': [
    ['Ich bin 22 Jahre alt.', 'I am 22 years old.'],
    ['Mein Bruder ist 22 Jahre alt.', 'My brother is 22 years old.'],
  ],
  'u2-das-seminar': [
    ['Das Seminar beginnt um neun Uhr.', "The seminar starts at nine o'clock."],
    ['Ich bin heute im Seminar.', 'I am in the seminar today.'],
  ],
  'u2-der-kurs': [
    ['Der Kurs ist am Montag.', 'The course is on Monday.'],
    ['Ich mache einen Kurs.', 'I am taking a course.', { mache: 'am taking | einen Kurs machen = to take a course' }],
  ],
  'u2-der-student': [
    ['Er ist Student.', 'He is a student.'],
    ['Der Student lernt viel.', 'The student studies a lot.', { lernt: 'studies | lernen' }],
  ],
  'u2-die-studentin': [
    [
      'Sie ist Studentin in Berlin.',
      'She is a student in Berlin.',
      {
        Sie: 'she | sie (capital at the start of the sentence)',
      },
    ],
    ['Die Studentin liest ein Buch.', 'The student is reading a book.'],
  ],
  'u2-die-fahrt': [
    ['Die Fahrt ist lang.', 'The journey is long.'],
    ['Gute Fahrt!', 'Have a good trip!', { Gute: 'good | Gute Fahrt! = Have a good trip!' }],
  ],
  'u2-warten': [
    ['Ich warte auf den Bus.', 'I am waiting for the bus.', { auf: 'for | warten auf = to wait for' }],
    ['Bitte warten Sie hier.', 'Please wait here.'],
  ],
  'u2-pro-woche': [
    ['Ich arbeite 40 Stunden pro Woche.', 'I work 40 hours per week.'],
    ['Der Kurs ist zweimal pro Woche.', 'The course is twice per week.'],
  ],
  'u2-das-krankenhaus': [
    [
      'Sie arbeitet im Krankenhaus.',
      'She works in the hospital.',
      {
        Sie: 'she | sie (capital at the start of the sentence)',
      },
    ],
    ['Das Krankenhaus ist groß.', 'The hospital is big.'],
  ],
  'u2-das-zimmer': [
    ['Mein Zimmer ist klein.', 'My room is small.'],
    ['Das Zimmer hat ein Fenster.', 'The room has a window.'],
  ],
  'u2-der-platz': [
    ['Das ist mein Platz.', 'That is my place.', { Das: 'that' }],
    ['Ist der Platz frei?', 'Is the place free?', { Platz: 'place / seat' }],
  ],
  'u2-die-nacht': [
    ['Gute Nacht!', 'Good night!', { Gute: 'good | Gute Nacht! = Good night!' }],
    [
      'In der Nacht schlafe ich.',
      'At night I sleep.',
      {
        In: 'at | in der Nacht = at night',
        der: 'the | dative feminine (in der Nacht)',
      },
    ],
  ],
  'u2-die-vorlesungen': [
    [
      'Die Vorlesungen sind am Morgen.',
      'The lectures are in the morning.',
      {
        am: 'in the | am Morgen = in the morning',
      },
    ],
    ['Ich habe heute zwei Vorlesungen.', 'I have two lectures today.'],
  ],
  'u2-die-seminare': [
    ['Die Seminare sind interessant.', 'The seminars are interesting.'],
    ['Wir haben viele Seminare.', 'We have many seminars.'],
  ],
  'u2-ich': [
    ['Ich bin Anna.', 'I am Anna.'],
    ['Ich trinke Kaffee.', 'I drink coffee.'],
  ],
  'u2-du': [
    ['Du bist nett.', 'You are nice.'],
    ['Kommst du mit?', 'Are you coming along?', { mit: 'along | mitkommen = to come along' }],
  ],
  'u2-er': [
    ['Er ist mein Bruder.', 'He is my brother.'],
    ['Er arbeitet in Köln.', 'He works in Cologne.'],
  ],
  'u2-sie-she': [
    [
      'Das ist Maria. Sie ist Lehrerin.',
      'This is Maria. She is a teacher.',
      {
        Das: 'this',
        Sie: 'she | sie (capital at the start of the sentence)',
      },
    ],
    [
      'Lisa ist nett. Sie lacht viel.',
      'Lisa is nice. She laughs a lot.',
      {
        Sie: 'she | sie (capital at the start of the sentence)',
      },
    ],
  ],
  'u2-es': [
    ['Es regnet.', 'It is raining.'],
    ['Das Haus ist alt. Es ist groß.', 'The house is old. It is big.'],
  ],
  'u2-wir': [
    ['Wir lernen Deutsch.', 'We are learning German.'],
    ['Wir wohnen in Hamburg.', 'We live in Hamburg.'],
  ],
  'u2-ihr': [
    ['Wo wohnt ihr?', 'Where do you all live?', { wohnt: 'live | wohnen, ihr' }],
    ['Ihr seid sehr nett.', 'You are all very nice.', { Ihr: 'you | informal, several people (ihr)' }],
  ],
  'u2-sie-they': [
    [
      'Tom und Lisa? Sie sind Freunde.',
      'Tom and Lisa? They are friends.',
      {
        Sie: 'they | sie (capital at the start of the sentence)',
      },
    ],
    [
      'Die Kinder spielen. Sie sind laut.',
      'The children are playing. They are loud.',
      {
        Sie: 'they | sie (capital at the start of the sentence)',
      },
    ],
  ],
  'u2-sie-you-formal': [
    ['Woher kommen Sie?', 'Where are you from?'],
    ['Sprechen Sie Englisch?', 'Do you speak English?'],
  ],
  'u2-das': [
    ['Das Kind spielt.', 'The child is playing.'],
    ['Das Auto ist rot.', 'The car is red.'],
  ],
  'u2-der-sommer': [
    ['Im Sommer ist es warm.', 'In summer it is warm.'],
    ['Der Sommer ist schön.', 'Summer is beautiful.'],
  ],
  'u2-der-herbst': [
    ['Im Herbst regnet es oft.', 'In autumn it often rains.'],
    ['Der Herbst ist bunt.', 'Autumn is colourful.'],
  ],
  'u2-der-winter': [
    ['Im Winter ist es kalt.', 'In winter it is cold.'],
    ['Der Winter ist lang.', 'Winter is long.'],
  ],
  'u2-der-fruehling': [
    ['Im Frühling blühen die Blumen.', 'In spring the flowers bloom.'],
    ['Der Frühling kommt bald.', 'Spring is coming soon.'],
  ],
  'u2-der-nachname': [
    ['Mein Nachname ist Schmidt.', 'My surname is Schmidt.'],
    ['Wie ist Ihr Nachname?', 'What is your last name?', { Wie: 'what | Wie ist …? = What is …?' }],
  ],
  'u2-der-vorname': [
    ['Mein Vorname ist Paul.', 'My first name is Paul.'],
    ['Wie ist dein Vorname?', 'What is your first name?', { Wie: 'what | Wie ist …? = What is …?' }],
  ],
  'u2-das-geburtsdatum': [
    ['Wie ist Ihr Geburtsdatum?', 'What is your date of birth?', { Wie: 'what | Wie ist …? = What is …?' }],
    [
      'Mein Geburtsdatum ist der 3. Mai.',
      'My date of birth is the 3rd of May.',
      {
        der: 'the | der 3. Mai = the 3rd of May',
      },
    ],
  ],
  'u2-der-geburtsort': [
    ['Mein Geburtsort ist Wien.', 'My place of birth is Vienna.'],
    ['Was ist Ihr Geburtsort?', 'What is your place of birth?'],
  ],
  'u2-die-adresse': [
    ['Wie ist Ihre Adresse?', 'What is your address?', { Wie: 'what | Wie ist …? = What is …?' }],
    ['Meine Adresse ist Hauptstraße 5.', 'My address is Hauptstraße 5.'],
  ],
  'u2-die-telefonnummer': [
    ['Wie ist Ihre Telefonnummer?', 'What is your telephone number?', { Wie: 'what | Wie ist …? = What is …?' }],
    ['Meine Telefonnummer ist neu.', 'My telephone number is new.'],
  ],
  'u2-die-handynummer': [
    ['Hast du meine Handynummer?', 'Do you have my mobile number?'],
    ['Meine Handynummer ist 0176 123456.', 'My mobile number is 0176 123456.'],
  ],
  'u2-die-hausnummer': [
    ['Meine Hausnummer ist zwölf.', 'My house number is twelve.'],
    ['Wie ist die Hausnummer?', 'What is the house number?', { Wie: 'what | Wie ist …? = What is …?' }],
  ],
  'u2-die-postleitzahl': [
    ['Wie ist die Postleitzahl?', 'What is the postcode?', { Wie: 'what | Wie ist …? = What is …?' }],
    ['Meine Postleitzahl ist 10115.', 'My postcode is 10115.'],
  ],
  'u2-der-wohnort': [
    ['Mein Wohnort ist Hamburg.', 'My place of residence is Hamburg.'],
    ['Bitte schreiben Sie Ihren Wohnort.', 'Please write your place of residence.'],
  ],

  // ------------------------------------------------------------- Unit 3
  'u3-der-platz': [
    ['Der Platz ist sehr groß.', 'The square is very big.', { Platz: 'square | here: a town square' }],
    ['Auf dem Platz ist ein Café.', 'There is a café on the square.', { Platz: 'square | here: a town square' }],
  ],
  'u3-das-gebaeude': [
    ['Das Gebäude ist sehr hoch.', 'The building is very tall.'],
    ['Ich arbeite in diesem Gebäude.', 'I work in this building.'],
  ],
  'u3-benennen': [
    ['Bitte benennen Sie die Dinge.', 'Please name the things.'],
    ['Wir benennen die Farben.', 'We are naming the colours.'],
  ],
  'u3-das-verkehrsmittel': [
    ['Der Bus ist ein Verkehrsmittel.', 'The bus is a means of transport.'],
    ['Welches Verkehrsmittel nimmst du?', 'Which transport do you take?'],
  ],
  'u3-die-dinge': [
    ['Ich kaufe viele Dinge.', 'I am buying many things.'],
    ['Die Dinge sind auf dem Tisch.', 'The things are on the table.'],
  ],
  'u3-die-jahreszeiten': [
    [
      'Es gibt vier Jahreszeiten.',
      'There are four seasons.',
      {
        Es: 'there | es gibt = there is / there are',
        gibt: 'are | es gibt = there are',
      },
    ],
    ['Ich mag alle Jahreszeiten.', 'I like all seasons.'],
  ],
  'u3-die-monate': [
    ['Ein Jahr hat zwölf Monate.', 'A year has twelve months.'],
    ['Die Monate im Sommer sind warm.', 'The months in summer are warm.'],
  ],
  'u3-das-rathaus': [
    ['Das Rathaus ist alt.', 'The town hall is old.'],
    ['Ich gehe zum Rathaus.', 'I am going to the town hall.'],
  ],
  'u3-das-schiff': [
    ['Das Schiff ist groß.', 'The ship is big.'],
    [
      'Wir fahren mit dem Schiff.',
      'We are travelling by ship.',
      {
        fahren: 'are travelling | fahren mit = to go by',
        mit: 'by | mit dem Schiff = by ship',
      },
    ],
  ],
  'u3-das-meer': [
    ['Ich sehe das Meer.', 'I see the sea.'],
    ['Das Meer ist blau.', 'The sea is blue.'],
  ],
  'u3-der-see': [
    ['Der See ist sehr ruhig.', 'The lake is very calm.'],
    ['Im Sommer schwimmen wir im See.', 'In summer we swim in the lake.'],
  ],
  'u3-der-fluss': [
    ['Der Fluss ist lang.', 'The river is long.'],
    ['Die Brücke geht über den Fluss.', 'The bridge goes over the river.', { geht: 'goes | here: crosses' }],
  ],
  'u3-fahren': [
    [
      'Ich fahre mit dem Bus.',
      'I am going by bus.',
      {
        fahre: 'go | fahren mit = to go by (vehicle)',
        mit: 'by | mit dem Bus = by bus',
      },
    ],
    ['Wir fahren nach Berlin.', 'We are driving to Berlin.', { fahren: 'are driving / going | fahren' }],
  ],
  'u3-die-stunden': [
    ['Ich arbeite acht Stunden.', 'I work eight hours.'],
    ['Der Film dauert zwei Stunden.', 'The film lasts two hours.'],
  ],
  'u3-die-breite': [
    ['Die Breite ist zwei Meter.', 'The width is two metres.'],
    ['Wie ist die Breite vom Tisch?', 'What is the width of the table?', { Wie: 'what | Wie ist …? = What is …?' }],
  ],
  'u3-die-hoehe': [
    ['Die Höhe ist drei Meter.', 'The height is three metres.'],
    ['Wie ist die Höhe vom Turm?', 'What is the height of the tower?', { Wie: 'what | Wie ist …? = What is …?' }],
  ],
  'u3-der-turm': [
    ['Der Turm ist alt.', 'The tower is old.'],
    ['Wir sehen den Turm.', 'We see the tower.'],
  ],
  'u3-die-kunsthalle': [
    ['Die Kunsthalle ist heute offen.', 'The art hall is open today.'],
    [
      'Wir gehen in die Kunsthalle.',
      'We are going to the art hall.',
      {
        in: 'to / into | in die Kunsthalle = to the art hall',
      },
    ],
  ],
  'u3-das-glueck': [
    ['Viel Glück!', 'Good luck!', { Viel: 'much | Viel Glück! = Good luck!' }],
    ['Ich habe Glück.', 'I am lucky.', { habe: 'have | Glück haben = to be lucky' }],
  ],
  'u3-links': [
    [
      'Gehen Sie nach links.',
      'Go to the left.',
      {
        Gehen: 'go | instruction with Sie',
        nach: 'to | nach links = to the left',
        links: 'left',
      },
    ],
    ['Das Café ist links.', 'The café is on the left.', { links: 'on the left' }],
  ],
  'u3-rechts': [
    [
      'Biegen Sie rechts ab.',
      'Turn right.',
      {
        Biegen: 'turn | abbiegen: “ab” moves to the end',
        Sie: 'you | formal; verb first = an instruction',
        rechts: 'right',
      },
    ],
    ['Die Bank ist rechts.', 'The bank is on the right.', { rechts: 'on the right' }],
  ],
  'u3-geradeaus': [
    ['Gehen Sie geradeaus.', 'Go straight ahead.', { Gehen: 'go | instruction with Sie' }],
    ['Der Bahnhof ist geradeaus.', 'The station is straight ahead.'],
  ],
  'u3-die-wegbeschreibung': [
    ['Ich brauche eine Wegbeschreibung.', 'I need directions.'],
    ['Die Wegbeschreibung ist einfach.', 'The directions are easy.'],
  ],
  'u3-die-jahreszeit': [
    ['Welche Jahreszeit magst du?', 'Which season do you like?'],
    ['Der Herbst ist eine schöne Jahreszeit.', 'Autumn is a beautiful season.'],
  ],
  'u3-das-messer': [
    ['Das Messer ist scharf.', 'The knife is sharp.'],
    ['Ich brauche ein Messer.', 'I need a knife.'],
  ],
  'u3-die-gabel': [
    ['Ich esse mit der Gabel.', 'I eat with the fork.', { der: 'the | dative feminine (mit der Gabel)' }],
    ['Die Gabel liegt links.', 'The fork is on the left.', { liegt: 'lies / is | liegen', links: 'on the left' }],
  ],
  'u3-der-loeffel': [
    ['Ich esse Suppe mit dem Löffel.', 'I eat soup with the spoon.'],
    ['Der Löffel ist klein.', 'The spoon is small.'],
  ],
  'u3-die-tassen': [
    ['Wir haben zwei Tassen.', 'We have two cups.'],
    ['Die Tassen sind im Schrank.', 'The cups are in the cupboard.'],
  ],

  // ------------------------------------------------------------- Unit 4
  'u4-die-mahlzeit': [
    ['Das ist eine gesunde Mahlzeit.', 'That is a healthy meal.', { Das: 'that' }],
    ['Wir essen drei Mahlzeiten am Tag.', 'We eat three meals a day.', { am: 'a | am Tag = a day / per day' }],
  ],
  'u4-der-appetit': [
    ['Guten Appetit!', 'Enjoy your meal!', { Guten: 'good | Guten Appetit! = Enjoy your meal!' }],
    ['Ich habe keinen Appetit.', 'I have no appetite.'],
  ],
  'u4-das-gespraech': [
    ['Das Gespräch ist interessant.', 'The conversation is interesting.'],
    ['Ich habe ein Gespräch mit dem Chef.', 'I have a conversation with the boss.'],
  ],
  'u4-die-vorlieben': [
    ['Was sind deine Vorlieben?', 'What are your preferences?'],
    ['Jeder hat Vorlieben.', 'Everyone has preferences.'],
  ],
  'u4-das-ei': [
    ['Ich esse ein Ei.', 'I am eating an egg.'],
    ['Das Ei ist warm.', 'The egg is warm.'],
  ],
  'u4-der-kaese': [
    ['Ich esse gern Käse.', 'I like eating cheese.', { gern: 'gladly | gern essen = to like eating' }],
    [
      'Der Käse kommt aus der Schweiz.',
      'The cheese comes from Switzerland.',
      {
        der: 'the | dative feminine (aus der Schweiz)',
      },
    ],
  ],
  'u4-der-orangensaft': [
    ['Ich trinke Orangensaft.', 'I am drinking orange juice.'],
    ['Der Orangensaft ist kalt.', 'The orange juice is cold.'],
  ],
  'u4-die-marmelade': [
    ['Ich esse Brot mit Marmelade.', 'I eat bread with jam.'],
    ['Die Marmelade ist aus Erdbeeren.', 'The jam is made of strawberries.', { aus: 'made of | aus = from / out of' }],
  ],
  'u4-die-banane': [
    ['Die Banane ist gelb.', 'The banana is yellow.'],
    ['Ich kaufe eine Banane.', 'I am buying a banana.'],
  ],
  'u4-das-broetchen': [
    ['Ich esse ein Brötchen.', 'I am eating a bread roll.'],
    ['Das Brötchen ist frisch.', 'The bread roll is fresh.'],
  ],
  'u4-das-mittagessen': [
    ['Das Mittagessen ist um zwölf Uhr.', "Lunch is at twelve o'clock."],
    [
      'Was gibt es zum Mittagessen?',
      'What is for lunch?',
      {
        gibt: 'is there | es gibt = there is',
        es: 'there | es gibt = there is',
        zum: 'for | zum Mittagessen = for lunch',
      },
    ],
  ],
  'u4-das-fruehstueck': [
    [
      'Zum Frühstück esse ich ein Brötchen.',
      'For breakfast I eat a bread roll.',
      {
        Zum: 'for | zum Frühstück = for breakfast',
      },
    ],
    ['Das Frühstück ist sehr wichtig.', 'Breakfast is very important.'],
  ],
  'u4-der-apfelsaft': [
    ['Ein Apfelsaft, bitte.', 'An apple juice, please.'],
    ['Der Apfelsaft ist sehr gut.', 'The apple juice is very good.', { gut: 'good' }],
  ],
  'u4-die-kartoffel': [
    ['Die Kartoffel ist groß.', 'The potato is big.'],
    ['Ich koche Kartoffeln.', 'I am cooking potatoes.'],
  ],
  'u4-das-gemuese': [
    ['Ich esse viel Gemüse.', 'I eat a lot of vegetables.'],
    ['Das Gemüse ist frisch.', 'The vegetables are fresh.'],
  ],
  'u4-das-oel': [
    ['Ich brauche Öl zum Kochen.', 'I need oil for cooking.', { zum: 'for | zum Kochen = for cooking' }],
    ['Das Öl ist in der Küche.', 'The oil is in the kitchen.', { der: 'the | dative feminine (in der Küche)' }],
  ],
  'u4-der-kuchen': [
    ['Der Kuchen ist lecker.', 'The cake is delicious.'],
    ['Ich backe einen Kuchen.', 'I am baking a cake.'],
  ],
  'u4-die-sahne': [
    ['Ich möchte Kaffee mit Sahne.', 'I would like coffee with cream.'],
    [
      'Möchtest du Sahne zum Kuchen?',
      'Would you like cream with the cake?',
      {
        zum: 'with | zum Kuchen = with the cake',
      },
    ],
  ],
  'u4-die-schokolade': [
    ['Kinder lieben Schokolade.', 'Children love chocolate.'],
    ['Ich kaufe eine Tafel Schokolade.', 'I am buying a bar of chocolate.'],
  ],
  'u4-der-keks': [
    ['Möchtest du einen Keks?', 'Would you like a cookie?'],
    ['Der Keks ist süß.', 'The cookie is sweet.'],
  ],
  'u4-der-zucker': [
    ['Nehmen Sie Zucker?', 'Do you take sugar?', { Nehmen: 'take | Nehmen Sie …? = Do you take …?' }],
    ['Ich trinke Tee ohne Zucker.', 'I drink tea without sugar.'],
  ],
  'u4-das-abendessen': [
    ['Wir kochen das Abendessen.', 'We are cooking dinner.'],
    ['Das Abendessen ist um sieben.', 'Dinner is at seven.'],
  ],
  'u4-die-suppe': [
    ['Die Suppe ist zu heiß.', 'The soup is too hot.'],
    [
      'Heute gibt es Suppe.',
      'Today there is soup.',
      {
        gibt: 'is there | es gibt = there is',
        es: 'there | es gibt = there is',
      },
    ],
  ],
  'u4-die-gurke': [
    ['Die Gurke ist grün.', 'The cucumber is green.'],
    ['Ich esse Salat mit Gurke.', 'I eat salad with cucumber.'],
  ],
  'u4-die-lebensmittel': [
    ['Ich kaufe Lebensmittel.', 'I am buying groceries.'],
    ['Die Lebensmittel sind teuer.', 'The groceries are expensive.'],
  ],
  'u4-das-ist-alles': [
    ['Danke, das ist alles.', "Thanks, that's all.", { das: 'that' }],
    [
      'Zwei Brötchen, bitte. Das ist alles.',
      "Two bread rolls, please. That's all.",
      {
        Das: 'that',
        Brötchen: 'bread rolls | das Brötchen, plural die Brötchen',
      },
    ],
  ],
  'u4-kaufen': [
    ['Ich kaufe Brot.', 'I am buying bread.'],
    ['Wir kaufen ein Auto.', 'We are buying a car.'],
  ],
  'u4-die-getraenke': [
    ['Die Getränke sind kalt.', 'The drinks are cold.'],
    ['Welche Getränke haben Sie?', 'Which drinks do you have?'],
  ],
  'u4-alles': [
    ['Alles ist gut.', 'Everything is fine.', { gut: 'fine' }],
    ['Ich habe alles.', 'I have everything.'],
  ],
  'u4-mehr': [
    ['Ich möchte mehr Kaffee.', 'I would like more coffee.'],
    ['Er arbeitet mehr als ich.', 'He works more than I do.'],
  ],
  'u4-stimmt': [
    [
      'Ist das richtig? – Stimmt.',
      'Is that right? – Correct.',
      {
        das: 'that',
        Stimmt: 'correct | stimmen = to be right',
      },
    ],
    [
      'Stimmt, das ist mein Buch.',
      "That's right, that is my book.",
      {
        Stimmt: 'that’s right | stimmen = to be right',
        das: 'that',
      },
    ],
  ],
  'u4-das-bild': [
    ['Das Bild ist schön.', 'The picture is beautiful.'],
    ['Ich male ein Bild.', 'I am painting a picture.'],
  ],
  'u4-der-einkaufswagen': [
    ['Ich brauche einen Einkaufswagen.', 'I need a shopping cart.'],
    ['Der Einkaufswagen ist voll.', 'The shopping cart is full.'],
  ],
  'u4-das-wechselgeld': [
    ['Hier ist Ihr Wechselgeld.', 'Here is your change.'],
    ['Das Wechselgeld stimmt nicht.', 'The change is not right.'],
  ],
  'u4-dran': [
    ['Wer ist dran?', 'Whose turn is it?', { Wer: 'who | Wer ist dran? = Whose turn is it?' }],
    ['Du bist dran!', "It's your turn!"],
  ],
  'u4-sonst-noch-etwas': [
    [
      'Sonst noch etwas? – Nein, danke.',
      'Anything else? – No, thanks.',
      {
        Sonst: 'else | Sonst noch etwas? = Anything else?',
        noch: 'else | noch etwas = anything else',
      },
    ],
    [
      'Ein Kaffee. Sonst noch etwas?',
      'A coffee. Anything else?',
      {
        Sonst: 'else | Sonst noch etwas? = Anything else?',
        noch: 'else | noch etwas = anything else',
      },
    ],
  ],
  'u4-der-reis': [
    ['Ich koche Reis.', 'I am cooking rice.'],
    ['Wir essen Reis mit Gemüse.', 'We are eating rice with vegetables.'],
  ],
  'u4-die-tuete': [
    ['Brauchen Sie eine Tüte?', 'Do you need a bag?'],
    ['Die Tüte ist schwer.', 'The bag is heavy.'],
  ],
  'u4-der-kassenzettel': [
    ['Hier ist der Kassenzettel.', 'Here is the receipt.'],
    ['Ich brauche den Kassenzettel.', 'I need the receipt.'],
  ],
  'u4-gleichfalls': [
    ['Schönes Wochenende! – Gleichfalls!', 'Have a nice weekend! – Same to you!'],
    ['Frohes Fest! – Gleichfalls!', 'Happy holidays! – Same to you!'],
  ],
  'u4-schmeckt': [
    ['Die Suppe schmeckt gut.', 'The soup tastes good.'],
    [
      'Schmeckt dir der Kuchen?',
      'Does the cake taste good to you?',
      {
        Schmeckt: 'tastes | Schmeckt dir …? = Do you like (the taste of) …?',
      },
    ],
  ],
  'u4-satt': [
    ['Danke, ich bin satt.', 'Thanks, I am full.'],
    ['Nach dem Essen sind wir satt.', 'After the meal we are full.', { Nach: 'after' }],
  ],
  'u4-mahlzeit': [
    [
      'Mahlzeit, Herr Weber!',
      'Enjoy your lunch, Mr Weber!',
      {
        Mahlzeit: 'enjoy your lunch | a lunchtime greeting at work',
      },
    ],
    [
      'Mahlzeit! Wir gehen jetzt in die Kantine.',
      'Enjoy your lunch! We are going to the canteen now.',
      {
        Mahlzeit: 'enjoy your lunch | a lunchtime greeting at work',
        in: 'to / into | in die Kantine = to the canteen',
      },
    ],
  ],
};
