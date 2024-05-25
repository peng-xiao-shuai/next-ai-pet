import AppConfigEnv from '@/utils/get-config';
import { fetchRequest } from '@/utils/request';
import NextImage, { StaticImageData } from 'next/image';
import { m, AnimatePresence } from 'framer-motion';
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
import { ClientFeedDrawer } from './ClientFeedDrawer';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { STEP_SELECTOR } from '@/utils/stpes';
// import leisure from '@@/images/leisure.gif';
import emptyFace from '@@/icons/empty-face.png';
import photoAlbum from '@@/images/photo-album.png';
import { ClientCardDrawer } from './ClientCardDrawer';
import { useUserStore } from '@/hooks/use-user';
import { useTour } from '@reactour/tour';

export enum DogGifName {
  KISS = 'kiss',
  TOUCH = 'touch',
  HUG = 'hug',
  EAT = 'eat',
  NONE = 'none',
  LEISURE = 'leisure',
}

const Gifs: Record<
  Exclude<DogGifName, DogGifName.NONE>,
  {
    src: string;
    name: string;
    data: (() => void) | StaticImageData;
  }
> = {
  [DogGifName.LEISURE]: {
    src: 'leisure',
    name: 'Leisure',
    data: emptyFace,
  },
  [DogGifName.EAT]: {
    src: 'eat',
    name: 'Eat',
    data: function () {
      import('@@/icons/happy-face.png').then((res) => {
        console.log(res);

        this.data = res.default;
      });
    },
  },
  [DogGifName.HUG]: {
    src: 'hug',
    name: 'Hug',
    data: function () {
      import('@@/images/hug.gif').then((res) => {
        this.data = res.default;
      });
    },
  },
  [DogGifName.KISS]: {
    src: 'kiss',
    name: 'Kiss',
    data: function () {
      import('@@/images/kiss.gif').then((res) => {
        this.data = res.default;
      });
    },
  },
  [DogGifName.TOUCH]: {
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

const TIME_COUNT = 60;

export const ClientDog: FC<{
  bgImgHeight: number;
  className?: string;
  name: DogGifName;
  onEnd: () => void;
}> = ({ bgImgHeight, name, onEnd, className }) => {
  const [gif, setGif] = useState<Exclude<DogGifName, DogGifName.NONE>>(
    DogGifName.LEISURE
  );
  const top = useMemo(() => bgImgHeight, [bgImgHeight]);
  const [feedDrawerVisible, setFeedDrawerVisible] = useState(false);
  const [cardDrawerVisible, setCardDrawerVisible] = useState(false);
  const [targetActive, setTargetActive] = useState<Tools['name'] | ''>('');
  const [foodPng, setFoodPng] = useState('/icons/empty-dog-bowl.png');
  const [handVisible, setHandVisible] = useState(false);
  const timeCount = useRef(TIME_COUNT);

  useBusWatch('foodStatus', () => {
    setFoodPng('/icons/dog-bowl.png');
    setGif(DogGifName.EAT);

    timeCount.current = TIME_COUNT;

    const timer = setInterval(() => {
      timeCount.current -= 1;
      localStorage.setItem('foodTimeCount', String(timeCount.current));
      console.log(timeCount.current <= 0);

      if (timeCount.current <= 0) {
        setFoodPng('/icons/empty-dog-bowl.png');
        setGif(DogGifName.LEISURE);
        clearInterval(timer);
      }
    }, 1000);
  });

  useEffect(() => {
    console.log('name', name, ![DogGifName.NONE].includes(name));
    let timer: NodeJS.Timeout;
    if (![DogGifName.NONE].includes(name)) {
      setGif(name as Exclude<DogGifName, DogGifName.NONE>);
      // setVisible(true);

      timer = setTimeout(
        () => {
          setGif((state) => {
            if (foodPng == '/icons/dog-bowl.png') {
              return DogGifName.EAT;
            } else {
              return DogGifName.LEISURE;
            }
          });
          onEnd();
          setTargetActive('');
          clearTimeout(timer);
        },
        name === DogGifName.KISS
          ? 3800
          : name === DogGifName.TOUCH
          ? 2700
          : 2500
      );
    }

    return () => {
      timer && clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, foodPng]);

  useEffect(() => {
    timeCount.current = Number(localStorage.getItem('foodTimeCount') || '0');

    let timer: NodeJS.Timeout;
    if (timeCount.current > 0) {
      setFoodPng('/icons/dog-bowl.png');
      setGif(DogGifName.EAT);

      timer = setInterval(() => {
        timeCount.current -= 1;
        localStorage.setItem('foodTimeCount', String(timeCount.current));

        if (timeCount.current <= 0) {
          setFoodPng('/icons/empty-dog-bowl.png');
          setGif(DogGifName.LEISURE);
          clearInterval(timer);
        }
      }, 1000);
    }

    Object.keys(Gifs).forEach((key) => {
      const _key = key as Exclude<DogGifName, DogGifName.NONE>;

      if (typeof Gifs[_key].data === 'function') {
        (Gifs[_key].data as () => void)();
      }
    });

    return () => {
      clearInterval(timer);
    };
  }, []);

  // useEffect(() => {
  //   console.log(gif, 'gif.....');
  // }, [gif]);

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
        className={`absolute left-[40%] -translate-y-[9vh] -translate-x-full z-50 transition-opacity ${className}`}
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

        <AnimatePresence>
          {handVisible && (
            <m.div
              initial={{ x: -5, y: -5 }}
              animate={{
                x: 5,
                y: 5,
              }}
              transition={{
                repeatType: 'reverse',
                duration: 0.6,
                repeat: Infinity,
              }}
            >
              <NextImage
                src="/icons/indicate.png"
                width={51}
                height={50}
                alt="indicate"
                className="absolute right-0 bottom-0 translate-x-2/4 translate-y-2/4"
              ></NextImage>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <DogBubble
        isEmpty={[
          '/icons/empty-dog-bowl.png',
          '/icons/dog-highlight.png',
        ].includes(foodPng)}
        top={top}
        trigger={(bol) => {
          if (bol) {
            setFoodPng('/icons/dog-highlight.png');
            setHandVisible(true);
          } else {
            setFoodPng((state) => {
              if (state === '/icons/dog-bowl.png') {
                return '/icons/dog-bowl.png';
              } else {
                return state;
              }
            });
            setHandVisible(false);
          }
        }}
      ></DogBubble>

      <Card top={top} setCardDrawerVisible={setCardDrawerVisible}></Card>

      <ClientFeedDrawer
        drawerVisible={feedDrawerVisible}
        setDrawerVisible={setFeedDrawerVisible}
      ></ClientFeedDrawer>

      <ClientCardDrawer
        drawerVisible={cardDrawerVisible}
        setDrawerVisible={setCardDrawerVisible}
      ></ClientCardDrawer>
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
                    { transform: 'translate(55%, 0%)', marginBottom: '4px' },
                    { transform: 'translate(-45%, 0%)', marginBottom: '12px' },
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
    <div className="absolute px-4 -left-10 -top-3 z-50 w-[84px]">
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
  gif: Exclude<DogGifName, DogGifName.NONE>;
  setTargetActive: Dispatch<SetStateAction<Tools['name'] | ''>>;
}> = ({ gif, setTargetActive }) => {
  const [lastTap, setLastTap] = useState(0);
  const doubleTapDelay = 500; // 双击间隔时间，单位为毫秒

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (![DogGifName.KISS, DogGifName.TOUCH, DogGifName.HUG].includes(gif)) {
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

      if (
        deltaY > 0 &&
        ![DogGifName.KISS, DogGifName.TOUCH, DogGifName.HUG].includes(gif)
      ) {
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

export const Card: FC<{
  top: number;
  className?: string;
  setCardDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ top, setCardDrawerVisible, className }) => {
  const [] = useState();
  return (
    <div
      className={`absolute w-[87px] h-[101px] -translate-y-72 left-[60%] -translate-x-2/4 z-0 transition-opacity ${className}`}
      id={STEP_SELECTOR.PHOTO_ALBUM}
      style={{
        top: top,
      }}
      onClick={() => {
        setCardDrawerVisible(true);
      }}
    >
      <div className="w-full h-full absolute">
        <NextImage src={photoAlbum} fill alt="photo album"></NextImage>
      </div>
      <div className="absolute z-10 w-[calc(100%-12px)] h-[calc(100%-12px)] box-border left-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4">
        <NextImage
          src="/images/scenery.jpg"
          fill
          sizes="100%"
          alt="scenery"
        ></NextImage>
      </div>

      <div className="absolute z-10 bottom-3 left-2/4 -translate-x-2/4 text-xs px-1 rounded-full bg-gradient-to-t from-[#F3CF86] to-[#FFF5E0] text-[#BD7D1D]">
        Collection
      </div>
    </div>
  );
};

/**
 * 每隔30s弹出气泡
 */
export const DogBubble: FC<{
  isEmpty: boolean;
  top: number;
  trigger: (bol: boolean) => void;
}> = ({ isEmpty, trigger, top }) => {
  const { isOpen } = useTour();
  const [visible, setVisible] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { userState } = useUserStore();
  useEffect(() => {
    if (isEmpty) {
      timer.current && clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        if (!isOpen) {
          trigger(true);
          setVisible(true);
        }
      }, userState.dogHungryReminderInterval * 1000);
    } else {
      setVisible(false);
      trigger(false);
      timer.current && clearTimeout(timer.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmpty, userState.dogHungryReminderInterval]);
  return (
    <div
      className={`${
        visible ? '' : 'opacity-0'
      } pointer-events-none transition-all duration-500 absolute w-[150px] h-[118px] -translate-y-56 left-[34%] translate-x-2/4 z-40 bg-[url('/images/bubble.png')] text-[15px] bg-[size:100%_100%] flex text-center leading-4 tracking-tight text-[#874544] px-4 pt-7`}
      style={{
        top: top,
      }}
    >
      Dear Master, l am hungry, can you feed me?
    </div>
  );
};
