import type { TestSummary } from '../types';
import { entityName } from './format';

function entityId(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string') {
    return value.id;
  }
  return '';
}

function matchesEntity(value: unknown, filterId: string, options: { id: string; name: string }[]): boolean {
  if (!filterId) return true;

  const selected = options.find((option) => option.id === filterId);
  const valueId = entityId(value);
  const valueName = entityName(value).toLowerCase();

  if (valueId === filterId) return true;
  if (selected && valueName === selected.name.toLowerCase()) return true;
  if (valueName && selected && valueName.includes(selected.name.toLowerCase())) return true;

  return false;
}

function matchesEntityList(
  values: TestSummary['topics'],
  filterId: string,
  options: { id: string; name: string }[]
): boolean {
  if (!filterId) return true;
  if (!values?.length) return false;

  const selected = options.find((option) => option.id === filterId);
  return values.some((value) => {
    const valueId = entityId(value);
    const valueName = entityName(value).toLowerCase();
    if (valueId === filterId) return true;
    if (selected && valueName === selected.name.toLowerCase()) return true;
    return false;
  });
}

export interface DashboardFilters {
  query: string;
  subjectId: string;
  topicId: string;
  subTopicId: string;
}

export function filterTests(
  tests: TestSummary[],
  filters: DashboardFilters,
  options: {
    subjects: { id: string; name: string }[];
    topics: { id: string; name: string }[];
    subTopics: { id: string; name: string }[];
  }
): TestSummary[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return tests.filter((test) => {
    if (normalizedQuery && !test.name.toLowerCase().includes(normalizedQuery)) {
      return false;
    }

    if (!matchesEntity(test.subject, filters.subjectId, options.subjects)) {
      return false;
    }

    if (!matchesEntityList(test.topics, filters.topicId, options.topics)) {
      return false;
    }

    if (!matchesEntityList(test.sub_topics, filters.subTopicId, options.subTopics)) {
      return false;
    }

    return true;
  });
}
