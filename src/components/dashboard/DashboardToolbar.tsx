import { Search } from 'lucide-react';
import { Button } from '../shared/Button';
import { Input } from '../shared/FormField';

interface DashboardToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onRefresh: () => void;
}

export function DashboardToolbar({ query, onQueryChange, onRefresh }: DashboardToolbarProps) {
  return (
    <div className="dashboard-toolbar">
      <div className="search-box">
        <Search size={18} />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by test name"
        />
      </div>
      <Button variant="secondary" onClick={onRefresh}>
        Refresh
      </Button>
    </div>
  );
}
