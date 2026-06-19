import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../shared/Button';

export function DashboardHeader() {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">Test creation</p>
        <h1>All tests</h1>
      </div>
      <Button className="button-link">
        <Link to="/tests/new">
          <Plus size={18} /> Create New Test
        </Link>
      </Button>
    </div>
  );
}
