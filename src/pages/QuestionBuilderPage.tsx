import { useParams } from 'react-router-dom';
import { TestFlowLayout } from '../components/layout/TestFlowLayout';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { Loader } from '../components/shared/Loader';
import { PublishBar } from '../components/tests/PublishBar';
import { QuestionBuilderFooter } from '../components/tests/QuestionBuilderFooter';
import { QuestionForm } from '../components/tests/QuestionForm';
import { QuestionSidebar } from '../components/tests/QuestionSidebar';
import { TestSummaryCard } from '../components/tests/TestSummaryCard';
import { useQuestionBuilder } from '../hooks/useQuestionBuilder';

const FORM_ID = 'question-form';

export function QuestionBuilderPage() {
  const { testId = '' } = useParams();
  const {
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
    handleAddQuestion,
    saveAndContinue,
    clearActiveQuestion,
    isSlotComplete,
    reload
  } = useQuestionBuilder(testId);

  if (loading) {
    return <Loader label="Loading question builder..." />;
  }

  if (!test) {
    return <ErrorMessage message={serverError || 'Test not found.'} onRetry={() => void reload()} />;
  }

  return (
    <TestFlowLayout
      sidebar={
        <QuestionSidebar
          totalQuestions={totalQuestions}
          isSlotComplete={isSlotComplete}
          activeSlot={activeSlot}
          onSelect={setActiveSlot}
        />
      }
      topBar={<PublishBar testId={testId} disabled={!hasSavedQuestions} />}
    >
      <TestSummaryCard test={test} variant="flow" />

      <QuestionForm
        key={activeSlot}
        formId={FORM_ID}
        questionNumber={activeSlot + 1}
        totalQuestions={totalQuestions}
        defaultValues={formDefaults}
        topicOptions={topicOptions}
        subTopicOptions={subTopicOptions}
        onSubmit={handleNext}
        onAddQuestion={handleAddQuestion}
        onClear={clearActiveQuestion}
        canGoPrevious={activeSlot > 0}
        canGoNext={activeSlot < totalQuestions - 1}
        onPrevious={() => setActiveSlot((slot) => Math.max(0, slot - 1))}
        onNextSlot={() => setActiveSlot((slot) => Math.min(totalQuestions - 1, slot + 1))}
      />

      {serverError ? <ErrorMessage message={serverError} onRetry={() => void reload()} /> : null}

      <QuestionBuilderFooter
        formId={FORM_ID}
        isLastQuestion={activeSlot === totalQuestions - 1}
        saving={saving}
        onSaveAndContinue={() => void saveAndContinue()}
      />
    </TestFlowLayout>
  );
}
