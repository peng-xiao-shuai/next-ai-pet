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
  useState,
} from 'react';
import { ChatContext } from './Client';
import { LOCALE_KEYS } from '@@/locales';
import { filterImage } from '@/utils/business';
import { CustomEvents, handleTriggerEvent } from '@/utils/GA-event';
import { VideoName } from './ShowAnimation';
import { ClientFeedDrawer } from './ClientFeedDrawer';

const Gifs: Record<
  Exclude<VideoName, VideoName.NONE | VideoName.FOOD | VideoName.FEED>,
  {
    src: string;
    name: string;
    data: HTMLImageElement | null;
  }
> = {
  [VideoName.LEISURE]: {
    src: '/images/introduction.gif',
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
  const [top, setTop] = useState(0);
  const [feedDrawerVisible, setFeedDrawerVisible] = useState(false);
  const [targetActive, setTargetActive] = useState<Tools['name'] | ''>('');

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (
      // @ts-ignore
      e.target.src.indexOf(encodeURIComponent(Gifs[VideoName.LEISURE].src)) !=
      -1
    ) {
      // 摸头
      if (offsetY <= 55 && offsetX < 140) {
        setTargetActive('Touch');
      } else if (offsetY <= 110 && offsetX < 140) {
        setTargetActive('Kiss on');
      } else if (offsetY > 110 && offsetX < 160) {
        setTargetActive('Hug');
      }
    }
  };

  useEffect(() => {
    if (bgImgHeight) {
      setTop(bgImgHeight / 1.65);
    }
  }, [bgImgHeight]);

  useEffect(() => {
    if (![VideoName.NONE, VideoName.FEED, VideoName.FOOD].includes(name)) {
      setGif(Gifs[name].src);
      // setVisible(true);

      const timer = setTimeout(() => {
        setGif(Gifs[VideoName.LEISURE].src);
        onEnd();
        setTargetActive('');
        clearTimeout(timer);
      }, 2500);
    }
  }, [name, onEnd]);

  return (
    <>
      <div
        className="absolute left-2/4 -translate-x-2/4 -translate-y-full z-40 w-[200px] h-[200px]"
        id="first-step"
        style={{
          top: top,
          opacity: top ? 1 : 0,
        }}
      >
        <Active
          targetActive={targetActive}
          setTargetActive={setTargetActive}
        ></Active>

        <NextImage
          className="relative z-40"
          priority
          src={gif}
          alt="dog"
          width={200}
          height={200}
          onClick={handleImageClick}
        ></NextImage>
      </div>

      <div
        className="absolute -translate-y-20 translate-x-16 z-50"
        id="dog-bowl"
        style={{
          top: top,
        }}
        onClick={() => {
          setFeedDrawerVisible(true);
        }}
      >
        <NextImage
          src="/icons/empty-dog-bowl.png"
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
