import { useMemo, useState } from 'react';
import { UnitSelector } from './components/UnitSelector';
import { WordTooltip } from './components/WordTooltip';
import { DEFAULT_UNIT, UNITS, wordsInUnit } from './data/vocabulary';
import { UnitWorkspace } from './UnitWorkspace';

/** One German learning page with multiple units; Unit 3 is selected by default. */
export default function App() {
  const [unitNumber, setUnitNumber] = useState(DEFAULT_UNIT);
  const unit = UNITS.find((u) => u.number === unitNumber) ?? UNITS[0];
  const words = useMemo(() => wordsInUnit(unit.number), [unit.number]);
  const suggestedUnit =
    UNITS.find((u) => u.number === DEFAULT_UNIT && u.wordCount > 0) ?? UNITS.find((u) => u.wordCount > 0);
  // After switching units with the selector, keep keyboard focus on it.
  const [refocusSelector, setRefocusSelector] = useState(false);

  const selectUnit = (number: number) => {
    if (number === unit.number) return;
    setRefocusSelector(document.activeElement?.closest('.unit-selector') != null);
    setUnitNumber(number);
  };

  return (
    <>
      <UnitWorkspace
        key={unit.number}
        unit={unit}
        words={words}
        suggestedUnit={suggestedUnit}
        onSelectUnit={selectUnit}
        unitNav={
          <UnitSelector units={UNITS} selected={unit.number} onSelect={selectUnit} focusSelected={refocusSelector} />
        }
      />
      <WordTooltip />
    </>
  );
}
