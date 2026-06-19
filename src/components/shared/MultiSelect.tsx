interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function MultiSelect({ label, options, selected, onChange, placeholder, error, disabled }: MultiSelectProps) {
  const toggle = (id: string) => {
    if (disabled) return;
    onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  return (
    <div className="field">
      <span>{label}</span>
      <div className={`multi-select ${disabled ? 'multi-select-disabled' : ''}`}>
        {options.length === 0 ? (
          <span className="empty-option">{placeholder ?? 'Select parent first'}</span>
        ) : (
          options.map((option) => (
            <button
              type="button"
              key={option.id}
              className={`chip ${selected.includes(option.id) ? 'chip-active' : ''}`}
              onClick={() => toggle(option.id)}
              disabled={disabled}
            >
              {option.name}
            </button>
          ))
        )}
      </div>
      {error ? <small className="field-error">{error}</small> : null}
    </div>
  );
}
