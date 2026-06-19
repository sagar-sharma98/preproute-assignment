import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import {
  createTest,
  getSubjects,
  getSubTopicsByTopic,
  getTest,
  getTopicsBySubject,
  updateTest
} from '../api/tests';
import { Button } from '../components/shared/Button';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { Field, Input, Select } from '../components/shared/FormField';
import { Loader } from '../components/shared/Loader';
import { getApiError } from '../api/client';
import type { Subject, SubTopic, TestPayload, Topic } from '../types';
import { resolveEntityId, resolveEntityIds } from '../utils/entities';

const markingRangeMessage = 'Value must be between -4 and 4';

function numberStringField(required: string, validate: (value: number) => string | null) {
  return z
    .string()
    .trim()
    .min(1, required)
    .refine((value) => !Number.isNaN(Number(value)), { message: 'Enter a valid number' })
    .superRefine((value, ctx) => {
      const message = validate(Number(value));
      if (message) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });
      }
    });
}

const testSchema = z.object({
  name: z.string().trim().min(2, 'Test name is required'),
  type: z.string().min(1, 'Test type is required'),
  subject: z.string().min(1, 'Subject is required'),
  topic: z.string().min(1, 'Topic is required'),
  sub_topic: z.string().min(1, 'Sub-topic is required'),
  correct_marks: numberStringField('Correct answer marks is required', (value) =>
    value >= 1 ? null : 'Correct answer marks must be a positive number'
  ),
  wrong_marks: numberStringField('Wrong answer marks is required', (value) =>
    value >= -4 && value <= 4 ? null : markingRangeMessage
  ),
  unattempt_marks: numberStringField('Unattempted marks is required', (value) =>
    value >= -4 && value <= 4 ? null : markingRangeMessage
  ),
  difficulty: z
    .enum(['easy', 'medium', 'difficult', ''])
    .refine((value) => value !== '', { message: 'Difficulty is required' }),
  total_time: numberStringField('Duration is required', (value) =>
    value >= 1 ? null : 'Duration must be a positive number'
  ),
  total_marks: numberStringField('Total marks is required', (value) =>
    value >= 1 ? null : 'Total marks must be a positive number'
  ),
  total_questions: numberStringField('Number of questions is required', (value) =>
    value >= 1 ? null : 'Number of questions must be a positive number'
  )
});

type TestFormValues = z.input<typeof testSchema>;

const defaults: TestFormValues = {
  name: '',
  type: 'chapterwise',
  subject: '',
  topic: '',
  sub_topic: '',
  correct_marks: '',
  wrong_marks: '',
  unattempt_marks: '',
  difficulty: '',
  total_time: '',
  total_marks: '',
  total_questions: ''
};

function buildTestPayload(values: TestFormValues): TestPayload {
  return {
    name: values.name,
    type: values.type,
    subject: values.subject,
    topics: [values.topic],
    sub_topics: [values.sub_topic],
    correct_marks: Number(values.correct_marks),
    wrong_marks: Number(values.wrong_marks),
    unattempt_marks: Number(values.unattempt_marks),
    difficulty: values.difficulty as TestPayload['difficulty'],
    total_time: Number(values.total_time),
    total_marks: Number(values.total_marks),
    total_questions: Number(values.total_questions)
  };
}

export function TestFormPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(Boolean(testId));
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [subTopicsLoading, setSubTopicsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting, submitCount }
  } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: defaults,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldFocusError: true
  });

  const { ref: nameRef, ...nameField } = register('name');
  const { ref: subjectRef, ...subjectField } = register('subject', {
    onChange: () => {
      setValue('topic', '', { shouldDirty: true, shouldValidate: false });
      setValue('sub_topic', '', { shouldDirty: true, shouldValidate: false });
      clearErrors(['topic', 'sub_topic']);
      setTopics([]);
      setSubTopics([]);
    }
  });
  const { ref: topicRef, ...topicField } = register('topic', {
    onChange: () => {
      setValue('sub_topic', '', { shouldDirty: true, shouldValidate: false });
      clearErrors('sub_topic');
      setSubTopics([]);
    }
  });
  const { ref: subTopicRef, ...subTopicField } = register('sub_topic');
  const { ref: totalTimeRef, ...totalTimeField } = register('total_time');
  const { ref: wrongMarksRef, ...wrongMarksField } = register('wrong_marks');
  const { ref: unattemptMarksRef, ...unattemptMarksField } = register('unattempt_marks');
  const { ref: correctMarksRef, ...correctMarksField } = register('correct_marks');
  const { ref: totalQuestionsRef, ...totalQuestionsField } = register('total_questions');
  const { ref: totalMarksRef, ...totalMarksField } = register('total_marks');
  const difficultyField = register('difficulty');

  const selectedSubject = watch('subject');
  const selectedTopic = watch('topic');
  const selectedType = watch('type');
  const showErrors = submitCount > 0;

  const fieldError = (message?: string) => (showErrors ? message : undefined);

  const normalizeDifficulty = (value?: string): TestFormValues['difficulty'] => {
    if (value === 'hard') return 'difficult';
    if (value === 'easy' || value === 'medium' || value === 'difficult') return value;
    return 'easy';
  };

  useEffect(() => {
    setSubjectsLoading(true);
    getSubjects()
      .then(setSubjects)
      .catch((error) => setServerError(getApiError(error)))
      .finally(() => setSubjectsLoading(false));
  }, []);

  useEffect(() => {
    if (!testId || subjectsLoading) return;

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const test = await getTest(testId);
        const subjectId = resolveEntityId(test.subject, subjects);
        const topicOptions = subjectId ? await getTopicsBySubject(subjectId) : [];
        const topicIds = resolveEntityIds(test.topics, topicOptions);
        const selectedTopicId = topicIds[0] ?? '';
        const subTopicOptions = selectedTopicId ? await getSubTopicsByTopic(selectedTopicId) : [];
        const subTopicIds = resolveEntityIds(test.sub_topics, subTopicOptions);

        if (cancelled) return;

        setTopics(topicOptions);
        setSubTopics(subTopicOptions);
        reset({
          ...defaults,
          name: test.name ?? '',
          type: test.type ?? 'chapterwise',
          subject: subjectId,
          topic: selectedTopicId,
          sub_topic: subTopicIds[0] ?? '',
          correct_marks: String(test.correct_marks ?? 5),
          wrong_marks: String(test.wrong_marks ?? -1),
          unattempt_marks: String(test.unattempt_marks ?? 0),
          difficulty: normalizeDifficulty(test.difficulty),
          total_time: String(test.total_time ?? 60),
          total_marks: String(test.total_marks ?? 250),
          total_questions: String(test.total_questions ?? 50)
        });
      } catch (error) {
        if (!cancelled) setServerError(getApiError(error));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reset, subjects, subjectsLoading, testId]);

  useEffect(() => {
    if (loading) return;

    if (!selectedSubject) {
      setTopics([]);
      setSubTopics([]);
      setTopicsLoading(false);
      return;
    }

    let cancelled = false;
    setTopicsLoading(true);

    getTopicsBySubject(selectedSubject)
      .then((loadedTopics) => {
        if (!cancelled) setTopics(loadedTopics);
      })
      .catch((error) => {
        if (!cancelled) setServerError(getApiError(error));
      })
      .finally(() => {
        if (!cancelled) setTopicsLoading(false);
      });

    return () => {
      cancelled = true;
      setTopicsLoading(false);
    };
  }, [loading, selectedSubject]);

  useEffect(() => {
    if (loading) return;

    if (!selectedTopic) {
      setSubTopics([]);
      setSubTopicsLoading(false);
      return;
    }

    let cancelled = false;
    setSubTopicsLoading(true);

    getSubTopicsByTopic(selectedTopic)
      .then((loadedSubTopics) => {
        if (!cancelled) setSubTopics(loadedSubTopics);
      })
      .catch((error) => {
        if (!cancelled) setServerError(getApiError(error));
      })
      .finally(() => {
        if (!cancelled) setSubTopicsLoading(false);
      });

    return () => {
      cancelled = true;
      setSubTopicsLoading(false);
    };
  }, [loading, selectedTopic]);

  const modeLabel = useMemo(() => (testId ? 'Edit Test creation' : 'Create Test'), [testId]);

  const saveTest = (continueToQuestions: boolean) =>
    handleSubmit(
      async (values) => {
        setServerError('');
        try {
          const payload = buildTestPayload(values);
          const saved = testId
            ? await updateTest(testId, { ...payload })
            : await createTest({ ...payload, status: 'draft' });

          if (!saved.id) {
            throw new Error('Test was saved, but the server did not return a test ID.');
          }

          navigate(continueToQuestions ? `/tests/${saved.id}/questions` : '/tests');
        } catch (error) {
          setServerError(getApiError(error));
        }
      },
      () => setServerError('')
    );

  if (loading) return <Loader label="Loading test details..." />;

  return (
    <form className="page-stack" onSubmit={saveTest(true)} noValidate>
      <div className="page-header">
        <div>
          <p className="eyebrow">Test Creation / {testId ? 'Edit Test' : 'Create Test'}</p>
          <h1>{modeLabel}</h1>
        </div>
      </div>

      <section className="form-card">
        <div className="segmented">
          <button
            type="button"
            className={selectedType === 'chapterwise' ? 'active' : ''}
            onClick={() => setValue('type', 'chapterwise', { shouldDirty: true })}
          >
            Chapter Wise
          </button>
          <button
            type="button"
            className={selectedType === 'pyq' ? 'active' : ''}
            onClick={() => setValue('type', 'pyq', { shouldDirty: true })}
          >
            PYQ
          </button>
          <button
            type="button"
            className={selectedType === 'mocktest' ? 'active' : ''}
            onClick={() => setValue('type', 'mocktest', { shouldDirty: true })}
          >
            Mock Test
          </button>
        </div>

        <input type="hidden" {...register('type')} />

        <div className="form-grid two-col">
          <Field label="Name of Test" error={fieldError(errors.name?.message)}>
            <Input ref={nameRef} placeholder="Enter name of Test" {...nameField} />
          </Field>

          <Field label="Subject" error={fieldError(errors.subject?.message)}>
            <Select ref={subjectRef} {...subjectField} disabled={subjectsLoading}>
              <option value="">{subjectsLoading ? 'Loading subjects...' : 'Choose from Drop-down'}</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Topic" error={fieldError(errors.topic?.message)}>
            <Select ref={topicRef} {...topicField} disabled={!selectedSubject}>
              <option value="">
                {!selectedSubject
                  ? 'Select subject first'
                  : topicsLoading
                    ? 'Loading topics...'
                    : topics.length === 0
                      ? 'No topics available'
                      : 'Choose from Drop-down'}
              </option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Sub Topic" error={fieldError(errors.sub_topic?.message)}>
            <Select ref={subTopicRef} {...subTopicField} disabled={!selectedTopic}>
              <option value="">
                {!selectedTopic
                  ? 'Select topic first'
                  : subTopicsLoading
                    ? 'Loading sub-topics...'
                    : subTopics.length === 0
                      ? 'No sub-topics available'
                      : 'Choose from Drop-down'}
              </option>
              {subTopics.map((subTopic) => (
                <option key={subTopic.id} value={subTopic.id}>
                  {subTopic.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Duration (Minutes)" error={fieldError(errors.total_time?.message)}>
            <Input ref={totalTimeRef} type="text" inputMode="numeric" placeholder="Ex: 60" {...totalTimeField} />
          </Field>
          <Field label="Test Difficulty Level" error={fieldError(errors.difficulty?.message)}>
            <div className="radio-row">
              {(['easy', 'medium', 'difficult'] as const).map((level) => (
                <label key={level}>
                  <input type="radio" value={level} {...difficultyField} />
                  <span>{level[0].toUpperCase() + level.slice(1)}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>

        <h2 className="section-title">Marking Scheme:</h2>
        <div className="form-grid five-col">
          <Field label="Wrong Answer" error={fieldError(errors.wrong_marks?.message)}>
            <Input ref={wrongMarksRef} type="text" inputMode="decimal" placeholder="e.g. -1" {...wrongMarksField} />
          </Field>
          <Field label="Unattempted" error={fieldError(errors.unattempt_marks?.message)}>
            <Input ref={unattemptMarksRef} type="text" inputMode="decimal" placeholder="e.g. 0" {...unattemptMarksField} />
          </Field>
          <Field label="Correct Answer" error={fieldError(errors.correct_marks?.message)}>
            <Input ref={correctMarksRef} type="text" inputMode="numeric" placeholder="e.g. 5" {...correctMarksField} />
          </Field>
          <Field label="No of Questions" error={fieldError(errors.total_questions?.message)}>
            <Input ref={totalQuestionsRef} type="text" inputMode="numeric" placeholder="Ex: 50" {...totalQuestionsField} />
          </Field>
          <Field label="Total Marks" error={fieldError(errors.total_marks?.message)}>
            <Input ref={totalMarksRef} type="text" inputMode="numeric" placeholder="Ex: 250" {...totalMarksField} />
          </Field>
        </div>
      </section>

      {serverError ? <ErrorMessage title="Could not save test" message={serverError} /> : null}
      <div className="footer-actions">
        <Button type="button" variant="secondary" onClick={() => void saveTest(false)()} disabled={isSubmitting}>
          <Save size={18} /> Save Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Next: Add Questions'} <ArrowRight size={18} />
        </Button>
      </div>
    </form>
  );
}
