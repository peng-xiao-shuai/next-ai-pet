'use client';
import { filterImage } from '@/utils/business';
import Image from 'next/image';
import {
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  MutableRefObject,
} from 'react';
import { ClientTips } from './ClientTips';
import { fetchRequest } from '@/utils/request';
import { ChatContext } from './Client';
import AppConfigEnv from '@/utils/get-config';
import { CenterPopup } from '@/components/CenterPopup';
import { cn } from '@/lib/utils';
import { ClientFeedDrawer } from './ClientFeedDrawer';
import { ClientFoodDrawer } from './ClientFoodDrawer';
import { ClientTaskDrawer } from './ClientTaskDrawer';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { useShare } from '@/hooks/use-share';
import { LOCALE_KEYS } from '@@/locales';
import { useTranslation } from '@/hooks/useTranslation';
import { CustomEvents, handleTriggerEvent } from '@/utils/GA-event';
import { useTour } from '@reactour/tour';
import { STEP_SELECTOR } from '@/utils/stpes';
import { m, AnimatePresence } from 'framer-motion';

export const ClientSendMsg: FC<{
  sendMsg: (val: string) => void;
  _P: string;
  detailCurrent: MutableRefObject<Indexes<any>>;
}> = ({ sendMsg, _P, detailCurrent }) => {
  const { t } = useTranslation();
  const { setIsOpen, setCurrentStep, steps } = useTour();
  const { detail, setDetail, list, readyState, scrollDom } =
    useContext(ChatContext);
  const [message, setMessage] = useState('');
  const InputRef = useRef<any>(null);
  const { handleShare } = useShare();
  const isDefineName = useMemo(
    () =>
      list![list!.length - 1]?.specialEventTrigger ===
      'REQUIRE_MODIFY_FRIEND_NAME',
    [list]
  );
  const handleSend = () => {
    if (detail.isInitialized) {
      detailCurrent.current.isInitialized = false;
      setDetail?.((state) => ({
        ...state,
        isInitialized: false,
      }));
      setMessage('');
    }

    sendMsg(message);
  };

  const sendMsgSuc = (type?: unknown) => {
    /**
     * 定义宠物名称
     */
    if (type === 'defineName') {
      setDetail?.((state) => ({
        ...state,
        name: message.trim(),
      }));
    }

    /**
     * 新用户引导分享
     */
    if (
      !localStorage.getItem('newShareVisible') &&
      localStorage.getItem('foodVisible')
    ) {
      setCurrentStep(
        steps.findIndex((item) =>
          item.selector.toString().includes(STEP_SELECTOR.SHARE)
        )
      );
      document.body.setAttribute('data-guide', 'HIGHLIGHT_SHARE');
      setIsOpen(true);
      localStorage.setItem('newShareVisible', 'true');

      /**
       * 集卡引导
       */
      if (!localStorage.getItem('photoVisible')) {
        setTimeout(() => {
          setCurrentStep(
            steps.findIndex((item) =>
              item.selector.toString().includes(STEP_SELECTOR.PHOTO_ALBUM)
            )
          );
          document.body.setAttribute('data-guide', 'HIGHLIGHT_PHOTO_ALBUM');
          setIsOpen(true);
          localStorage.setItem('photoVisible', 'true');
        }, 3000);
      }
    }

    setMessage('');
  };

  useBusWatch(_P + 'sendMsgSuc', sendMsgSuc);

  /**
   * 开屏结束后
   */
  useBusWatch('IntroductionAnimation', () => {
    setCurrentStep(0);
    setIsOpen(true);
    document.body.setAttribute('data-guide', 'SEND_MESSAGE');
  });

  useEffect(() => {
    if (detail.isInitialized) {
      setMessage('Hi,my good pet');
    }
  }, [detail.isInitialized]);

  return (
    <div className="relative z-40 py-3" id={STEP_SELECTOR.INPUT}>
      {/* <ClientTools></ClientTools> */}

      <div className="input-container relative text-white mx-3 h-12 bg-white/55 border border-white rounded-xl flex items-center">
        <div className="btn-wrapper absolute top-2/4 -translate-y-2/4 left-3 rtl:left-[unset] rtl:right-3">
          <Image
            src="/icons/share-gold.png"
            width={28}
            height={28}
            alt="share gold"
            onClick={handleShare}
          ></Image>
        </div>

        <input
          value={message}
          ref={InputRef}
          cursor-spacing={20}
          className={`send-input block bg-transparent text-[#222222] placeholder:text-black/50 textarea-dom pr-[72px] pl-12 w-full rounded-xl !outline-none leading-[theme(height.12)] rtl:pr-12 rtl:pl-[72px]`}
          placeholder={
            isDefineName
              ? `${t(LOCALE_KEYS.PLEASE_DIRECTLY_TYPE_THE_NAME_OF_YOUR_PET)}`
              : `${t(LOCALE_KEYS.MESSAGE)}`
          }
          maxLength={isDefineName ? 20 : 200}
          onFocus={() => {}}
          onChange={({ target }) => {
            setMessage(target.value);
          }}
          onBlur={({ target }) => {
            /**
             * FIX Ios 软键盘消失页面不会掉下来
             */
            if (/iPad|iPhone|iPod/gi.test(window.navigator.userAgent)) {
              window.scrollTo(0, 0);
            }
            //   window.scrollTo(0, 100);
            // }
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <div className="btn-wrapper absolute top-2/4 -translate-y-2/4 right-4 rtl:right-[unset] rtl:left-4">
          {readyState === 1 ? (
            <m.div
              initial={{ scale: 1 }}
              animate={{
                scale: detail.isInitialized ? 0.8 : 1,
              }}
              transition={{
                repeatType: 'reverse',
                duration: 1,
                repeat: Infinity,
              }}
            >
              <Image
                onClick={() => {
                  handleSend();
                }}
                width={30}
                height={30}
                className="send-icon"
                alt="send"
                src="/icons/send.png"
              ></Image>
            </m.div>
          ) : (
            <div className="size-[30px] bg-[#c19140] flex items-center justify-center rounded-full overflow-hidden">
              <span className="loading loading-spinner"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
