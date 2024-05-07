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

export const ClientFeedDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ drawerVisible, setDrawerVisible }) => {
  const { state } = useContext(ChatContext);
  const [feedValue, setFeedValue] = useState<number | string>(20);
  const { userState, setDataLocal } = useUserStore();
  const [sendLoading, setSendLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (Number(feedValue) > userState.walletAble) {
      setErrorMsg('You don’t have enough food');
    } else {
      setErrorMsg('');
    }
  }, [feedValue, userState.walletAble]);

  return (
    <ClientChatDrawer
      drawerVisible={drawerVisible}
      title="Feed"
      setDrawerVisible={setDrawerVisible}
    >
      <div className="flex mb-6 justify-between gap-2">
        <span className="text-white text-sm">
          产能描述简短文案，产能描述，简短文案简短文案简短文案简短文案产能描述简短文案，产能描述，简短文案简短文案简短文案简短文案
        </span>
        <Rules className="!size-6 text-[#737373]"></Rules>
      </div>

      <div className="actions-list grid grid-cols-3 gap-x-4 mb-4">
        {[20, 100, 200].map((item) => (
          <div
            key={item}
            className={cn(
              'h-28 w-full bg-[#1D1C21] flex flex-wrap justify-center content-center rounded-2xl border-[#FDCD62] ',
              item === feedValue ? 'border-2' : ''
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
            <div className="text-lg font-bold text-[#FDCD62] w-full text-center">
              {item}
            </div>
          </div>
        ))}
      </div>

      <div className={cn('flex justify-between gap-4 text-white', 'mb-10')}>
        <div className="relative flex-1">
          <div
            className={cn(
              'bg-[#1D1C21] rounded-2xl h-12 flex items-center px-2 w-full border-2 border-transparent duration-300 transition-all',
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
          className="text-lg leading-[3]"
          onClick={() => {
            setFeedValue(userState.walletAble);
          }}
        >
          Feed all
        </div>
      </div>

      <div className="flex items-center justify-between text-white h-12">
        <div className="h-full">
          <div className="flex items-center">
            <div className="min-w-16 h-7 px-2 rounded-full flex items-center justify-center gap-1 border-2 border-white/50">
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
          <div className="text-sm">You have the food</div>
        </div>

        <Button
          title="Send"
          click={async () => {
            if (errorMsg) {
              return;
            }

            setSendLoading(true);
            try {
              const { result } = await fetchRequest(
                `/restApi/friend/feedFood/${state!
                  .friendId!}?quantity=${feedValue}`
              );
              28;
              toast(
                `谢谢主人给我投喂，本次投喂产能增加 ${result.chatCapacity} `,
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
          }}
          disabled={sendLoading}
          className={cn(
            'duration-300 transition-all !w-28 !h-full bg-gradient-to-r to-[#D18EF7] from-[#FA3B67] !mb-0',
            errorMsg ? 'grayscale' : ''
          )}
        ></Button>
      </div>
    </ClientChatDrawer>
  );
};
