import AppConfigEnv from '@/utils/get-config';
import { fetchRequest } from '@/utils/request';
import NextImage, { StaticImageData } from 'next/image';
import {
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChatContext } from './Client';
import { LOCALE_KEYS } from '@@/locales';
import { filterImage } from '@/utils/business';
import { CustomEvents, handleTriggerEvent } from '@/utils/GA-event';
import { VideoName } from './ShowAnimation';
import { ClientFeedDrawer } from './ClientFeedDrawer';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { STEP_SELECTOR } from '@/utils/stpes';
import withDragDetection from '@/components/mouse-hoc';
import leisure from '@@/images/leisure.gif';

const Gifs: Record<
  Exclude<VideoName, VideoName.NONE>,
  {
    src: string;
    name: string;
    data: (() => void) | StaticImageData;
  }
> = {
  [VideoName.LEISURE]: {
    src: 'leisure',
    name: 'Leisure',
    data: leisure,
  },
  [VideoName.HUG]: {
    src: 'hug',
    name: 'Hug',
    data: function () {
      import('@@/images/hug.gif').then((res) => {
        this.data = res.default;
      });
    },
  },
  [VideoName.KISS]: {
    src: 'kiss',
    name: 'Kiss',
    data: function () {
      import('@@/images/kiss.gif').then((res) => {
        this.data = res.default;
      });
    },
  },
  [VideoName.TOUCH]: {
    src: 'touch',
    name: 'Touch',
    data: function () {
      import('@@/images/touch.gif').then((res) => {
        this.data = res.default;
      });
    },
  },
};

type Tools = {
  url: string;
  name: 'Kiss on' | 'Touch' | 'Hug';
} & Indexes<string>;

export const ClientDog: FC<{
  bgImgHeight: number;
  className?: string;
  name: Exclude<VideoName, VideoName.NONE>;
  onEnd: () => void;
}> = ({ bgImgHeight, name, onEnd, className }) => {
  const [gif, setGif] = useState<Exclude<VideoName, VideoName.NONE>>(
    VideoName.LEISURE
  );
  const top = useMemo(() => bgImgHeight, [bgImgHeight]);
  const [feedDrawerVisible, setFeedDrawerVisible] = useState(false);
  const [targetActive, setTargetActive] = useState<Tools['name'] | ''>('');
  const [foodPng, setFoodPng] = useState('/icons/empty-dog-bowl.png');
  const timeCount = useRef(30);

  useBusWatch('foodStatus', () => {
    setFoodPng('/icons/dog-bowl.png');
    timeCount.current = 30;

    const timer = setInterval(() => {
      timeCount.current -= 1;
      localStorage.setItem('foodTimeCount', String(timeCount.current));

      if (timeCount.current <= 0) {
        setFoodPng('/icons/empty-dog-bowl.png');
        clearInterval(timer);
      }
    }, 1000);
  });

  useEffect(() => {
    if (![VideoName.NONE].includes(name)) {
      setGif(name);
      // setVisible(true);

      const timer = setTimeout(
        () => {
          setGif(VideoName.LEISURE);
          onEnd();
          setTargetActive('');
          clearTimeout(timer);
        },
        name === VideoName.KISS ? 3800 : name === VideoName.TOUCH ? 2700 : 2500
      );
    }
  }, [name, onEnd]);

  useEffect(() => {
    timeCount.current = Number(localStorage.getItem('foodTimeCount') || '0');

    let timer: NodeJS.Timeout;
    if (timeCount.current > 0) {
      setFoodPng('/icons/dog-bowl.png');
      timer = setInterval(() => {
        timeCount.current -= 1;
        localStorage.setItem('foodTimeCount', String(timeCount.current));

        if (timeCount.current <= 0) {
          setFoodPng('/icons/empty-dog-bowl.png');
          clearInterval(timer);
        }
      }, 1000);
    }

    Object.keys(Gifs).forEach((key) => {
      const _key = key as Exclude<VideoName, VideoName.NONE>;

      if (typeof Gifs[_key].data === 'function') {
        (Gifs[_key].data as () => void)();
      }
    });

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div
        className={`absolute left-2/4 -translate-x-2/4 -translate-y-full z-40 w-[200px] h-[200px] transition-opacity ${className}`}
        id={STEP_SELECTOR.FIRST}
        style={{
          top: top,
          opacity: top ? 1 : 0,
        }}
      >
        <Active
          targetActive={targetActive}
          setTargetActive={setTargetActive}
        ></Active>

        <DogActive gif={gif} setTargetActive={setTargetActive}></DogActive>
      </div>

      <div
        className={`absolute -translate-y-[9vh] translate-x-[16vw] z-50 transition-opacity ${className}`}
        id={STEP_SELECTOR.DOG_BOWL}
        style={{
          top: top,
        }}
        onClick={() => {
          setFeedDrawerVisible(true);
        }}
      >
        <NextImage
          src={foodPng}
          width={84}
          height={84}
          alt="dog bowl"
        ></NextImage>
      </div>

      <ClientFeedDrawer
        drawerVisible={feedDrawerVisible}
        setDrawerVisible={setFeedDrawerVisible}
      ></ClientFeedDrawer>
    </>
  );
};

export const Active: FC<{
  targetActive: Tools['name'] | '';
  setTargetActive: Dispatch<SetStateAction<Tools['name'] | ''>>;
}> = ({ targetActive, setTargetActive }) => {
  const { state, checkEntering } = useContext(ChatContext);
  const [tools, setTools] = useState<Tools[]>([]);

  const getTools = () => {
    fetchRequest(
      `/restApi/friendAction/girlfriendActionList?reviewVersion=${AppConfigEnv.APPVERSIONCODE}&type=${AppConfigEnv.APPTYPE}`,
      {},
      {
        method: 'GET',
      }
    ).then(({ result }) => {
      if (Array.isArray(result)) {
        setTools(
          result
            .filter((item) => ['Kiss on', 'Touch', 'Hug'].includes(item.action))
            .map(
              (item, index) =>
                ({
                  ...item,
                  url: filterImage(item.expression2),
                  name: item.action,
                  style: [
                    { transform: 'translate(55%, 0%)', marginBottom: '6px' },
                    { transform: 'translate(-45%, 0%)', marginBottom: '18px' },
                    { transform: 'translate(20%, 0%)' },
                  ][index],
                } as never)
            )
        );
      }
    });
  };

  const clickTool = (tool: Indexes<string>) => {
    openActionPopup(tool);
    handleTriggerEvent(CustomEvents.ARE_INTERACTIVE_USERS, true);

    switch (tool.name) {
      case 'Kiss on':
        handleTriggerEvent([
          {
            eventAction: CustomEvents.NUMBER_KISSES,
          },
          {
            eventAction: CustomEvents.KISS_USERS,
            isSetCookie: true,
          },
        ]);
        break;
      case 'Touch':
        handleTriggerEvent([
          {
            eventAction: CustomEvents.OF_STROKES,
          },
          {
            eventAction: CustomEvents.PETTING_USERS,
            isSetCookie: true,
          },
        ]);
        break;
      case 'Hug':
        handleTriggerEvent([
          {
            eventAction: CustomEvents.OF_HUGS,
          },
          {
            eventAction: CustomEvents.NUMBER_HUG_USERS,
            isSetCookie: true,
          },
        ]);
        break;
      default:
        break;
    }
  };

  const openActionPopup = (item: any) => {
    if (item.type === -1) {
      fetchAction(item);
      return;
    }
  };

  const fetchAction = (item: any) => {
    if (checkEntering?.()) return;
    state!.entering = true;

    const { action, copywritingOne, copywritingTwo } = item!;
    fetchRequest('/restApi/friendAction/girlfriendActionProcessing', {
      copywritingOne: copywritingOne || '',
      copywritingTwo: copywritingTwo || '',
      action,
      giftFriendId: state!.friendId,
    })
      .then((res) => {})
      .finally(() => {
        state!.entering = false;
      });
  };

  useEffect(() => {
    if (targetActive != '') {
      clickTool(tools.find((item) => item.name === targetActive)!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetActive]);

  useEffect(() => {
    getTools();
  }, []);

  return (
    <div className="absolute px-4 -left-10 -top-7 z-50 w-[84px]">
      {tools?.map((tool: any, index: number) => (
        <div
          key={index}
          className="tool size-10 flex justify-center items-center bg-[#FFF2E5] border-[#fff] border rounded-2xl"
          onClick={() => {
            clickTool(tool);
          }}
          style={tool.style}
        >
          <NextImage
            width={32}
            height={32}
            src={filterImage(tool.url)}
            alt={tool.name}
          />
        </div>
      ))}
    </div>
  );
};

export const DogActive: FC<{
  gif: Exclude<VideoName, VideoName.NONE>;
  setTargetActive: Dispatch<SetStateAction<Tools['name'] | ''>>;
}> = ({ gif, setTargetActive }) => {
  const [lastTap, setLastTap] = useState(0);
  const doubleTapDelay = 500; // 双击间隔时间，单位为毫秒

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (
      // @ts-ignore
      e.target.src.indexOf(Gifs[VideoName.LEISURE].src) != -1
    ) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;

      if (tapLength < doubleTapDelay && tapLength > 0) {
        setTargetActive('Kiss on');
      } else {
        /**
         * 摸头
         */
        if (offsetY <= 110 && offsetX < 140) {
          setTargetActive('Touch');
        }
      }

      setLastTap(currentTime);
    }
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(event.touches[0]?.clientY);
  };

  const handleMouseUp = (event: TouchEvent) => {
    if (isDragging) {
      const currentY = event.changedTouches[0].clientY;

      const deltaY = startY - currentY;

      if (deltaY > 0) {
        console.log('向上拖拽');
        setTargetActive('Hug');
        // 在此处处理向上拖拽的逻辑
      } else {
        console.log('未向上拖拽');
        // 你可以根据需要处理其他方向的拖拽逻辑
      }
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchend', handleMouseUp);
    } else {
      document.removeEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('touchend', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <NextImage
      className="relative z-40"
      draggable="false"
      priority
      unoptimized
      src={Gifs[gif].data as StaticImageData}
      alt="dog"
      width={200}
      height={200}
      onClick={handleImageClick}
      onTouchStart={handleTouchStart}
    ></NextImage>
  );
};
