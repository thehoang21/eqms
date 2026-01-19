import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../button/Button';

interface ESignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  actionTitle: string;
}

export const ESignatureModal: React.FC<ESignatureModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  actionTitle 
}) => {
  const [username, setUsername] = useState('Dr. A. Smith'); // Simulated logged-in user
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !reason) {
      setError('Username, Password and Reason for Change are mandatory for Audit Trail.');
      return;
    }
    // Simulate verification
    onConfirm(reason);
    // Reset
    setPassword('');
    setReason('');
    setError('');
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
               <Lock className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Electronic Signature</h3>
              <p className="text-xs text-slate-500">21 CFR Part 11 Compliance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex gap-3">
             <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
             <p className="text-sm text-yellow-800">
               You are about to <span className="font-bold">{actionTitle}</span>. 
               This action will be permanently recorded in the Audit Trail.
             </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Username <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Password <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
              placeholder="Enter your password"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Reason <span className="text-red-500">*</span></label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm min-h-[80px]"
              placeholder="e.g., Reviewed and approved for release..."
            />
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <div className="pt-2 flex gap-3">
             <Button type="button" size='sm' variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
             <Button type="submit" size='sm' className="w-full">Sign</Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};