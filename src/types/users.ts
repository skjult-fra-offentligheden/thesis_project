import type { Grant } from './grants';

export type User = {
  id: string;
  name: string;
  email: string;
  roleId: 'superuser' | 'employee';
  grants: Grant[];
  department?: string;
  employeeRole?: string;
  expiryDate?: string; // ISO date string, e.g. "2026-12-31"
};
