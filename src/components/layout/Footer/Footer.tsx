import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer 
      className="sticky bottom-0 z-30 shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur-sm shadow-[0_-1px_3px_0_rgba(0,0,0,0.05)]"
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="max-w-[1920px] px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-3">
          {/* Left: Copyright */}
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} Ngoc Thien Pharma.{" "}
              <span className="sm:inline text-slate-600">All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};