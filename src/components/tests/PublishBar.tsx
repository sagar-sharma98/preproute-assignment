import { Link } from 'react-router-dom';

interface PublishBarProps {
  testId: string;
  disabled?: boolean;
}

export function PublishBar({ testId, disabled }: PublishBarProps) {
  if (disabled) {
    return (
      <div className="publish-bar">
        <span className="publish-bar__button publish-bar__button--disabled">Publish</span>
      </div>
    );
  }

  return (
    <div className="publish-bar">
      <Link className="publish-bar__button" to={`/tests/${testId}/preview`}>
        Publish
      </Link>
    </div>
  );
}
