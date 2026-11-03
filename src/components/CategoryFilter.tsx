import type { CategoryFilterValue } from '../hooks/useFlashcardDeck';
import './CategoryFilter.css';

interface CategoryFilterProps {
  categories: readonly CategoryFilterValue[];
  selected: CategoryFilterValue;
  counts: Map<CategoryFilterValue, { learned: number; total: number }>;
  onSelect: (category: CategoryFilterValue) => void;
}

const ICONS: Record<CategoryFilterValue, string> = {
  All: '📚',
  Places: '🏛️',
  Travel: '🚢',
  Directions: '🧭',
  Time: '⏰',
  Objects: '📦',
  Food: '🍴',
  Other: '✨',
  Letters: '🔤',
};

const LABELS: Partial<Record<CategoryFilterValue, string>> = { All: 'All Words' };

export function CategoryFilter({ categories, selected, counts, onSelect }: CategoryFilterProps) {
  return (
    <nav className="categories" aria-label="Vocabulary categories">
      <ul className="categories__list">
        {categories.map((category) => {
          const isSelected = category === selected;
          const count = counts.get(category);
          return (
            <li key={category}>
              <button
                type="button"
                className={`chip${isSelected ? ' is-selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => onSelect(category)}
              >
                <span className="chip__icon" aria-hidden="true">
                  {ICONS[category]}
                </span>
                {LABELS[category] ?? category}
                {count && (
                  <>
                    <span className="chip__count" aria-hidden="true">
                      {count.learned}/{count.total}
                    </span>
                    <span className="sr-only">
                      , {count.learned} of {count.total} learned
                    </span>
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
