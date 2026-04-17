import type { Requirement } from '../types/requirements';

export const requirementsCatalogue: Requirement[] = [
  {
    kind: 'legal',
    id: 'req-eu-sanctions-833',
    label: 'EU sanctions screening',
    citation: {
      instrument: 'Council Regulation (EU) 833/2014',
      article: 'Art. 3',
      jurisdiction: 'EU',
    },
    rationale:
      'Operators must screen counterparties and vessels against EU restrictive measures before granting data access related to controlled goods.',
  },
  {
    kind: 'legal',
    id: 'req-gdpr-access-control',
    label: 'GDPR access control',
    citation: {
      instrument: 'Regulation (EU) 2016/679 (GDPR)',
      article: 'Art. 5(1)(f)',
      jurisdiction: 'EU',
    },
    rationale:
      'Personal data must be processed in a manner that ensures appropriate security, including protection against unauthorised access.',
  },
  {
    kind: 'legal',
    id: 'req-export-control-dual-use',
    label: 'Export control — dual-use clearance',
    citation: {
      instrument: 'Regulation (EU) 2021/821',
      article: 'Art. 12',
      jurisdiction: 'EU',
    },
    rationale:
      'Technical data on dual-use items may only be made available to cleared personnel.',
  },
  {
    kind: 'organisational',
    id: 'req-everllence-segregation',
    label: 'Everllence duty segregation policy',
    source: {
      setBy: 'Everllence Compliance',
      policyRef: 'INT-SEC-014',
    },
    rationale:
      'Internal policy: grant assignment and grant approval must be performed by different superusers above a defined threshold.',
  },
  {
    kind: 'organisational',
    id: 'req-customer-fleet-scoping',
    label: 'Customer fleet scoping policy',
    source: {
      setBy: 'Customer Admin',
    },
    rationale:
      'Customer policy: employees are granted access only to fleets relevant to their assigned operational region.',
  },
  {
    kind: 'organisational',
    id: 'req-everllence-diagnostic-cert',
    label: 'Internal diagnostic certification',
    source: {
      setBy: 'Everllence Operations',
      policyRef: 'OPS-CERT-007',
    },
    rationale:
      'Vessel diagnostic functions require completion of internal certification before access is granted.',
  },
  {
    kind: 'organisational',
    id: 'req-service-agreement',
    label: 'Everllence service agreement',
    source: {
      setBy: 'Everllence Sales',
      policyRef: 'SVC-AGR-001',
    },
    rationale:
      'An active service agreement is required before platform products such as Primeserv and the Spare Part Shop can be activated for a user.',
  },
  {
    kind: 'organisational',
    id: 'req-data-subscription',
    label: 'Data monitoring subscription',
    source: {
      setBy: 'Everllence Data Services',
      policyRef: 'DATA-SUB-003',
    },
    rationale:
      'An active data subscription is required to activate extended monitoring and AI analytics features.',
  },
    {
    kind: 'organisational',
    id: 'req-primeserv-subscription',
    label: 'Primeserv subscription',
    source: {
      setBy: 'Everllence Data Services',
      policyRef: 'DATA-SUB-001',
    },
    rationale:
      'Primeserv license is required to access basic vessel health monitoring data and alerts.',
  },
];
