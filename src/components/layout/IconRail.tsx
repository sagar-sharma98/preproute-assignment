import {
  Archive,
  Bell,
  Building2,
  ChevronUp,
  Edit3,
  FileStack,
  IndianRupee,
  MessageCircle,
  Settings,
  Trophy,
  UserCircle,
  Users
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const railItems = [
  { icon: ChevronUp, to: '/tests', label: 'Analytics', end: true },
  { icon: Edit3, to: '/tests/new', label: 'Create test' },
  { icon: FileStack, to: '/tests', label: 'Documents', end: true },
  { icon: Users, to: '/tests', label: 'Users', end: true },
  { icon: Building2, to: '/tests', label: 'Institution', end: true },
  { icon: UserCircle, to: '/tests', label: 'Profile', end: true },
  { icon: Archive, to: '/tests', label: 'Archive', end: true },
  { icon: IndianRupee, to: '/tests', label: 'Payments', end: true },
  { icon: Trophy, to: '/tests', label: 'Achievements', end: true },
  { icon: MessageCircle, to: '/tests', label: 'Messages', end: true },
  { icon: Bell, to: '/tests', label: 'Notifications', end: true },
  { icon: Settings, to: '/tests', label: 'Settings', end: true }
];

export function IconRail() {
  return (
    <aside className="icon-rail" aria-label="Quick navigation">
      {railItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.end}
          title={item.label}
          className={({ isActive }) => `icon-rail__item${isActive ? ' active' : ''}`}
        >
          <item.icon size={20} strokeWidth={1.8} />
        </NavLink>
      ))}
    </aside>
  );
}
