import { useEffect } from 'react';
import bus from '@/utils/bus';
import { Handler } from 'mitt';
export const useBusWatch = <T = any>(
  _type: string,
  _handler: Handler<T>,
  beforeUnload: () => void = () => {}
) => {
  useEffect(() => {
    // 启用监听、
    // @ts-ignore
    bus.on(_type, _handler);

    // 在组件卸载之前移除监听
    return () => {
      beforeUnload();

      // @ts-ignore
      bus.off(_type, _handler);
    };
  }, [_type, _handler, beforeUnload]);
};
