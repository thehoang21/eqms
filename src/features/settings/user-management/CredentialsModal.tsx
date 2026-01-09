import React from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, Info, User, Copy, Check, RefreshCw, KeyRound, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/components/ui/utils";
import { useToast } from "@/components/ui/toast";
import { IconHash } from "@tabler/icons-react";

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  username: string;
  password: string;
  onRegeneratePassword: () => void;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  username,
  password,
  onRegeneratePassword,
}) => {
  const { showToast } = useToast();
  
  if (!isOpen) return null;

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
                <h2 className="text-lg font-bold text-slate-900">User Created Successfully</h2>
                <p className="text-sm text-slate-600">Account credentials generated</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-6 space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Important: Save these credentials</p>
                  <p>The password cannot be retrieved later. Please share these credentials with the user securely.</p>
                </div>
              </div>
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                Employee ID
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={employeeId}
                  readOnly
                  className="flex-1 h-11 px-4 border border-slate-200 rounded-lg text-sm bg-slate-50 font-mono font-medium text-slate-900"
                />
                <CopyButton text={employeeId} label="Employee ID" showToast={showToast} />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                Username
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={username}
                  readOnly
                  className="flex-1 h-11 px-4 border border-slate-200 rounded-lg text-sm bg-slate-50 font-mono font-medium text-slate-900"
                />
                <CopyButton text={username} label="Username" showToast={showToast} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="flex-1 h-11 px-4 border border-slate-200 rounded-lg text-sm bg-slate-50 font-mono font-medium text-slate-900"
                />
                <button
                  onClick={onRegeneratePassword}
                  className="flex items-center justify-center h-11 w-11 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200"
                  title="Regenerate Password"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <CopyButton text={password} label="Password" showToast={showToast} />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">Click refresh icon to generate a new password</p>
            </div>

            {/* Copy All Button */}
            <button
              onClick={async () => {
                const credentials = `Employee ID: ${employeeId}\nUsername: ${username}\nPassword: ${password}`;
                try {
                  // Try modern clipboard API first
                  if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(credentials);
                  } else {
                    // Fallback for older browsers or non-secure contexts
                    const textArea = document.createElement('textarea');
                    textArea.value = credentials;
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
                    message: "All credentials copied to clipboard",
                  });
                } catch (err) {
                  console.error('Failed to copy credentials:', err);
                  showToast({
                    type: "error",
                    title: "Copy Failed",
                    message: "Failed to copy credentials to clipboard",
                  });
                }
              }}
              className="w-full flex items-center justify-center gap-2 h-10 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              <Copy className="h-4 w-4" />
              Copy All Credentials
            </button>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

// Copy Button Component
const CopyButton: React.FC<{ text: string; label: string; showToast: ReturnType<typeof useToast>['showToast'] }> = ({ text, label, showToast }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
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
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast({
        type: "success",
        title: "Copied!",
        message: `${label} copied to clipboard`,
      });
    } catch (err) {
      console.error('Failed to copy text:', err);
      showToast({
        type: "error",
        title: "Copy Failed",
        message: `Failed to copy ${label.toLowerCase()}`,
      });
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center justify-center h-11 w-11 rounded-lg border transition-all duration-200",
        copied
          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
};
