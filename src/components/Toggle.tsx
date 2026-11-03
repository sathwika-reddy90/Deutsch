import './Toggle.css';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="toggle" onClick={onChange}>
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
      <span className="toggle__label">{label}</span>
      <span className="toggle__state" aria-hidden="true">
        {checked ? 'On' : 'Off'}
      </span>
    </button>
  );
}
