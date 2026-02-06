import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';

// Layout
import { MainLayout } from '@/components/layout/MainLayout';

// Auth Guard
import { ProtectedRoute } from '@/middleware/ProtectedRoute';

// Auth Context
import { useAuth } from '@/contexts/AuthContext';

// Features - Auth (eager load for login page)
import { LoginView } from '@/features/auth';
import { UnderConstruction } from './UnderConstruction';

// ==================== LAZY LOADED FEATURES ====================
// Dashboard & Tasks
const DashboardView = lazy(() => import('@/features/dashboard').then(m => ({ default: m.DashboardView })));
const MyTasksView = lazy(() => import('@/features/my-tasks').then(m => ({ default: m.MyTasksView })));

// Notifications
const NotificationsView = lazy(() => import('@/features/notifications').then(m => ({ default: m.NotificationsView })));

// Documents
const DetailDocumentView = lazy(() => import('@/features/documents').then(m => ({ default: m.DetailDocumentView })));
const ArchivedDocumentsView = lazy(() => import('@/features/documents/archived-documents').then(m => ({ default: m.ArchivedDocumentsView })));
const DocumentsView = lazy(() => import('@/features/documents/document-list').then(m => ({ default: m.DocumentsView })));
const NewDocumentView = lazy(() => import('@/features/documents/document-list/new-document').then(m => ({ default: m.NewDocumentView })));
const DocumentReviewView = lazy(() => import('@/features/documents/document-list/review-document').then(m => ({ default: m.DocumentReviewView })));
const DocumentApprovalView = lazy(() => import('@/features/documents/document-list/approval-document').then(m => ({ default: m.DocumentApprovalView })));

// Document Revisions
const RevisionListView = lazy(() => import('@/features/documents/document-revisions').then(m => ({ default: m.RevisionListView })));
const NewRevisionView = lazy(() => import('@/features/documents/document-revisions').then(m => ({ default: m.NewRevisionView })));
const RevisionsOwnedByMeView = lazy(() => import('@/features/documents/document-revisions').then(m => ({ default: m.RevisionsOwnedByMeView })));
const RevisionWorkspaceView = lazy(() => import('@/features/documents/document-revisions').then(m => ({ default: m.RevisionWorkspaceView })));
const PendingDocumentsView = lazy(() => import('@/features/documents/document-revisions').then(m => ({ default: m.PendingDocumentsView })));
const RevisionReviewView = lazy(() => import('@/features/documents/document-revisions').then(m => ({ default: m.RevisionReviewView })));
const RevisionApprovalView = lazy(() => import('@/features/documents/document-revisions').then(m => ({ default: m.RevisionApprovalView })));
const StandaloneRevisionView = lazy(() => import('@/features/documents/document-revisions/components/StandaloneRevisionView').then(m => ({ default: m.StandaloneRevisionView })));

// Controlled Copies
const ControlledCopiesView = lazy(() => import('@/features/documents/controlled-copies').then(m => ({ default: m.ControlledCopiesView })));
const ControlledCopyDetailView = lazy(() => import('@/features/documents/controlled-copies').then(m => ({ default: m.ControlledCopyDetailView })));
const DestroyControlledCopyView = lazy(() => import('@/features/documents/controlled-copies').then(m => ({ default: m.DestroyControlledCopyView })));
const RequestControlledCopyView = lazy(() => import('@/features/documents/views/RequestControlledCopyView').then(m => ({ default: m.RequestControlledCopyView })));

// Settings
const ProfileView = lazy(() => import('@/features/settings').then(m => ({ default: m.ProfileView })));
const UserManagementView = lazy(() => import('@/features/settings').then(m => ({ default: m.UserManagementView })));
const AddUserView = lazy(() => import('@/features/settings').then(m => ({ default: m.AddUserView })));
const EditUserView = lazy(() => import('@/features/settings').then(m => ({ default: m.EditUserView })));
const DictionariesView = lazy(() => import('@/features/settings').then(m => ({ default: m.DictionariesView })));
const RolePermissionView = lazy(() => import('@/features/settings/role-permission').then(m => ({ default: m.RolePermissionView })));

// Quality Management
const TrainingView = lazy(() => import('@/features/training').then(m => ({ default: m.TrainingView })));
const CreateTrainingView = lazy(() => import('@/features/training').then(m => ({ default: m.CreateTrainingView })));
const DeviationsView = lazy(() => import('@/features/deviations').then(m => ({ default: m.DeviationsView })));
const CAPAView = lazy(() => import('@/features/capa').then(m => ({ default: m.CAPAView })));
const ReportView = lazy(() => import('@/features/report').then(m => ({ default: m.ReportView })));

// System
const AuditTrailView = lazy(() => import('@/features/audit-trail').then(m => ({ default: m.AuditTrailView })));

// ==================== ROUTE WRAPPERS ====================
// Reusable wrapper for extracting ID from URL params

interface RouteWrapperProps {
  render: (id: string, navigate: ReturnType<typeof useNavigate>) => React.ReactElement;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ render }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  if (!id) {
    navigate('/dashboard');
    return null;
  }
  
  return render(id, navigate);
};

// Specific route wrappers
const DetailDocumentViewWrapper = () => (
  <RouteWrapper 
    render={(id, navigate) => (
      <Suspense fallback={<LoadingFallback />}>
        <DetailDocumentView documentId={id} onBack={() => navigate(-1)} />
      </Suspense>
    )} 
  />
);

const DocumentReviewViewWrapper = () => {
  const { user } = useAuth();
  return (
    <RouteWrapper 
      render={(id, navigate) => (
        <Suspense fallback={<LoadingFallback />}>
          <DocumentReviewView documentId={id} onBack={() => navigate(-1)} currentUserId={user?.id || ''} />
        </Suspense>
      )} 
    />
  );
};

const DocumentApprovalViewWrapper = () => {
  const { user } = useAuth();
  return (
    <RouteWrapper 
      render={(id, navigate) => (
        <Suspense fallback={<LoadingFallback />}>
          <DocumentApprovalView documentId={id} onBack={() => navigate(-1)} currentUserId={user?.id || ''} />
        </Suspense>
      )} 
    />
  );
};

const RevisionReviewViewWrapper = () => {
  const { user } = useAuth();
  return (
    <RouteWrapper 
      render={(id, navigate) => (
        <Suspense fallback={<LoadingFallback />}>
          <RevisionReviewView documentId={id} onBack={() => navigate(-1)} currentUserId={user?.id || ''} />
        </Suspense>
      )} 
    />
  );
};

const RevisionApprovalViewWrapper = () => {
  const { user } = useAuth();
  return (
    <RouteWrapper 
      render={(id, navigate) => (
        <Suspense fallback={<LoadingFallback />}>
          <RevisionApprovalView revisionId={id} onBack={() => navigate(-1)} currentUserId={user?.id || ''} />
        </Suspense>
      )} 
    />
  );
};

const ControlledCopyDetailViewWrapper = () => (
  <RouteWrapper 
    render={(id, navigate) => (
      <Suspense fallback={<LoadingFallback />}>
        <ControlledCopyDetailView controlledCopyId={id} onBack={() => navigate(-1)} />
      </Suspense>
    )} 
  />
);

// ==================== LOADING FALLBACK ====================
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"></div>
      <p className="text-sm text-slate-500">Loading...</p>
    </div>
  </div>
);

// ==================== MAIN ROUTES ====================

export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (username: string, password: string, _rememberMe: boolean) => {
    try {
      await login({ username, password });
    } catch {
      // Login simulation handles its own errors in LoginView
    }
    navigate('/dashboard');
  };

  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginView onLogin={handleLogin} />} />
      
      {/* ==================== PROTECTED ROUTES (WITH LAYOUT) ==================== */}
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        
        {/* ===== DASHBOARD & TASKS ===== */}
        <Route path="dashboard" element={<Suspense fallback={<LoadingFallback />}><DashboardView /></Suspense>} />
        <Route path="my-tasks" element={<Suspense fallback={<LoadingFallback />}><MyTasksView /></Suspense>} />
        <Route path="notifications" element={<Suspense fallback={<LoadingFallback />}><NotificationsView /></Suspense>} />
        
        {/* ===== DOCUMENTS ===== */}
        <Route path="documents">
          {/* Document Lists */}
          <Route path="owned" element={<Suspense fallback={<LoadingFallback />}><DocumentsView viewType="owned-by-me" onViewDocument={(id) => navigate(`/documents/${id}`)} /></Suspense>} />
          <Route path="all" element={<Suspense fallback={<LoadingFallback />}><DocumentsView viewType="all" onViewDocument={(id) => navigate(`/documents/${id}`)} /></Suspense>} />
          <Route path="all/new" element={<Suspense fallback={<LoadingFallback />}><NewDocumentView /></Suspense>} />
          <Route path="archived" element={<Suspense fallback={<LoadingFallback />}><ArchivedDocumentsView /></Suspense>} />
          
          {/* Document Detail & Actions */}
          <Route path=":id" element={<DetailDocumentViewWrapper />} />
          <Route path=":id/review" element={<DocumentReviewViewWrapper />} />
          <Route path=":id/approval" element={<DocumentApprovalViewWrapper />} />
          
          {/* Document Revisions */}
          <Route path="revisions">
            <Route path="all" element={<Suspense fallback={<LoadingFallback />}><RevisionListView /></Suspense>} />
            <Route path="owned" element={<Suspense fallback={<LoadingFallback />}><RevisionsOwnedByMeView /></Suspense>} />
            <Route path="pending-review" element={<Suspense fallback={<LoadingFallback />}><PendingDocumentsView viewType="review" onViewDocument={(id) => navigate(`/documents/${id}`)} /></Suspense>} />
            <Route path="pending-approval" element={<Suspense fallback={<LoadingFallback />}><PendingDocumentsView viewType="approval" onViewDocument={(id) => navigate(`/documents/${id}`)} /></Suspense>} />
            <Route path="new" element={<Suspense fallback={<LoadingFallback />}><NewRevisionView /></Suspense>} />
            <Route path="new-standalone" element={<Suspense fallback={<LoadingFallback />}><StandaloneRevisionView /></Suspense>} />
            <Route path="workspace" element={<Suspense fallback={<LoadingFallback />}><RevisionWorkspaceView /></Suspense>} />
            <Route path="review/:id" element={<RevisionReviewViewWrapper />} />
            <Route path="approval/:id" element={<RevisionApprovalViewWrapper />} />
            <Route path="*" element={<Suspense fallback={<LoadingFallback />}><DocumentsView viewType="all" onViewDocument={(id) => navigate(`/documents/${id}`)} /></Suspense>} />
          </Route>
          
          {/* Controlled Copies */}
          <Route path="controlled-copies">
            <Route index element={<Suspense fallback={<LoadingFallback />}><ControlledCopiesView /></Suspense>} />
            <Route path=":id" element={<ControlledCopyDetailViewWrapper />} />
            <Route path=":id/destroy" element={<Suspense fallback={<LoadingFallback />}><DestroyControlledCopyView /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<LoadingFallback />}><DocumentsView viewType="all" onViewDocument={(id) => navigate(`/documents/${id}`)} /></Suspense>} />
          </Route>
          <Route path="controlled-copy/request" element={<Suspense fallback={<LoadingFallback />}><RequestControlledCopyView /></Suspense>} />
        </Route>
        
        {/* ===== SETTINGS ===== */}
        <Route path="settings">
          <Route path="user-management">
            <Route index element={<Suspense fallback={<LoadingFallback />}><UserManagementView /></Suspense>} />
            <Route path="add" element={<Suspense fallback={<LoadingFallback />}><AddUserView /></Suspense>} />
            <Route path="edit/:userId" element={<Suspense fallback={<LoadingFallback />}><EditUserView /></Suspense>} />
          </Route>
          <Route path="roles" element={<Suspense fallback={<LoadingFallback />}><RolePermissionView /></Suspense>} />
          <Route path="dictionaries" element={<Suspense fallback={<LoadingFallback />}><DictionariesView /></Suspense>} />
          <Route path="config" element={<UnderConstruction />} />
          <Route path="info-system" element={<UnderConstruction />} />
        </Route>
        
        {/* ===== TRAINING MANAGEMENT ===== */}
        <Route path="training-management">
          <Route path="courses" element={<Suspense fallback={<LoadingFallback />}><TrainingView /></Suspense>} />
          <Route path="create" element={<Suspense fallback={<LoadingFallback />}><CreateTrainingView /></Suspense>} />
          <Route index element={<Navigate to="/training-management/courses" replace />} />
        </Route>
        
        {/* ===== DEVIATION & NCs ===== */}
        <Route path="deviations-ncs" element={<Suspense fallback={<LoadingFallback />}><DeviationsView /></Suspense>} />
        
        {/* ===== CAPA MANAGEMENT ===== */}
        <Route path="capa-management" element={<Suspense fallback={<LoadingFallback />}><CAPAView /></Suspense>} />
        
        {/* ===== CHANGE MANAGEMENT ===== */}
        <Route path="change-management" element={<UnderConstruction />} />
        
        {/* ===== COMPLAINTS MANAGEMENT ===== */}
        <Route path="complaints-management" element={<UnderConstruction />} />
        
        {/* ===== EQUIPMENT MANAGEMENT ===== */}
        <Route path="equipment-management" element={<UnderConstruction />} />
        
        {/* ===== SUPPLIER MANAGEMENT ===== */}
        <Route path="supplier-management" element={<UnderConstruction />} />
        
        {/* ===== RISK MANAGEMENT ===== */}
        <Route path="risk-management" element={<UnderConstruction />} />
        
        {/* ===== REPORT ===== */}
        <Route path="report" element={<Suspense fallback={<LoadingFallback />}><ReportView /></Suspense>} />
        
        {/* ===== AUDIT TRAIL SYSTEM ===== */}
        <Route path="audit-trail" element={<Suspense fallback={<LoadingFallback />}><AuditTrailView /></Suspense>} />
        
        {/* ===== PROFILE ===== */}
        <Route path="profile" element={<Suspense fallback={<LoadingFallback />}><ProfileView onBack={() => navigate(-1)} /></Suspense>} />
        
        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<UnderConstruction />} />
      </Route>
    </Routes>
  );
};
