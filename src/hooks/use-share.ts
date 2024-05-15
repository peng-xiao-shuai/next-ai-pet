import { base64UrlEncode, copyText } from '@/utils/string-transform';
import { useUserStore } from './use-user';
import AppConfigEnv from '@/utils/get-config';
import { CustomEvents, handleTriggerEvent } from '@/utils/GA-event';

export const useShare = () => {
  const { userState } = useUserStore();
  const handleShare = () => {
    const str = JSON.stringify({
      id: userState.googleOpenid,
    });

    handleTriggerEvent([
      {
        eventAction: CustomEvents.CLICK_TO_INVITE_THE_NUMBER_OF_FRIENDS,
        isSetCookie: true,
      },
      {
        eventAction:
          CustomEvents.THE_NUMBER_OF_TIMES_YOU_CLICK_TO_INVITE_FRIENDS,
      },
    ]);

    window.Telegram.WebApp.openTelegramLink(
      encodeURI(`https://t.me/share/url?url=t.me/${AppConfigEnv.TG_BOT_NAME}/${
        AppConfigEnv.TG_APP_NAME
      }?startapp=${base64UrlEncode(
        str
      )}&text=💰🪙+1,000 $AIPET as a first-time gift
⭐️+2,000 $AIPET if you have Telegram Premium`)
    );
  };

  return {
    handleShare,
  };
};
