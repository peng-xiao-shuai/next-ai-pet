'use client';
import Image from 'next/image';
import { useState, useEffect, ReactNode, FC } from 'react';

const BgLoading = (children?: ReactNode) => {
  return (
    <div className="fixed z-50 top-0 w-full h-[100vh] bg-[url(/images/start-bg-image.png)] bg-center bg-[size:100vw_100vh]">
      <div className="absolute z-[51] text-4xl font-bold top-8 text-white text-center w-full font-sans">
        Chat to Earn!
      </div>

      {children}
    </div>
  );
};

export const InitLoading: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
  }, []);

  if (visible) {
    return BgLoading();
  }

  return children ? BgLoading(children) : <></>;
};
