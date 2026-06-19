import { Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmDialog } from '../shared/ConfirmDialog';

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const displayName = user?.name ?? user?.userId ?? 'Alex Wando';

  const handleLogout = () => {
    setLogoutOpen(false);
    logout();
  };

  return (
    <>
      <div className="profile-area">
        <button type="button" className="icon-button" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>
        <button
          type="button"
          className="profile-block"
          onClick={() => setLogoutOpen(true)}
          aria-label="Open profile menu"
        >
          <img className="avatar" src="/avatar.png" alt="" />
          <div className="profile-copy">
            <strong>{displayName}</strong>
            <span>{user?.role ?? 'Admin'}</span>
          </div>
          <ChevronDown size={18} className="profile-chevron" />
        </button>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        title="Log out?"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </>
  );
}
