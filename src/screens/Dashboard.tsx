import { useState } from 'react';
import { customerOrg, existingUsers } from '../data/users';
import { fleets } from '../data/fleets';
import type { Vessel } from '../data/fleets';

// Mock live metrics per vessel — replace with real data in production
const VESSEL_METRICS: Record<string, { rpm: number; hours: number; online: boolean; alerts: number }> = {
  'v-atl-1': { rpm: 85.3,  hours: 42150, online: true,  alerts: 0 },
  'v-atl-2': { rpm: 0.0,   hours: 18230, online: true,  alerts: 2 },
  'v-atl-3': { rpm: 0.0,   hours: 31800, online: false, alerts: 0 },
  'v-bal-1': { rpm: 112.0, hours: 9450,  online: true,  alerts: 1 },
  'v-bal-2': { rpm: 0.0,   hours: 24600, online: true,  alerts: 0 },
  'v-pac-1': { rpm: 98.5,  hours: 55200, online: true,  alerts: 0 },
  'v-pac-2': { rpm: 76.2,  hours: 38900, online: true,  alerts: 4 },
  'v-pac-3': { rpm: 0.0,   hours: 62450, online: false, alerts: 0 },
};

function fmt(n: number) {
  return n.toLocaleString('en-GB');
}

export function Dashboard() {
  const [search, setSearch] = useState('');
  const q = search.trim().toLowerCase();

  // Filter fleets/vessels by search query
  const filteredFleets = fleets
    .map((fleet) => ({
      ...fleet,
      vessels: fleet.vessels.filter(
        (v) =>
          q === '' ||
          v.name.toLowerCase().includes(q) ||
          v.imoNumber.includes(q) ||
          v.type.toLowerCase().includes(q) ||
          fleet.name.toLowerCase().includes(q)
      ),
    }))
    .filter((fleet) => fleet.vessels.length > 0);

  const totalFound = filteredFleets.reduce((acc, f) => acc + f.vessels.length, 0);

  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Overview of your organisation's fleet and vessel status.
      </p>

      {/* Summary stats */}
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

      {/* Search */}
      <div className="vessel-search-wrap">
        <div className="vessel-search-box">
          <SearchIcon />
          <input
            className="vessel-search-input"
            placeholder="Search by vessel name, IMO or type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="vessel-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <span className="vessel-search-count">
          {totalFound} vessel{totalFound !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Fleet groups */}
      {filteredFleets.length === 0 ? (
        <div className="vessel-empty">No vessels match "{search}"</div>
      ) : (
        filteredFleets.map((fleet) => (
          <div key={fleet.id} className="fleet-section">
            <div className="fleet-section-header">
              <span className="fleet-section-name">{fleet.name}</span>
              <span className="fleet-section-count">
                {fleet.vessels.length} vessel{fleet.vessels.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="vessel-card-grid">
              {fleet.vessels.map((vessel) => (
                <VesselCard key={vessel.id} vessel={vessel} />
              ))}
            </div>
          </div>
        ))
      )}

      {/* Recent activity */}
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

/* ── Vessel card ──────────────────────────────────────────────────────── */

function VesselCard({ vessel }: { vessel: Vessel }) {
  const m = VESSEL_METRICS[vessel.id] ?? { rpm: 0, hours: 0, online: false, alerts: 0 };

  return (
    <div className={`vessel-card${!m.online ? ' offline' : ''}`}>
      <div className="vessel-card-header">
        <div className="vessel-card-name">{vessel.name}</div>
        {m.alerts > 0 && (
          <span className="vessel-alert-badge">{m.alerts}</span>
        )}
      </div>
      <div className="vessel-card-meta">
        <span className="vessel-card-type">{vessel.type}</span>
        <span className="vessel-card-imo">IMO {vessel.imoNumber}</span>
      </div>

      <div className="vessel-card-divider" />

      <div className="vessel-card-icons">
        <div className="vessel-icon-col">
          <WifiIcon online={m.online} />
          <span className="vessel-icon-label">{m.online ? 'Online' : 'Offline'}</span>
        </div>
        <div className="vessel-icon-col">
          <GaugeIcon />
          <span className="vessel-icon-label">{m.rpm.toFixed(1)} rpm</span>
        </div>
        <div className="vessel-icon-col">
          <ClockIcon />
          <span className="vessel-icon-label">{fmt(m.hours)} h</span>
        </div>
      </div>
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function WifiIcon({ online }: { online: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={online ? '#1a7a3a' : '#a4abb5'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill={online ? '#1a7a3a' : '#a4abb5'} stroke="none" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
