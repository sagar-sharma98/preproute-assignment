import { Logo } from '../shared/Logo';
import { ProfileMenu } from './ProfileMenu';

interface TopBarProps {
  showLogo?: boolean;
}

export function TopBar({ showLogo = false }: TopBarProps) {
  return (
    <header className="topbar">
      {showLogo ? (
        <div className="topbar-logo">
          <Logo />
        </div>
      ) : (
        <div className="topbar-spacer" />
      )}
      <ProfileMenu />
    </header>
  );
}
