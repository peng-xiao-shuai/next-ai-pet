import { Button } from '@/components/Button';
import Image from 'next/image';
import { useState } from 'react';
import { ClientFeedDrawer } from './ClientFeedDrawer';
import { ClientTaskDrawer } from './ClientTaskDrawer';
import { ClientFoodDrawer } from './ClientFoodDrawer';

export const ClientTaskAndShop = () => {
  const [feedDrawerVisible, setFeedDrawerVisible] = useState(false);
  const [foodDrawerVisible, setFoodDrawerVisible] = useState(false);
  const [taskDrawerVisible, setTaskDrawerVisible] = useState(false);

  return (
    <>
      <div className="absolute right-4 translate-y-2">
        <Image
          src="/icons/shop.png"
          alt="shop"
          width={62}
          height={62}
          className="mb-2"
          onClick={() => {
            setTaskDrawerVisible(true);
          }}
        ></Image>
        <Image
          src="/icons/task.png"
          alt="task"
          width={62}
          height={62}
          onClick={() => {
            setFoodDrawerVisible(true);
          }}
        ></Image>
      </div>

      <ClientFeedDrawer
        drawerVisible={feedDrawerVisible}
        setDrawerVisible={setFeedDrawerVisible}
      ></ClientFeedDrawer>

      <ClientFoodDrawer
        drawerVisible={foodDrawerVisible}
        setDrawerVisible={setFoodDrawerVisible}
      ></ClientFoodDrawer>
      {/* 
      <ClientTaskDrawer
        drawerVisible={taskDrawerVisible}
        setDrawerVisible={setTaskDrawerVisible}
      ></ClientTaskDrawer> */}
    </>
  );
};
