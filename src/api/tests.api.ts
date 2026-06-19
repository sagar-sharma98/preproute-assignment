import type { TestPayload, TestSummary } from '../types';
import { api, unwrapApiResponse } from './client';
import type { ApiResponse } from '../types';
import { assertRecord, normalizeTest } from './lib/normalizers';
import { extractCollection } from './lib/records';

const VALID_TEST_STATUSES = new Set(['live', 'unpublished', 'scheduled', 'expired', 'draft']);

function serializeTestPayload(payload: Partial<TestPayload> & Record<string, unknown>) {
  const body: Record<string, unknown> = { ...payload };

  if (body.difficulty === 'difficult') {
    body.difficulty = 'hard';
  }

  if (body.status === null || body.status === undefined) {
    delete body.status;
  } else if (!VALID_TEST_STATUSES.has(String(body.status))) {
    delete body.status;
  }

  for (const key of ['correct_marks', 'wrong_marks', 'unattempt_marks', 'total_time', 'total_marks', 'total_questions'] as const) {
    if (body[key] !== undefined && body[key] !== null) {
      body[key] = Number(body[key]);
    }
  }

  return body;
}

export async function getTests() {
  const { data } = await api.get<ApiResponse<unknown>>('/tests');
  const tests = extractCollection(unwrapApiResponse(data), ['tests']);
  return tests.map(normalizeTest);
}

export async function getTest(id: string) {
  const { data } = await api.get<ApiResponse<unknown>>(`/tests/${id}`);
  return normalizeTest(assertRecord(unwrapApiResponse(data)));
}

export async function createTest(payload: TestPayload) {
  const body = serializeTestPayload({
    ...(payload as Partial<TestPayload> & Record<string, unknown>),
    status: payload.status && payload.status !== null ? payload.status : 'draft'
  });
  const { data } = await api.post<ApiResponse<unknown>>('/tests', body);
  return normalizeTest(assertRecord(unwrapApiResponse(data)));
}

export async function updateTest(id: string, payload: Partial<TestPayload> & Record<string, unknown>) {
  const { data } = await api.put<ApiResponse<unknown>>(`/tests/${id}`, serializeTestPayload(payload));
  return normalizeTest(assertRecord(unwrapApiResponse(data)));
}

export async function publishTest(id: string) {
  const { data } = await api.put<ApiResponse<unknown>>(`/tests/${id}`, { status: 'live' });
  return normalizeTest(assertRecord(unwrapApiResponse(data)));
}
