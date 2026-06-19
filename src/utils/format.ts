import type { Subject, SubTopic, Topic } from '../types';

export function entityName(value: unknown): string {
  if (!value) return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && 'name' in value && typeof value.name === 'string') {
    return value.name;
  }
  return '-';
}

export function listNames(values?: string[] | Topic[] | SubTopic[] | Subject[]): string[] {
  if (!values || values.length === 0) return [];
  return values.map((item) => entityName(item));
}

export function formatDate(value?: string): string {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}
