import type { CSSProperties } from 'react';

/**
 * Font size that keeps a word on one line inside its card: the longest word of
 * `text` is scaled to the container width (via container query units), capped at
 * `maxRem`. Requires an ancestor with `container-type: inline-size`.
 */
export function fitTextStyle(text: string, maxRem: number): CSSProperties {
  const longest = Math.max(...text.split(/\s+/).map((part) => part.length));
  return { '--fit-chars': Math.max(longest, 4), '--fit-max': `${maxRem}rem` } as CSSProperties;
}
