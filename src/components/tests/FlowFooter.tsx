import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface FlowFooterProps {
  exitLabel: string;
  exitTo: string;
  children: ReactNode;
}

export function FlowFooter({ exitLabel, exitTo, children }: FlowFooterProps) {
  return (
    <footer className="flow-footer">
      <Link className="flow-footer__exit" to={exitTo}>
        {exitLabel}
      </Link>
      <div className="flow-footer__right">{children}</div>
    </footer>
  );
}
