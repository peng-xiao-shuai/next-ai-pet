'use client';
import LoadingRender from '@/app/loading';
import { Button } from '@/components/Button';
import FrameAnimation from '@/components/FrameAnimation';
import { InitLoading } from '@/components/InitLoading';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchRequest } from '@/utils/request';
import { LOCALE_KEYS } from '@@/locales';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

let state = {
  countDown: 3,
};
export const ClientCreatePet: FC<{
  setFriendId: Dispatch<SetStateAction<string | undefined>>;
  setIsPet: Dispatch<SetStateAction<boolean>>;
}> = ({ setFriendId, setIsPet }) => {
  const [isGift, setIsGift] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [progressNum, setProgressNum] = useState(0);
  const [countDown, setCountDown] = useState(state.countDown);
  const { t } = useTranslation();

  const onAllLoaded = () => {
    setIsLoader(true);
    setProgressNum(100);

    const timer = setTimeout(() => {
      setIsGift(false);

      const time = setInterval(() => {
        if (state.countDown < 0) {
          setIsPet(true);
          clearInterval(time);
          clearTimeout(timer);
        } else {
          state.countDown -= 1;
          setCountDown((val) => state.countDown);
        }
      }, 1000);
    }, 3000);
  };

  useEffect(() => {
    if (progressNum >= 100) return;

    let timer: NodeJS.Timeout;
    let progress = progressNum;
    timer = setInterval(
      () => {
        const num = parseInt(String(Math.random() * 5), 10);
        if (num > 3) {
          progress += num;
          setProgressNum(progress > 99 ? 99 : progress);
        }
      },
      progressNum > 20 ? 300 : progressNum > 60 ? 6000 : 100
    );

    return () => {
      clearInterval(timer);
    };
  }, [progressNum]);

  useEffect(() => {
    fetchRequest(`/restApi/friend/generate`, {
      styleId: 1,
    }).then(({ result }) => {
      setFriendId(result.id);
      Cookies.set('isPet', '1');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return countDown >= 0 ? (
    <>
      {!isLoader && (
        <InitLoading>
          <div className="absolute bottom-20 flex flex-wrap justify-center w-full">
            <span
              className="text-sm text-white font-bold"
              style={{
                WebkitTextStroke: '0.6px #753D3F',
              }}
            >
              Regret for your waiting because the first loading
            </span>
            <div className="border border-[#753D3F] rounded-full">
              <Progress
                className="w-[70vw] !bg-[rgba(128,84,62,0.50)]"
                bgClassName="from-[#3BDC14] to-[#46F71D] rounded-full border border-white duration-500"
                value={progressNum}
              ></Progress>
            </div>
            <div
              className="text-sm text-white font-bold w-full text-center"
              style={{
                WebkitTextStroke: '0.6px #753D3F',
              }}
            >
              Communicating with Server
            </div>
          </div>
        </InitLoading>
      )}

      <div className="fixed top-0 z-40 flex justify-center items-center bg-black w-full h-full">
        <Image
          src="/images/lights.png"
          width={750}
          height={972}
          priority
          alt="lights"
          className="absolute left-0 top-0"
        ></Image>
        <FrameAnimation
          height={750}
          width={750}
          loopIndex={50}
          baseUrl="/animation/gift/"
          totalFrames={100}
          initialDelay={0}
          frameNumber={30}
          allLoaded
          className="absolute top-2/4 -translate-y-2/4 left-0"
          onAllLoaded={onAllLoaded}
        >
          {!isGift && (
            <div className="relative z-10 w-2/4 mx-auto -mt-20">
              <Button
                disabled={loading}
                click={() => {
                  setLoading(true);
                  setCountDown(-1);
                  setIsPet(true);
                }}
                title={t(LOCALE_KEYS.ADOPT_A_PET)}
                className="bg-[#515151] text-xl w-2/3 mx-auto text-white border-white border-2"
              />

              <div className="text-center text-lg text-[#DCA823]">
                {countDown}s
              </div>
            </div>
          )}
        </FrameAnimation>
      </div>
    </>
  ) : (
    <></>
  );
};
