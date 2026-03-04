/**
 * Application Route Constants
 * Centralized route definitions for type-safe navigation
 */

export const ROUTES = {
  // Auth
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  CONTACT_ADMIN: '/contact-admin',

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
    KNOWLEDGE: '/documents/knowledge',
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
      DETAIL: (id: string) => `/documents/revisions/${id}`,
      REVIEW: (id: string) => `/documents/revisions/review/${id}`,
      APPROVAL: (id: string) => `/documents/revisions/approval/${id}`,
    },

    // Controlled Copies
    CONTROLLED_COPIES: {
      ALL: '/documents/controlled-copies/all',
      READY: '/documents/controlled-copies/ready',
      DISTRIBUTED: '/documents/controlled-copies/distributed',
      DETAIL: (id: string) => `/documents/controlled-copies/${id}`,
      DESTROY: (id: string) => `/documents/controlled-copies/${id}/destroy`,
      REQUEST: '/documents/controlled-copy/request',
    },
  },

  // Training
  TRAINING: {
    BASE: '/training-management',
    // Course Inventory
    COURSES_LIST: '/training-management/courses-list',
    COURSES_CREATE: '/training-management/courses/create',
    COURSE_DETAIL: (courseId: string) => `/training-management/courses/${courseId}`,
    COURSE_EDIT: (courseId: string) => `/training-management/courses/${courseId}/edit`,
    COURSE_PROGRESS: (courseId: string) => `/training-management/courses/${courseId}/progress`,
    COURSE_RESULT_ENTRY: (courseId: string) => `/training-management/courses/${courseId}/result-entry`,
    // Training Materials
    TRAINING_MATERIALS: '/training-management/training-materials',
    UPLOAD_MATERIAL: '/training-management/training-materials/upload',
    MATERIAL_DETAIL: (id: string) => `/training-management/training-materials/${id}`,
    MATERIAL_EDIT: (id: string) => `/training-management/training-materials/${id}/edit`,
    MATERIAL_NEW_REVISION: (id: string) => `/training-management/training-materials/${id}/new-revision`,
    MATERIAL_USAGE_REPORT: (id: string) => `/training-management/training-materials/${id}/usage-report`,
    MATERIAL_REVIEW: (id: string) => `/training-management/training-materials/${id}/review`,
    MATERIAL_APPROVAL: (id: string) => `/training-management/training-materials/${id}/approval`,
    // Approval
    PENDING_REVIEW: '/training-management/pending-review',
    PENDING_APPROVAL: '/training-management/pending-approval',
    APPROVAL_DETAIL: (id: string) => `/training-management/pending-review/${id}`,
    APPROVE_DETAIL: (id: string) => `/training-management/pending-approval/${id}`,
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

  // Product Management
  PRODUCT: '/product-management',

  // Regulatory Management
  REGULATORY: '/regulatory-management',

  // Report
  REPORT: '/report',

  // Audit Trail
  AUDIT_TRAIL: '/audit-trail',

  // Settings
  SETTINGS: {
    USERS: '/settings/users',
    USERS_ADD: '/settings/users/add',
    USERS_EDIT: (userId: string) => `/settings/users/edit/${userId}`,
    ROLES: '/settings/roles',
    ROLES_NEW: '/settings/roles/new',
    ROLES_DETAIL: (roleId: string) => `/settings/roles/${roleId}`,
    ROLES_EDIT: (roleId: string) => `/settings/roles/${roleId}/edit`,
    DICTIONARIES: '/settings/dictionaries',
    CONFIGURATION: '/settings/configuration',
    SYSTEM_INFO: '/settings/system-info',
  },

  // User Manual
  USER_MANUAL: '/user-manual',

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
