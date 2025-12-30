import React from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { DashboardView } from '../features/dashboard';
import { DocumentListView, DocumentsOwnedByMeView, DetailDocumentView } from '../features/documents';
import { RevisionListView, NewRevisionView, RevisionsOwnedByMeView } from '../features/documents/document-revisions';
import { NewDocumentView } from '../features/documents/new-document';
import { ExternalDocumentsView } from '../features/documents/external-documents';
import { ArchivedDocumentsView } from '../features/documents/archived';
import { MyTasksView } from '../features/my-tasks';
import { ProfileView } from '../features/settings';
import { UIShowcase } from '../features/ui-showcase/UIShowcase';
import { UnderConstruction } from './UnderConstruction';
import { MainLayout } from '../MainLayout';

// Wrapper for Detail View to extract ID from params
const DetailDocumentViewWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <DetailDocumentView documentId={id!} onBack={() => navigate(-1)} />;
};

export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="my-tasks" element={<MyTasksView />} />
        {/* Document Routes */}
        <Route path="documents/owned" element={<DocumentsOwnedByMeView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/all" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/all/new" element={<NewDocumentView />} />
        <Route path="documents/revisions/all" element={<RevisionListView />} />
        <Route path="documents/revisions/owned" element={<RevisionsOwnedByMeView />} />
        <Route path="documents/revisions/new" element={<NewRevisionView />} />
        <Route path="documents/revisions/*" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/controlled-copies/*" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
        <Route path="documents/archived" element={<ArchivedDocumentsView />} />
        <Route path="documents/external" element={<ExternalDocumentsView />} />
        {/* Detail View */}
        <Route path="documents/:id" element={<DetailDocumentViewWrapper />} />
        {/* Profile */}
        <Route path="profile" element={<ProfileView onBack={() => navigate(-1)} />} />
        {/* UI Showcase */}
        <Route path="ui-demo" element={<UIShowcase />} />
        {/* Fallback for other routes */}
        <Route path="*" element={<UnderConstruction />} />
      </Route>
    </Routes>
  );
};
