import { Button } from '../shared/Button';
import { FlowFooter } from './FlowFooter';

interface QuestionBuilderFooterProps {
  formId: string;
  isLastQuestion: boolean;
  saving: boolean;
  onSaveAndContinue: () => void;
}

export function QuestionBuilderFooter({
  formId,
  isLastQuestion,
  saving,
  onSaveAndContinue
}: QuestionBuilderFooterProps) {
  return (
    <FlowFooter exitLabel="Exit Test Creation" exitTo="/tests">
      {isLastQuestion ? (
        <Button onClick={onSaveAndContinue} disabled={saving}>
          {saving ? 'Saving...' : 'Save & Continue'}
        </Button>
      ) : (
        <Button type="submit" form={formId}>
          Next
        </Button>
      )}
    </FlowFooter>
  );
}
