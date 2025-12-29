import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_CONFIG, findNodeAndBreadcrumbs, findNodeByPath } from '../constants';
import { BreadcrumbItem } from '../types';

/**
 * Custom hook to manage navigation state and actions
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Find nav item by path
  const activeItem = findNodeByPath(NAV_CONFIG, location.pathname);
  // If not found, fallback to empty string (forces sidebar to re-render)
  const activeId = activeItem?.id || '';

  // Derive breadcrumbs from activeId
  const breadcrumbs: BreadcrumbItem[] = findNodeAndBreadcrumbs(NAV_CONFIG, activeId) || [
    { label: 'Dashboard', id: 'dashboard' },
  ];

  const handleNavigate = (id: string) => {
    const findItem = (items: any[], targetId: string): any => {
      for (const item of items) {
        if (item.id === targetId) return item;
        if (item.children) {
          const found = findItem(item.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const item = findItem(NAV_CONFIG, id);
    if (item?.path) {
      // Always navigate with absolute path
      const targetPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
      navigate(targetPath);
    }
  };

  return {
    activeId,
    breadcrumbs,
    handleNavigate,
  };
};
