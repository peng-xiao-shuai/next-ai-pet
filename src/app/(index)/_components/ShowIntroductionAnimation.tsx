import Image from 'next/image';
import { ChatContext } from './Client';
import { FC, useContext, useEffect, useState } from 'react';
import { m } from 'framer-motion';
import emitter from '@/utils/bus';

export const ShowIntroductionAnimation: FC<{
  _P: string;
}> = ({ _P }) => {
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

  return (
    visible && (
      <div
        className={`bg-black/30 fixed z-50 top-0 left-0 flex items-center justify-center w-full h-full opacity-${opacity} duration-200 transition-all`}
      >
        <m.div
          animate={{
            left: 12,
            bottom: 87,
            scale: 0.9,
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
                /**
                 * 开屏结束
                 */
                emitter.emit('IntroductionAnimation');
              }, 200);
            }
          }}
        >
          <Image
            src="/images/introduction.gif"
            width={200}
            height={200}
            alt="introduction"
          ></Image>
        </m.div>
      </div>
    )
  );
};
