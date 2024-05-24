import { Button } from '@/components/Button';
import Image from 'next/image';
import { FC, useState } from 'react';
import { ClientFeedDrawer } from './ClientFeedDrawer';
import { ClientTaskDrawer } from './ClientTaskDrawer';
import { ClientFoodDrawer } from './ClientFoodDrawer';
import { useBusWatch } from '@/hooks/use-bus-watch';

export const ClientTaskAndShop: FC<{
  className?: string;
}> = ({ className }) => {
  const [foodDrawerVisible, setFoodDrawerVisible] = useState(false);
  const [taskDrawerVisible, setTaskDrawerVisible] = useState(false);
  useBusWatch('setFoodDrawerVisible', (bol: boolean) => {
    setFoodDrawerVisible(bol);
  });
  useBusWatch('setTaskDrawerVisible', (bol: boolean) => {
    setTaskDrawerVisible(bol);
  });

  return (
    <>
      <div
        className={`absolute right-4 translate-y-2 transition-all ${className}`}
      >
        <Image
          src="/icons/shop.png"
          alt="shop"
          width={62}
          height={62}
          className="mb-2"
          onClick={() => {
            setFoodDrawerVisible(true);
          }}
        ></Image>
        <Image
          src="/icons/task.png"
          alt="task"
          width={62}
          height={62}
          onClick={() => {
            setTaskDrawerVisible(true);
          }}
        ></Image>
      </div>

      <ClientFoodDrawer
        drawerVisible={foodDrawerVisible}
        setDrawerVisible={setFoodDrawerVisible}
      ></ClientFoodDrawer>

      <ClientTaskDrawer
        drawerVisible={taskDrawerVisible}
        setDrawerVisible={setTaskDrawerVisible}
      ></ClientTaskDrawer>
    </>
  );
};
