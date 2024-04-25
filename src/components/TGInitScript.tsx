'use client';

import { useUserStore } from '@/hooks/use-user';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { toast } from 'sonner';

export const TGInitScript = () => {
  const router = useRouter();
  const setData = useUserStore.getState().setDataLocal;
  let initData = '';

  const TGWebAppReady = () => {
    const WebApp = window.Telegram.WebApp;
    const params: Indexes<string> = {};
    const paramsEach = WebApp.initDataUnsafe.start_param?.split('_');
    paramsEach?.forEach((item: string, index: number) => {
      if (index % 2 === 0) {
        params[item] = paramsEach[index + 1];
      }
    });

    if (params.url && params.uid && params.sn) {
      router.replace(`/${params.url}?uid=${params.uid}&sn=${params.sn}`);
    }

    /**
     * 存储邀请码
     */
    if (params.inviteCode) {
      window.localStorage.setItem('inviteCode', params.inviteCode);
    }

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
              body: JSON.stringify({ initData }),
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
        } catch (err: any) {
          toast(err.message);
          console.log(err);
        }
      };

      sendRequest();
    }
  };
  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onReady={TGWebAppReady}
      ></Script>
    </>
  );
};
