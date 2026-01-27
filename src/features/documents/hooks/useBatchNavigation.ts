/**
 * useBatchNavigation Hook
 * 
 * A custom hook for managing batch document navigation in workflow views.
 * Handles navigation between multiple documents in a batch processing flow.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface BatchDocument {
  id: string;
  documentId: string;
  title: string;
  status?: string;
  isCompleted?: boolean;
}

interface UseBatchNavigationProps {
  batchDocuments: BatchDocument[];
  currentDocumentId: string;
  onNavigateToDocument?: (documentId: string) => void;
  onFinishBatch?: () => void;
}

export interface UseBatchNavigationReturn {
  currentIndex: number;
  totalDocuments: number;
  isLastDocument: boolean;
  isNavigating: boolean;
  batchDocuments: BatchDocument[];
  handleNavigate: (documentId: string, index: number) => void;
  handleFinishBatch: () => void;
  autoNavigateToNext: (onComplete?: () => void) => void;
  markDocumentCompleted: (documentId: string) => void;
}

export const useBatchNavigation = ({
  batchDocuments,
  currentDocumentId,
  onNavigateToDocument,
  onFinishBatch,
}: UseBatchNavigationProps): UseBatchNavigationReturn => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  // Find current document index
  const currentIndex = batchDocuments.findIndex(doc => doc.id === currentDocumentId);
  const totalDocuments = batchDocuments.length;
  const isLastDocument = currentIndex === totalDocuments - 1;

  // Navigate to specific document
  const handleNavigate = useCallback((documentId: string, index: number) => {
    if (onNavigateToDocument) {
      onNavigateToDocument(documentId);
    }
  }, [onNavigateToDocument]);

  // Handle finish batch
  const handleFinishBatch = useCallback(() => {
    if (onFinishBatch) {
      onFinishBatch();
    } else {
      // Default: navigate to dashboard
      navigate('/dashboard');
    }
  }, [onFinishBatch, navigate]);

  // Auto-navigate to next document after action completion
  const autoNavigateToNext = useCallback((onComplete?: () => void) => {
    if (isNavigating) return;

    setIsNavigating(true);

    // Execute completion callback immediately
    if (onComplete) {
      onComplete();
    }

    // If last document, don't auto-navigate
    if (isLastDocument) {
      setIsNavigating(false);
      return;
    }

    // Auto-navigate after delay
    setTimeout(() => {
      const nextDoc = batchDocuments[currentIndex + 1];
      if (nextDoc && onNavigateToDocument) {
        onNavigateToDocument(nextDoc.id);
      }
      setIsNavigating(false);
    }, 1500);
  }, [isNavigating, isLastDocument, currentIndex, batchDocuments, onNavigateToDocument]);

  // Mark document as completed
  const markDocumentCompleted = useCallback((documentId: string) => {
    const docIndex = batchDocuments.findIndex(doc => doc.id === documentId);
    if (docIndex !== -1) {
      batchDocuments[docIndex].isCompleted = true;
    }
  }, [batchDocuments]);

  return {
    currentIndex,
    totalDocuments,
    isLastDocument,
    isNavigating,
    batchDocuments,
    handleNavigate,
    handleFinishBatch,
    autoNavigateToNext,
    markDocumentCompleted,
  };
};
