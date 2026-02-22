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

  // Notifications
  NOTIFICATIONS: '/notifications',

  // Documents
  DOCUMENTS: {
    OWNED: '/documents/owned',
    ALL: '/documents/all',
    NEW: '/documents/all/new',
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
      ALL: '/documents/controlled-copies?view=all',
      READY: '/documents/controlled-copies?view=ready',
      DISTRIBUTED: '/documents/controlled-copies?view=distributed',
      DESTROY: (id: string) => `/documents/controlled-copies/${id}/destroy`,
    },
  },

  // Training
  TRAINING: {
    BASE: '/training-management',
    // Course Inventory
    COURSES_LIST: '/training-management/courses-list',
    TRAINING_MATERIALS: '/training-management/training-materials',
    COURSES_CREATE: '/training-management/courses/create',
    // Compliance Tracking
    TRAINING_MATRIX: '/training-management/training-matrix',
    COURSE_STATUS: '/training-management/course-status',
    // Records & Archive
    EMPLOYEE_TRAINING_FILES: '/training-management/employee-training-files',
    EXPORT_RECORDS: '/training-management/export-records',
  },

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

  // Report
  REPORT: '/report',

  // Audit Trail
  AUDIT_TRAIL: '/audit-trail',

  // Settings
  SETTINGS: {
    USER_MANAGEMENT: '/settings/user-management',
    USER_MANAGEMENT_ADD: '/settings/user-management/add',
    USER_MANAGEMENT_EDIT: (userId: string) => `/settings/user-management/edit/${userId}`,
    ROLE_PERMISSION: '/settings/role-permission',
    ROLE_PERMISSION_NEW: '/settings/role-permission/new',
    ROLE_PERMISSION_DETAIL: (roleId: string) => `/settings/role-permission/${roleId}`,
    ROLE_PERMISSION_EDIT: (roleId: string) => `/settings/role-permission/${roleId}/edit`,
    DICTIONARIES: '/settings/dictionaries',
    CONFIG: '/settings/config',
    SYSTEM_INFO: '/settings/info-system',
  },

  // Profile
  PROFILE: '/profile',
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
