import { useSyncExternalStore } from 'react';

/** The example-sentence word whose English is showing – only one on the page at a time. */
export interface OpenGloss {
  /** The word button the tooltip points at. */
  anchor: HTMLElement;
  /** "meaning" or "meaning | note". */
  gloss: string;
  /** Opened by tap / Enter: stays until closed. Otherwise it follows hover / focus. */
  pinned: boolean;
}

let open: OpenGloss | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export const wordGloss = {
  get: () => open,
  show(anchor: HTMLElement, gloss: string, pinned: boolean) {
    open = { anchor, gloss, pinned };
    emit();
  },
  /** Closes the tooltip – only `anchor`'s when given, and a pinned one only if `pinnedToo`. */
  hide(anchor?: HTMLElement, pinnedToo = false) {
    if (!open || (anchor && open.anchor !== anchor) || (open.pinned && !pinnedToo)) return;
    open = null;
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export const useOpenGloss = () => useSyncExternalStore(wordGloss.subscribe, wordGloss.get);
