import type { Question } from '../types';
import { api, unwrapApiResponse } from './client';
import type { ApiResponse } from '../types';
import { normalizeQuestion } from './lib/normalizers';
import { extractCollection, isRecord } from './lib/records';

function serializeQuestionPayload(question: Question) {
  if (!question.test_id) {
    throw new Error('Each question must be linked to a test before saving.');
  }

  const subject = question.subject?.trim();
  if (!subject) {
    throw new Error('Subject is required for each question.');
  }

  const body: Record<string, unknown> = {
    type: 'mcq',
    question: question.question,
    option1: question.option1,
    option2: question.option2,
    option3: question.option3,
    option4: question.option4,
    correct_option: question.correct_option,
    subject,
    test_id: question.test_id
  };

  if (question.explanation?.trim()) {
    body.explanation = question.explanation.trim();
  }

  if (question.difficulty) {
    body.difficulty = question.difficulty;
  }

  return body;
}

export async function bulkCreateQuestions(questions: Question[]) {
  const { data } = await api.post<ApiResponse<unknown>>('/questions/bulk', {
    questions: questions.map(serializeQuestionPayload)
  });
  const responseData = unwrapApiResponse(data);
  const created = Array.isArray(responseData)
    ? responseData.filter(isRecord)
    : extractCollection(responseData, ['questions']);
  return created.map(normalizeQuestion);
}

export async function fetchQuestions(question_ids: string[]) {
  const { data } = await api.post<ApiResponse<unknown>>('/questions/fetchBulk', { question_ids });
  const questions = extractCollection(unwrapApiResponse(data), ['questions']);
  return questions.map(normalizeQuestion);
}
