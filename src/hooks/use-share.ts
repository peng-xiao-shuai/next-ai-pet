import { fetchRequest } from '@/utils/request';
import { base64UrlEncode, copyText } from '@/utils/string-transform';
import { toast } from 'sonner';
import { useUserStore } from './use-user';
import { urlencoded } from 'express';
import AppConfigEnv from '@/utils/get-config';

export const useShare = () => {
  const { userState } = useUserStore();
  const handleShare = () => {
    const str = JSON.stringify({
      id: userState.googleOpenid,
    });
    // fetchRequest(
    //   '/telegram/sendMessage/' +
    //     window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
    //   {
    //     message: `点击当前连接转发 tg://msg_url?url=t.me/pxs_test_bot/test?startapp=${base64UrlEncode(
    //       str
    //     )}&text=快来和我一起领养AI宠物吧！`,
    //   }
    // );

    // copyText(
    //   `t.me/pxs_test_bot/test?startapp=${base64UrlEncode(str)}`,
    //   () => {
    //     toast('复制链接成功，也可以在机器人聊天中点击链接分享');
    //   },
    //   false
    // );
    window.Telegram.WebApp.openTelegramLink(
      encodeURI(`https://t.me/share/url?url=t.me/${AppConfigEnv.TG_BOT_NAME}/${AppConfigEnv.TG_APP_NAME}?startapp=${base64UrlEncode(
        str
      )}&text=💰🪙+1,000 $PET as a first-time gift
⭐️+2,000 $PET if you have Telegram Premium`)
    );
  };

  return {
    handleShare,
  };
};
