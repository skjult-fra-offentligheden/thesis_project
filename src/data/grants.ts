import type { FunctionGrant } from '../types/grants';
import { requirementsCatalogue } from './requirements';

const req = (id: string) => {
  const r = requirementsCatalogue.find((x) => x.id === id);
  if (!r) throw new Error(`Unknown requirement: ${id}`);
  return r;
};

// Product licences a superuser can assign when creating an employee.
// Each is a standalone Everllence product backed by an organisational
// requirement (service agreement or data subscription).
// Fleet / vessel access is handled separately via the fleet assignment UI.

export const productLicences: FunctionGrant[] = [
  {
    kind: 'function',
    id: 'lic-primeserv',
    label: 'Primeserv',
    provenance: req('req-primeserv-subscription'),
  },
  {
    kind: 'function',
    id: 'lic-ai-service',
    label: 'AI Service',
    provenance: req('req-data-subscription'),
  },
  {
    kind: 'function',
    id: 'lic-extended-data-monitoring',
    label: 'Extended Data Monitoring',
    provenance: req('req-data-subscription'),
  },
  {
    kind: 'function',
    id: 'lic-spare-part-shop',
    label: 'Spare Part Shop',
    provenance: req('req-export-control-dual-use'),
  },
  {
    kind: 'function',
    id: 'lic-technical-documents',
    label: 'Technical Documents',
    provenance: req('req-export-control-dual-use'),
  },
  {
    kind: 'function',
    id: 'lic-fleet-manager',
    label: 'Fleet Manager',
    provenance: req('req-everllence-diagnostic-cert'),
  },
];
