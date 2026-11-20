import { useCallback, useEffect, useRef, useState } from 'react';

export type SpeechMode = 'normal' | 'slow';

/** Speaking rates: normal for everyday listening, slow for beginners. */
export const SPEECH_RATES: Record<SpeechMode, number> = { normal: 0.85, slow: 0.55 };
/** Example sentences: closer to natural speed, and a slow speed that keeps the sentence flowing. */
export const SENTENCE_RATES: Record<SpeechMode, number> = { normal: 0.9, slow: 0.7 };

/** Speech id of a word's example sentence (index 0 or 1), e.g. "u3-das-meer#1". */
export const sentenceSpeechId = (wordId: string, index: number) => `${wordId}#${index + 1}`;
const PITCH = 1;

export type SpeechLanguage = 'de' | 'en';
const LANG_TAG: Record<SpeechLanguage, string> = { de: 'de-DE', en: 'en-US' };

const normalizeLang = (lang: string) => lang.replace('_', '-').toLowerCase();

/** How long an utterance may take to start before it counts as dropped (phone engines can be slow to wake). */
const START_GRACE_MS = 1000;
/** An engine that claims to be busy but never starts speaking is given up on after this long. */
const START_TIMEOUT_MS = 10000;
/** Pause before the one retry of a dropped utterance (lets a late cancel settle). */
const RETRY_DELAY_MS = 120;

/**
 * Picks a voice for a language from whatever the browser offers – no voice
 * names are hard-coded. Prefers the exact tag (e.g. `de-DE`), then any voice of
 * that language (`de-*`); within each group an on-device voice beats one that
 * needs the network (Android lists both), then the system default voice wins,
 * otherwise the browser's own order is kept.
 */
function pickVoice(voices: SpeechSynthesisVoice[], preferredTag: string): SpeechSynthesisVoice | null {
  const exact = preferredTag.toLowerCase();
  const language = exact.split('-')[0];
  const tier = (v: SpeechSynthesisVoice) => {
    const lang = normalizeLang(v.lang);
    if (lang === exact) return 0;
    if (lang.startsWith(language)) return 1;
    return 2;
  };
  const remote = (v: SpeechSynthesisVoice) => (v.localService === false ? 1 : 0);
  const matches = voices
    .map((voice, index) => ({ voice, index }))
    .filter(({ voice }) => tier(voice) < 2)
    .sort(
      (a, b) =>
        tier(a.voice) - tier(b.voice) ||
        remote(a.voice) - remote(b.voice) ||
        Number(b.voice.default) - Number(a.voice.default) ||
        a.index - b.index,
    );
  return matches[0]?.voice ?? null;
}

export const pickGermanVoice = (voices: SpeechSynthesisVoice[]) => pickVoice(voices, 'de-DE');

/**
 * English (Speaking Practice prompt): respect the user's own choice first – the
 * system default voice if it is English, then a voice matching the browser
 * language (e.g. en-IN), then en-US, then any English voice.
 */
export function pickEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const english = voices.filter((v) => normalizeLang(v.lang).startsWith('en'));
  const systemDefault = english.find((v) => v.default);
  if (systemDefault) return systemDefault;
  const browserLang = typeof navigator !== 'undefined' ? normalizeLang(navigator.language) : '';
  if (browserLang.startsWith('en')) {
    const local = pickVoice(english, browserLang);
    if (local && normalizeLang(local.lang) === browserLang) return local;
  }
  return pickVoice(english, 'en-US');
}

const isSupported = () =>
  typeof window !== 'undefined' && !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function';

/** iPhone / iPad (iPadOS reports itself as a Mac with touch). */
const isAppleMobile = () =>
  typeof navigator !== 'undefined' &&
  (/iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1));

const IOS_TIP_KEY = 'deutsch-lernen:ios-audio-tip';

export interface SpeakingState {
  id: string;
  mode: SpeechMode;
}

export interface SayOptions {
  language: SpeechLanguage;
  rate: number;
}

/** A short message about audio, shown above the card controls. */
export interface SpeechNotice {
  /** Changes for every new notice (so the same text can be shown again). */
  key: number;
  tone: 'error' | 'warning' | 'tip';
  title: string;
  detail?: string;
}

/** Why an utterance did not play: a SpeechSynthesisErrorEvent code, or "no-start" (it never began). */
type SpeechProblem = string;

const GERMAN_VOICE_HELP =
  'iPhone/iPad: Settings → Accessibility → Spoken Content → Voices → German. Android: Settings → search “Text-to-speech” → install German voice data.';

function describeProblem(problem: SpeechProblem): Omit<SpeechNotice, 'key'> {
  switch (problem) {
    case 'not-allowed':
      return { tone: 'error', title: 'The browser blocked the audio.', detail: 'Tap the speaker button again to play it.' };
    case 'language-unavailable':
    case 'voice-unavailable':
      return {
        tone: 'error',
        title: 'This device has no German voice for speech.',
        detail: `Add one, then reload the page. ${GERMAN_VOICE_HELP}`,
      };
    case 'network':
      return {
        tone: 'error',
        title: 'The German voice needs an internet connection.',
        detail: 'Check your connection and tap again, or install an offline German voice.',
      };
    case 'audio-busy':
    case 'audio-hardware':
      return {
        tone: 'error',
        title: 'The phone’s audio output is busy.',
        detail: 'Stop other apps that are playing sound (or a call), then tap again.',
      };
    case 'no-start':
      return {
        tone: 'error',
        title: 'The audio didn’t start.',
        detail: isAppleMobile()
          ? 'Turn the volume up and check that Silent Mode is off, then tap again.'
          : 'Turn the volume up and tap again. If it stays silent, your browser may need a German text-to-speech voice.',
      };
    default:
      return {
        tone: 'error',
        title: 'The German audio could not be played.',
        detail: `Your device’s speech engine reported “${problem}”. Tap again, or try another browser.`,
      };
  }
}

/**
 * Text-to-speech via the Web Speech API, shared by Listen, Slow Listen, the example
 * sentences, the unit test and Speaking Practice. Only one utterance ever plays.
 *
 * Phone browsers are stricter than desktop ones, so every utterance:
 *   - is spoken synchronously inside the tap/click that asked for it (iOS Safari ignores
 *     `speak()` that isn't tied to a user gesture until one has been);
 *   - only cancels earlier speech when something is actually playing (a cancel() right
 *     before speak() can swallow the new utterance on mobile engines);
 *   - uses a voice looked up fresh at that moment, `lang` always set (de-DE for German);
 *   - must really start: an utterance that is dropped is retried once, and one that
 *     never starts or fails is reported through `notice` – never shown as played.
 */
export function useGermanSpeech() {
  const [supported] = useState(isSupported);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [englishVoice, setEnglishVoice] = useState<SpeechSynthesisVoice | null>(null);
  /** The browser has reported its voice list (it may still contain no German voice). */
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  /** Which Listen / Slow Listen button is playing (Speaking Practice tracks its own status). */
  const [speaking, setSpeaking] = useState<SpeakingState | null>(null);
  const [notice, setNotice] = useState<SpeechNotice | null>(null);

  const voicesLoadedRef = useRef(false);
  /** The request currently in progress; anything from an older one is ignored. */
  const requestRef = useRef<object | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onDoneRef = useRef<((completed: boolean) => void) | null>(null);
  const buttonKeyRef = useRef<string | null>(null);
  const watchdogRef = useRef<number | undefined>(undefined);
  const retryTimerRef = useRef<number | undefined>(undefined);
  const noticeKeyRef = useRef(0);
  const warnedNoGermanRef = useRef(false);

  const show = useCallback((next: Omit<SpeechNotice, 'key'>) => {
    noticeKeyRef.current++;
    setNotice({ ...next, key: noticeKeyRef.current });
  }, []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    // Voices load asynchronously: Chrome returns [] at first and fires `voiceschanged`;
    // some mobile browsers fill the list late without firing it, so also poll briefly.
    const update = () => {
      const voices = synth.getVoices();
      setVoice(pickGermanVoice(voices));
      setEnglishVoice(pickEnglishVoice(voices));
      if (voices.length) {
        voicesLoadedRef.current = true;
        setVoicesLoaded(true);
      }
      return voices.length > 0;
    };
    let polls = 0;
    const poll = window.setInterval(() => {
      if (update() || ++polls >= 20) window.clearInterval(poll);
    }, 250);
    if (update()) window.clearInterval(poll);
    synth.addEventListener?.('voiceschanged', update);
    return () => {
      window.clearInterval(poll);
      synth.removeEventListener?.('voiceschanged', update);
      if (synth.speaking || synth.pending || synth.paused) synth.cancel();
      window.clearInterval(watchdogRef.current);
      window.clearTimeout(retryTimerRef.current);
    };
  }, [supported]);

  /** Stops the current utterance (if any) and tells its owner it didn't complete. */
  const interrupt = useCallback(() => {
    window.clearTimeout(retryTimerRef.current);
    window.clearInterval(watchdogRef.current);
    const onDone = onDoneRef.current;
    onDoneRef.current = null;
    requestRef.current = null;
    utteranceRef.current = null;
    buttonKeyRef.current = null;
    const synth = window.speechSynthesis;
    // Only when something is queued or playing: a needless cancel() can make some
    // mobile engines drop the utterance that is spoken right after it.
    if (synth.speaking || synth.pending || synth.paused) synth.cancel();
    onDone?.(false);
  }, []);

  /** One-time hints shown when audio is first asked for (it still plays). */
  const hintBeforeSpeaking = useCallback(
    (language: SpeechLanguage, voices: SpeechSynthesisVoice[]) => {
      if (language === 'de' && voicesLoadedRef.current && voices.length && !pickGermanVoice(voices)) {
        if (warnedNoGermanRef.current) return;
        warnedNoGermanRef.current = true;
        show({
          tone: 'warning',
          title: 'No German voice found on this device.',
          detail: `Your browser’s default voice reads the word, so it may not sound German. ${GERMAN_VOICE_HELP}`,
        });
        return;
      }
      if (!isAppleMobile()) return;
      try {
        if (localStorage.getItem(IOS_TIP_KEY)) return;
        localStorage.setItem(IOS_TIP_KEY, '1');
      } catch {
        return; // storage blocked: skip the tip rather than repeat it on every tap
      }
      show({
        tone: 'tip',
        title: 'Can’t hear anything?',
        detail: 'On iPhone, check that Silent Mode is off (it can mute speech) and the volume is up.',
      });
    },
    [show],
  );

  const play = useCallback(
    (text: string, { language, rate }: SayOptions, onDone: (completed: boolean) => void) => {
      const synth = window.speechSynthesis;
      interrupt();
      const request = {};
      requestRef.current = request;
      onDoneRef.current = onDone;
      let attempts = 0;
      let started = false;
      let attemptStartedAt = 0;

      const finish = (completed: boolean, problem?: SpeechProblem) => {
        if (requestRef.current !== request) return;
        requestRef.current = null;
        utteranceRef.current = null;
        buttonKeyRef.current = null;
        window.clearInterval(watchdogRef.current);
        window.clearTimeout(retryTimerRef.current);
        if (problem) show(describeProblem(problem));
        const done = onDoneRef.current;
        onDoneRef.current = null;
        done?.(completed);
      };

      // Speaks synchronously – on the first attempt that is still inside the tap's handler.
      const attempt = () => {
        attempts++;
        attemptStartedAt = performance.now();
        const utterance = new SpeechSynthesisUtterance(text);
        // Looked up now, not cached: a voice object from an older list can fail silently.
        const voices = synth.getVoices();
        const detected = language === 'de' ? pickGermanVoice(voices) : pickEnglishVoice(voices);
        // German is always de-DE (so the browser picks a German voice itself if none was found);
        // English follows the chosen voice (e.g. en-IN).
        utterance.lang = language === 'en' && detected ? detected.lang.replace('_', '-') : LANG_TAG[language];
        if (detected) utterance.voice = detected;
        utterance.rate = rate;
        utterance.pitch = PITCH;
        utterance.onstart = () => {
          if (utteranceRef.current !== utterance) return;
          started = true;
          setNotice((current) => (current?.tone === 'error' ? null : current)); // audio works again
        };
        utterance.onend = () => {
          if (utteranceRef.current === utterance) finish(true);
        };
        utterance.onerror = (event) => {
          // Utterances we cancelled ourselves are no longer current – ignore their errors.
          if (utteranceRef.current !== utterance) return;
          const code = (event as SpeechSynthesisErrorEvent).error ?? 'synthesis-failed';
          if (code === 'interrupted' || code === 'canceled') {
            // Not cancelled by this app: the engine dropped it (e.g. a late cancel). Once more.
            if (!started && attempts < 2) return retry();
            return finish(false, started ? undefined : 'no-start');
          }
          finish(false, code);
        };
        utteranceRef.current = utterance;
        if (synth.paused) synth.resume(); // Chrome can be left paused
        synth.speak(utterance);
      };

      const retry = () => {
        utteranceRef.current = null; // late events of the dropped utterance are ignored
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = window.setTimeout(() => {
          if (requestRef.current !== request) return;
          if (synth.speaking || synth.pending) synth.cancel();
          attempt();
        }, RETRY_DELAY_MS);
      };

      hintBeforeSpeaking(language, synth.getVoices());
      attempt();

      // Some engines drop an utterance without any event, or never fire `end`.
      watchdogRef.current = window.setInterval(() => {
        if (requestRef.current !== request) return window.clearInterval(watchdogRef.current);
        if (!utteranceRef.current) return; // a retry is about to start
        const elapsed = performance.now() - attemptStartedAt;
        const idle = !synth.speaking && !synth.pending;
        if (idle && (started || elapsed > START_GRACE_MS)) {
          if (started) return finish(true); // it played, but `end` never came
          if (attempts < 2) return retry(); // dropped before it started
          return finish(false, 'no-start');
        }
        if (!started && elapsed > START_TIMEOUT_MS) {
          utteranceRef.current = null;
          synth.cancel();
          finish(false, 'no-start');
        }
      }, 250);
    },
    [interrupt, hintBeforeSpeaking, show],
  );

  /**
   * Listen / Slow Listen: speaks the full German term (e.g. "der Platz") once.
   * Example sentences and the unit test use it too, with their own id and rate.
   * Call it directly from the click handler – never after an await or timer.
   */
  const speak = useCallback(
    (id: string, text: string, mode: SpeechMode = 'normal', rate = SPEECH_RATES[mode]) => {
      if (!supported) {
        show({ tone: 'error', title: 'Audio is not available in this browser.', detail: 'Try Safari or Chrome.' });
        return;
      }
      const key = `${id}:${mode}`;
      if (buttonKeyRef.current === key) return; // this exact button is already playing
      setSpeaking({ id, mode });
      play(text, { language: 'de', rate }, () =>
        setSpeaking((current) => (current?.id === id && current.mode === mode ? null : current)),
      );
      buttonKeyRef.current = key;
    },
    [supported, play, show],
  );

  /** Speaks once and resolves `true` when finished, `false` if interrupted or failed. */
  const say = useCallback(
    (text: string, options: SayOptions) =>
      new Promise<boolean>((resolve) => {
        if (!supported) return resolve(false);
        setSpeaking(null);
        play(text, options, resolve);
      }),
    [supported, play],
  );

  /** Stops all speech immediately. */
  const cancel = useCallback(() => {
    if (!supported) return;
    interrupt();
    setSpeaking(null);
  }, [supported, interrupt]);

  return { supported, voice, englishVoice, voicesLoaded, speaking, speak, say, cancel, notice, dismissNotice };
}
