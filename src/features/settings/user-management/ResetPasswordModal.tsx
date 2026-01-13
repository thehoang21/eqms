import React from "react";
import { createPortal } from "react-dom";
import { X, Info, RefreshCw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { useToast } from "@/components/ui/toast";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  password: string;
  onRegeneratePassword: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  userName,
  password,
  onRegeneratePassword,
}) => {
  const { showToast } = useToast();
  
  if (!isOpen) return null;

  const handleCopyPassword = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(password);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = password;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        textArea.remove();
        if (!successful) {
          throw new Error('Fallback copy failed');
        }
      }
      
      showToast({
        type: "success",
        title: "Copied!",
        message: "Password copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy password:', err);
      showToast({
        type: "error",
        title: "Copy Failed",
        message: "Failed to copy password",
      });
    }
  };

  const handleConfirmReset = () => {
    console.log('Reset password confirmed for user');
    // TODO: Call API to reset password
    showToast({
      type: "success",
      title: "Password Reset!",
      message: `Password has been reset for ${userName}`,
    });
    onClose();
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Reset Password</h2>
                <p className="text-sm text-slate-600">New password generated for {userName}</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon-sm"
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </Button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6 space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Important: Share this password securely</p>
                  <p>The user must change this temporary password on their next login.</p>
                </div>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                New Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="flex-1 h-11 px-4 border border-slate-200 rounded-lg text-sm bg-slate-50 font-mono font-medium text-slate-900"
                />
                <Button
                  onClick={onRegeneratePassword}
                  variant="outline"
                  size="icon"
                  className="flex items-center justify-center h-11 w-11 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                  title="Regenerate Password"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleCopyPassword}
                  variant="outline"
                  size="icon"
                  className="flex items-center justify-center h-11 w-11 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all duration-200"
                  title="Copy Password"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">Click refresh icon to generate a new password</p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleConfirmReset}>
              Confirm Reset
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
