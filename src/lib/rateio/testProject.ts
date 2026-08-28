import type { Project } from './types';

// These references are the existing Solar Lab test accounts. Keep this policy
// server-derived: the browser must never be able to nominate a real project as
// a test account.
const SOLAR_LAB_TEST_REFERENCES = new Set(['L-0029', 'V-0029', 'M-0029']);

export function isRateioTestProject(project: Pick<Project, 'reference'>) {
  return SOLAR_LAB_TEST_REFERENCES.has(project.reference.trim().toUpperCase());
}

