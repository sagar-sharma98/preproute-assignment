import { ReactNode } from 'react';
import { IconRail } from './IconRail';

interface TestFlowLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  topBar?: ReactNode;
}

export function TestFlowLayout({ children, sidebar, topBar }: TestFlowLayoutProps) {
  return (
    <div className="test-flow-layout">
      <IconRail />
      {sidebar}
      <div className="test-flow-main">
        {topBar}
        <div className="test-flow-content">{children}</div>
      </div>
    </div>
  );
}
