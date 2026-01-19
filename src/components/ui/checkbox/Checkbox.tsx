import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../utils';

/**
 * Checkbox component with custom styling
 * 
 * @example
 * ```tsx
 * <Checkbox 
 *   checked={isChecked} 
 *   onChange={setIsChecked}
 *   label="Accept terms" 
 * />
 * ```
 */
export interface CheckboxProps {
  /** Input element ID */
  id?: string;
  /** Checked state */
  checked?: boolean;
  /** Callback when checked state changes */
  onChange?: (checked: boolean) => void;
  /** Label text */
  label?: string;
  /** Disable the checkbox */
  disabled?: boolean;
  /** Additional CSS classes */
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
