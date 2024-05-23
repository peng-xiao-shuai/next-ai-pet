import { checkEventCookie, setEventCookie } from '@/utils/GA-event';
import Cookies from 'js-cookie';
import { useTour } from '@reactour/tour';
import { useEffect } from 'react';
import { useUserStore } from './use-user';
import { STEP_SELECTOR, _Steps } from '@/utils/stpes';

export const useGuide = ({ list }: { list: any[] }) => {
  const { setIsOpen, setCurrentStep, steps, isOpen } = useTour();
  const { userState } = useUserStore();

  useEffect(() => {
    const specialEventTrigger = list![list!.length - 1]?.specialEventTrigger;
    /**
     * 这里要配置好顺序， 第一个是“操作按钮”，第二个是“喂狗粮”
     * 那么在 page.tsx 中 step 数组中的 selector 对应的值也应该是 “操作按钮”上的 类名或者id名称
     *
     * 第一个空对应 page step 中的第一个
     */
    const index = [
      'xxxxx',
      'HIGHLIGHT_ACTION_BTN',
      'HIGHLIGHT_FEED_FOOD',
      'HIGHLIGHT_SHARE',
    ].indexOf(specialEventTrigger);

    if (index > -1) {
      /**
       * 弹出过引导了不在弹出
       */
      if (
        localStorage.getItem('foodVisible') &&
        specialEventTrigger === 'HIGHLIGHT_FEED_FOOD'
      ) {
        return;
      }
      document.body.setAttribute('data-guide', specialEventTrigger);

      setCurrentStep(
        steps.findIndex((item) =>
          (item as _Steps).specialEventTrigger?.includes(specialEventTrigger)
        )
      );
      setIsOpen(true);

      if (specialEventTrigger === 'HIGHLIGHT_FEED_FOOD') {
        localStorage.setItem('foodVisible', 'true');
      }
    } else {
      /**
       * 判断新老用户
       */
      if (
        Math.abs(Number(new Date()) - Number(new Date(userState.createdTime))) /
          (1000 * 60 * 60 * 24) >
        1
      ) {
        if (!checkEventCookie('true', 'shareVisible')) {
          setCurrentStep(
            steps.findIndex((item) =>
              item.selector.toString().includes(STEP_SELECTOR.SHARE)
            )
          );
          document.body.setAttribute('data-guide', 'HIGHLIGHT_SHARE');
          setIsOpen(true);
          // 设置 cookie 以记录事件已被触发
          setEventCookie('true', 'shareVisible');
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, userState.createdTime]);

  /**
   * 若是老用户则功能上线后首次进来会弹出功能引导
   */
  useEffect(() => {
    if (
      Math.abs(Number(new Date()) - Number(new Date(userState.createdTime))) /
        (1000 * 60 * 60 * 24) >
        1 &&
      !localStorage.getItem('photoVisible')
    ) {
      setCurrentStep(
        steps.findIndex((item) =>
          item.selector.toString().includes(STEP_SELECTOR.PHOTO_ALBUM)
        )
      );
      document.body.setAttribute('data-guide', 'HIGHLIGHT_PHOTO_ALBUM');
      setIsOpen(true);
      localStorage.setItem('photoVisible', 'true');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.createdTime]);
};
