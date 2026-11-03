import { useEffect, useRef } from 'react';
import type { Unit } from '../data/vocabulary';
import './UnitSelector.css';

interface UnitSelectorProps {
  units: Unit[];
  selected: number;
  onSelect: (unit: number) => void;
  /** Focus the selected unit on mount (keeps keyboard focus after switching units). */
  focusSelected?: boolean;
}

/** Compact unit switcher: [ UNIT 1 ] [ UNIT 2 ] [ UNIT 3 ] [ ALPHABETS ] … */
export function UnitSelector({ units, selected, onSelect, focusSelected }: UnitSelectorProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusSelected) selectedRef.current?.focus();
  }, [focusSelected]);

  return (
    <nav className="unit-selector" aria-label="Units">
      <ul className="unit-selector__list">
        {units.map((unit) => {
          const isSelected = unit.number === selected;
          const empty = unit.wordCount === 0;
          return (
            <li key={unit.number}>
              <button
                ref={isSelected ? selectedRef : undefined}
                type="button"
                className={`unit-tab${isSelected ? ' is-selected' : ''}${empty ? ' is-empty' : ''}`}
                aria-pressed={isSelected}
                aria-label={`${unit.name}, ${empty ? 'coming soon' : `${unit.wordCount} ${unit.noun}s`}`}
                onClick={() => onSelect(unit.number)}
                data-unit={unit.number}
              >
                <span className="unit-tab__name">{unit.name}</span>
                <span className="unit-tab__meta" aria-hidden="true">
                  {unit.tag}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
