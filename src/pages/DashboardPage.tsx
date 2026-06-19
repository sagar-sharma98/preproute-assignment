import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getTests } from '../api/tests';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { DashboardFilters } from '../components/dashboard/DashboardFilters';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardTestGrid } from '../components/dashboard/DashboardTestGrid';
import { DashboardToolbar } from '../components/dashboard/DashboardToolbar';
import { Button } from '../components/shared/Button';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { Loader } from '../components/shared/Loader';
import { useAsync } from '../hooks/useAsync';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { filterTests } from '../utils/testFilters';

export function DashboardPage() {
  const { data: tests, loading, error, refresh } = useAsync(getTests);
  const {
    filters,
    subjects,
    topics,
    subTopics,
    hasActiveFilters,
    setQuery,
    setSubjectId,
    setTopicId,
    setSubTopicId,
    clearFilters
  } = useDashboardFilters();
  const location = useLocation();
  const publishMessage = (location.state as { publishMessage?: string } | null)?.publishMessage;

  const filteredTests = useMemo(
    () => filterTests(tests ?? [], filters, { subjects, topics, subTopics }),
    [filters, subjects, topics, subTopics, tests]
  );

  const totalTests = tests?.length ?? 0;

  return (
    <section className="page-stack dashboard-page">
      <DashboardHeader />
      <DashboardToolbar query={filters.query} onQueryChange={setQuery} onRefresh={() => void refresh()} />
      <DashboardFilters
        subjects={subjects}
        topics={topics}
        subTopics={subTopics}
        subjectId={filters.subjectId}
        topicId={filters.topicId}
        subTopicId={filters.subTopicId}
        hasActiveFilters={hasActiveFilters}
        onSubjectChange={setSubjectId}
        onTopicChange={setTopicId}
        onSubTopicChange={setSubTopicId}
        onClear={clearFilters}
      />

      {publishMessage ? <div className="success-message">{publishMessage}</div> : null}
      {error ? <ErrorMessage title="Could not load tests" message={error} onRetry={() => void refresh()} /> : null}
      {loading ? <Loader label="Loading tests..." /> : null}

      {!loading && totalTests === 0 ? (
        <DashboardEmptyState
          title="No tests yet"
          description="Create your first chapter wise, PYQ, or mock test to get started."
          action={
            <Button className="button-link">
              <Link to="/tests/new">
                <Plus size={18} /> Create New Test
              </Link>
            </Button>
          }
        />
      ) : null}

      {!loading && totalTests > 0 && filteredTests.length === 0 ? (
        <DashboardEmptyState
          title="No matching tests"
          description="Try a different test name or adjust the subject, topic, and sub-topic filters."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : null}

      {!loading && filteredTests.length > 0 ? <DashboardTestGrid tests={filteredTests} /> : null}
    </section>
  );
}
