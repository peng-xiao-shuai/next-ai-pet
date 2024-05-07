'use client';

import { useUserStore } from '@/hooks/use-user';
import { decodeFromBase64Url } from '@/utils/string-transform';
import Cookies from 'js-cookie';
import Script from 'next/script';
import { toast } from 'sonner';
import { useEffect } from 'react';

export const TGInitScript = () => {
  const setData = useUserStore.getState().setDataLocal;
  let initData = '';

  const TGWebAppReady = () => {
    const WebApp = window.Telegram.WebApp;
    WebApp.expand();
    const params: Indexes<string> = JSON.parse(
      WebApp.initDataUnsafe.start_param
        ? decodeFromBase64Url(WebApp.initDataUnsafe.start_param)
        : '{}'
    );

    /**
     * 静默登录
     */
    if (WebApp.initDataUnsafe.user) {
      console.log(WebApp.initDataUnsafe);

      initData = `query_id=${
        WebApp.initDataUnsafe.query_id
      }&user=${encodeURIComponent(
        JSON.stringify(WebApp.initDataUnsafe.user)
      )}&auth_date=${WebApp.initDataUnsafe.auth_date}&hash=${
        WebApp.initDataUnsafe.hash
      }`;

      const sendRequest = async () => {
        try {
          const { result, code, message } = await (
            await fetch('/api/tg-login', {
              method: 'POST',
              body: JSON.stringify({
                initData,
                sourceId: params.id,
                is_premium: WebApp.initDataUnsafe.user.is_premium || false,
              }),
            })
          ).json();

          if (code != '200') {
            throw new Error(message);
          }

          const { token, isRegister, memberDetail = {} } = result;
          Cookies.set('token', token, { expires: 365 * 20 });
          Cookies.set('isPet', memberDetail.currentFriendCount, {
            expires: 365 * 20,
          });

          if (isRegister && typeof fbq != 'undefined')
            fbq('track', 'CompleteRegistration');
          setData(memberDetail);
          window.scrollTo(0, 100);
          WebApp.ready();
        } catch (err: any) {
          toast(err.message);
          console.log(err);
        }
      };

      sendRequest();
    }
  };

  useEffect(() => {
    let overflow = 100;
    document.documentElement.style.background = 'black';
    document.body.style.overflowY = 'hidden';
    document.body.style.position = `fixed`;
    document.body.style.width = `100vw`;
    document.body.style.left = `${0}px`;
    document.body.style.top = `${-overflow}px`;
    document.body.style.height = window.innerHeight + overflow + 'px';
    document.body.style.paddingBottom = `${overflow}px`;
    document.body.style.marginTop = `${overflow}px`;
    window.scrollTo(0, overflow);
  }, []);
  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onReady={TGWebAppReady}
      ></Script>
    </>
  );
};
