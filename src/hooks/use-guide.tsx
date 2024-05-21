import { useTour } from '@reactour/tour';
import { useEffect } from 'react';

export const useGuide = ({ list }: { list: any[] }) => {
  const { setIsOpen, setCurrentStep, currentStep } = useTour();

  useEffect(() => {
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
    ].indexOf(list![list!.length - 1]?.specialEventTrigger);

    if (index > -1) {
      document.body.setAttribute(
        'data-guide',
        list![list!.length - 1]?.specialEventTrigger
      );
      setCurrentStep(index);
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);
};
