import { useBusWatch } from '@/hooks/use-bus-watch';
import Image from 'next/image';
import { ChatContext } from './Client';
import { useContext, useEffect, useState } from 'react';
import { m } from 'framer-motion';
const _P = 'Chat-';

export const ShowIntroductionAnimation = () => {
  const { detail, setList } = useContext(ChatContext);
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    if (detail.isInitialized) {
      setVisible(true);

      const timer = setTimeout(() => {
        setOpacity(100);
        clearTimeout(timer);
      }, 200);
    }
  }, [detail.isInitialized]);

  useBusWatch(_P + 'onSocketMessage', () => {
    if (detail.isInitialized) {
    }
  });

  return (
    visible && (
      <div
        className={`bg-black/30 fixed z-50 top-0 left-0 flex items-center justify-center w-full h-full opacity-${opacity} duration-200 transition-all`}
      >
        <m.div
          animate={{
            left: -114,
            top: 51,
            scale: 0.8,
          }}
          className="fixed z-50"
          transition={{
            delay: 2,
            duration: 0.8,
          }}
          onAnimationComplete={(e) => {
            if ((e as any).scale) {
              setOpacity(0);

              setList?.((state) => {
                const CopyList = state.map((item) => ({ ...item }));
                CopyList[CopyList.length - 1].visible = true;
                return CopyList;
              });
              const timer = setTimeout(() => {
                setVisible(false);
                clearTimeout(timer);
              }, 200);
            }
          }}
        >
          <Image
            src="/images/introduction.gif"
            width={450}
            height={450}
            alt="introduction"
          ></Image>
        </m.div>
      </div>
    )
  );
};
