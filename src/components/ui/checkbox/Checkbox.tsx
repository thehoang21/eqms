import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../utils';

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <label
          htmlFor={id}
          className={cn(
            'flex items-center justify-center w-5 h-5 rounded border-2 cursor-pointer transition-all',
            'peer-focus:ring-2 peer-focus:ring-emerald-500 peer-focus:ring-offset-2',
            checked
              ? 'bg-emerald-600 border-emerald-600'
              : 'bg-white border-slate-300 hover:border-emerald-400',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {checked && (
            <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
          )}
        </label>
      </div>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'ml-2 text-sm font-medium text-slate-700 cursor-pointer select-none',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};
