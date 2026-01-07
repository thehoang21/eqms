import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-3 px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
      <div>
        &copy; {new Date().getFullYear()} Ngoc Thien Pharma. All rights reserved. EU-GMP Compliant.
      </div>
      <div className="mt-2 md:mt-0 flex items-center space-x-4">
        <span>Version 1.0.1 (Dev)</span>
      </div>
    </footer>
  );
};