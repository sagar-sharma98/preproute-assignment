import type { Subject, SubTopic, Topic } from '../types';
import { api, unwrapApiResponse } from './client';
import type { ApiResponse } from '../types';
import { normalizeEntities } from './lib/records';

export async function getSubjects() {
  const { data } = await api.get<ApiResponse<unknown>>('/subjects');
  return normalizeEntities<Subject>(unwrapApiResponse(data), ['subjects'], ['id', '_id', 'subject_id', 'subjectId'], [
    'name',
    'title',
    'subject_name',
    'subjectName'
  ]);
}

export async function getTopicsBySubject(subjectId: string) {
  const { data } = await api.get<ApiResponse<unknown>>(`/topics/subject/${subjectId}`);
  return normalizeEntities<Topic>(
    unwrapApiResponse(data),
    ['topics'],
    ['id', '_id', 'topic_id', 'topicId'],
    ['name', 'title', 'topic_name', 'topicName'],
    'subject_id',
    ['subject_id', 'subjectId']
  );
}

export async function getSubTopicsByTopic(topicId: string) {
  const { data } = await api.get<ApiResponse<unknown>>(`/sub-topics/topic/${topicId}`);
  return normalizeEntities<SubTopic>(
    unwrapApiResponse(data),
    ['sub_topics', 'subTopics', 'subtopics'],
    ['id', '_id', 'sub_topic_id', 'subTopicId', 'subtopic_id', 'subtopicId'],
    ['name', 'title', 'sub_topic_name', 'subTopicName', 'subtopic_name', 'subtopicName'],
    'topic_id',
    ['topic_id', 'topicId']
  );
}

export async function getSubTopicsByTopics(topicIds: string[]) {
  const { data } = await api.post<ApiResponse<unknown>>('/sub-topics/multi-topics', { topicIds });
  return normalizeEntities<SubTopic>(
    unwrapApiResponse(data),
    ['sub_topics', 'subTopics', 'subtopics'],
    ['id', '_id', 'sub_topic_id', 'subTopicId', 'subtopic_id', 'subtopicId'],
    ['name', 'title', 'sub_topic_name', 'subTopicName', 'subtopic_name', 'subtopicName'],
    'topic_id',
    ['topic_id', 'topicId']
  );
}

export async function loadSubTopicsForTopics(topicIds: string[]) {
  if (topicIds.length === 0) return [];
  try {
    return await getSubTopicsByTopics(topicIds);
  } catch {
    const groups = await Promise.all(topicIds.map((topicId) => getSubTopicsByTopic(topicId)));
    return groups.flat();
  }
}
