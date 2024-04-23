'use client';
import { Button } from '@/components/Button';
import Image from 'next/image';
import { AiFillQuestionCircle } from 'react-icons/ai';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { cn } from '@/lib/utils';

export const ClientFoodDrawer: FC<{
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
  ];

  return (
    <Drawer open={drawerVisible} onOpenChange={setDrawerVisible}>
      <DrawerContent className="!bg-[#2F2F3B] !p-6 !pt-0 !rounded-b-none">
        <DrawerHeader className="!p-0">
          <DrawerTitle className="text-white text-left flex justify-between items-center">
            <span className="text-lg font-bold text-[#F0F0F2]">Food</span>
            <IoCloseCircle className="text-[#3B3B3D] size-6" />
          </DrawerTitle>
        </DrawerHeader>

        <div className="mb-6 mt-4 bg-[#444450] h-[1px] w-full"></div>

        <div className="text-[#868686] text-sm mb-5">You can erm food</div>

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

        <div className="text-[#868686] text-sm mb-5">You can buy food</div>

        <div className="actions-list grid grid-cols-3 gap-x-4 mb-4">
          {topUp.map((item) => (
            <div
              key={item.price}
              className={cn(
                'h-28 w-full bg-[#1D1C21] flex flex-wrap justify-center content-center rounded-2xl border-[#FDCD62] '
              )}
            >
              <div className="flex gap-1 w-full items-center justify-center mb-5">
                <Image
                  src="/icons/feed.png"
                  width={16}
                  height={16}
                  alt={item + ' feed'}
                ></Image>
                <span className="text-lg font-bold text-white text-center">
                  {item.availabilityFood}
                </span>
              </div>

              <Button
                title={item.price + 'Ton'}
                click={() => {}}
                disabled={loading}
                className="!w-20 h-7 bg-gradient-to-r to-[#D18EF7] from-[#FA3B67] mb-0 text-white text-sm"
              ></Button>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
