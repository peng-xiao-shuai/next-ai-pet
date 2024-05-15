import { debounce } from '@/utils/debounce-throttle';
import React, { FC } from 'react';

export const Button: FC<{
  title?: string;
  children?: React.ReactNode;
  click: () => void;
  className?: string;
  disabled?: boolean;
}> = ({ title, click, children, className, disabled }) => {
  return (
    <button
      className={`btn-loading h-12 w-full flex justify-center items-center mb-4 rounded-full font-bold ${className}`}
      onClick={() => {
        debounce(click);
      }}
      disabled={disabled || false}
    >
      <span className="loading loading-spinner"></span>
      {children || title}
    </button>
  );
};
