import React from 'react';
import { BeatLoading } from 'respinner';
import { cn } from '../utils';

/**
 * Loading Component using respinner BeatLoading
 * 
 * Usage:
 * - <Loading /> - Default inline loading
 * - <Loading size="sm" /> - Small loading
 * - <Loading size="lg" /> - Large loading
 * - <Loading fullPage /> - Full page overlay loading
 * - <Loading color="#111111" /> - Custom color
 */

interface LoadingProps {
  /** Size of the loading spinner */
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  /** Color of the spinner (hex or color name) */
  color?: string;
  /** Number of beat elements */
  count?: number;
  /** Display as full-page overlay */
  fullPage?: boolean;
  /** Additional text to display */
  text?: string;
  /** Additional className */
  className?: string;
}

const sizeMap = {
  xs: { count: 3, textSize: 'text-xs' },
  sm: { count: 3, textSize: 'text-sm' },
  default: { count: 4, textSize: 'text-sm' },
  lg: { count: 4, textSize: 'text-base' },
  xl: { count: 5, textSize: 'text-lg' },
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'default',
  color = '#111111',
  count,
  fullPage = false,
  text,
  className,
}) => {
  const sizeConfig = sizeMap[size];
  const actualCount = count ?? sizeConfig.count;

  const loadingContent = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3",
      className
    )}>
      <BeatLoading color={color} count={actualCount} />
      {text && (
        <p className={cn(
          "text-slate-600 font-medium",
          sizeConfig.textSize
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {loadingContent}
      </div>
    );
  }

  return loadingContent;
};

/**
 * Inline Loading - For small inline contexts (buttons, dropdowns)
 */
export const InlineLoading: React.FC<Omit<LoadingProps, 'fullPage' | 'text'>> = (props) => (
  <Loading {...props} size={props.size || 'xs'} />
);

/**
 * Full Page Loading - For route transitions and page loading
 */
export const FullPageLoading: React.FC<Omit<LoadingProps, 'fullPage'>> = (props) => (
  <Loading {...props} fullPage text={props.text || 'Loading...'} />
);

/**
 * Button Loading - Specifically for button loading states
 */
export const ButtonLoading: React.FC<{ text?: string; light?: boolean }> = ({ 
  text = 'Loading...', 
  light = false 
}) => (
  <div className="flex items-center justify-center gap-2">
    <BeatLoading color={light ? '#ffffff' : '#111111'} count={4} />
    <span>{text}</span>
  </div>
);

/**
 * Card/Section Loading - For loading states in cards or sections
 */
export const SectionLoading: React.FC<{ text?: string; minHeight?: string }> = ({ 
  text = 'Loading...', 
  minHeight = '200px' 
}) => (
  <div 
    className="flex items-center justify-center bg-white rounded-xl border border-slate-200"
    style={{ minHeight }}
  >
    <Loading text={text} size="default" />
  </div>
);
