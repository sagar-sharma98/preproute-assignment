interface LoaderProps {
  label?: string;
  compact?: boolean;
}

export function Loader({ label = 'Loading...', compact = false }: LoaderProps) {
  return (
    <div className={compact ? 'loader loader-compact' : 'loader'} role="status" aria-live="polite">
      <span className="loader-spinner" />
      <span>{label}</span>
    </div>
  );
}
