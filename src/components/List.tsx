import { Dispatch, FC, ReactNode, SetStateAction } from 'react';

export const Lists: FC<{
  className?: string;
  trigger: () => void;
  children: ReactNode;
  hasMore: boolean;
}> = ({ className, trigger, children, hasMore }) => {
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    if (scrollHeight - scrollTop === clientHeight && hasMore) {
      trigger();
    }
  };

  return (
    <div
      onScroll={handleScroll}
      className={`${className || ''} w-full h-full overflow-y-auto`}
    >
      {children}
    </div>
  );
};

export const LoadMore: FC<{
  martinTop?: string;
  /**
   * 是否还有更多
   */
  loaded: boolean;
  /**
   * 是否加载中
   */
  isLoading: boolean;
  /**
   * 加载中文字
   */
  loadingTips?: string;
  /**
   * 加载完成文字
   */
  loadedTips?: string;
  emit?: () => void;
}> = ({
  martinTop = '0px',
  loaded = false,
  isLoading = false,
  loadingTips = '',
  loadedTips = '',
  emit,
}) => {
  return (
    <div
      className="flex items-center justify-center py-4 text-sm text-center text-[#a19ea9]"
      onClick={() => {
        if (!loaded) emit?.();
      }}
      style={{ marginTop: martinTop }}
    >
      {loaded ? (
        <div className="flex items-center">
          <div
            className="mx-1 w-11 h-[1px]"
            style={{
              backgroundImage:
                'linear-gradient(to right,rgba(239, 239, 239, 0) 0%,#7b7788 49%,rgba(239, 239, 239, 0) 100%)',
            }}
          ></div>
          {loadedTips || 'All displayed'}
          <div
            className="mx-1 w-11 h-[1px]"
            style={{
              backgroundImage:
                'linear-gradient(to right,rgba(239, 239, 239, 0) 0%,#7b7788 49%,rgba(239, 239, 239, 0) 100%)',
            }}
          ></div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center gap-2">
          <span className="loading loading-spinner size-4 mr"></span>
          <span>{'Loading'}</span>
        </div>
      ) : (
        <span>{loadingTips || 'Load more'}</span>
      )}
    </div>
  );
};
