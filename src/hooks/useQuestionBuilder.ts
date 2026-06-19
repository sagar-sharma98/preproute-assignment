import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  bulkCreateQuestions,
  fetchQuestions,
  getSubjects,
  getSubTopicsByTopic,
  getTest,
  getTopicsBySubject,
  loadSubTopicsForTopics,
  updateTest
} from '../api/tests';
import { getApiError } from '../api/client';
import type { QuestionFormValues } from '../components/tests/QuestionForm';
import { questionToFormValues } from '../components/tests/QuestionForm';
import type { Question, Subject, SubTopic, TestSummary, Topic } from '../types';
import { resolveEntityId, resolveEntityIds } from '../utils/entities';

export function useQuestionBuilder(testId: string) {
  const navigate = useNavigate();
  const [test, setTest] = useState<TestSummary | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topicOptions, setTopicOptions] = useState<Topic[]>([]);
  const [subTopicOptions, setSubTopicOptions] = useState<SubTopic[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const totalQuestions = test?.total_questions ?? 1;
  const activeQuestion = questions[activeSlot];
  const formDefaults = useMemo(() => questionToFormValues(activeQuestion), [activeQuestion, activeSlot]);

  const loadPage = useCallback(async () => {
    if (!testId) {
      setServerError('Missing test ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setServerError('');
    try {
      const [loadedTest, loadedSubjects] = await Promise.all([getTest(testId), getSubjects()]);
      setTest(loadedTest);
      setSubjects(loadedSubjects);

      const resolvedSubjectId = resolveEntityId(loadedTest.subject, loadedSubjects);
      setSubjectId(resolvedSubjectId);

      if (resolvedSubjectId) {
        const topics = await getTopicsBySubject(resolvedSubjectId);
        setTopicOptions(topics);

        const topicIds = resolveEntityIds(Array.isArray(loadedTest.topics) ? loadedTest.topics : [], topics);
        if (topicIds.length) {
          setSubTopicOptions(await loadSubTopicsForTopics(topicIds));
        }
      }

      const questionRefs = loadedTest.questions ?? [];
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
    void loadPage();
  }, [loadPage]);

  useEffect(() => {
    const topicId = formDefaults.topic;
    if (!topicId) return;

    let cancelled = false;
    void getSubTopicsByTopic(topicId).then((items) => {
      if (!cancelled) setSubTopicOptions(items);
    });

    return () => {
      cancelled = true;
    };
  }, [formDefaults.topic]);

  function prepareQuestion(values: QuestionFormValues): Question {
    const defaultTopic = resolveEntityIds(Array.isArray(test?.topics) ? test.topics : [], topicOptions)[0];
    const defaultSubTopic = resolveEntityIds(Array.isArray(test?.sub_topics) ? test.sub_topics : [], subTopicOptions)[0];

    return {
      type: 'mcq',
      question: values.question.trim(),
      option1: values.option1.trim(),
      option2: values.option2.trim(),
      option3: values.option3.trim(),
      option4: values.option4.trim(),
      correct_option: values.correct_option,
      explanation: values.explanation?.trim() || undefined,
      difficulty: (values.difficulty as Question['difficulty']) || undefined,
      topic: values.topic || defaultTopic || undefined,
      sub_topic: values.sub_topic || defaultSubTopic || undefined,
      subject: subjectId,
      test_id: testId
    };
  }

  function upsertQuestion(values: QuestionFormValues) {
    const prepared = prepareQuestion(values);
    setQuestions((prev) => {
      const next = [...prev];
      next[activeSlot] = { ...prepared, id: prev[activeSlot]?.id };
      return next;
    });
    setServerError('');
  }

  function handleNext(values: QuestionFormValues) {
    upsertQuestion(values);
    if (activeSlot < totalQuestions - 1) {
      setActiveSlot((slot) => slot + 1);
    }
  }

  async function saveAndContinue() {
    setSaving(true);
    setServerError('');
    try {
      const savedQuestions = questions.filter((question) => question.question?.trim());
      if (savedQuestions.length === 0) {
        setServerError('Add at least one question before continuing.');
        return;
      }

      const newQuestions = savedQuestions.filter((question) => !question.id);
      const existingQuestions = savedQuestions.filter((question) => question.id);

      const created = newQuestions.length
        ? await bulkCreateQuestions(newQuestions.map((question) => ({ ...question, test_id: testId, subject: subjectId })))
        : [];

      const allQuestions = [...existingQuestions, ...created];
      const questionIds = allQuestions.map((question) => question.id).filter((id): id is string => Boolean(id));
      const marksPerQuestion = test?.correct_marks ?? 1;

      await updateTest(testId, {
        questions: questionIds,
        total_questions: questionIds.length,
        total_marks: questionIds.length * marksPerQuestion
      });

      navigate(`/tests/${testId}/preview`);
    } catch (error) {
      setServerError(getApiError(error));
    } finally {
      setSaving(false);
    }
  }

  function clearActiveQuestion() {
    setQuestions((prev) => {
      const next = [...prev];
      delete next[activeSlot];
      return next.filter(Boolean);
    });
  }

  const isSlotComplete = (index: number) => Boolean(questions[index]?.question?.trim());
  const hasSavedQuestions = questions.some((question) => question.question?.trim());

  return {
    test,
    loading,
    saving,
    serverError,
    totalQuestions,
    activeSlot,
    formDefaults,
    topicOptions,
    subTopicOptions,
    hasSavedQuestions,
    setActiveSlot,
    handleNext,
    saveAndContinue,
    clearActiveQuestion,
    isSlotComplete,
    reload: loadPage
  };
}
