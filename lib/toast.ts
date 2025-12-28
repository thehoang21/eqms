/**
 * Toast Notifications Configuration
 * Using react-hot-toast or similar library
 */

// Placeholder for toast library configuration
// Install: npm install react-hot-toast

export const toastConfig = {
  duration: 4000,
  position: 'bottom-right' as const,
  success: {
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
};

// You can install and configure react-hot-toast:
// import toast, { Toaster } from 'react-hot-toast';
// export { toast, Toaster };
