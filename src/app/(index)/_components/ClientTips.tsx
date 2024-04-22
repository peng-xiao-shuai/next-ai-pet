import { FC } from 'react';

export const ClientTips: FC<{
  text: string;
  className?: string;
  cornerClassName?: string;
}> = ({ text, className, cornerClassName }) => {
  return (
    <div
      className={`absolute px-5 py-4 bg-gradient-to-t to-[#F4B4CF] from-[#BE89F5] rounded-xl text-[#1D1C21] text-lg leading-5 font-bold ${className}`}
    >
      {text}
      {/* 三角形 */}
      <div
        className={`absolute bg-[#BE89F5] size-3 rotate-45 ${cornerClassName}`}
      ></div>
    </div>
  );
};
