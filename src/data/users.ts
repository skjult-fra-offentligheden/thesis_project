import type { User } from '../types/users';
import { requirementsCatalogue } from './requirements';

const req = (id: string) => {
  const r = requirementsCatalogue.find((x) => x.id === id);
  if (!r) throw new Error(`Unknown requirement: ${id}`);
  return r;
};

// The participant logs in as this user. Establishing identity before
// the create-user task is methodological, not decorative — comprehension
// must be tested role-situated, not in the abstract.
export const currentUser: User = {
  id: 'usr-sarah-chen',
  name: 'Sarah Chen',
  email: 'sarah.chen@acme-shipping.com',
  roleId: 'superuser',
  grants: [],
};

export const existingUsers: User[] = [
  currentUser,
  {
    id: 'usr-marek-novak',
    name: 'Marek Novák',
    email: 'marek.novak@acme-shipping.com',
    roleId: 'employee',
    department: 'Engineering',
    employeeRole: 'Marine Engineer',
    expiryDate: '2026-12-31',
    grants: [
      {
        kind: 'data',
        id: 'grant-marek-fleet-atlantic',
        label: 'Fleet Atlantic',
        scope: { type: 'fleet', targetId: 'fleet-atlantic' },
        provenance: req('req-customer-fleet-scoping'),
      },
      {
        kind: 'function',
        id: 'grant-marek-diagnose',
        label: 'Vessel diagnostics',
        provenance: req('req-everllence-diagnostic-cert'),
      },
    ],
  },
  {
    id: 'usr-aisha-rahman',
    name: 'Aisha Rahman',
    email: 'aisha.rahman@acme-shipping.com',
    roleId: 'employee',
    department: 'Operations',
    employeeRole: 'Fleet Coordinator',
    expiryDate: '2026-05-20',
    grants: [
      {
        kind: 'data',
        id: 'grant-aisha-fleet-baltic',
        label: 'Fleet Baltic',
        scope: { type: 'fleet', targetId: 'fleet-baltic' },
        provenance: req('req-customer-fleet-scoping'),
      },
    ],
  },
  {
    id: 'usr-thomas-berg',
    name: 'Thomas Berg',
    email: 'thomas.berg@acme-shipping.com',
    roleId: 'superuser',
    department: 'Administration',
    employeeRole: 'IT Administrator',
    expiryDate: '2025-11-30',
    grants: [],
  },
];

export const customerOrg = {
  name: 'Imaginary Shipping A/S',
  fleetCount: 3,
  vesselCount: 47,
};
