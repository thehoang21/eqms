import React from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, AlertTriangle, XCircle, Info, HelpCircle } from 'lucide-react';
import { Button } from '../button/Button';
import { cn } from '../utils';

export type AlertModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: React.ReactNode;
  type?: AlertModalType;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  showCancel?: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'info',
  confirmText,
  cancelText = 'Cancel',
  isLoading = false,
  showCancel,
}) => {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      defaultConfirmText: 'OK',
    },
    error: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      defaultConfirmText: 'Close',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      defaultConfirmText: 'Confirm',
    },
    info: {
      icon: Info,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      defaultConfirmText: 'OK',
    },
    confirm: {
      icon: HelpCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      defaultConfirmText: 'Confirm',
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  // Determine if we should show the cancel button
  // If showCancel is explicitly provided, use it.
  // Otherwise, show it for 'confirm' and 'warning' types.
  const shouldShowCancel = showCancel !== undefined
    ? showCancel
    : (type === 'confirm' || type === 'warning');

  const finalConfirmText = confirmText || currentConfig.defaultConfirmText;

  // Custom button styles based on type
  const getConfirmButtonClass = () => {
    if (type === 'error') return 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500';
    if (type === 'warning') return 'bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500';
    return '';
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden">

        <div className="p-6">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100 z-10"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col items-center gap-4 text-center">
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center shrink-0 border",
                currentConfig.bgColor,
                currentConfig.borderColor
              )}>
                <Icon className={cn("h-6 w-6", currentConfig.color)} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-6 mb-2 text-center">
                  {title}
                </h3>
                {description && (
                  <div className="text-sm text-slate-500 leading-relaxed text-left">
                    {description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-center gap-3">
          {shouldShowCancel && (
            <Button
              size='sm'
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 max-w-[200px] whitespace-nowrap"
            >
              {cancelText}
            </Button>
          )}

          <Button
            size='sm'
            onClick={onConfirm || onClose}
            className={cn("flex-1 max-w-[200px] whitespace-nowrap", getConfirmButtonClass())}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : finalConfirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
