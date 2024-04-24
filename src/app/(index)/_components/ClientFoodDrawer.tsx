'use client';
import { Button } from '@/components/Button';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { cn } from '@/lib/utils';
import { ClientChatDrawer } from './ClientChatDrawer';

export const ClientFoodDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ drawerVisible, setDrawerVisible }) => {
  const [loading, setLoading] = useState(false);
  const [feedValue, setFeedValue] = useState(10);

  const topUp = [
    {
      price: 10,
      availabilityFood: 1000,
    },
    {
      price: 15,
      availabilityFood: 1500,
    },
    {
      price: 30,
      availabilityFood: 3000,
    },
    {
      price: 80,
      availabilityFood: 8000,
    },
  ];

  return (
    <ClientChatDrawer
      drawerVisible={drawerVisible}
      title="Food"
      setDrawerVisible={setDrawerVisible}
    >
      <div className="actions-list grid grid-cols-2 gap-y-4 gap-x-4 mb-14">
        {topUp.map((item) => (
          <div
            key={item.price}
            className={cn(
              'h-28 w-full bg-[#1D1C21] flex flex-wrap justify-center content-center rounded-2xl border-[#FDCD62]',
              item.price === feedValue ? 'border-2' : ''
            )}
            onClick={() => {
              setFeedValue(item.price);
            }}
          >
            <div className="flex gap-1 w-full items-center justify-center mb-3">
              <Image
                src="/icons/feed.png"
                width={28}
                height={28}
                alt={item + ' feed'}
              ></Image>
              <span className="text-2xl font-bold text-white text-center">
                {item.availabilityFood}
              </span>
            </div>
            <span className="text-[#8E8D92]">{item.price}Ton</span>
          </div>
        ))}
      </div>

      <Button
        title={'Buy'}
        click={() => {}}
        disabled={loading}
        className="h-11 bg-gradient-to-r to-[#D18EF7] from-[#FA3B67] mb-0 text-white text-sm"
      ></Button>
    </ClientChatDrawer>
  );
};
