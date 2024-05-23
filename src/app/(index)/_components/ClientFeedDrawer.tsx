'use client';
import { Button } from '@/components/Button';
import Image from 'next/image';
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import { ClientChatDrawer } from './ClientChatDrawer';
import { useUserStore } from '@/hooks/use-user';
import { fetchRequest } from '@/utils/request';
import { ChatContext } from './Client';
import { toast } from 'sonner';
import { Rules } from '@/components/Rules';
import { VideoName } from './ShowAnimation';
import { LOCALE_KEYS } from '@@/locales';
import { useTranslation } from '@/hooks/useTranslation';
import { CustomEvents, handleTriggerEvent } from '@/utils/GA-event';
import emitter from '@/utils/bus';

export const ClientFeedDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ drawerVisible, setDrawerVisible }) => {
  // const { state, showAnimationFun } = useContext(ChatContext);
  const { state } = useContext(ChatContext);
  const [feedValue, setFeedValue] = useState<number | string>(5);
  const { userState, setDataLocal } = useUserStore();
  const { t } = useTranslation();
  const [sendLoading, setSendLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (Number(feedValue) > userState.walletAble) {
      setErrorMsg(t(LOCALE_KEYS.YOU_DON_T_HAVE_ENOUGH_FOOD));
    } else {
      setErrorMsg('');
    }
  }, [feedValue, t, userState.walletAble]);

  useEffect(() => {
    if (drawerVisible) {
      handleTriggerEvent([
        {
          eventAction: CustomEvents.FEED_THE_NUMBER_OF_PAGE_VISITORS,
          isSetCookie: true,
        },
      ]);
    }
  }, [drawerVisible]);

  return (
    <ClientChatDrawer
      drawerVisible={drawerVisible}
      title={t(LOCALE_KEYS.FEED)}
      setDrawerVisible={setDrawerVisible}
    >
      <div className="flex mb-6 justify-between gap-2">
        <span className="text-[#7F6957] text-sm">
          {t(LOCALE_KEYS.CAPACITY_DESCRIPTION)}
        </span>
        <Rules className="!size-6 text-[#D3B49C]"></Rules>
      </div>

      <div className="actions-list grid grid-cols-3 gap-x-4 mb-4">
        {[5, 10, 50].map((item) => (
          <div
            key={item}
            className={cn(
              'h-28 w-full bg-[#fffcf7] flex flex-wrap justify-center content-center rounded-2xl border-2 border-[#D3B996] transition-all duration-300',
              item === feedValue ? '!border-[#FDCD62] !bg-[#fff7d5]' : ''
            )}
            onClick={() => {
              setFeedValue(item);
            }}
          >
            <Image
              src="/icons/feed.png"
              width={32}
              height={32}
              alt={item + ' feed'}
            ></Image>
            <div
              className="text-lg font-bold w-full text-center"
              style={{
                color: item === feedValue ? '#F1B62D' : '#7F6957',
              }}
            >
              {item}
            </div>
          </div>
        ))}
      </div>

      <div className={cn('flex justify-between gap-4 text-white', 'mb-10')}>
        <div className="relative flex-1">
          <div
            className={cn(
              'bg-[#FFFCF7] text-black rounded-2xl h-12 flex items-center px-2 w-full border-2 border-[#D3B996] duration-300 transition-all',
              errorMsg ? 'border-[#FF2F53] mb-[6px]' : ''
            )}
          >
            <input
              className={cn('bg-transparent w-full ')}
              value={feedValue}
              onChange={({ target }) => {
                setFeedValue(target.value.replace(/[^0-9]/g, ''));
              }}
            />
          </div>

          {Boolean(errorMsg) && (
            <div className="text-[#FF2F53] text-xs absolute">{errorMsg}</div>
          )}
        </div>

        <div
          className="text-lg leading-[3] text-[#BF8154]"
          onClick={() => {
            setFeedValue(userState.walletAble);
          }}
        >
          {t(LOCALE_KEYS.FEED_ALL)}
        </div>
      </div>

      <div className="flex items-center justify-between text-[#7F6957] h-12">
        <div className="h-full">
          <div className="flex items-center">
            <div className="bg-[#FBEDCE] min-w-16 h-7 px-2 rounded-full flex items-center justify-center gap-1 border-2 border-[#F7D59A]">
              <Image
                src="/icons/feed.png"
                width={16}
                height={16}
                alt="feed"
              ></Image>
              <span className="text-xs">{userState.walletAble}</span>
            </div>
            <Rules className="!size-6 text-[#737373]"></Rules>
          </div>
          <div className="text-sm">{t(LOCALE_KEYS.YOU_HAVE_THE_FOOD_)}</div>
        </div>

        <Button
          click={async () => {
            if (errorMsg || !feedValue) {
              return;
            }

            setSendLoading(true);
            try {
              const { result } = await fetchRequest(
                `/restApi/friend/feedFood/${state!
                  .friendId!}?quantity=${feedValue}`
              );

              handleTriggerEvent([
                {
                  eventAction: CustomEvents.NUMBER_OF_FOOD_USERS_FEED,
                  eventValue: {
                    value: feedValue,
                    id: window.Telegram?.WebApp.initDataUnsafe.user?.id,
                  },
                },
                {
                  eventAction: CustomEvents.NUMBER_OF_FOOD_USERS_FEED,
                  eventValue: feedValue,
                },
                {
                  eventAction: CustomEvents.FEED_THE_NUMBER_OF_DOG_FOOD_USERS,
                  isSetCookie: true,
                },
              ]);

              // 开启动画
              // showAnimationFun?.(VideoName.FEED);

              toast(
                t(LOCALE_KEYS.THANK_YOU_FOR_FEEDING, [result.chatCapacity]),
                {
                  duration: 3000,
                }
              );
            } catch (err: any) {
              console.log(err);
            }
            setSendLoading(false);
            setFeedValue('');
            setDataLocal({
              walletAble: userState.walletAble - Number(feedValue),
            });
            setDrawerVisible(false);
            emitter.emit('foodStatus');
          }}
          disabled={sendLoading}
          className={cn(
            'duration-300 transition-all !w-28 !h-full border-2 border-[#A55636] bg-[#FFD262] text-[#FFFAEF] !mb-0',
            errorMsg || !feedValue ? 'grayscale' : ''
          )}
        >
          <div
            className="bg-[#84420B] w-full h-full flex items-center justify-center rounded-full"
            style={{
              boxShadow: '0px 1px 1px white inset',
              WebkitTextStroke: '3px transparent',
              // @ts-ignore
              WebkitBackgroundClip: 'text',
            }}
          >
            <span className="loading loading-spinner"></span>
            {t(LOCALE_KEYS.SEND)}
          </div>
        </Button>
      </div>
    </ClientChatDrawer>
  );
};
