// RBAC for capability tiering only. Roles bundle UI/action permissions
// (what affordances exist) but NOT requirements — provenance lives on
// grants exclusively. This is the single-source-of-truth choice that
// keeps Principle 1's argument coherent.

export type Permission =
  | 'user.create'
  | 'user.view'
  | 'grant.assign'
  | 'grant.revoke'
  | 'vessel.diagnose'
  | 'fleet.view';

export type Role = {
  id: 'superuser' | 'employee';
  label: string;
  description: string;
  permissions: Permission[];
};
