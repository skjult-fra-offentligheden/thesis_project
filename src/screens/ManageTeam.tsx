import { useState } from 'react';
import type { User } from '../types/users';
import { currentUser } from '../data/users';

type ExpiryStatus = 'none' | 'active' | 'soon' | 'expired';

function getExpiryStatus(expiryDate?: string): ExpiryStatus {
  if (!expiryDate) return 'none';
  const today = new Date();
  const exp = new Date(expiryDate);
  const daysLeft = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 60) return 'soon';
  return 'active';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function ManageTeam({
  users,
  onDelete,
}: {
  users: User[];
  onDelete: (id: string) => void;
}) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const total = users.length;
  const employees = users.filter((u) => u.roleId === 'employee').length;
  const expiredCount = users.filter((u) => getExpiryStatus(u.expiryDate) === 'expired').length;
  const soonCount = users.filter((u) => getExpiryStatus(u.expiryDate) === 'soon').length;

  return (
    <>
      <h1 className="page-title">Manage team</h1>
      <p className="page-subtitle">
        View and manage all users in your organisation.
      </p>

      {/* Stats bar */}
      <div className="mt-stats-bar">
        <div className="mt-stat">
          <span className="mt-stat-value">{total}</span>
          <span className="mt-stat-label">Total users</span>
        </div>
        <div className="mt-stat">
          <span className="mt-stat-value">{employees}</span>
          <span className="mt-stat-label">Employees</span>
        </div>
        {soonCount > 0 && (
          <div className="mt-stat warning">
            <span className="mt-stat-value">{soonCount}</span>
            <span className="mt-stat-label">Expiring soon</span>
          </div>
        )}
        {expiredCount > 0 && (
          <div className="mt-stat danger">
            <span className="mt-stat-value">{expiredCount}</span>
            <span className="mt-stat-label">Expired</span>
          </div>
        )}
      </div>

      {/* User list */}
      <div className="mt-list">
        {users.length === 0 && (
          <div className="mt-empty">No users in this organisation yet.</div>
        )}
        {users.map((user) => {
          const status = getExpiryStatus(user.expiryDate);
          const fleetGrants = user.grants.filter((g) => g.kind === 'data');
          const isSelf = user.id === currentUser.id;
          const isConfirming = confirmDeleteId === user.id;

          return (
            <div
              key={user.id}
              className={`mt-user-row${status === 'expired' ? ' expired' : ''}`}
            >
              {/* Avatar */}
              <div className={`mt-avatar${user.roleId === 'superuser' ? ' superuser' : ''}`}>
                {initials(user.name)}
              </div>

              {/* Identity */}
              <div className="mt-user-info">
                <div className="mt-user-name">
                  {user.name}
                  {isSelf && <span className="mt-self-tag">you</span>}
                </div>
                <div className="mt-user-email">{user.email}</div>
                {(user.department || user.employeeRole) && (
                  <div className="mt-user-meta">
                    {[user.department, user.employeeRole]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                )}

                {/* Fleet / vessel chips */}
                {fleetGrants.length > 0 ? (
                  <div className="mt-fleets">
                    {fleetGrants.map((g) => (
                      <span key={g.id} className="mt-fleet-chip">
                        {g.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="mt-fleets">
                    <span className="mt-fleet-chip none">No fleet access</span>
                  </div>
                )}
              </div>

              {/* Badges: role + expiry */}
              <div className="mt-badges">
                <span
                  className={`mt-role-badge${user.roleId === 'employee' ? ' employee' : ''}`}
                >
                  {user.roleId === 'superuser' ? 'Superuser' : 'Employee'}
                </span>

                {status === 'none' && (
                  <span className="mt-expiry-badge none">No expiry</span>
                )}
                {status === 'active' && (
                  <span className="mt-expiry-badge active">
                    Expires {formatDate(user.expiryDate!)}
                  </span>
                )}
                {status === 'soon' && (
                  <span className="mt-expiry-badge soon">
                    Expires {formatDate(user.expiryDate!)}
                  </span>
                )}
                {status === 'expired' && (
                  <span className="mt-expiry-badge expired">
                    Expired {formatDate(user.expiryDate!)}
                  </span>
                )}
              </div>

              {/* Delete */}
              {!isSelf && (
                <div className="mt-actions">
                  {isConfirming ? (
                    <>
                      <span className="mt-confirm-label">Delete user?</span>
                      <button
                        className="btn-confirm-delete"
                        onClick={() => {
                          onDelete(user.id);
                          setConfirmDeleteId(null);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn-delete"
                      onClick={() => setConfirmDeleteId(user.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
