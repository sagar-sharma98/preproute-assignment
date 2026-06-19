import { Link } from 'react-router-dom';

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link to="/tests" className={`logo logo-link${compact ? ' logo--compact' : ''}`} aria-label="Go to dashboard">
      <img className="logo-image" src="/preproute-logo.png" alt="PrepRoute" />
    </Link>
  );
}
