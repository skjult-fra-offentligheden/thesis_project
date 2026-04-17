import type { Role } from '../types/roles';

export const roles: Role[] = [
  {
    id: 'superuser',
    label: 'Superuser',
    description:
      'Manages users and grants for the customer organisation. Cannot perform vessel operations directly.',
    permissions: ['user.create', 'user.view', 'grant.assign', 'grant.revoke'],
  },
  {
    id: 'employee',
    label: 'Employee',
    description:
      'Performs operational work on assigned fleets and vessels. Access scope is determined by grants.',
    permissions: ['user.view', 'vessel.diagnose', 'fleet.view'],
  },
];
