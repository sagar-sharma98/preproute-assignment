import { Link } from 'react-router-dom';

interface PreviewEditLinksProps {
  testId: string;
}

export function PreviewEditLinks({ testId }: PreviewEditLinksProps) {
  return (
    <div className="preview-actions">
      <Link to={`/tests/${testId}/edit`}>Edit test</Link>
      <Link to={`/tests/${testId}/questions`}>Edit questions</Link>
    </div>
  );
}
