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

export const ClientFeedDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ drawerVisible, setDrawerVisible }) => {
  const [feedValue, setFeedValue] = useState(20);
  const [sendLoading, setSendLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('You don’t have enough food');
  return (
    <Drawer open={drawerVisible} onOpenChange={setDrawerVisible}>
      <DrawerContent className="!bg-[#2F2F3B] !p-6 !pt-0 !rounded-b-none">
        <DrawerHeader className="!p-0">
          <DrawerTitle className="text-white text-left flex justify-between items-center">
            <span className="text-lg font-bold text-[#F0F0F2]">Feed</span>
            <IoCloseCircle className="text-[#3B3B3D] size-6" />
          </DrawerTitle>
        </DrawerHeader>

        <div className="mb-6 mt-4 bg-[#444450] h-[1px] w-full"></div>

        <div className="actions-list grid grid-cols-3 gap-x-4 mb-4">
          {[20, 100, 200].map((item) => (
            <div
              key={item}
              className={cn(
                'h-28 w-full bg-[#1D1C21] flex flex-wrap justify-center content-center rounded-2xl border-[#FDCD62] ',
                item === feedValue ? 'border-4' : ''
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

        <div
          className={cn(
            'flex justify-between items-center gap-4 text-white',
            errorMsg ? 'mb-4' : 'mb-10'
          )}
        >
          <span className="text-sm font-bold">Type the number:</span>

          <div>
            <div
              className={cn(
                'bg-[#1D1C21] rounded-full h-12 flex items-center px-2 flex-1 border-[#FF2F53]',
                errorMsg ? 'border-2 mb-[6px]' : ''
              )}
            >
              <input
                type="number"
                className={cn('bg-transparent w-full ')}
                value={feedValue}
                onChange={({ target }) => {
                  setFeedValue(Number(target.value));
                }}
              />
            </div>

            {Boolean(errorMsg) && (
              <div className="text-[#FF2F53]">{errorMsg}</div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-white">
          <div>
            <div className="flex items-center">
              <div className="mr-2 w-16 h-7 rounded-full flex items-center justify-center gap-1 border-2 border-white/50">
                <Image
                  src="/icons/feed.png"
                  width={16}
                  height={16}
                  alt="feed"
                ></Image>
                <span className="text-xs">234</span>
              </div>
              <AiFillQuestionCircle className="size-[15px] text-[#737373]"></AiFillQuestionCircle>
            </div>
            <div className="text-sm">You have the food</div>
          </div>

          <Button
            title="Send"
            click={() => {}}
            disabled={sendLoading}
            className="w-28 h-11 bg-gradient-to-r to-[#D18EF7] from-[#FA3B67] mb-0"
          ></Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
