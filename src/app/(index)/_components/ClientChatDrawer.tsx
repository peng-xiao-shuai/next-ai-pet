'use client';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';

export const ClientChatDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
}> = ({ drawerVisible, setDrawerVisible, title, children }) => {
  return (
    <Drawer open={drawerVisible} onOpenChange={setDrawerVisible}>
      <DrawerPortal>
        <DrawerContent
          className={cn(
            '!bg-[#f9f6ec] border-8 border-b-0 border-[#bf8154] !p-4 !pt-0 !rounded-b-none'
          )}
        >
          <div className="absolute -top-6 left-2/4 -translate-x-2/4 bg-[#b7794c] z-[-1] w-48 h-4 rounded-t-[8px]"></div>
          <DrawerHeader className="!p-0 mb-6">
            {/* bg-[#ebc879]  */}
            <DrawerTitle
              className={cn(
                'absolute left-2/4 -translate-x-2/4 -top-4 bg-[#ebc879] rounded-b-2xl'
              )}
            >
              <div
                className="text-white text-xl bg-gradient-to-t from-[#b7794c] to-[#b7794c] w-44 h-11 leading-[2] font-bold font-sans rounded-b-[12px]"
                style={{
                  WebkitTextStroke: '5px transparent',
                  // @ts-ignore
                  WebkitBackgroundClip: 'text',
                }}
              >
                {title}
              </div>
            </DrawerTitle>
            {/* 
            <IoCloseCircle
              className="text-[#3B3B3D] size-6"
              onClick={() => {
                setDrawerVisible(false);
              }}
            /> */}
          </DrawerHeader>
          {/* <div className="mb-6 mt-4 bg-[#444450] h-[1px] w-full"></div> */}

          {children}
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};
