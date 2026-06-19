import { Outlet, useLocation } from 'react-router-dom';
import { isFlowRoute } from '../../constants/navigation';
import { SidebarNav } from './SidebarNav';
import { TopBar } from './TopBar';

export function AppLayout() {
  const { pathname } = useLocation();
  const flowMode = isFlowRoute(pathname);

  return (
    <div className={`app-shell${flowMode ? ' app-shell--flow' : ''}`}>
      {!flowMode ? <SidebarNav /> : null}
      <div className="main-shell">
        <TopBar showLogo={flowMode} />
        <main className={`content${flowMode ? ' content--flow' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
