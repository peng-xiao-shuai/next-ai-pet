'use client';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Dispatch, FC, SetStateAction } from 'react';
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
