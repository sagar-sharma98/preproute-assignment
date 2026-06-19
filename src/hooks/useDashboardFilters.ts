import { useEffect, useState } from 'react';
import { getSubjects, getSubTopicsByTopic, getTopicsBySubject } from '../api/tests';
import type { Subject, SubTopic, Topic } from '../types';

export interface DashboardFilterState {
  query: string;
  subjectId: string;
  topicId: string;
  subTopicId: string;
}

const EMPTY_FILTERS: DashboardFilterState = {
  query: '',
  subjectId: '',
  topicId: '',
  subTopicId: ''
};

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilterState>(EMPTY_FILTERS);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);

  useEffect(() => {
    void getSubjects().then(setSubjects);
  }, []);

  useEffect(() => {
    if (!filters.subjectId) {
      setTopics([]);
      setSubTopics([]);
      setFilters((current) => ({ ...current, topicId: '', subTopicId: '' }));
      return;
    }

    let cancelled = false;
    void getTopicsBySubject(filters.subjectId).then((loadedTopics) => {
      if (!cancelled) {
        setTopics(loadedTopics);
        setSubTopics([]);
        setFilters((current) => ({ ...current, topicId: '', subTopicId: '' }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [filters.subjectId]);

  useEffect(() => {
    if (!filters.topicId) {
      setSubTopics([]);
      setFilters((current) => ({ ...current, subTopicId: '' }));
      return;
    }

    let cancelled = false;
    void getSubTopicsByTopic(filters.topicId).then((loadedSubTopics) => {
      if (!cancelled) {
        setSubTopics(loadedSubTopics);
        setFilters((current) => ({ ...current, subTopicId: '' }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [filters.topicId]);

  const hasActiveFilters = Boolean(
    filters.query.trim() || filters.subjectId || filters.topicId || filters.subTopicId
  );

  return {
    filters,
    subjects,
    topics,
    subTopics,
    hasActiveFilters,
    setQuery: (query: string) => setFilters((current) => ({ ...current, query })),
    setSubjectId: (subjectId: string) => setFilters((current) => ({ ...current, subjectId })),
    setTopicId: (topicId: string) => setFilters((current) => ({ ...current, topicId })),
    setSubTopicId: (subTopicId: string) => setFilters((current) => ({ ...current, subTopicId })),
    clearFilters: () => setFilters(EMPTY_FILTERS)
  };
}
