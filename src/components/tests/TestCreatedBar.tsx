import { CheckCircle2 } from 'lucide-react';

interface TestCreatedBarProps {
  complete: boolean;
  questionCount: number;
}

export function TestCreatedBar({ complete, questionCount }: TestCreatedBarProps) {
  return (
    <div className="test-created-bar">
      <strong>Test created</strong>
      <span className={`test-created-bar__pill${complete ? '' : ' test-created-bar__pill--pending'}`}>
        <CheckCircle2 size={16} />
        {complete ? `All ${questionCount} Questions done` : 'Questions pending'}
      </span>
    </div>
  );
}
