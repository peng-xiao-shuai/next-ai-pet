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
              return `<div class="inline-flex items-center text-[#FDCD62] mx-1"><img src="/icons/gold-coin.png" style="width: 14px;height:14px;margin-right:2px" alt="gold coin" />${p1}</div>`; // 处理 &+数字& 的情况
            } else {
              return `<div class="inline-flex items-center text-[#FDCD62] mx-1"><img src="/icons/feed.png" style="width: 14px;height:14px;margin-right:2px" alt="food" />${p2}</div>`; // 处理 $+数字$ 的情况
            }
          })
        : '',
    }));
    setTaskList(data);
    setLoading(false);
  };

  const handleTask = (item: Task) => {
    if (item.isCompleted) return;
    switch (item.code) {
      case 'FOLLOW_X':
        fetchRequest('/restApi/task', {
          code: 'FOLLOW_X',
        });
        window.Telegram.WebApp.openLink('https://x.com/aipets_official');
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
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerVisible]);

  return (
    <ClientChatDrawer
      drawerVisible={drawerVisible}
      title={t(LOCALE_KEYS.TASK)}
      setDrawerVisible={setDrawerVisible}
    >
      <div className="mb-10">
        {loading && taskList.length === 0 ? (
          <div className="h-40 w-full bg-[#1D1C21] rounded-2xl mb-14">
            <LoadingRender />
          </div>
        ) : (
          taskList.map((item, index) => (
            <div
              key={item.id}
              className="mb-5"
              onClick={() => {
                if (!item.isCompleted) {
                  debounce(handleTask, 300, [item]);
                }
              }}
            >
              <div className={cn('w-full flex justify-between items-center')}>
                <div className="text-lg font-bold text-white text-left mb-1">
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
                      <span className="text-sm text-[#FDCD62]">
                        +{item.reward}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  title={`${
                    item.isCompleted
                      ? t(LOCALE_KEYS.FINISH)
                      : t(formatText[item.code])
                  }`}
                  className={`!mb-0 h-8 ${'bg-gradient-to-r to-[#D18EF7] from-[#FA3B67] text-white !min-w-20 max-w-28 !w-auto px-2 !text-sm pointer-events-none'}`}
                  click={() => {}}
                ></Button>
              </div>

              {Boolean(item.remark.length) &&
                item.remark
                  .split('\\n')
                  ?.map((remark) => (
                    <div
                      className="text-sm text-[#BCBCC4] items-center flex mb-1"
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
