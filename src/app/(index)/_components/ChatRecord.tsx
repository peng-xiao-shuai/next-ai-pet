'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { FC, SyntheticEvent, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from '@/utils/debounce-throttle';
import { filterFormatDate, filterImage } from '@/utils/business';
import { ChatContext } from './Client';

type Record<T = any> = FC<
  {
    item: any;
  } & T
>;

const ClassName = {
  text__inner:
    'text__inner px-3 py-2 max-w-72 min-w-14 min-h-9 rounded-xl break-words whitespace-pre-wrap',
};

// 时间, 通知
export const SystemRecord: Record = ({ item }) => {
  return (
    <div
      className={cn(
        'item--info text-sm text-[#ebebf5] text-center mb-3 whitespace-pre-wrap',
        !!item.scene && item.type !== 'TIMESTAMP' ? 'scene' : ''
      )}
    >
      {item.message}
    </div>
  );
};

type TextRecord = {
  TextMe: Record;
  TextAI: FC<{
    item: any;
  }>;
};
// 文本类型记录
export const TextRecord: TextRecord = {
  // me
  TextMe: ({ item }) => {
    return (
      <div className="flex items-center relative" dir="ltr">
        <div
          className={cn(
            ClassName.text__inner,
            'text__inner bg-[#EFE0DD] text-[#1D1C21] pr-12',
            item.type === 'HOT_DATE' ? 'hot-date text-white' : '',
            item.type === 'ROLE_PLAY' ? 'role-play text-white' : ''
          )}
          style={{
            backgroundImage: (
              {
                HOT_DATE: 'linear-gradient(to right, #ff8f4f 0%, #ec52d4 100%)',
                ROLE_PLAY:
                  'linear-gradient(to right, #ff8f4f 0%, #ec52d4 100%)',
              } as Indexes
            )[item.type],
          }}
          dangerouslySetInnerHTML={{ __html: item.message }}
        />

        <div className="absolute text-xs right-2 bottom-2 text-[#9C9CA3]">
          {filterFormatDate(item.timestamp, 'hh:mm')}
        </div>
      </div>
    );
  },

  // AI
  TextAI: ({ item }) => {
    return (
      <div className="flex items-center relative" dir="ltr">
        <div
          className={cn(
            ClassName.text__inner,
            'text__inner relative bg-[#252033] max-w-64 pr-12',
            item.type === 'HOT_DATE' ? 'hot-date' : '',
            item.type === 'ROLE_PLAY' ? 'role-play' : ''
          )}
          dangerouslySetInnerHTML={{
            __html: item.message,
          }}
        />

        <div className="absolute text-xs right-2 bottom-2 text-[#9C9CA3]">
          {filterFormatDate(item.timestamp, 'hh:mm')}
        </div>
      </div>
    );
  },
};

export const ImageVideoRecorder: Record = ({ item }) => {
  const ctx = useContext(ChatContext);
  const router = useRouter();
  const onImgLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const index = ctx.list?.indexOf(item);
    item.loaded = true;
    ctx.setList?.((state) => {
      const CopyList = [...state];
      CopyList[index!].loaded = true;

      return CopyList;
    });
  };

  const openCreateVideo = (key?: string) => {
    // debounce(
    //   () => {
    //     if (item.type === 'VIDEO') {
    //       ctx.setVideoData?.({
    //         videoUrl: item.videoUrl,
    //         poster: item.coverUrl,
    //       });
    //       ctx.setVideoVisible?.(true);
    //     } else if (key !== 'undress') {
    //       const needUndress =
    //         item.resourceType === 'IMAGE_NORAL' && !item.isUnderwearUnlocked;
    //       if (needUndress) {
    //         ctx.state!.needUpdateImg = item;
    //       }
    //       let query = `friendId=${ctx.state!.friendId}&url=${
    //         item.imageUrl
    //       }&needUndress=${needUndress}&chatId=${item.id}`;
    //       if (ctx.detail?.name !== ctx.detail?.friendStyleName)
    //         query += `&name=${ctx.detail?.name}`;
    //       router.push(`/photo?${query}`);
    //     } else {
    //       ctx.state!.needUpdateImg = item;
    //     }
    //   },
    //   300,
    //   [key]
    // );
  };

  return (
    <div className="item__container--video relative">
      <div className="video-wrapper p-2 bg-[#252033] rounded-xl">
        {item.type === 'IMG' ? (
          <Image
            className="cover-img rounded-md"
            width={171}
            height={256}
            alt=""
            src={filterImage(item.imageUrl)}
            onLoad={(e) => onImgLoad(e)}
          />
        ) : (
          <Image
            className="cover-video rounded-md"
            width={171}
            height={171}
            src={filterImage(item.coverUrl)}
            onLoad={(e) => onImgLoad(e)}
            alt=""
          />
        )}

        <div
          className={cn('mask absolute left-0 top-0 size-full rounded-2xl')}
          onClick={() => {
            openCreateVideo();
          }}
        >
          {item.type !== 'IMG' && item.loaded && (
            <Image
              className="icon absolute top-2/4 left-16 -translate-y-2/4"
              width={40}
              height={40}
              alt=""
              src="/icons/play-white.png"
            ></Image>
          )}
        </div>
      </div>

      <div className="absolute text-xs right-2 bottom-3 text-white rounded-full px-[10px] bg-black/40 py-[2px]">
        {filterFormatDate(item.timestamp, 'hh:mm')}
      </div>
    </div>
  );
};

// 排队
export const AwaitRecord: FC = () => {
  return (
    <div className="item__container--text relative z-[1]">
      <div
        className={cn(
          'text__inner flex bg-[#252033] text-white items-center',
          ClassName.text__inner
        )}
      >
        <span className="loading loading-dots"></span>
      </div>
    </div>
  );
};

export const ClientChatRecord = () => {
  const {
    state,
    list,
    detail,
    queryingPast,
    scrollDom,
    setQueryingPast,
    getList,
    getPast,
    newestId,
  } = useContext(ChatContext);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (scrollTop === 0 && state?.listLoading) {
      getPast?.();
    }
    if (
      scrollTop + clientHeight >= scrollHeight - 1 &&
      scrollTop > state?.lastScrollTop!
    ) {
      debounce(() => {
        if (!queryingPast) return;
        setQueryingPast?.(false);
        getList?.();
      }, 100);
    }
    state!.lastScrollTop = scrollTop;
  };

  return (
    <div
      id="scroll-dom"
      ref={scrollDom}
      dir="ltr"
      className={cn('relative z-10 p-5 flex-1 overflow-y-auto chat-record')}
      onScroll={onScroll}
    >
      {list?.map((item) => (
        <div
          key={item.id}
          className={cn(
            'item--member flex',
            item.source !== 'AI' ? 'self flex-row-reverse' : 'ai',
            item.type === 'TIMESTAMP' ? '' : 'mb-6'
          )}
        >
          <div className="item__container relative text-[17px] leading-[22px] -tracking-[0.5px]">
            {/* <!-- 纯文本 --> */}
            {['TEXT', 'ACTION', 'REQUEST', 'HOT_DATE', 'ROLE_PLAY'].includes(
              item.type
            ) && (
              <div className="item__container--text relative z-[1] text-white">
                {['TEXT', 'HOT_DATE', 'ROLE_PLAY'].includes(item.type) &&
                item.source === 'AI' ? (
                  <TextRecord.TextAI item={item}></TextRecord.TextAI>
                ) : (
                  <TextRecord.TextMe item={item}></TextRecord.TextMe>
                )}
              </div>
            )}

            {/* 视频图片 */}
            {['VIDEO', 'IMG'].includes(item.type) && (
              <ImageVideoRecorder item={item}></ImageVideoRecorder>
            )}

            {/* 排队 */}
            {(item.type === 'ENTERING' || item.type === 'QUEUE_UP') && (
              <AwaitRecord></AwaitRecord>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
