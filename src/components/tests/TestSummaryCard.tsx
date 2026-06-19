import { Clock, Edit3, FileQuestion, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TestSummary } from '../../types';
import { entityName, listNames } from '../../utils/format';

interface TestSummaryCardProps {
  test: TestSummary;
  variant?: 'default' | 'flow';
}

export function TestSummaryCard({ test, variant = 'default' }: TestSummaryCardProps) {
  const topics = listNames(test.topics);

  return (
    <section className={`test-summary-card${variant === 'flow' ? ' test-summary-card--flow' : ''}`}>
      <div className="summary-topline">
        <span className="pill-dark">{formatTestType(test.type)}</span>
        {test.id ? (
          <Link className="edit-link" to={`/tests/${test.id}/edit`} aria-label="Edit test">
            <Edit3 size={20} />
          </Link>
        ) : null}
      </div>
      <div className="summary-body">
        <div className="summary-copy">
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
              <dd>{topics.length ? topics.map((topic) => <span className="tag" key={topic}>{topic}</span>) : '-'}</dd>
            </div>
            <div>
              <dt>Sub Topic</dt>
              <dd>{listNames(test.sub_topics).map((topic) => <span className="tag" key={topic}>{topic}</span>)}</dd>
            </div>
          </dl>
        </div>
        <div className="summary-stats">
          <span><Clock size={16} /> {test.total_time ?? 0} Min</span>
          <span><FileQuestion size={16} /> {test.total_questions ?? 0} Q&apos;s</span>
          <span><Medal size={16} /> {test.total_marks ?? 0} Marks</span>
        </div>
      </div>
    </section>
  );
}

import { formatTestType } from '../../utils/testType';
