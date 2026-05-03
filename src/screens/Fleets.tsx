import { useState } from 'react';
import type { Fleet, Vessel } from '../data/fleets';
import type { User } from '../types/users';

/* ── Helpers ────────────────────────────────────────────────────────────── */

function getUsersForFleet(fleet: Fleet, users: User[]): User[] {
  const vesselIds = new Set(fleet.vessels.map((v) => v.id));
  return users.filter((u) =>
    u.grants.some(
      (g) =>
        g.kind === 'data' &&
        ((g.scope.type === 'fleet' && g.scope.targetId === fleet.id) ||
          (g.scope.type === 'vessel' && vesselIds.has(g.scope.targetId)))
    )
  );
}

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function makeId() {
  return `fleet-${Date.now()}`;
}

/* ── Main screen ────────────────────────────────────────────────────────── */

export function Fleets({
  fleets,
  onFleetsChange,
  users,
}: {
  fleets: Fleet[];
  onFleetsChange: (fleets: Fleet[]) => void;
  users: User[];
}) {
  const [editingFleet, setEditingFleet] = useState<Fleet | null>(null);
  const [creating, setCreating] = useState(false);

  function saveFleet(updated: Fleet) {
    onFleetsChange(fleets.map((f) => (f.id === updated.id ? updated : f)));
    setEditingFleet(null);
  }

  function deleteFleet(id: string) {
    onFleetsChange(fleets.filter((f) => f.id !== id));
    setEditingFleet(null);
  }

  function createFleet(fleet: Fleet) {
    onFleetsChange([...fleets, fleet]);
    setCreating(false);
  }

  // All unique vessels across all fleets (for the vessel picker)
  const allVessels: Vessel[] = Array.from(
    new Map(fleets.flatMap((f) => f.vessels).map((v) => [v.id, v])).values()
  );

  return (
    <>
      <div className="fleet-mgmt-title-row">
        <div>
          <h1 className="page-title">Fleet management</h1>
          <p className="page-subtitle">
            Manage your fleets, vessels, and user access assignments.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          + Create fleet
        </button>
      </div>

      <div className="fleet-mgmt-list">
        {fleets.map((fleet) => {
          const assignedUsers = getUsersForFleet(fleet, users);
          return (
            <div key={fleet.id} className="fleet-mgmt-card">
              <div className="fleet-mgmt-card-header">
                <div>
                  <div className="fleet-mgmt-card-name">{fleet.name}</div>
                  <div className="fleet-mgmt-card-meta">
                    {fleet.vessels.length} vessel{fleet.vessels.length !== 1 ? 's' : ''}
                    {' · '}
                    {assignedUsers.length} user{assignedUsers.length !== 1 ? 's' : ''} assigned
                  </div>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingFleet(fleet)}
                >
                  Edit fleet
                </button>
              </div>

              <div className="fleet-mgmt-section-label">Vessels</div>
              <table className="fleet-mgmt-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>IMO</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {fleet.vessels.map((v) => (
                    <tr key={v.id}>
                      <td>{v.name}</td>
                      <td className="fleet-mgmt-imo">{v.imoNumber}</td>
                      <td><span className="fleet-mgmt-type-tag">{v.type}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="fleet-mgmt-section-label" style={{ marginTop: 16 }}>
                Assigned users
              </div>
              {assignedUsers.length === 0 ? (
                <p className="fleet-mgmt-empty">No users assigned to this fleet.</p>
              ) : (
                <div className="fleet-mgmt-users">
                  {assignedUsers.map((u) => (
                    <div key={u.id} className="fleet-mgmt-user-row">
                      <div className="fleet-mgmt-avatar">{initials(u.name)}</div>
                      <div>
                        <div className="fleet-mgmt-user-name">{u.name}</div>
                        {u.employeeRole && (
                          <div className="fleet-mgmt-user-role">{u.employeeRole}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingFleet && (
        <EditFleetModal
          fleet={editingFleet}
          allVessels={allVessels}
          onSave={saveFleet}
          onDelete={deleteFleet}
          onClose={() => setEditingFleet(null)}
        />
      )}

      {creating && (
        <CreateFleetModal
          allVessels={allVessels}
          onCreate={createFleet}
          onClose={() => setCreating(false)}
        />
      )}
    </>
  );
}

/* ── Edit fleet modal ───────────────────────────────────────────────────── */

function EditFleetModal({
  fleet,
  allVessels,
  onSave,
  onDelete,
  onClose,
}: {
  fleet: Fleet;
  allVessels: Vessel[];
  onSave: (fleet: Fleet) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(fleet.name);
  const [vesselIds, setVesselIds] = useState<Set<string>>(
    new Set(fleet.vessels.map((v) => v.id))
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  function toggleVessel(id: string) {
    setVesselIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSave() {
    const vessels = allVessels.filter((v) => vesselIds.has(v.id));
    onSave({ ...fleet, name: name.trim(), vessels });
  }

  return (
    <div className="fleet-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="fleet-modal">
        <div className="fleet-modal-header">
          <div className="fleet-modal-title">Edit fleet</div>
          <button className="outlook-close" onClick={onClose}>✕</button>
        </div>

        <div className="fleet-modal-body">
          <label className="form-label">Fleet name</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: 20 }}
          />

          <div className="fleet-mgmt-section-label">Vessels in fleet</div>
          <div className="fleet-modal-vessel-list">
            {allVessels.map((v) => (
              <label key={v.id} className="fleet-modal-vessel-row">
                <input
                  type="checkbox"
                  checked={vesselIds.has(v.id)}
                  onChange={() => toggleVessel(v.id)}
                />
                <span className="fleet-modal-vessel-name">{v.name}</span>
                <span className="fleet-mgmt-imo">{v.imoNumber}</span>
                <span className="fleet-mgmt-type-tag">{v.type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="fleet-modal-footer">
          {confirmDelete ? (
            <>
              <span className="fleet-delete-confirm-text">Delete this fleet?</span>
              <button className="btn btn-danger" onClick={() => onDelete(fleet.id)}>Yes, delete</button>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost-danger" onClick={() => setConfirmDelete(true)}>Delete fleet</button>
              <div style={{ flex: 1 }} />
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim()}>
                Save changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Create fleet modal ─────────────────────────────────────────────────── */

function CreateFleetModal({
  allVessels,
  onCreate,
  onClose,
}: {
  allVessels: Vessel[];
  onCreate: (fleet: Fleet) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [vesselIds, setVesselIds] = useState<Set<string>>(new Set());

  function toggleVessel(id: string) {
    setVesselIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleCreate() {
    const vessels = allVessels.filter((v) => vesselIds.has(v.id));
    onCreate({ id: makeId(), name: name.trim(), vessels });
  }

  return (
    <div className="fleet-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="fleet-modal">
        <div className="fleet-modal-header">
          <div className="fleet-modal-title">Create fleet</div>
          <button className="outlook-close" onClick={onClose}>✕</button>
        </div>

        <div className="fleet-modal-body">
          <label className="form-label">Fleet name</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Fleet North Sea"
            style={{ marginBottom: 20 }}
          />

          <div className="fleet-mgmt-section-label">Select vessels</div>
          <div className="fleet-modal-vessel-list">
            {allVessels.map((v) => (
              <label key={v.id} className="fleet-modal-vessel-row">
                <input
                  type="checkbox"
                  checked={vesselIds.has(v.id)}
                  onChange={() => toggleVessel(v.id)}
                />
                <span className="fleet-modal-vessel-name">{v.name}</span>
                <span className="fleet-mgmt-imo">{v.imoNumber}</span>
                <span className="fleet-mgmt-type-tag">{v.type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="fleet-modal-footer">
          <div style={{ flex: 1 }} />
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Create fleet
          </button>
        </div>
      </div>
    </div>
  );
}
