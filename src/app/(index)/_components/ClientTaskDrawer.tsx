'use client';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ClientChatDrawer } from './ClientChatDrawer';
import { fetchRequest } from '@/utils/request';
import LoadingRender from '@/app/loading';
import { Button } from '@/components/Button';
import { useShare } from '@/hooks/use-share';
import { useConnectWallet } from '@/hooks/use-connect-wallet';
import { debounce } from '@/utils/debounce-throttle';
import Image from 'next/image';
import { LOCALE_KEYS } from '@@/locales';
import { useTranslation } from '@/hooks/useTranslation';
import { CustomEvents, handleTriggerEvent } from '@/utils/GA-event';
import { BsCheckAll } from 'react-icons/bs';

export const ClientTaskDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ drawerVisible, setDrawerVisible }) => {
  type Task = {
    code: keyof typeof formatText;
    cycleType: string;
    enable: number;
    id: number;
    limit: number;
    name: string;
    remark: string;
    requirement: number;
    reward: number;
    sort: number;
    statistics: string;
    isCompleted: boolean;
    type: string;
  };
  const [loading, setLoading] = useState(false);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const { t } = useTranslation();
  const { handleShare } = useShare();
  const { handleOpen } = useConnectWallet({
    bindSuccessCB: () => {
      setTaskList((state) => {
        const CopyList = state.map((item) => ({
          ...item,
        }));
        const findData = CopyList.find((item) => item.code === 'BIND_WALLET');

        if (findData) {
          findData.isCompleted = true;
        }

        return CopyList;
      });
    },
  });
  const formatText = {
    FOLLOW_X: LOCALE_KEYS.GO_TO_FOLLOW,
    JOIN_GROUP: LOCALE_KEYS.GO_TO_ADD,
    JOIN_CHANNEL: LOCALE_KEYS.GO_TO_ADD,
    JOIN_T_APP_PARK_CHANNEL: LOCALE_KEYS.GO_TO_ADD,
    BIND_WALLET: LOCALE_KEYS.GO_TO_LINK,
    INVITE_MEMBER: LOCALE_KEYS.INVITE,
  } as const;

  const getTaskList = async () => {
    setLoading(true);
    const { result } = await fetchRequest('/restApi/task/list');
    const data = result.rows.map((item: Task) => ({
      ...item,
      remark: item.remark
        ? item.remark.replaceAll(/&(\+\d+)&|\$(\+\d+)\$/g, (match, p1, p2) => {
            if (p1) {
              return `<div class="inline-flex items-center text-[#F1B62D] mx-1"><img src="/icons/gold-coin.png" style="width: 14px;height:14px;margin-right:2px" alt="gold coin" />${p1}</div>`; // 处理 &+数字& 的情况
            } else {
              return `<div class="inline-flex items-center text-[#F1B62D] mx-1"><img src="/icons/feed.png" style="width: 14px;height:14px;margin-right:2px" alt="food" />${p2}</div>`; // 处理 $+数字$ 的情况
            }
          })
        : '',
    }));
    const inviteData = data.find((item: Task) => item.code === 'INVITE_MEMBER');
    data.splice(data.indexOf(inviteData), 1);
    data.unshift(inviteData);
    setTaskList(data);
    setLoading(false);
  };

  const handleTask = (item: Task) => {
    // if (item.isCompleted) return;
    switch (item.code) {
      case 'FOLLOW_X':
        if (!item.isCompleted) {
          handleTriggerEvent([
            {
              eventAction: CustomEvents.FOLLOW_THE_NUMBER_OF_TWITTER_USERS,
            },
          ]);
        }
        fetchRequest('/restApi/task', {
          code: 'FOLLOW_X',
        });
        window.Telegram.WebApp.openLink('https://x.com/aipets_official');
        break;
      case 'JOIN_T_APP_PARK_CHANNEL':
        if (!item.isCompleted) {
          handleTriggerEvent([
            {
              eventAction: CustomEvents.NUMBER_OF_PEOPLE_WHO_JOINED_TAPPPARK,
            },
          ]);
        }
        fetchRequest('/restApi/task', {
          code: 'JOIN_T_APP_PARK_CHANNEL',
        }).then((res) => {
          setTaskList((state) => {
            const CopyList = state.map((item) => ({
              ...item,
            }));
            const findData = CopyList.find(
              (item) => item.code === 'JOIN_T_APP_PARK_CHANNEL'
            );

            if (findData) {
              findData.isCompleted = true;
            }

            return CopyList;
          });
        });
        window.Telegram.WebApp.openTelegramLink(
          'https://t.me/+KuMRCj9WUVthY2Fh'
        );

        // window.Telegram.WebApp.close();
        break;
      case 'JOIN_GROUP':
        window.Telegram.WebApp.openTelegramLink('https://t.me/AiPets_Group');
        window.Telegram.WebApp.close();
        break;
      case 'JOIN_CHANNEL':
        window.Telegram.WebApp.openTelegramLink('https://t.me/AiPetsAnn');
        window.Telegram.WebApp.close();
        break;
      case 'BIND_WALLET':
        if (!item.isCompleted) {
          handleTriggerEvent([
            {
              eventAction: CustomEvents.LINK_WALLET_NUMBER,
            },
          ]);
        }
        // @ts-ignore
        document.activeElement?.blur?.();
        handleOpen();
        break;
      case 'INVITE_MEMBER':
        handleShare();
        break;
    }
  };

  useEffect(() => {
    if (drawerVisible) {
      getTaskList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerVisible]);

  return (
    <ClientChatDrawer
      drawerVisible={drawerVisible}
      title={t(LOCALE_KEYS.TASK)}
      setDrawerVisible={setDrawerVisible}
    >
      <div className="max-h-[50vh] overflow-y-auto">
        {loading && taskList.length === 0 ? (
          <div className="h-40 w-full bg-[#1D1C21] overflow-hidden rounded-2xl mb-14">
            <LoadingRender className="h-full" />
          </div>
        ) : (
          taskList.map((item, index) => (
            <div
              key={item.id}
              className="mb-3 bg-[#FFFCF7] border-[#D3B996] border-2 rounded-xl py-2 px-3"
            >
              <div className={cn('w-full flex justify-between items-center')}>
                <div className="text-lg font-bold text-[#7F6957] text-left mb-1">
                  <span>{item.name}</span>
                  {Boolean(item.reward) && (
                    <div className="flex items-center">
                      <Image
                        src="/icons/gold-coin.png"
                        width={15}
                        height={15}
                        className="mr-1"
                        alt="gold coin"
                      ></Image>
                      <span className="text-sm text-[#F1B62D]">
                        +{item.reward}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  className={cn(
                    item.isCompleted ? 'grayscale' : '',
                    '!mb-0 h-8 duration-300 transition-all !min-w-20 max-w-28 !w-auto border-2 border-[#A55636] bg-[#FFD262] text-[#FFFAEF]'
                  )}
                  click={() => {
                    handleTask(item);
                  }}
                >
                  <div
                    className="bg-[#84420B] w-full h-full flex text-sm items-center justify-center rounded-full pointer-events-none"
                    style={{
                      boxShadow: '0px 1px 1px white inset',
                      WebkitTextStroke: '3px transparent',
                      // @ts-ignore
                      WebkitBackgroundClip: 'text',
                    }}
                  >
                    {item.isCompleted ? (
                      <BsCheckAll className="size-7"></BsCheckAll>
                    ) : (
                      t(formatText[item.code])
                    )}
                  </div>
                </Button>
              </div>

              {Boolean(item.remark.length) &&
                item.remark
                  .split('\\n')
                  ?.map((remark) => (
                    <div
                      className="text-sm text-[#7F6957] items-center flex mb-1"
                      key={remark}
                      dangerouslySetInnerHTML={{ __html: remark }}
                    ></div>
                  ))}
            </div>
          ))
        )}

        {/* <div className="flex justify-between gap-4 items-center">
          <span className="text-sm text-[#BCBCC4] flex-1">
            If you invite a new user you will get{' '}
            <span className="text-[#FDCD62] font-bold">1</span> food
          </span>

          <div
            className="bg-gradient-to-r text-center leading-8 to-[#D18EF7] from-[#FA3B67] text-white rounded-full w-[70px] h-8"
            onClick={handleShare}
          >
            Invite
          </div>
        </div> */}
      </div>
    </ClientChatDrawer>
  );
};
