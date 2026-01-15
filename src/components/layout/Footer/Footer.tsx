import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-2.5 md:py-3 lg:py-3.5 px-4 md:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 text-xs sm:text-xs md:text-sm text-slate-500">
      <div className="text-center md:text-left">
        &copy; {new Date().getFullYear()} Ngoc Thien Pharma. All rights reserved. EU-GMP Compliant.
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <span>Version 1.0.1 (Dev)</span>
      </div>
    </footer>
  );
};