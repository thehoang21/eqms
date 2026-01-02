import React from 'react';
import { cn } from '../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'default',
  size = 'default',
  fullWidth = false,
  ...props
}) => {
  const variants = {
    default: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-95',
    ghost: 'hover:bg-slate-100 hover:text-slate-900 active:scale-95',
    outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm active:scale-95',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-95',
  };

  const sizes = {
    // Responsive sizes
    xs: 'h-6 md:h-7 px-2 md:px-3 text-xs',
    sm: 'h-8 md:h-9 px-3 md:px-4 text-xs md:text-sm',
    default: 'h-10 md:h-11 px-4 md:px-6 text-sm md:text-base',
    lg: 'h-12 md:h-14 px-6 md:px-8 text-base md:text-lg',
    xl: 'h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl',
    'icon-sm': 'h-8 w-8 md:h-9 md:w-9 p-0',
    icon: 'h-10 w-10 md:h-11 md:w-11 p-0',
    'icon-lg': 'h-12 w-12 md:h-14 md:w-14 p-0',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'ring-offset-background transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  );
};
