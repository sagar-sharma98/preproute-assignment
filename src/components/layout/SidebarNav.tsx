import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navigation';
import { Logo } from '../shared/Logo';

export function SidebarNav() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo />
      </div>
      <nav className="sidebar-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.label === 'Dashboard'}
            className={() => `nav-item${item.isActive(pathname) ? ' active' : ''}`}
          >
            <item.icon size={20} strokeWidth={2} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
