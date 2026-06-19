import type { Question, TestSummary } from '../../types';
import { isRecord, pickString, type UnknownRecord } from './records';

export function normalizeQuestion(raw: UnknownRecord): Question {
  const id = pickString(raw, ['id', '_id', 'question_id', 'questionId']);
  const topic = pickString(raw, ['topic', 'topic_id', 'topicId']);
  const subTopic = pickString(raw, ['sub_topic', 'subtopic', 'sub_topic_id', 'subTopicId']);
  const subject = pickString(raw, ['subject', 'subject_id', 'subjectId']);

  return {
    ...(raw as unknown as Question),
    id: id || undefined,
    type: 'mcq',
    question: pickString(raw, ['question', 'text', 'question_text', 'questionText']) || '',
    option1: pickString(raw, ['option1', 'option_1', 'optionA', 'option_a']) || '',
    option2: pickString(raw, ['option2', 'option_2', 'optionB', 'option_b']) || '',
    option3: pickString(raw, ['option3', 'option_3', 'optionC', 'option_c']) || '',
    option4: pickString(raw, ['option4', 'option_4', 'optionD', 'option_d']) || '',
    correct_option: (pickString(raw, ['correct_option', 'correctOption', 'answer']) ||
      'option1') as Question['correct_option'],
    subject: subject || undefined,
    topic: topic || undefined,
    sub_topic: subTopic || undefined
  };
}

export function normalizeTest(raw: UnknownRecord): TestSummary {
  const id = pickString(raw, ['id', '_id', 'test_id', 'testId']);
  const questions = raw.questions;
  const normalizedQuestions = Array.isArray(questions)
    ? questions.map((item) => (typeof item === 'string' ? item : normalizeQuestion(item as UnknownRecord)))
    : undefined;

  return {
    ...(raw as unknown as TestSummary),
    id,
    name: pickString(raw, ['name', 'title', 'test_name', 'testName']) || 'Untitled test',
    questions: normalizedQuestions as TestSummary['questions']
  };
}

export function assertRecord(value: unknown): UnknownRecord {
  if (!isRecord(value)) {
    throw new Error('Expected a record response from the API.');
  }
  return value;
}
