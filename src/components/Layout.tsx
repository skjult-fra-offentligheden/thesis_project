import type { ReactNode } from 'react';
import { currentUser, customerOrg } from '../data/users';
import { roles } from '../data/roles';

type NavKey = 'dashboard' | 'create-user' | 'manage-team' | 'fleets' | 'settings';

type Props = {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onLogout: () => void;
  children: ReactNode;
};

export function Layout({ active, onNavigate, onLogout, children }: Props) {
  const role = roles.find((r) => r.id === currentUser.roleId)!;

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo-group">
          <img
            src="/everllence-logo.png"
            alt="Everllence"
            className="header-logo"
            sizes='100x50'
          />
          <span className="header-org">{customerOrg.name}</span>
        </div>
        <div className="header-user">
          <span>{currentUser.name}</span>
          <span className="header-user-badge">{role.label}</span>
        </div>
      </header>

      <nav className="nav">
        <NavItem
          label="Dashboard"
          active={active === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
        />
        <NavItem
          label="Create user"
          active={active === 'create-user'}
          onClick={() => onNavigate('create-user')}
        />
        <NavItem
          label="Manage team"
          active={active === 'manage-team'}
          onClick={() => onNavigate('manage-team')}
        />
        <NavItem label="Fleets" disabled comingSoon />
        <NavItem label="Settings" disabled comingSoon />
        <div className="nav-spacer" />

        <div className="nav-logout" onClick={onLogout}>
          <LogoutIcon />
          Sign out
        </div>
      </nav>

      <main className="main">{children}</main>
    </div>
  );
}

function NavItem({
  label,
  active,
  disabled,
  comingSoon,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  onClick?: () => void;
}) {
  const cls = `nav-item${active ? ' active' : ''}${disabled ? ' disabled' : ''}`;
  return (
    <div className={cls} onClick={disabled ? undefined : onClick}>
      {label}
      {comingSoon && <span className="nav-tag">soon</span>}
    </div>
  );
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export type { NavKey };
