'use client';
import { useRef, useEffect, useContext } from 'react';
import WebSocket from '../app/(index)/wsRequest';
import { useBusWatch } from './use-bus-watch';
import Cookies from 'js-cookie';
import { useUserStore } from './use-user';
import { ChatContext } from '@/app/(index)/_components/Client';
import { VideoName } from '@/app/(index)/_components/ShowAnimation';

const _P = 'notification-';

export const usePublicSocket = (
  showAnimationFun: (source: VideoName.FEED | VideoName.FOOD) => void
) => {
  const PublicSocket = useRef(new WebSocket(_P));
  const { userState, setData } = useUserStore();

  useBusWatch(_P + 'onSocketMessage', (e) => {
    if (e.data === 'PONG') {
      return;
    }
    setData();

    const data = JSON.parse(e.data);

    if (data.type === 'RECHARGE_SUCCESS') {
      // 开启动画
      showAnimationFun?.(VideoName.FOOD);
    }
  });

  useEffect(() => {
    if (userState.id) {
      PublicSocket.current?.connect(
        'wss://doujiwrzdg1dh.cloudfront.net/restApi/ws/notification/' +
          userState.id
      );
    }
  }, [userState.id]);
  return PublicSocket;
};
