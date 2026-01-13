/**
 * Application Route Constants
 * Centralized route definitions for type-safe navigation
 */

export const ROUTES = {
  // Auth
  LOGIN: '/login',

  // Dashboard
  DASHBOARD: '/dashboard',

  // My Tasks
  MY_TASKS: '/my-tasks',

  // Documents
  DOCUMENTS: {
    OWNED: '/documents/owned',
    ALL: '/documents/all',
    NEW: '/documents/all/new',
    BATCH_NEW: '/documents/batch/new',
    DETAIL: (id: string) => `/documents/${id}`,
    REVIEW: (id: string) => `/documents/${id}/review`,
    APPROVAL: (id: string) => `/documents/${id}/approval`,
    ARCHIVED: '/documents/archived',

    // Templates
    TEMPLATES: '/documents/templates',
    TEMPLATES_NEW: '/documents/templates/new',
    TEMPLATE_DETAIL: (id: string) => `/documents/templates/${id}`,

    // Revisions
    REVISIONS: {
      ALL: '/documents/revisions/all',
      OWNED: '/documents/revisions/owned',
      PENDING_REVIEW: '/documents/revisions/pending-review',
      PENDING_APPROVAL: '/documents/revisions/pending-approval',
      NEW: '/documents/revisions/new',
      NEW_MULTI: (sourceDocId: string) => `/documents/revisions/new-multi?sourceDocId=${sourceDocId}`,
      NEW_STANDALONE: (sourceDocId: string) => `/documents/revisions/new-standalone?sourceDocId=${sourceDocId}`,
      STANDALONE: '/documents/revisions/standalone',
      WORKSPACE: '/documents/revisions/workspace',
      REVIEW: (id: string) => `/documents/revisions/review/${id}`,
      APPROVAL: (id: string) => `/documents/revisions/approval/${id}`,
    },

    // Controlled Copies
    CONTROLLED_COPIES: {
      ALL: '/documents/controlled-copies/all',
      READY: '/documents/controlled-copies/ready',
      DISTRIBUTED: '/documents/controlled-copies/distributed',
    },
  },

  // Training
  TRAINING: '/training-management',

  // Deviation & NCs
  DEVIATIONS: '/deviations-ncs',

  // CAPA
  CAPA: '/capa-management',

  // Change Control
  CHANGE_CONTROL: '/change-management',

  // Complaints
  COMPLAINTS: '/complaints-management',

  // Equipment
  EQUIPMENT: '/equipment-management',

  // Supplier
  SUPPLIER: '/supplier-management',

  // Risk Management
  RISK: '/risk-management',

  // Audit Trail
  AUDIT_TRAIL: '/audit-trail',

  // Settings
  SETTINGS: {
    USERS: '/settings/users',
    ROLES: '/settings/roles',
    DICTIONARIES: '/settings/dictionaries',
    CONFIG: '/settings/config',
    SYSTEM_INFO: '/settings/info-system',
  },

  // Profile
  PROFILE: '/profile',

  // UI Demo
  UI_DEMO: '/ui-demo',
} as const;

/**
 * Helper to get route with parameters
 * @example getRoute(ROUTES.DOCUMENTS.DETAIL, '123') // '/documents/123'
 */
export const getRoute = (
  routeFn: string | ((param: string) => string),
  param?: string
): string => {
  if (typeof routeFn === 'function' && param) {
    return routeFn(param);
  }
  return routeFn as string;
};

export const ROUTE_NEW_REVISION_MULTI = '/documents/revisions/new-multi';
export const ROUTE_NEW_REVISION_STANDALONE = '/documents/revisions/new-standalone';
