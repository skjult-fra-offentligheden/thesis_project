import type { Requirement } from './requirements';

// Grants are the single concept that gates data and function access.
// Each grant carries a Requirement as provenance — this is the 2x2
// the rendering layer must handle: function/data x legal/organisational.

export type FunctionGrant = {
  kind: 'function';
  id: string;
  label: string;            // e.g. "View vessel diagnostics"
  provenance: Requirement;
};

export type DataGrant = {
  kind: 'data';
  id: string;
  label: string;            // e.g. "Fleet Atlantic"
  scope: { type: 'fleet' | 'vessel'; targetId: string };
  provenance: Requirement;
};

export type Grant = FunctionGrant | DataGrant;
