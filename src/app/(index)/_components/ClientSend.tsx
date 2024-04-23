'use client';
import { filterImage } from '@/utils/business';
import Image from 'next/image';
import { FC, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ClientTips } from './ClientTips';
import { fetchRequest } from '@/utils/request';
import { ChatContext } from './Client';
import { useUserStore } from '@/hooks/use-user';
import AppConfigEnv from '@/utils/get-config';
import { CenterPopup } from '@/components/CenterPopup';
import { cn } from '@/lib/utils';
import { IoCloseCircle } from 'react-icons/io5';
import { AiFillQuestionCircle } from 'react-icons/ai';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/Button';

export const ClientSendMsg: FC<{
  sendMsg: () => void;
}> = ({ sendMsg }) => {
  const { state, detail } = useContext(ChatContext);
  const { userState } = useUserStore();
  const [message, setMessage] = useState('');

  const setGuideData = (map: any, label: string, guideStep?: number) => {
    if (!(!map.reviewHide && !(map.ugcHide && detail.styleType === 'USER')))
      return;
    const temp = JSON.parse(JSON.stringify(map));
    if (['ROLE_PLAY', 'HOT_DATE', 'ASMR'].includes(map.name)) {
      if (!state!.guideMapTemp) {
        state!.guideMapTemp = map;
        map.step = 3;
        map.guideTip = 'chat.guideTip3' + label;
        state!.guideMapTemp.guides = [temp];
      } else {
        state!.guideMapTemp.guideTip += `, ${label}`;
        state!.guideMapTemp.guides.push(temp);
      }
    } else if (map.name === 'LET_ME_SEE_U') {
      map.guides = [temp];
      map.step = 1;
      map.guideTip = 'chat.guideTip1';
    } else if (map.name === 'TAKE_ACTION') {
      map.guides = [temp];
      map.step = 2;
      map.guideTip = 'chat.guideTip2';
    }

    if (map.step && (!guideStep || map.step < guideStep)) {
      state!.tempStep = map.step;
    }
  };

  return (
    <>
      <ClientTools></ClientTools>

      <div className="input-container relative m-3 leading-none text-white">
        {/* <ClientTips
          className="right-0 -translate-y-[120%] w-56"
          cornerClassName="bottom-0 translate-y-2/4 right-6"
          text={'Send messages to earn growth points!'}
        ></ClientTips> */}

        <textarea
          value={message}
          className="textarea-dom pr-[72px] pl-4 w-full h-12 rounded-3xl bg-[#302c4f] resize-none !outline-none leading-[theme(height.12)] rtl:pr-4 rtl:pl-[72px]"
          placeholder={`Message`}
          maxLength={200}
          onChange={({ target }) => {
            setMessage(target.value);
          }}
          onBlur={({ target }) => {
            /**
             * FIX Ios 软键盘消失页面不会掉下来
             */
            window.scrollTo(0, 200);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              sendMsg();
            }
          }}
        />
        <div className="btn-wrapper absolute top-2/4 -translate-y-2/4 right-4 rtl:right-[unset] rtl:left-4">
          <Image
            onClick={() => {
              sendMsg();
            }}
            width={30}
            height={30}
            className="send-icon"
            alt="send"
            src="/icons/send.png"
          ></Image>
        </div>
      </div>
    </>
  );
};

let actionMapCopy: Indexes = {};
export const ClientTools = () => {
  const { state, checkEntering } = useContext(ChatContext);
  const [tools, setTools] = useState([]);
  const [actionMap, setActionMap] = useState<Indexes>({});
  const [inp1, setInp1] = useState('');
  const [inp2, setInp2] = useState('');
  const [feedValue, setFeedValue] = useState(20);
  const [sendLoading, setSendLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('You don’t have enough food');
  const [actionDialogVisible, setActionDialogVisible] = useState(false);
  const [actionDrawerVisible, setActionDrawerVisible] = useState(true);

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
              (item) =>
                ({
                  ...item,
                  url: filterImage(item.expression2),
                  name: item.action,
                } as never)
            )
            .concat([
              {
                url: '/icons/feed.png',
                name: 'feed',
              },
              {
                url: '/icons/food.png',
                name: 'food',
              },
            ] as never[])
        );
      }
    });
  };

  const clickTool = (tool: Indexes<string>) => {
    switch (tool.name) {
      case 'feed':
        setActionDrawerVisible(true);
        break;
      case 'food':
        toast('coming soon');
        break;
      case 'Kiss on':
      case 'Touch':
      case 'Hug':
        openActionPopup(tool);
        break;
      default:
        break;
    }
  };

  const openActionPopup = (item: any) => {
    actionMapCopy = item;
    setActionMap(item);
    setInp1('');
    setInp2('');
    if (item.type === -1) {
      fetchAction();
      return;
    }
    setTimeout(() => {
      setActionDialogVisible(true);
    }, 0);
  };

  const fetchAction = () => {
    if (checkEntering?.()) return;
    state!.entering = true;
    setActionDialogVisible(false);

    const { action, copywritingOne, copywritingTwo } = actionMapCopy!;
    fetchRequest('/restApi/friendAction/girlfriendActionProcessing', {
      copywritingOne: inp1 || copywritingOne || '',
      copywritingTwo: inp2 || copywritingTwo || '',
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
    <>
      <div
        className="tools-bar grid grid-cols-5 px-4 overflow-x-auto"
        style={{
          unicodeBidi: 'normal',
        }}
      >
        {tools?.map((tool: any, index: number) => (
          <div
            key={index}
            className="tool relative flex justify-center items-center"
            onClick={() => {
              clickTool(tool);
            }}
          >
            <Image
              className="tool__icon"
              width={33}
              height={33}
              src={filterImage(tool.url)}
              alt={tool.name}
            />

            {/* <GuideStep tool={tool}></GuideStep> */}
          </div>
        ))}
      </div>

      <Drawer open={actionDrawerVisible} onOpenChange={setActionDrawerVisible}>
        <DrawerContent className="!bg-[#2F2F3B] !p-6 !pt-0 !rounded-b-none">
          <DrawerHeader className="!p-0">
            <DrawerTitle className="text-white text-left flex justify-between items-center">
              <span className="text-lg font-bold text-[#F0F0F2]">Feed</span>
              <IoCloseCircle className="text-[#3B3B3D] size-6" />
            </DrawerTitle>
          </DrawerHeader>

          <div className="mb-6 mt-4 bg-[#444450] h-[1px] w-full"></div>

          <div className="actions-list grid grid-cols-3 gap-x-4 mb-4">
            {[20, 100, 200].map((item) => (
              <div
                key={item}
                className={cn(
                  'h-28 w-full bg-[#1D1C21] flex flex-wrap justify-center content-center rounded-2xl border-[#FDCD62] ',
                  item === feedValue ? 'border-4' : ''
                )}
                onClick={() => {
                  setFeedValue(item);
                }}
              >
                <Image
                  src="/icons/feed.png"
                  width={32}
                  height={32}
                  alt={item + ' feed'}
                ></Image>
                <div className="text-lg font-bold text-[#FDCD62] w-full text-center">
                  {item}
                </div>
              </div>
            ))}
          </div>

          <div
            className={cn(
              'flex justify-between items-center gap-4 text-white',
              errorMsg ? 'mb-4' : 'mb-10'
            )}
          >
            <span className="text-sm font-bold">Type the number:</span>

            <div>
              <div
                className={cn(
                  'bg-[#1D1C21] rounded-full h-12 flex items-center px-2 flex-1 border-[#FF2F53]',
                  errorMsg ? 'border-2 mb-[6px]' : ''
                )}
              >
                <input
                  type="number"
                  className={cn('bg-transparent w-full ')}
                  value={feedValue}
                  onChange={({ target }) => {
                    setFeedValue(Number(target.value));
                  }}
                />
              </div>

              {Boolean(errorMsg) && (
                <div className="text-[#FF2F53]">{errorMsg}</div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-white">
            <div>
              <div className="flex items-center">
                <div className="mr-2 w-16 h-7 rounded-full flex items-center justify-center gap-1 border-2 border-white/50">
                  <Image
                    src="/icons/feed.png"
                    width={16}
                    height={16}
                    alt="feed"
                  ></Image>
                  <span className="text-xs">234</span>
                </div>
                <AiFillQuestionCircle className="size-[15px] text-[#737373]"></AiFillQuestionCircle>
              </div>
              <div className="text-sm">You have the food</div>
            </div>

            <Button
              title="Send"
              click={() => {}}
              disabled={sendLoading}
              className="w-28 h-11 bg-gradient-to-r to-[#D18EF7] from-[#FA3B67] mb-0"
            ></Button>
          </div>
          <div className="slot__list"></div>
        </DrawerContent>
      </Drawer>

      <CenterPopup
        title={actionMap.mainTitle}
        subtitle={actionMap.subTitle}
        confirmText="accept"
        cancleText="cancel"
        plainBtn
        isAction
        open={actionDialogVisible}
        onClose={setActionDialogVisible}
        onConfirm={fetchAction}
      >
        <div
          className={cn(
            'action__slot group',
            actionMap.type === 1 ? 'is-two' : ''
          )}
        >
          {actionMap.type === 1 && (
            <input
              className="firstInp inp group-[.is-two]:mt-6 mx-auto px-4 w-64 h-14 text-lg text-black rounded-2xl bg-white placeholder:text-[#a19ea9]"
              placeholder={actionMap.copywritingOne}
              value={inp1}
              onChange={({ target }) => {
                setInp1(target.value);
              }}
              type="text"
            />
          )}

          <input
            className="secondInp mt-11 mb-12 inp group-[.is-two]:mt-5 mx-auto px-4 w-64 h-14 text-lg text-black rounded-2xl bg-white placeholder:text-[#a19ea9]"
            value={inp2}
            onChange={({ target }) => {
              setInp2(target.value);
            }}
            placeholder={actionMap.copywritingTwo}
            type="text"
          />
        </div>
      </CenterPopup>
    </>
  );
};
