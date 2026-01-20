import React from 'react';
import { AppRoutes } from './routes';
import { ToastProvider } from '@/components/ui/toast';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </React.StrictMode>
  );
};

export default App;
