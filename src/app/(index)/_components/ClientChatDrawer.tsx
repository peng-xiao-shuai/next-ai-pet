'use client';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';

export const ClientChatDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
}> = ({ drawerVisible, setDrawerVisible, title, children }) => {
  useEffect(() => {
    // const overflow = 100;
    if (!drawerVisible) {
      document.body.classList.add(
        'fixed',
        '!top-[-100px]',
        'left-0',
        'right-0',
        'h-auto'
      );
    } else {
      // document.body.className = '';
      // setClassName('fixed !top-[-100px] left-0 right-0 h-auto')
      // document.body.style.height =
      //   window.Telegram.WebApp.viewportStableHeight + 'px';
      // document.body.style.marginTop = `${0}px`;
      // document.body.style.paddingBottom = `${0}px`;
      // document.body.style.top = `${0}px`;
      // if (/iphone/gi.test(window.navigator.userAgent)) {
      //   window.scrollTo(0, 0);
      // } else {
      //   window.scrollTo(0, 0);
      // }
    }
  }, [drawerVisible]);
  return (
    <Drawer open={drawerVisible} onOpenChange={setDrawerVisible}>
      <DrawerPortal>
        <DrawerContent className="!bg-[#2F2F3B] !p-6 !pt-0 !rounded-b-none">
          <DrawerHeader className="!p-0">
            <DrawerTitle className="text-white text-left flex justify-between items-center">
              <span className="text-lg font-bold text-[#F0F0F2]">{title}</span>
              <IoCloseCircle
                className="text-[#3B3B3D] size-6"
                onClick={() => {
                  setDrawerVisible(false);
                }}
              />
            </DrawerTitle>
          </DrawerHeader>

          <div className="mb-6 mt-4 bg-[#444450] h-[1px] w-full"></div>

          {children}
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};
