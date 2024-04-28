'use client';
import { Button } from '@/components/Button';
import AppConfigEnv from '@/utils/get-config';
import { fetchRequest } from '@/utils/request';
import {
  AnimationPlaybackControls,
  AnimationSequence,
  SequenceOptions,
  m,
  useAnimate,
} from 'framer-motion';
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
  const [scope, animate] = useAnimate();
  const [isGift, setIsGift] = useState(true);
  const [loading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState(state.countDown);

  useEffect(() => {
    fetchRequest(`/restApi/friend/generate`, {
      styleId: 1,
    }).then(({ result }) => {
      setFriendId(result.id);
      Cookies.set('isPet', '1');
    });

    const animation = (
      animate as (
        sequence: AnimationSequence,
        options?: SequenceOptions
      ) => AnimationPlaybackControls
    )(
      [
        [scope.current, { rotate: 5 }],
        [scope.current, { rotate: -5 }],
        [scope.current, { rotate: 5 }],
        [scope.current, { rotate: -5 }],
        [scope.current, { rotate: 0 }],
        [scope.current, { rotate: 2 }, { delay: 0.5 }],
        [scope.current, { rotate: -2 }],
        [scope.current, { rotate: 2 }],
        [scope.current, { rotate: -2 }],
        [scope.current, { rotate: 0, opacity: 0 }],
      ],
      { delay: 1, duration: 2 }
    );

    animation.then(() => {
      setIsGift(false);

      const time = setInterval(() => {
        if (state.countDown < 0) {
          setIsPet(true);
          clearInterval(time);
        } else {
          state.countDown -= 1;
          setCountDown((val) => val - 1);
        }
      }, 1000);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return countDown >= 0 ? (
    <div className="fixed flex justify-center items-center bg-black w-full h-full">
      <Image
        src="/images/lights.png"
        width={750}
        height={972}
        priority
        alt="lights"
        className="absolute left-0 top-0"
      ></Image>
      {isGift ? (
        <div>
          <Image
            width={232}
            height={207}
            ref={scope}
            alt="Gift"
            src="/images/gift.png"
            priority
          ></Image>
        </div>
      ) : (
        <div className="relative z-10">
          <m.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Image
              src="/images/pet.png"
              width={440}
              height={440}
              priority
              alt="pet"
              className="mb-5"
            ></Image>
          </m.div>

          <Button
            disabled={loading}
            click={() => {
              setLoading(true);
              setCountDown(-1);
              setIsPet(true);
            }}
            title="Adopt a pet"
            className="bg-[#515151] text-xl w-2/3 mx-auto text-white border-white border-2"
          />

          <div className="text-center text-lg text-[#DCA823]">{countDown}s</div>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};
