'use client';

import { useUserStore } from '@/hooks/use-user';
import { decodeFromBase64Url } from '@/utils/string-transform';
import Cookies from 'js-cookie';
import Script from 'next/script';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { createDebounce } from '@/utils/debounce-throttle';
import VC from 'vconsole';
import { CustomEvents, handleTriggerEvent } from '@/utils/GA-event';

export const TGInitScript = () => {
  const setDataLocal = useUserStore.getState().setDataLocal;
  const setData = useUserStore.getState().setData;
  const [debounce, clearFun] = createDebounce();
  const [debounce2, clearFun2] = createDebounce();
  let initData = '';

  const TGWebAppReady = () => {
    const WebApp = window.Telegram.WebApp;
    WebApp.expand();
    WebApp.enableClosingConfirmation()

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
                timezone: Math.round(-new Date().getTimezoneOffset() / 60),
                languageCode:
                  'en' ||
                  Cookies.get('locale') ||
                  WebApp.initDataUnsafe.user.language_code,
                is_premium: WebApp.initDataUnsafe.user.is_premium || false,
              }),
            })
          ).json();

          if (code != '200') {
            throw new Error(message);
          }

          if (result.isJoinChannel == 1) {
            handleTriggerEvent([
              {
                eventAction: CustomEvents.NUMBER_OF_FOLLOWERS,
                eventValue: params.id,
                isSetCookie: true,
              },
            ]);
          }
          if (result.isJoinChannel == 1) {
            handleTriggerEvent([
              {
                eventAction: CustomEvents.NUMBER_OF_PEOPLE_COMPLETING_THE_GROUP,
                eventValue: params.id,
                isSetCookie: true,
              },
            ]);
          }

          if (params.id && result.isRegister == 1) {
            handleTriggerEvent([
              {
                eventAction:
                  CustomEvents.NUMBER_OF_FRIENDS_SUCCESSFULLY_INVITED,
                eventValue: params.id,
                isSetCookie: true,
              },
              {
                eventAction: CustomEvents.FISSION_NEW_USERS,
              },
            ]);
          }

          const { token, isRegister, memberDetail = {} } = result;
          Cookies.set('token', token, { expires: 365 * 20 });
          Cookies.set('isPet', memberDetail.currentFriendCount, {
            expires: 365 * 20,
          });

          if (isRegister && typeof fbq != 'undefined')
            fbq('track', 'CompleteRegistration');
          setDataLocal(memberDetail);
          WebApp.ready();
        } catch (err: any) {
          toast(err.message);
          console.log(err);
        }
      };

      sendRequest();
    } else if (process.env.NODE_ENV === 'development') {
      Cookies.set(
        'token',
        'eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiJuaHJrbWEiLCJzdWIiOiIxNzk0MjczMDc0MzAwNDA3ODEwIiwiZXhwIjoxNzE5MDQzMzU3LCJpYXQiOjE3MTY2MjQxNTd9.t1YmTt-QAjUTE67CqCYz047AH2qUwORpBrt6hUIeeF3Dq5eEWCyoPDQ6f7cAl1pdA1Mt5Xa4LC3BUgortL3RaQ'
      );
      Cookies.set('isPet', '1');
      setData();
    }
  };

  useEffect(() => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.body.classList.add('ios', 'group');
    }

    // let Log: VC;

    // if (
    //   process.env.NODE_ENV === 'development' &&
    //   typeof window != 'undefined'
    // ) {
    //   Log = new VC();
    // }

    // return () => {
    //   Log?.destroy();
    // };
    // /**
    //  * 更改 overflow 需要更改 globals.css body[data-scroll-locked] 样式
    //  */
    // let overflow = 100;
    // document.body.style.background = 'black';
    // document.body.style.overflowY = 'hidden';
    // document.body.style.width = `100vw`;
    // document.body.style.height = window.innerHeight + overflow + 'px';
    // document.body.style.paddingBottom = `${overflow}px`;
    // document.body.style.marginTop = `${overflow}px`;

    // if (/iphone/gi.test(window.navigator.userAgent)) {
    //   document.body.style.position = `fixed`;
    //   document.body.style.left = `${0}px`;
    //   document.body.style.top = `${-overflow}px`;
    //   // document.body.style.bottom = `${-overflow}px`;
    //   window.scrollTo(0, 0);
    // } else {
    //   window.scrollTo(0, overflow);
    // }
    //   document.body.addEventListener('touchstart', () => {
    //     debounce(() => {
    //       let overflow = 100;
    //       document.body.style.background = 'black';
    //       document.body.style.overflowY = 'hidden';
    //       document.body.style.width = `100vw`;
    //       document.body.style.height = window.innerHeight + overflow + 'px';
    //       document.body.style.paddingBottom = `${overflow}px`;
    //       document.body.style.marginTop = `${overflow}px`;

    //       if (/iphone/gi.test(window.navigator.userAgent)) {
    //         document.body.style.position = `fixed`;
    //         document.body.style.left = `${0}px`;
    //         document.body.style.top = `${-overflow}px`;
    //         // document.body.style.bottom = `${-overflow}px`;
    //         window.scrollTo(0, 0);
    //       } else {
    //         window.scrollTo(0, overflow);
    //       }
    //     })
    //   })

    //   const close = () => {
    //     console.log('结束');

    //     let overflow = 100;
    //     document.body.style.background = 'black';
    //     document.body.style.overflowY = 'auto';
    //     document.body.style.width = `100vw`;
    //     document.body.style.height = window.innerHeight + 'px';
    //     document.body.style.paddingBottom = `${0}px`;
    //     document.body.style.marginTop = `${0}px`;

    //     if (/iphone/gi.test(window.navigator.userAgent)) {
    //       document.body.style.position = `relative`;
    //       document.body.style.left = `${0}px`;
    //       document.body.style.top = `${0}px`;
    //       // document.body.style.bottom = `${-overflow}px`;
    //     }
    //     window.scrollTo(0, 0);

    //     clearFun()
    // }

    //   document.body.addEventListener('touchcancel', close)
    //   document.body.addEventListener('touchend', close)
  }, []);
  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        onReady={TGWebAppReady}
      ></Script>

      <Script
        defer
        data-domain="aipets.io"
        src="https://log.href.style/js/script.js"
      ></Script>

      <Script
        defer
        data-domain="tgaipet.com"
        src="https://plausible.io/js/script.js"
      ></Script>
    </>
  );
};
