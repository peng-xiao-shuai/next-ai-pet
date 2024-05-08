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

export const ClientTaskDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ drawerVisible, setDrawerVisible }) => {
  type Task = {
    code: string;
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

  const getTaskList = async () => {
    setLoading(true);
    const { result } = await fetchRequest('/restApi/task/list');
    const data = result.rows.map((item: Task) => ({
      ...item,
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
      title="Task"
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
              <div className={cn('w-full flex justify-between')}>
                <div className="text-lg font-bold text-white text-left">
                  {item.name}
                </div>

                <Button
                  title={`${item.isCompleted ? '已完成' : '+' + item.reward + ' $Pets'}`}
                  className={`!mb-0 h-auto ${
                    item.isCompleted
                      ? 'bg-gradient-to-r to-[#D18EF7] from-[#FA3B67] text-white !w-20 !text-sm'
                      : 'font-bold text-[#FDCD62] text-sm leading-normal !items-start !w-auto pointer-events-none cursor-pointer'
                  }`}
                  click={() => {}}
                ></Button>
              </div>

              {Boolean(item.remark.length) &&
                item.remark.split(';')?.map((remark) => (
                  <div className="text-sm text-[#BCBCC4]" key={remark}>
                    {remark}
                  </div>
                ))}
            </div>
          ))
        )}

        <div className="flex justify-between gap-4 items-center">
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
        </div>
      </div>
    </ClientChatDrawer>
  );
};
