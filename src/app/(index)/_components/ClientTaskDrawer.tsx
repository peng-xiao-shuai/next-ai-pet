'use client';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { cn } from '@/lib/utils';
import { ClientChatDrawer } from './ClientChatDrawer';

export const ClientTaskDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ drawerVisible, setDrawerVisible }) => {
  const [loading, setLoading] = useState(false);
  const addGold = [
    {
      content: 'The first message send to your pet everyday',
      gold: 20,
    },
    {
      content: 'Share to friends',
      gold: 20,
    },
  ];

  return (
    <ClientChatDrawer
      drawerVisible={drawerVisible}
      title="Task"
      setDrawerVisible={setDrawerVisible}
    >
      <div className="mb-10">
        {addGold.map((item, index) => (
          <div key={index} className={cn('mb-5 w-full flex justify-between')}>
            <div className="text-lg font-bold text-white w-full text-left">
              {item.content}
            </div>

            <span className="font-bold text-[#FDCD62] text-sm">
              +{item.gold}
            </span>
          </div>
        ))}

        <div className="flex justify-between gap-4">
          <span className="text-sm text-[#BCBCC4] flex-1">
            If you invite a new user you will get xxx food
          </span>

          <div className="bg-gradient-to-r text-center leading-8 to-[#D18EF7] from-[#FA3B67] text-white rounded-full w-[70px] h-8">
            Invite
          </div>
        </div>
      </div>
    </ClientChatDrawer>
  );
};
