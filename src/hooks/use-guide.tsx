import { checkEventCookie, setEventCookie } from '@/utils/GA-event';
import Cookies from 'js-cookie';
import { useTour } from '@reactour/tour';
import { useEffect } from 'react';
import { useUserStore } from './use-user';
import { STEP_SELECTOR, _Steps } from '@/utils/stpes';

export const useGuide = ({ list }: { list: any[] }) => {
  const { setIsOpen, setCurrentStep, steps } = useTour();
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
      document.body.setAttribute('data-guide', specialEventTrigger);

      setCurrentStep(
        steps.findIndex((item) =>
          (item as _Steps).specialEventTrigger?.includes(specialEventTrigger)
        )
      );
      setIsOpen(true);
    } else {
      /**
       * 判断新老用户
       */
      if (
        Math.abs(Number(new Date()) - Number(new Date(userState.createTime))) /
          (1000 * 60 * 60 * 24) >
        1
      ) {
        if (!checkEventCookie('true', 'shareVisible')) {
          setCurrentStep(
            steps.findIndex((item) =>
              item.selector.toString().includes(STEP_SELECTOR.SHARE)
            )
          );
          setIsOpen(true);
          // 设置 cookie 以记录事件已被触发
          setEventCookie('true', 'shareVisible');
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);
};
