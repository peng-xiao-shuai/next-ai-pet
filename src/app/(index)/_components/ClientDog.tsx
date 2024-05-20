import AppConfigEnv from '@/utils/get-config';
import { fetchRequest } from '@/utils/request';
import { m, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { ChatContext } from './Client';
import { LOCALE_KEYS } from '@@/locales';
import { filterImage } from '@/utils/business';
import { CustomEvents, handleTriggerEvent } from '@/utils/GA-event';
import { cn } from '@/lib/utils';
import { GuideStep } from './ClientSend';
import { VideoName } from './ShowAnimation';

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

export const ClientDog: FC<{
  bgImgHeight: number;
  name: Exclude<VideoName, VideoName.NONE | VideoName.FOOD | VideoName.FEED>;
  onEnd: () => void;
}> = ({ bgImgHeight, name, onEnd }) => {
  const [gif, setGif] = useState(Gifs[VideoName.LEISURE].src);
  const [top, setTop] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (bgImgHeight) {
      setTop(bgImgHeight / 1.65);
    }
  }, [bgImgHeight]);

  useEffect(() => {
    if (![VideoName.NONE, VideoName.FEED, VideoName.FOOD].includes(name)) {
      setGif(Gifs[name].src);
      setVisible(true);

      const timer = setTimeout(() => {
        setGif(Gifs[VideoName.LEISURE].src);
        onEnd();
        clearTimeout(timer);
      }, 2500);
    }
  }, [name, onEnd]);

  return (
    <div
      className="absolute left-2/4 -translate-x-2/4 -translate-y-full z-40 w-[200px] h-[200px]"
      style={{
        top: top,
        opacity: top ? 1 : 0,
      }}
    >
      <Active></Active>

      <NextImage src={gif} alt="dog" width={200} height={200}></NextImage>
    </div>
  );
};

export const Active = () => {
  const { state, checkEntering, list } = useContext(ChatContext);
  const [tools, setTools] = useState<any>([]);

  /**
   * 结束动画
   */
  const [isAnimateEnd, setIsAnimateEnd] = useState(false);
  const tipsStatus = useMemo(() => {
    if (
      ['HIGHLIGHT_ACTION_BTN', 'HIGHLIGHT_FEED_FOOD'].includes(
        list![list!.length - 1]?.specialEventTrigger
      )
    ) {
      setIsAnimateEnd(false);

      setTimeout(() => {
        setIsAnimateEnd(true);
      }, 4000);
    }
    return list![list!.length - 1]?.specialEventTrigger || 'none';
  }, [list]);

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
                  step: index === 1 ? 'HIGHLIGHT_ACTION_BTN' : '',
                  highlight: 'HIGHLIGHT_ACTION_BTN',
                  content:
                    LOCALE_KEYS.PLEASE_CHOOSE_AN_ACTION_TO_TOUCH_YOUR_PET,
                  url: filterImage(item.expression2),
                  name: item.action,
                  style: [
                    {},
                    { transform: 'translate(-100%, 105%)' },
                    { transform: 'translate(-40%, 235%)' },
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
    getTools();
  }, []);

  return (
    <div
      className="px-4 overflow-x-auto"
      style={{
        unicodeBidi: 'normal',
      }}
    >
      {tools?.map((tool: any, index: number) => (
        <div
          key={index}
          className="tool absolute z-40 -left-1 -top-1 size-10 flex justify-center items-center bg-[#FFF2E5] border-[#fff] border rounded-2xl"
          onClick={() => {
            setIsAnimateEnd(true);
            clickTool(tool);
          }}
          style={tool.style}
        >
          <NextImage
            width={32}
            height={32}
            src={filterImage(tool.url)}
            alt={tool.name}
            className={cn(
              tipsStatus === tool.highlight && !isAnimateEnd
                ? 'relative z-50'
                : ''
            )}
          />
        </div>
      ))}

      <AnimatePresence>
        {tipsStatus === tools[1]?.step && !isAnimateEnd && (
          <m.div
            animate={{
              opacity: 1,
              zIndex: 40,
            }}
            exit={{
              opacity: 0,
              zIndex: 40,
            }}
          >
            <GuideStep tool={tools[1]}></GuideStep>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
