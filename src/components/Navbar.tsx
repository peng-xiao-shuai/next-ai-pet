'use client';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { FaChevronLeft } from 'react-icons/fa';

export const Navbar: FC<{
  children?: React.ReactNode;
  title?: string;
  back?: () => void;
}> = ({ children, title, back }) => {
  const router = useRouter();
  return (
    <>
      <div className={`px-4 w-full${' fixed z-10 bg-[#181425]'}`}>
        <div className={`flex items-center rounded-lg bg-base-300 h-12 `}>
          <div
            onClick={() => {
              if (back && typeof back === 'function') {
                back();
              } else {
                router.back();
              }
            }}
          >
            <div className="flex-none leading-none">
              <FaChevronLeft className=" size-6 svg-icon swap-off text-white rtl:rotate-180" />
            </div>
          </div>

          <div className="flex-1 text-center">
            <span className="font-sans _bold text-base-content pl-2 text-xl normal-case text-white">
              {title}
            </span>
          </div>
          <div className="flex-none">{children}</div>
        </div>
      </div>
    </>
  );
};
