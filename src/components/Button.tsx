import { debounce } from '@/utils/debounce-throttle';
import React, { CSSProperties, FC } from 'react';

export const Button: FC<{
  title?: string;
  children?: React.ReactNode;
  click: () => void;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}> = ({ title, click, style, children, className, disabled }) => {
  return (
    <button
      className={`btn-loading h-12 w-full flex justify-center items-center mb-4 rounded-full font-bold ${className}`}
      onClick={() => {
        debounce(click);
      }}
      disabled={disabled || false}
      style={style || {}}
    >
      <span className="loading loading-spinner"></span>
      {children || title}
    </button>
  );
};
