import AppConfigEnv from '@/utils/get-config';
import { fetchRequest } from '@/utils/request';
import NextImage from 'next/image';
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

const Gifs: Record<
  Exclude<VideoName, VideoName.NONE | VideoName.FOOD | VideoName.FEED>,
  {
    src: string;
    name: string;
    data: HTMLImageElement | null;
  }
> = {
  [VideoName.LEISURE]: {
    src: '/images/leisure.gif',
    name: 'Leisure',
    data: null,
  },
  [VideoName.HUG]: {
    src: '/images/hug.gif',
    name: 'Hug',
    data: null,
  },
  [VideoName.KISS]: {
    src: '/images/kiss.gif',
    name: 'Kiss',
    data: null,
  },
  [VideoName.TOUCH]: {
    src: '/images/touch.gif',
    name: 'Touch',
    data: null,
  },
};

type Tools = {
  url: string;
  name: 'Kiss on' | 'Touch' | 'Hug';
} & Indexes<string>;

export const ClientDog: FC<{
  bgImgHeight: number;
  name: Exclude<VideoName, VideoName.NONE | VideoName.FOOD | VideoName.FEED>;
  onEnd: () => void;
}> = ({ bgImgHeight, name, onEnd }) => {
  const [gif, setGif] = useState(Gifs[VideoName.LEISURE].src);
  const top = useMemo(() => bgImgHeight, [bgImgHeight]);
  const [feedDrawerVisible, setFeedDrawerVisible] = useState(false);
  const [targetActive, setTargetActive] = useState<Tools['name'] | ''>('');
  const [foodPng, setFoodPng] = useState('/icons/empty-dog-bowl.png');
  const timeCount = useRef(30);
  const EnhancedComponent = useMemo(
    () =>
      withDragDetection(() => (
        <NextImage
          className="relative z-40"
          draggable="false"
          priority
          unoptimized
          src={gif}
          alt="dog"
          width={200}
          height={200}
          onClick={handleImageClick}
          onDoubleClick={handleDoubleClick}
        ></NextImage>
      )),
    [gif]
  );

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (
      // @ts-ignore
      e.target.src.indexOf(Gifs[VideoName.LEISURE].src) != -1
    ) {
      /**
       * 摸头
       */
      if (offsetY <= 110 && offsetX < 140) {
        setTargetActive('Touch');
      }
      // else if (offsetY <= 110 && offsetX < 140) {
      //   setTargetActive('Kiss on');
      // } else if (offsetY > 110 && offsetX < 160) {
      //   setTargetActive('Hug');
      // }
    }
  };

  const handleDoubleClick = (e: MouseEvent<HTMLImageElement>) => {
    if (
      // @ts-ignore
      e.target.src.indexOf(Gifs[VideoName.LEISURE].src) != -1
    ) {
      setTargetActive('Kiss on');
    }
  };

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
    if (![VideoName.NONE, VideoName.FEED, VideoName.FOOD].includes(name)) {
      setGif(Gifs[name].src);
      // setVisible(true);

      const timer = setTimeout(
        () => {
          setGif(Gifs[VideoName.LEISURE].src);
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
    console.log(timeCount.current, localStorage.getItem('foodTimeCount'));

    let timer: NodeJS.Timeout;
    if (timeCount.current > 0) setFoodPng('/icons/dog-bowl.png');
    timer = setInterval(() => {
      timeCount.current -= 1;
      localStorage.setItem('foodTimeCount', String(timeCount.current));

      if (timeCount.current <= 0) {
        setFoodPng('/icons/empty-dog-bowl.png');
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div
        className="absolute left-2/4 -translate-x-2/4 -translate-y-full z-40 w-[200px] h-[200px]"
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

        <EnhancedComponent
          dragUpCB={() => {
            setTargetActive('Hug');
          }}
        ></EnhancedComponent>
      </div>

      <div
        className="absolute -translate-y-20 translate-x-16 z-50"
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
