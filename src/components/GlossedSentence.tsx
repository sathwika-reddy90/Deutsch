import { useRef, type FocusEvent, type MouseEvent, type PointerEvent } from 'react';
import type { SentenceToken } from '../data/vocabulary';
import { wordGloss } from '../hooks/useWordGloss';

interface GlossedSentenceProps {
  words: SentenceToken[];
}

/**
 * A German sentence whose words show their English (WordTooltip): on mouse hover or
 * keyboard focus, or pinned by a tap / Enter. Clicking a word never flips the card.
 */
export function GlossedSentence({ words }: GlossedSentenceProps) {
  const pointerType = useRef('');
  return words.map(({ text, gloss }, i) => {
    if (!gloss) return text;
    const mouse = (event: PointerEvent) => event.pointerType === 'mouse';
    return (
      <button
        key={i}
        type="button"
        className="gloss-word"
        onPointerDown={(event) => (pointerType.current = event.pointerType)}
        onPointerEnter={(event) => mouse(event) && wordGloss.show(event.currentTarget, gloss, false)}
        onPointerLeave={(event) => mouse(event) && wordGloss.hide(event.currentTarget)}
        onFocus={(event: FocusEvent<HTMLButtonElement>) => {
          if (event.currentTarget.matches(':focus-visible')) wordGloss.show(event.currentTarget, gloss, false);
        }}
        onBlur={(event) => wordGloss.hide(event.currentTarget)}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation(); // a word is not a flip target
          const via = event.detail === 0 ? 'keyboard' : pointerType.current;
          pointerType.current = '';
          if (via === 'mouse') return; // hover already shows it
          const open = wordGloss.get();
          if (open?.anchor === event.currentTarget && open.pinned) wordGloss.hide(event.currentTarget, true);
          else wordGloss.show(event.currentTarget, gloss, true);
        }}
      >
        {text}
      </button>
    );
  });
}
