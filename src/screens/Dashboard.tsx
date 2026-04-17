import { customerOrg, existingUsers } from '../data/users';

// Screen 1. Deliberately minimal. The encoding (legal/organisational
// provenance) does NOT appear here — its first appearance is on the
// create-user / assign-grant screen, where it has to be acted on.
// Rationale: encoding-as-wallpaper before encoding-as-signal would
// dilute the comprehension test.

export function Dashboard() {
  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Overview of your organisation's users, fleets, and recent activity.
      </p>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-label">Active users</div>
          <div className="card-value">{existingUsers.length}</div>
        </div>
        <div className="card">
          <div className="card-label">Fleets</div>
          <div className="card-value">{customerOrg.fleetCount}</div>
        </div>
        <div className="card">
          <div className="card-label">Vessels</div>
          <div className="card-value">{customerOrg.vesselCount}</div>
        </div>
      </div>

      <div className="activity">
        <div className="activity-title">Recent activity</div>
        <div className="activity-list">
          <div className="activity-row">
            <span>Aisha Rahman granted access to Fleet Baltic</span>
            <span className="activity-when">2 days ago</span>
          </div>
          <div className="activity-row">
            <span>Marek Novák completed diagnostic certification</span>
            <span className="activity-when">5 days ago</span>
          </div>
          <div className="activity-row">
            <span>Thomas Berg added as superuser</span>
            <span className="activity-when">2 weeks ago</span>
          </div>
        </div>
      </div>
    </>
  );
}
