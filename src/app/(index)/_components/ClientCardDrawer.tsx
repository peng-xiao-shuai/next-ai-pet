'use client';
import { Button } from '@/components/Button';
import Image from 'next/image';
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import { ClientChatDrawer } from './ClientChatDrawer';
// import { useUserStore } from '@/hooks/use-user';
import { fetchRequest } from '@/utils/request';
import { ChatContext } from './Client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { LOCALE_KEYS } from '@@/locales';
// import { useTranslation } from '@/hooks/useTranslation';
// import { CustomEvents, handleTriggerEvent } from '@/utils/GA-event';
// import emitter from '@/utils/bus';

export const ClientCardDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ drawerVisible, setDrawerVisible }) => {
  return (
    <ClientChatDrawer
      drawerVisible={drawerVisible}
      title={'图集'}
      setDrawerVisible={setDrawerVisible}
    >
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </ClientChatDrawer>
  );
};
