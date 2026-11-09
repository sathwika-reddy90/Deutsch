import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useOpenGloss, wordGloss, type OpenGloss } from '../hooks/useWordGloss';
import './WordTooltip.css';

const ID = 'word-gloss';
/** Space between word and tooltip, and kept free at the viewport edges. */
const GAP = 8;

interface Position {
  of: OpenGloss;
  left: number;
  top: number;
  placement: 'above' | 'below';
  arrowX: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/** Cancels the click that follows this pointerdown (it outlives the tooltip, which closes first). */
function swallowNextClick() {
  const swallow = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  document.addEventListener('click', swallow, { capture: true, once: true });
  window.setTimeout(() => document.removeEventListener('click', swallow, { capture: true }), 600);
}

/**
 * The English of the example-sentence word that is hovered, focused or tapped
 * (see GlossedSentence). Rendered once, on <body>, so card overflow never clips it.
 * Above the word when it fits, otherwise below; always inside the viewport.
 */
export function WordTooltip() {
  const open = useOpenGloss();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position | null>(null);

  // Mark the word that is showing its meaning (highlight + aria-describedby).
  useEffect(() => {
    if (!open) return;
    const { anchor } = open;
    anchor.classList.add('is-glossed');
    anchor.setAttribute('aria-describedby', ID);
    return () => {
      anchor.classList.remove('is-glossed');
      anchor.removeAttribute('aria-describedby');
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    if (!open.anchor.isConnected) return wordGloss.hide(open.anchor, true);
    const word = open.anchor.getBoundingClientRect();
    const tip = ref.current.getBoundingClientRect();
    const placement = word.top - tip.height - GAP >= GAP ? 'above' : 'below';
    const center = word.left + word.width / 2;
    const left = clamp(center - tip.width / 2, GAP, window.innerWidth - tip.width - GAP);
    setPosition({
      of: open,
      left,
      top: placement === 'above' ? word.top - tip.height - GAP : word.bottom + GAP,
      placement,
      arrowX: clamp(center - left, 12, tip.width - 12),
    });
  }, [open]);

  // Close on scroll / resize (the word moved), Escape, and – when pinned – a tap elsewhere.
  useEffect(() => {
    if (!open) return;
    const close = () => wordGloss.hide(undefined, true);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (open.anchor.isConnected) open.anchor.focus({ preventScroll: true });
      close();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!open.pinned || target?.closest('.gloss-word, .word-tooltip')) return;
      // Dismissing the meaning shouldn't also flip the card underneath.
      if (target?.closest('.card')) swallowNextClick();
      close();
    };
    window.addEventListener('scroll', close, { capture: true, passive: true });
    window.addEventListener('resize', close);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('scroll', close, { capture: true });
      window.removeEventListener('resize', close);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [open]);

  if (!open) return null;
  const [meaning, note] = open.gloss.split(' | ');
  const placed = position?.of === open ? position : null;
  return createPortal(
    <div
      ref={ref}
      id={ID}
      role="tooltip"
      className={`word-tooltip word-tooltip--${placed?.placement ?? 'above'}${open.pinned ? ' is-pinned' : ''}`}
      style={
        {
          left: placed?.left ?? 0,
          top: placed?.top ?? 0,
          visibility: placed ? 'visible' : 'hidden',
          '--arrow-x': `${placed?.arrowX ?? 0}px`,
        } as CSSProperties
      }
    >
      <span className="word-tooltip__meaning">{meaning}</span>
      {note && <span className="word-tooltip__note">{note}</span>}
      {open.pinned && (
        <button
          type="button"
          className="word-tooltip__close"
          aria-label="Close translation"
          onClick={() => wordGloss.hide(undefined, true)}
        >
          ×
        </button>
      )}
    </div>,
    document.body,
  );
}
