import type { Subject, SubTopic, Topic } from '../../types';
import { Field, Select } from '../shared/FormField';

interface DashboardFiltersProps {
  subjects: Subject[];
  topics: Topic[];
  subTopics: SubTopic[];
  subjectId: string;
  topicId: string;
  subTopicId: string;
  hasActiveFilters: boolean;
  onSubjectChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onSubTopicChange: (value: string) => void;
  onClear: () => void;
}

export function DashboardFilters({
  subjects,
  topics,
  subTopics,
  subjectId,
  topicId,
  subTopicId,
  hasActiveFilters,
  onSubjectChange,
  onTopicChange,
  onSubTopicChange,
  onClear
}: DashboardFiltersProps) {
  return (
    <div className="dashboard-filters">
      <Field label="Subject">
        <Select value={subjectId} onChange={(event) => onSubjectChange(event.target.value)}>
          <option value="">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Topic">
        <Select value={topicId} onChange={(event) => onTopicChange(event.target.value)} disabled={!subjectId}>
          <option value="">{subjectId ? 'All topics' : 'Select subject first'}</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Sub-topic">
        <Select value={subTopicId} onChange={(event) => onSubTopicChange(event.target.value)} disabled={!topicId}>
          <option value="">{topicId ? 'All sub-topics' : 'Select topic first'}</option>
          {subTopics.map((subTopic) => (
            <option key={subTopic.id} value={subTopic.id}>
              {subTopic.name}
            </option>
          ))}
        </Select>
      </Field>
      {hasActiveFilters ? (
        <button type="button" className="dashboard-filters__clear" onClick={onClear}>
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
