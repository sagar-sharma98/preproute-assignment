import { ClipboardList, Edit3, LayoutDashboard, type LucideIcon } from 'lucide-react';

export interface NavItemConfig {
  label: string;
  icon: LucideIcon;
  to: string;
  isActive: (pathname: string) => boolean;
}

export const NAV_ITEMS: NavItemConfig[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/tests',
    isActive: (pathname) => pathname === '/tests'
  },
  {
    label: 'Test Creation',
    icon: Edit3,
    to: '/tests/new',
    isActive: (pathname) =>
      pathname === '/tests/new' || /^\/tests\/[^/]+\/(edit|questions|preview)$/.test(pathname)
  },
  {
    label: 'Test Tracking',
    icon: ClipboardList,
    to: '/tests',
    isActive: () => false
  }
];

export function isFlowRoute(pathname: string) {
  return /\/tests\/[^/]+\/(questions|preview)$/.test(pathname);
}
