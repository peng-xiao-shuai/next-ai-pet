'use client';
import Image from 'next/image';
import { useState, useEffect, ReactNode, FC } from 'react';

const BgLoading = (children?: ReactNode) => {
  return (
    <div className="fixed z-50 top-0 w-full h-[100vh]">
      <div className="absolute z-[51] text-4xl font-bold top-8 text-white text-center w-full font-sans">
        Chat to Earn!
      </div>
      <Image
        width={750}
        height={1624}
        sizes="100vw"
        style={{
          width: '100%',
          height: 'auto',
        }}
        src="/images/start-bg-image.png"
        alt="start"
        priority
      />

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
