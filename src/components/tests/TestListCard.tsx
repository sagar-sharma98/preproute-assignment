import { Clock, Edit3, Eye, FileQuestion, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../shared/StatusBadge';
import type { TestSummary } from '../../types';
import { entityName, formatDate, listNames } from '../../utils/format';

interface TestListCardProps {
  test: TestSummary;
}

export function TestListCard({ test }: TestListCardProps) {
  const topics = listNames(test.topics);

  return (
    <article className="dashboard-test-card">
      <div className="dashboard-test-card__top">
        <span className="pill-dark">{formatTestType(test.type)}</span>
        <StatusBadge status={test.status} />
      </div>

      <div className="summary-title">
        <span className="chapter-icon">CH</span>
        <h2>{test.name || 'Untitled test'}</h2>
        <span className="pill-green">{test.difficulty ?? 'easy'}</span>
      </div>

      <dl className="summary-meta">
        <div>
          <dt>Subject</dt>
          <dd>{entityName(test.subject)}</dd>
        </div>
        <div>
          <dt>Topic</dt>
          <dd>
            {topics.length
              ? topics.map((topic) => (
                  <span className="tag" key={topic}>
                    {topic}
                  </span>
                ))
              : '-'}
          </dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDate(test.created_at)}</dd>
        </div>
      </dl>

      <div className="dashboard-test-card__footer">
        <div className="summary-stats summary-stats--compact">
          <span>
            <Clock size={15} /> {test.total_time ?? 0} Min
          </span>
          <span>
            <FileQuestion size={15} /> {test.total_questions ?? test.questions?.length ?? 0} Q&apos;s
          </span>
          <span>
            <Medal size={15} /> {test.total_marks ?? 0} Marks
          </span>
        </div>

        <div className="dashboard-test-card__actions">
          <Link className="dashboard-action" to={`/tests/${test.id}/preview`}>
            <Eye size={16} /> View
          </Link>
          <Link className="dashboard-action" to={`/tests/${test.id}/edit`}>
            <Edit3 size={16} /> Edit
          </Link>
        </div>
      </div>
    </article>
  );
}

import { formatTestType } from '../../utils/testType';
