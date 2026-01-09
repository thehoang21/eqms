import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '../button/Button';
import { cn } from '../utils';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  showCancel?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeToClass: Record<NonNullable<FormModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  '2xl': 'max-w-3xl',
};

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmText = 'Save',
  cancelText = 'Cancel',
  isLoading = false,
  showCancel = true,
  size = 'xl',
  className,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={cn(
        'bg-white rounded-xl shadow-xl w-full border border-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden',
        sizeToClass[size],
        className
      )}>
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-lg font-bold text-slate-900 leading-6 truncate">{title}</h3>
              )}
              {description && (
                <div className="mt-1.5 text-sm text-slate-500 leading-relaxed">{description}</div>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-slate-400 hover:text-slate-600 transition-colors -mt-1 -mr-2 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 bg-white">
          {children}
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
          {showCancel && (
            <Button size="sm" variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
          )}
          <Button size="sm" onClick={onConfirm || onClose} disabled={isLoading}>
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
