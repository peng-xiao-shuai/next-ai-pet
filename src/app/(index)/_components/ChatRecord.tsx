'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  FC,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from '@/utils/debounce-throttle';
import { filterFormatDate, filterImage } from '@/utils/business';
import { ChatContext } from './Client';
import { m } from 'framer-motion';
import { toast } from 'sonner';
import emitter from '@/utils/bus';
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6';

type Record<T = any> = FC<
  {
    item: any;
  } & T
>;

const ClassName = {
  text__inner:
    'text__inner px-3 py-2 max-w-80 min-w-14 min-h-9 rounded-xl break-words whitespace-pre-wrap',
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
      <div className="flex items-center relative gap-2" dir="ltr">
        {Boolean(item.friendPointChange) && (
          <m.div
            className="flex items-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{ type: 'spring', delay: 0.3, duration: 0.5 }}
          >
            <Image
              src="/icons/gold-coin.png"
              alt="add Gold coin"
              width={16}
              height={16}
              className="mx-[2px]"
            ></Image>
            <div
              className={`text-[#f5b53b] break-words max-w-24 leading-none ${
                item.friendPointChange > 100000000
                  ? 'text-[9px] mr-3'
                  : 'text-sm'
              }`}
            >
              +{item.friendPointChange}
            </div>
          </m.div>
        )}

        <div
          className={cn(
            ClassName.text__inner,
            'text__inner bg-[rgba(188,117,0,0.72)] text-white pr-12',
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

        <div className="absolute text-xs right-2 bottom-2 text-white regular">
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
            'text__inner relative bg-[rgba(37,32,51,0.56)] pr-12',
            item.type === 'HOT_DATE' ? 'hot-date' : '',
            item.type === 'ROLE_PLAY' ? 'role-play' : ''
          )}
          dangerouslySetInnerHTML={{
            __html: item.message,
          }}
        />

        <div className="absolute text-xs right-2 bottom-2 text-white regular">
          {filterFormatDate(item.timestamp, 'hh:mm')}
        </div>
      </div>
    );
  },
};

// 音频
export const AudioRecord: Record<{}> = ({ item }) => {
  const { state, setList } = useContext(ChatContext);
  const filterDuration = (num: number) => {
    if (!num) return '0:00';
    const h = parseInt(String(num / 60), 10);
    const s = `${Math.round(num % 60)}`.padStart(2, '0');
    return `${h}:${s}`;
  };

  const playVoice = () => {
    debounce(() => {
      const { id, playing, voiceUrl } = item;
      if (!voiceUrl) {
        toast('Play failure');
        return;
      }

      if (state?.currentAudioItem?.id !== id) {
        destroyAudio();
        state!.currentAudioItem = item;
        // setLoading?.(true);
        // emitter.emit('setGlobalLoading', true);

        state!.audioContext!.src = voiceUrl;
        state!.audioContext!.load();
      }
      if (playing) {
        state!.audioContext!.pause();
        // setTimeout(() => {
        //   state!.audioContext!.playing = false;
        // }, 50);
        // setLoading?.(false);
        // emitter.emit('setGlobalLoading', false);
      } else if (state?.audioContext?.readyState >= 3) {
        state?.audioContext?.play();
      } else {
        state?.audioContext?.addEventListener(
          'canplay',
          () => {
            // setLoading?.(false);
            // emitter.emit('setGlobalLoading', false);
            state?.audioContext?.play();
          },
          { once: true }
        );
      }

      setList?.((l) => {
        const CopyList = [...l];
        const index = l.findIndex((i) => i.id === state!.currentAudioItem.id);
        if (index >= 0) {
          CopyList[index] = state!.currentAudioItem;
        }

        return CopyList;
      });
    });
  };

  const destroyAudio = (type: string | Event = '') => {
    // setLoading(false);
    (state!.currentAudioItem as Indexes).playing = false;
    (state!.currentAudioItem as Indexes).voiveProgress = 0;
    state!.currentAudioItem = {};
    if (state!.audioContext && type === 'clear') {
      state!.audioContext.pause();
      state!.audioContext.removeEventListener('error', onAudioError);
      state!.audioContext.removeEventListener('ended', destroyAudio);
      state!.audioContext.removeEventListener('timeupdate', onAudioUpdate);
    }
  };

  const onAudioUpdate = () => {
    // setLoading(false);
    (state!.currentAudioItem as Indexes).playing =
      !state!.audioContext?.paused &&
      !state!.audioContext?.ended &&
      state!.audioContext?.readyState &&
      state!.audioContext?.readyState > 2;
    const total = (state!.currentAudioItem as Indexes).voiceDuration;
    const now = state!.audioContext?.currentTime!;
    const progress = Math.ceil((now / total) * 9);
    (state!.currentAudioItem as Indexes).voiveProgress = progress;

    setList?.((l) => {
      const CopyList = [...l];
      const index = l.findIndex((i) => i.id === state!.currentAudioItem.id);

      if (index >= 0) {
        CopyList[index] = state!.currentAudioItem;
      }

      return CopyList;
    });
  };

  const onAudioError = () => {
    destroyAudio();
    toast.warning('LoadFail');
  };

  useEffect(() => {
    if (!state?.audioContext) {
      console.log(state!.audioContext);

      state!.audioContext = new Audio();

      state!.audioContext.addEventListener('error', onAudioError);
      state!.audioContext.addEventListener('ended', destroyAudio);
      state!.audioContext.addEventListener('timeupdate', onAudioUpdate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center relative" dir="ltr">
      <div
        className={cn(
          'item__container--voice bg-[rgba(37,32,51,0.56)] text-white pr-12 flex items-center max-w-60 h-14 rounded-2xl'
        )}
        onClick={() => {
          playVoice();
        }}
      >
        <div className="icons ml-3 relative w-7 h-7">
          <FaCirclePause
            className={cn(
              'absolute transition-all left-0 top-0 w-full h-full text-[rgba(188,117,0,0.72)]',
              item.playing ? 'z-10 opacity-100' : 'z-0 opacity-0'
            )}
          />

          <FaCirclePlay
            className={cn(
              'absolute transition-all left-0 top-0 w-full h-full',
              !item.playing ? 'z-10 opacity-100' : 'z-0 opacity-0'
            )}
          />
        </div>
        <div className="progress flex items-center my-0 mx-2">
          {new Array(9).fill(1).map((each, index) => (
            <div
              className={cn(
                'progress__line h-4 w-[3px] mr-1 rounded transition-all',
                'first-of-type:h-2 [&:nth-of-type(9)]:h-2 [&:nth-of-type(5)]:h-2 [&:nth-of-type(3)]:h-[26px] [&:nth-of-type(7)]:h-[26px]'
              )}
              style={{
                background:
                  Number(item.voiveProgress) > index
                    ? 'rgba(188,117,0,0.72)'
                    : 'white',
              }}
              key={index}
            ></div>
          ))}
        </div>
        <div className="time">{filterDuration(item.voiceDuration)}</div>
      </div>
      <div className="absolute text-xs right-2 bottom-2 text-white regular">
        {filterFormatDate(item.timestamp, 'hh:mm')}
      </div>
    </div>
  );
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
      <div
        className={`video-wrapper p-2 ${
          item.imageUrl.includes('gif') ? '' : 'bg-[rgba(37,32,51,0.56)]'
        } rounded-xl`}
      >
        {item.type === 'IMG' ? (
          <Image
            className="cover-img rounded-md"
            width={171}
            height={171}
            alt=""
            src={filterImage(item.imageUrl)}
            onLoad={(e) => onImgLoad(e)}
            unoptimized
          />
        ) : (
          <Image
            className="cover-video rounded-md"
            width={171}
            height={171}
            src={filterImage(item.coverUrl)}
            onLoad={(e) => onImgLoad(e)}
            alt=""
            unoptimized
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

      <div className="absolute text-xs right-2 bottom-3 text-white rounded-full px-[10px] bg-[rgba(37,32,51,0.56)] py-[2px]">
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
          'text__inner flex bg-[rgba(37,32,51,0.56)] text-white items-center',
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
    queryingPast,
    scrollDom,
    setQueryingPast,
    getList,
    getPast,
  } = useContext(ChatContext);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop === 0 && !state!.listLoading) {
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
      className={cn(
        `relative w-[95vw] z-10 p-2 pb-0 flex-1 overflow-y-auto mx-auto chat-record`
      )}
      onScroll={onScroll}
      style={{
        maskImage: 'linear-gradient(transparent, #000 20%)',
        WebkitMaskImage: 'linear-gradient(transparent, #000 20%)',
      }}
    >
      {list?.map((item) => (
        <div
          key={item.id}
          className={cn(
            'item--member flex',
            item.source !== 'AI' ? 'self flex-row-reverse' : 'ai',
            item.type === 'TIMESTAMP' ? '' : 'mt-6',
            item.visible === false ? 'opacity-0' : 'opacity-100'
          )}
        >
          <div className="item__container relative text-[17px] leading-[22px] -tracking-[0.5px]">
            {/* <!-- 纯文本 --> */}
            {['TEXT', 'ACTION', 'REQUEST', 'HOT_DATE', 'ROLE_PLAY'].includes(
              item.type
            ) && (
              <div className="item__container--text relative z-[1] text-white pointer-events-none">
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

            {/* 语音 */}
            {item.type === 'VOICE' && <AudioRecord item={item}></AudioRecord>}

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
