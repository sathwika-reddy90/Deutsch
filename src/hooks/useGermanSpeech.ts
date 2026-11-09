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

/**
 * Picks a voice for a language from whatever the browser offers – no voice
 * names are hard-coded. Prefers the exact tag (e.g. `de-DE`), then any voice of
 * that language (`de-*`); within each group the system default voice wins,
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
  const matches = voices
    .map((voice, index) => ({ voice, index }))
    .filter(({ voice }) => tier(voice) < 2)
    .sort((a, b) => tier(a.voice) - tier(b.voice) || Number(b.voice.default) - Number(a.voice.default) || a.index - b.index);
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

export interface SpeakingState {
  id: string;
  mode: SpeechMode;
}

export interface SayOptions {
  language: SpeechLanguage;
  rate: number;
}

/**
 * Text-to-speech via the Web Speech API, shared by Listen, Slow Listen and
 * Speaking Practice. Only one utterance ever plays: starting any speech cancels
 * whatever is playing, and an interrupted `say()` resolves `false` so a running
 * sequence knows to stop.
 */
export function useGermanSpeech() {
  const [supported] = useState(isSupported);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [englishVoice, setEnglishVoice] = useState<SpeechSynthesisVoice | null>(null);
  /** Which Listen / Slow Listen button is playing (Speaking Practice tracks its own status). */
  const [speaking, setSpeaking] = useState<SpeakingState | null>(null);

  const voicesRef = useRef<Record<SpeechLanguage, SpeechSynthesisVoice | null>>({ de: null, en: null });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onDoneRef = useRef<((completed: boolean) => void) | null>(null);
  const buttonKeyRef = useRef<string | null>(null);
  const watchdogRef = useRef<number | undefined>(undefined);
  const startTimerRef = useRef<number | undefined>(undefined);
  const lastCancelRef = useRef(0);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    // Voices often load asynchronously (Chrome returns [] on first call).
    const update = () => {
      const voices = synth.getVoices();
      voicesRef.current = { de: pickGermanVoice(voices), en: pickEnglishVoice(voices) };
      setVoice(voicesRef.current.de);
      setEnglishVoice(voicesRef.current.en);
    };
    update();
    synth.addEventListener?.('voiceschanged', update);
    return () => {
      synth.removeEventListener?.('voiceschanged', update);
      synth.cancel();
      window.clearInterval(watchdogRef.current);
      window.clearTimeout(startTimerRef.current);
    };
  }, [supported]);

  /** Stops the current utterance (if any) and tells its owner it didn't complete. */
  const interrupt = useCallback(() => {
    window.clearTimeout(startTimerRef.current);
    window.clearInterval(watchdogRef.current);
    const onDone = onDoneRef.current;
    onDoneRef.current = null;
    utteranceRef.current = null;
    buttonKeyRef.current = null;
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) lastCancelRef.current = performance.now();
    synth.cancel();
    onDone?.(false);
  }, []);

  const play = useCallback(
    (text: string, { language, rate }: SayOptions, onDone: (completed: boolean) => void) => {
      const synth = window.speechSynthesis;
      const wasBusy = synth.speaking || synth.pending;
      interrupt();

      const utterance = new SpeechSynthesisUtterance(text);
      // Same detected voice for every German utterance (Listen, Slow, Practice).
      const detected =
        voicesRef.current[language] ??
        (language === 'de' ? pickGermanVoice(synth.getVoices()) : pickEnglishVoice(synth.getVoices()));
      // German is always de-DE; English follows the chosen voice (e.g. en-IN).
      utterance.lang = language === 'en' && detected ? detected.lang.replace('_', '-') : LANG_TAG[language];
      if (detected) utterance.voice = detected;
      utterance.rate = rate;
      utterance.pitch = PITCH;

      const finish = (completed: boolean) => {
        // A cancelled utterance also fires end/error – ignore it if a newer one is playing.
        if (utteranceRef.current !== utterance) return;
        utteranceRef.current = null;
        buttonKeyRef.current = null;
        window.clearInterval(watchdogRef.current);
        const done = onDoneRef.current;
        onDoneRef.current = null;
        done?.(completed);
      };
      utterance.onend = () => finish(true);
      utterance.onerror = () => finish(false);
      utteranceRef.current = utterance;
      onDoneRef.current = onDone;

      const start = () => {
        synth.resume(); // Chrome can get stuck in a paused state
        synth.speak(utterance);
        // Some browsers occasionally never fire `end`; don't leave anything stuck.
        let checks = 0;
        watchdogRef.current = window.setInterval(() => {
          checks++;
          if (checks > 2 && !synth.speaking && !synth.pending) finish(true);
          if (checks > 60) {
            synth.cancel();
            finish(false);
          }
        }, 250);
      };
      // Chrome may drop an utterance queued right after cancel().
      const recentlyCancelled = performance.now() - lastCancelRef.current < 100;
      if (wasBusy || recentlyCancelled) startTimerRef.current = window.setTimeout(start, 60);
      else start();
    },
    [interrupt],
  );

  /**
   * Listen / Slow Listen: speaks the full German term (e.g. "der Platz") once.
   * Example sentences use it too, with their own id and rate.
   */
  const speak = useCallback(
    (id: string, text: string, mode: SpeechMode = 'normal', rate = SPEECH_RATES[mode]) => {
      if (!supported) return;
      const key = `${id}:${mode}`;
      if (buttonKeyRef.current === key) return; // this exact button is already playing
      setSpeaking({ id, mode });
      play(text, { language: 'de', rate }, () =>
        setSpeaking((current) => (current?.id === id && current.mode === mode ? null : current)),
      );
      buttonKeyRef.current = key;
    },
    [supported, play],
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

  return { supported, voice, englishVoice, speaking, speak, say, cancel };
}
