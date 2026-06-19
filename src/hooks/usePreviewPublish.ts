import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions, getTest, publishTest } from '../api/tests';
import { getApiError } from '../api/client';
import type { Question, TestSummary } from '../types';

export function usePreviewPublish(testId: string) {
  const navigate = useNavigate();
  const [test, setTest] = useState<TestSummary | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const loadPreview = useCallback(async () => {
    if (!testId) {
      setServerError('Missing test ID. Please select a test again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setServerError('');
    try {
      const testData = await getTest(testId);
      setTest(testData);

      const questionRefs = testData.questions ?? [];
      const questionIds = questionRefs
        .map((item) => (typeof item === 'string' ? item : item.id))
        .filter((id): id is string => Boolean(id));

      if (questionIds.length > 0) {
        setQuestions(await fetchQuestions(questionIds));
      } else {
        setQuestions(questionRefs.filter((item): item is Question => typeof item === 'object'));
      }
    } catch (error) {
      setServerError(getApiError(error));
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    void loadPreview();
  }, [loadPreview]);

  const complete = useMemo(() => questions.length > 0, [questions.length]);
  const totalQuestions = test?.total_questions ?? Math.max(questions.length, 1);

  const publish = async () => {
    if (!complete) {
      setServerError('Add and save at least one question before publishing.');
      return;
    }

    setPublishing(true);
    setServerError('');
    try {
      await publishTest(testId);
      navigate('/tests', { state: { publishMessage: 'Test published successfully.' } });
    } catch (error) {
      setServerError(getApiError(error));
    } finally {
      setPublishing(false);
    }
  };

  return {
    test,
    questions,
    loading,
    publishing,
    serverError,
    complete,
    totalQuestions,
    publish,
    reload: loadPreview
  };
}
