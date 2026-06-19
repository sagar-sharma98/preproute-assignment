import type { TestStatus } from '../../types';

export function StatusBadge({ status }: { status?: TestStatus }) {
  const label = status ?? 'draft';
  return <span className={`status status-${label}`}>{label}</span>;
}
