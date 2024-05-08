'use client';
import { filterImage } from '@/utils/business';
import Image from 'next/image';
import { FC, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { ClientTips } from './ClientTips';
import { fetchRequest } from '@/utils/request';
import { ChatContext } from './Client';
import AppConfigEnv from '@/utils/get-config';
import { CenterPopup } from '@/components/CenterPopup';
import { cn } from '@/lib/utils';
import { ClientFeedDrawer } from './ClientFeedDrawer';
import { ClientFoodDrawer } from './ClientFoodDrawer';
import { ClientTaskDrawer } from './ClientTaskDrawer';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { m, AnimatePresence } from 'framer-motion';

export const ClientSendMsg: FC<{
  sendMsg: (val: string) => void;
  _P: string;
}> = ({ sendMsg, _P }) => {
  const { detail, setDetail, list, readyState } = useContext(ChatContext);
  const [message, setMessage] = useState('');
  const isDefineName = useMemo(
    () =>
      list![list!.length - 1]?.specialEventTrigger ===
      'REQUIRE_MODIFY_FRIEND_NAME',
    [list]
  );

  const sendMsgSuc = (type?: unknown) => {
    /**
     * 定义宠物名称
     */
    if (type === 'defineName') {
      setDetail?.((state) => ({
        ...state,
        name: message.trim(),
      }));
    }

    setMessage('');
  };

  useBusWatch(_P + 'sendMsgSuc', sendMsgSuc);

  useEffect(() => {
    if (detail.isInitialized) {
      setMessage('Hi,my good pet');
    }
  }, [detail.isInitialized]);

  return (
    <>
      <ClientTools></ClientTools>

      <div className="input-container relative m-3 leading-none text-white">
        {detail.isInitialized && (
          <ClientTips
            visible={detail.isInitialized}
            className="right-0 -translate-y-[120%] w-56"
            cornerClassName="bottom-0 translate-y-2/4 right-6"
            text={'Send messages to earn growth points!'}
          ></ClientTips>
        )}

        <input
          value={message}
          className="textarea-dom pr-[72px] pl-4 w-full h-12 rounded-3xl bg-[#302c4f] resize-none !outline-none leading-[theme(height.12)] rtl:pr-4 rtl:pl-[72px]"
          placeholder={
            isDefineName
              ? 'Please directly type the name of your pet'
              : `Message`
          }
          maxLength={isDefineName ? 20 : 200}
          onChange={({ target }) => {
            setMessage(target.value);
          }}
          onBlur={({ target }) => {
            /**
             * FIX Ios 软键盘消失页面不会掉下来
             */
            window.scrollTo(0, 0);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              sendMsg(message);
            }
          }}
        />
        <div className="btn-wrapper absolute top-2/4 -translate-y-2/4 right-4 rtl:right-[unset] rtl:left-4">
          {readyState === 1 ? (
            <Image
              onClick={() => {
                if (detail.isInitialized) {
                  setDetail?.((state) => ({
                    ...state,
                    isInitialized: false,
                  }));
                  setMessage('');
                }
                sendMsg(message);
              }}
              width={30}
              height={30}
              className="send-icon"
              alt="send"
              src="/icons/send.png"
            ></Image>
          ) : (
            <div className="size-[30px] bg-[#fd2c54] flex items-center justify-center rounded-full overflow-hidden">
              <span className="loading loading-spinner"></span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

let actionMapCopy: Indexes = {};
export const ClientTools = () => {
  const { state, checkEntering, list } = useContext(ChatContext);
  const [tools, setTools] = useState([]);
  const [actionMap, setActionMap] = useState<Indexes>({});
  const [inp1, setInp1] = useState('');
  const [inp2, setInp2] = useState('');
  const [actionDialogVisible, setActionDialogVisible] = useState(false);
  const [feedDrawerVisible, setFeedDrawerVisible] = useState(false);
  const [foodDrawerVisible, setFoodDrawerVisible] = useState(false);
  const [taskDrawerVisible, setTaskDrawerVisible] = useState(false);
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
                  content: 'Please choose an action to touch your pet.',
                  url: filterImage(item.expression2),
                  name: item.action,
                } as never)
            )
            .concat([
              {
                url: '/icons/food.png',
                name: 'feed',
                step: 'HIGHLIGHT_FEED_FOOD',
                highlight: 'HIGHLIGHT_FEED_FOOD',
                content: 'Click to feed your pet food',
              },
              {
                url: '/icons/task.png',
                name: 'task',
                step: 'task',
              },
              {
                url: '/icons/shop.png',
                name: 'food',
                step: 'food',
              },
            ] as never[])
        );
      }
    });
  };

  const clickTool = (tool: Indexes<string>) => {
    switch (tool.name) {
      case 'feed':
        setFeedDrawerVisible(true);
        break;
      case 'food':
        setFoodDrawerVisible(true);
        break;
      case 'task':
        setTaskDrawerVisible(true);
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
        className="tools-bar grid grid-cols-6 px-4 overflow-x-auto pt-3"
        style={{
          unicodeBidi: 'normal',
        }}
      >
        {tools?.map((tool: any, index: number) => (
          <div
            key={index}
            className="tool relative flex justify-center items-center"
            onClick={() => {
              setIsAnimateEnd(true);
              clickTool(tool);
            }}
          >
            <Image
              width={33}
              height={33}
              src={filterImage(tool.url)}
              alt={tool.name}
              className={cn(
                tipsStatus === tool.highlight && !isAnimateEnd
                  ? 'relative z-50'
                  : ''
              )}
            />
            <AnimatePresence>
              {tipsStatus === tool.step && !isAnimateEnd && (
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
                  <GuideStep tool={tool}></GuideStep>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <ClientFeedDrawer
        drawerVisible={feedDrawerVisible}
        setDrawerVisible={setFeedDrawerVisible}
      ></ClientFeedDrawer>

      <ClientFoodDrawer
        drawerVisible={foodDrawerVisible}
        setDrawerVisible={setFoodDrawerVisible}
      ></ClientFoodDrawer>

      <ClientTaskDrawer
        drawerVisible={taskDrawerVisible}
        setDrawerVisible={setTaskDrawerVisible}
      ></ClientTaskDrawer>

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

export const GuideStep: FC<{
  tool: any;
}> = ({ tool }) => {
  return (
    <>
      <div
        className="tool__guide__mask fixed z-40 top-0 left-0 size-full bg-black/40"
        onClick={(e) => e.stopPropagation()}
      ></div>

      <ClientTips
        visible={true}
        text={tool.content}
        className={`${
          typeof window != 'undefined' &&
          /iphone/gi.test(window.navigator.userAgent)
            ? '-translate-y-[155%]'
            : '-translate-y-[355%]'
        } !fixed -translate-x-[56%] z-50 w-[280px]`}
        cornerClassName="bottom-0 translate-y-2/4 left-2/4 -translate-x-2/4"
      ></ClientTips>
    </>
  );
};
