'use client';
import { useRef, useEffect } from 'react';
import WebSocket from '../app/(index)/wsRequest';
import { useBusWatch } from './use-bus-watch';
import Cookies from 'js-cookie';
import { useUserStore } from './use-user';

const _P = 'notification-';

export const usePublicSocket = () => {
  const PublicSocket = useRef(new WebSocket(_P));
  const { userState, setData } = useUserStore();

  useBusWatch(_P + 'onSocketMessage', (e) => {
    if (e.data === 'PONG') return;
    setData();
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
