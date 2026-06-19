import type { ReactNode } from 'react';

interface DashboardEmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function DashboardEmptyState({ title, description, action }: DashboardEmptyStateProps) {
  return (
    <div className="dashboard-empty">
      <p className="dashboard-empty__title">{title}</p>
      <p className="muted">{description}</p>
      {action}
    </div>
  );
}
