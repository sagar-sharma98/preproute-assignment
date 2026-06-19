import type { TestSummary } from '../../types';
import { TestListCard } from '../tests/TestListCard';

interface DashboardTestGridProps {
  tests: TestSummary[];
}

export function DashboardTestGrid({ tests }: DashboardTestGridProps) {
  return (
    <div className="dashboard-grid">
      {tests.map((test) => (
        <TestListCard key={test.id} test={test} />
      ))}
    </div>
  );
}
