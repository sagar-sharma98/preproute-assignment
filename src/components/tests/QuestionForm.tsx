import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronLeft,
  ChevronRight,
  Code,
  Image,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  Sigma,
  Strikethrough,
  Table,
  Trash2,
  Underline
} from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Question, SubTopic, Topic } from '../../types';
import { Field, Select, Textarea } from '../shared/FormField';

const correctOptions = ['option1', 'option2', 'option3', 'option4'] as const;
type CorrectOption = (typeof correctOptions)[number];

const schema = z.object({
  question: z.string().min(1, 'Question is required'),
  option1: z.string().min(1, 'Option 1 is required'),
  option2: z.string().min(1, 'Option 2 is required'),
  option3: z.string().min(1, 'Option 3 is required'),
  option4: z.string().min(1, 'Option 4 is required'),
  correct_option: z
    .enum(['', ...correctOptions])
    .transform((value, ctx): CorrectOption => {
      if (value === '') {
        ctx.addIssue({ code: 'custom', message: 'Select the correct option' });
        return z.NEVER;
      }
      return value;
    }),
  explanation: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'difficult', '']).optional(),
  topic: z.string().optional(),
  sub_topic: z.string().optional()
});

export type QuestionFormValues = z.infer<typeof schema>;
type QuestionFormInput = z.input<typeof schema>;

interface QuestionFormProps {
  formId: string;
  questionNumber: number;
  totalQuestions: number;
  defaultValues?: Partial<QuestionFormInput>;
  topicOptions: Topic[];
  subTopicOptions: SubTopic[];
  onSubmit: (values: QuestionFormValues) => void;
  onAddQuestion?: (values: QuestionFormValues) => void;
  onClear: () => void;
  onPrevious?: () => void;
  onNextSlot?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

const emptyDefaults: QuestionFormInput = {
  question: '',
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  correct_option: '',
  explanation: '',
  difficulty: '',
  topic: '',
  sub_topic: ''
};

export function QuestionForm({
  formId,
  questionNumber,
  totalQuestions,
  defaultValues,
  topicOptions,
  subTopicOptions,
  onSubmit,
  onAddQuestion,
  onClear,
  onPrevious,
  onNextSlot,
  canGoPrevious = false,
  canGoNext = false
}: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<QuestionFormInput, unknown, QuestionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...emptyDefaults, ...defaultValues }
  });

  const selectedCorrect = watch('correct_option');

  useEffect(() => {
    reset({ ...emptyDefaults, ...defaultValues });
  }, [defaultValues, reset]);

  const optionFields = correctOptions;

  function clearOption(field: CorrectOption) {
    setValue(field, '', { shouldDirty: true });
    if (selectedCorrect === field) {
      setValue('correct_option', '', { shouldDirty: true });
    }
  }

  return (
    <form id={formId} className="question-workspace" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="question-workspace__header">
        <h3 className="question-workspace__title">
          Question {questionNumber}/{totalQuestions}
        </h3>
        <div className="question-workspace__actions">
          {onAddQuestion ? (
            <button type="button" className="chip-button chip-button--primary" onClick={() => void handleSubmit(onAddQuestion)()}>
              Add Question
            </button>
          ) : null}
          <button type="button" className="chip-button chip-button--outline">
            CSV
          </button>
        </div>
      </div>

      <button type="button" className="text-danger-button" onClick={onClear}>
        <Trash2 size={16} />
        Delete All Edits
      </button>

      <div className="rich-editor">
        <div className="rich-editor__toolbar" aria-hidden="true">
          <Bold size={16} />
          <Italic size={16} />
          <Underline size={16} />
          <Strikethrough size={16} />
          <Code size={16} />
          <Link2 size={16} />
          <AlignLeft size={16} />
          <AlignCenter size={16} />
          <AlignRight size={16} />
          <List size={16} />
          <ListOrdered size={16} />
          <Table size={16} />
          <Sigma size={16} />
          <Image size={16} />
          <Paperclip size={16} />
        </div>
        <div className="rich-editor__body">
          <Textarea {...register('question')} placeholder="Type here" rows={6} />
          {errors.question ? <p className="field-error">{errors.question.message}</p> : null}
          <button type="button" className="rich-editor__clear" onClick={onClear} aria-label="Clear question">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <section className="question-workspace__section">
        <div className="question-workspace__section-header">
          <h4>Type the options below</h4>
          <p className="muted question-workspace__hint">Select the radio button for the correct answer</p>
        </div>
        <Controller
          name="correct_option"
          control={control}
          render={({ field }) => (
            <>
              {optionFields.map((optionField, index) => (
                <div
                  className={`option-row${field.value === optionField ? ' option-row--correct' : ''}`}
                  key={optionField}
                >
                  <label className="option-row__radio" title="Mark as correct answer">
                    <input
                      type="radio"
                      name={field.name}
                      value={optionField}
                      checked={field.value === optionField}
                      onChange={() => field.onChange(optionField)}
                    />
                    <span className="option-row__radio-mark" />
                  </label>
                  <input
                    className={`option-row__input${errors[optionField] ? ' has-error' : ''}`}
                    placeholder="Type Option here"
                    {...register(optionField)}
                  />
                  <button
                    type="button"
                    className="option-row__delete"
                    onClick={() => clearOption(optionField)}
                    aria-label={`Clear option ${index + 1}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </>
          )}
        />
        {errors.correct_option ? <p className="field-error">{errors.correct_option.message}</p> : null}
      </section>

      <section className="question-workspace__section">
        <h4>Add Solution</h4>
        <div className="rich-editor__body rich-editor__body--plain">
          <Textarea {...register('explanation')} placeholder="Type here" rows={4} />
          <button type="button" className="rich-editor__clear" aria-label="Clear solution">
            <Trash2 size={16} />
          </button>
        </div>
      </section>

      <div className="question-pagination">
        <button
          type="button"
          className="question-pagination__btn"
          disabled={!canGoPrevious}
          onClick={onPrevious}
          aria-label="Previous question"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="question-pagination__btn"
          disabled={!canGoNext}
          onClick={onNextSlot}
          aria-label="Next question"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <section className="question-settings">
        <h4>Question settings</h4>
        <div className="question-settings__stack">
          <Field label="Level of Difficulty" error={errors.difficulty?.message}>
            <Select {...register('difficulty')}>
              <option value="">Select from Drop-down</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="difficult">Difficult</option>
            </Select>
          </Field>
          <Field label="Topic" error={errors.topic?.message}>
            <Select {...register('topic')}>
              <option value="">Select from Drop-down</option>
              {topicOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Sub-topic" error={errors.sub_topic?.message}>
            <Select {...register('sub_topic')}>
              <option value="">Select from Drop-down</option>
              {subTopicOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </section>
    </form>
  );
}

export function questionToFormValues(question?: Question): Partial<QuestionFormInput> {
  if (!question) return {};

  return {
    question: question.question,
    option1: question.option1,
    option2: question.option2,
    option3: question.option3,
    option4: question.option4,
    correct_option: question.correct_option,
    explanation: question.explanation ?? '',
    difficulty: question.difficulty ?? '',
    topic: typeof question.topic === 'string' ? question.topic : '',
    sub_topic: typeof question.sub_topic === 'string' ? question.sub_topic : ''
  };
}
