import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TestFlowLayout } from '../components/layout/TestFlowLayout';
import { Button } from '../components/shared/Button';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { Loader } from '../components/shared/Loader';
import { FlowFooter } from '../components/tests/FlowFooter';
import { PreviewEditLinks } from '../components/tests/PreviewEditLinks';
import { PublishOptionsCard } from '../components/tests/PublishOptionsCard';
import { QuestionSidebar } from '../components/tests/QuestionSidebar';
import { TestCreatedBar } from '../components/tests/TestCreatedBar';
import { TestSummaryCard } from '../components/tests/TestSummaryCard';
import { usePreviewPublish } from '../hooks/usePreviewPublish';

export function PreviewPublishPage() {
  const { testId = '' } = useParams();
  const [activeSlot, setActiveSlot] = useState(0);
  const { test, questions, loading, publishing, serverError, complete, totalQuestions, publish, reload } =
    usePreviewPublish(testId);

  if (loading) {
    return <Loader label="Loading preview..." />;
  }

  return (
    <TestFlowLayout
      sidebar={
        <QuestionSidebar
          totalQuestions={totalQuestions}
          isSlotComplete={(index) => Boolean(questions[index]?.question?.trim())}
          activeSlot={activeSlot}
          onSelect={setActiveSlot}
        />
      }
      topBar={<TestCreatedBar complete={complete} questionCount={questions.length} />}
    >
      {test ? (
        <TestSummaryCard test={{ ...test, total_questions: questions.length || test.total_questions }} variant="flow" />
      ) : null}

      <PreviewEditLinks testId={testId} />
      <PublishOptionsCard />

      {serverError ? <ErrorMessage message={serverError} onRetry={() => void reload()} /> : null}

      <FlowFooter exitLabel="Cancel" exitTo="/tests">
        <Button onClick={() => void publish()} disabled={publishing || !complete || loading}>
          {publishing ? 'Publishing...' : 'Confirm'}
        </Button>
      </FlowFooter>
    </TestFlowLayout>
  );
}
