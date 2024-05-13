'use client';
import {
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
  useState,
  createContext,
  MutableRefObject,
  FC,
  useEffect,
} from 'react';
import ChatWebSocket from '../wsRequest';
import { ClientSendMsg } from './ClientSend';
import { ClientChatRecord } from './ChatRecord';
import { fetchRequest } from '@/utils/request';
import { filterAbbrTime, filterImage } from '@/utils/business';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { toast } from 'sonner';
import { Navbar } from './Navbar';
import { useUserStore } from '@/hooks/use-user';
import AppConfigEnv from '@/utils/get-config';
import { usePublicSocket } from '@/hooks/use-public-socket';
import { VideoName, VideoPlayer } from './ShowAnimation';
import { useTranslation } from '@/hooks/useTranslation';
import { ShowIntroductionAnimation } from './ShowIntroductionAnimation';

const MAX_LEN = 80;

type ChatContextState = {
  state: {
    /**
     * recordLength 复制版本，修改 recordLength 时应该同步调用 setRecordLength
     */
    recordLength: number;
    friendId: string;
    entering: boolean;
    readyReturn: boolean;
    afterSysNotice: boolean;
    readyItem: null | Indexes;
    enteringId: string;
    recorderManager: null | Indexes;
    systemTempItem: Indexes;
    aiThinking: boolean;
    currentAudioItem: Indexes;
    pressTimer: null | NodeJS.Timeout;
    recordTimer: null | NodeJS.Timeout;
    firstId: string;
    lastScrollTop: number;
    lastAlbumsTop: number;
    tempStep: number;
    needUpdateImg: Indexes;
    hasGuide: boolean;
    guideMapTemp: any;
    /**
     * readyVoice 复制版本，修改 readyVoice 时应该同步调用 setReadyVoice
     */
    readyVoice: null | string | Blob;
    listLoading: boolean;
  };
  detail: any;
  setDetail: Dispatch<SetStateAction<Indexes<any>>>;
  scrollDom: MutableRefObject<HTMLDivElement | null>;
  onSocketMessage: (e: any, isSocket?: boolean) => void;
  list: any[];
  setList: Dispatch<SetStateAction<ChatContextState['list']>>;
  videoData: {
    videoUrl: string;
    poster: string;
  };
  setVideoData: Dispatch<SetStateAction<ChatContextState['videoData']>>;
  videoVisible: boolean;
  setVideoVisible: Dispatch<SetStateAction<ChatContextState['videoVisible']>>;
  queryingPast: boolean;
  setQueryingPast: Dispatch<SetStateAction<ChatContextState['queryingPast']>>;
  curSceneStartT: number;
  setCurSceneStartT: Dispatch<
    SetStateAction<ChatContextState['curSceneStartT']>
  >;
  getPast: () => void;
  getList: () => void;
  newestId: string | '';
  readyState: 0 | 1 | 2 | 3;
  checkEntering: () => void;
  showAnimationFun: (source: VideoName.FOOD | VideoName.FEED) => void;
};

export const ChatContext = createContext<Partial<ChatContextState>>({});

const state: ChatContextState['state'] = {
  friendId: '',
  entering: false,
  readyReturn: false,
  afterSysNotice: true,
  readyItem: null,
  enteringId: '',
  guideMapTemp: null,
  recorderManager: null,
  systemTempItem: {},
  aiThinking: false,
  currentAudioItem: {},
  pressTimer: null,
  recordTimer: null,
  firstId: '',
  lastScrollTop: 0,
  lastAlbumsTop: 0,
  tempStep: 0,
  recordLength: 0,
  needUpdateImg: {},
  hasGuide: false,
  readyVoice: null,
  listLoading: false,
};

const _P = 'Chat-';

export const Client: FC<{
  friendId: undefined | string;
  className: string;
}> = ({ friendId, className }) => {
  const chat = useRef(new ChatWebSocket(_P));
  const { userState, setDataLocal } = useUserStore();
  const scrollDom = useRef<HTMLDivElement | null>(null);
  const recordListLength = useRef(0);
  const [list, setList] = useState<any[]>([]);
  const [videoPlayerName, setVideoPlayerName] = useState(VideoName.NONE);
  const [loading, setLoading] = useState<boolean>(false);
  const [queryingPast, setQueryingPast] = useState(false);
  const [curSceneStartT, setCurSceneStartT] = useState(0);
  const [detail, setDetail] = useState<Indexes>({});
  const detailCurrent = useRef<Indexes>({});
  const { t } = useTranslation();
  const [videoData, setVideoData] = useState({
    videoUrl: '',
    poster: '',
  });
  const [readyState, setReadyState] = useState<0 | 1 | 2 | 3>(0);
  const newestId = useMemo(() => {
    const [item] = list?.slice(-1) || [];
    if (!item) return '';
    return item.id;
  }, [list]);

  const sendMsg = (message: string) => {
    if (checkEntering()) return;

    let copyMessage = message.trim();

    if (!copyMessage) return;

    state.entering = true;

    const isDefineName =
      list[list.length - 1]?.specialEventTrigger ===
      'REQUIRE_MODIFY_FRIEND_NAME';

    chat.current?.sendMsg(
      JSON.stringify({
        friendId: state.friendId,
        type: 'TEXT',
        message: copyMessage,
        source: 'MEMBER',
        handlerType: isDefineName ? 'MODIFY_FRIEND_NAME' : 'CHAT',
      }),

      isDefineName ? 'defineName' : 'message'
    );
  };

  const filterMessage = (item: any, isSocket = false) => {
    const index = list.indexOf(item);
    item.feedback = item.feedback || null;

    if (state.enteringId) {
      const idx = list.findIndex(
        (listItem) => listItem.id === state.enteringId
      );
      state.enteringId = '';
      if (idx !== -1)
        setList((state) => {
          const CopyList = [...state];
          CopyList.splice(idx, 1);
          return CopyList;
        });
    }

    if (item.type === 'ENTERING') {
      state.aiThinking = true;
      state.enteringId = item.id;
    } else {
      state.aiThinking = false;
    }

    item.head = item.source === 'AI' ? item.friendHead : item.memberHead;

    if (item.type === 'TIMESTAMP') item.message = filterAbbrTime(item.message);

    if (item.type === 'SYSTEM_NOTICE' && item.scene && isSocket) {
      state.systemTempItem = item;
      const tempArr = item.message.split('');
      const tempStr = item.message;
      item.message = '';
      const timer = setInterval(() => {
        (state.systemTempItem as Indexes).message += tempArr.shift();
        if (tempArr.length === 0) {
          clearInterval(timer);
          if (state.readyItem) {
            const id = `entering${new Date().getTime()}`;
            setList((state) =>
              state.concat({
                id,
                type: 'ENTERING',
                source: 'AI',
              })
            );
            setTimeout(() => {
              const idx = list.findIndex((listItem) => listItem.id === id);
              if (idx !== -1)
                setList((state) => {
                  const CopyList = [...state];
                  CopyList.splice(idx, 1);
                  return CopyList;
                });
              onSocketMessage(state.readyItem);
              if (!state.afterSysNotice) {
                setTimeout(() => {
                  state.afterSysNotice = true;
                }, 800);
              }
            }, 500);
          }
        } else if (!detail.scene) {
          item.message = tempStr;
          clearInterval(timer);
          if (state.readyItem) {
            onSocketMessage(state.readyItem);
            if (!state.afterSysNotice) state.afterSysNotice = true;
          }
        }
      }, 20);
    }

    if (
      item.message &&
      ['TEXT', 'ACTION', 'REQUEST', 'HOT_DATE', 'ROLE_PLAY'].includes(item.type)
    ) {
      const str = `<text>${item.message}</text>`;
      item.message = str.replace(/\*(.*?)\*/g, '<b><i>*$1*</i></b>');
    }

    if (!item.extObj) return;

    const extObj = JSON.parse(item.extObj);

    /**
     * 判断开场动画
     */
    if (
      detailCurrent.current.isInitialized &&
      item.source == 'AI' &&
      extObj.imageUrl?.includes('gif')
    ) {
      item.visible = false;
    }

    switch (item.type) {
      case 'VIDEO':
        item.coverUrl = filterImage(extObj.coverUrl);
        item.videoUrl = filterImage(extObj.videoUrl);
        break;
      case 'VOICE':
        item.voiceUrl = filterImage(extObj.voiceUrl);
        item.playing = false;
        item.voiceDuration = extObj.voiceDuration || 0;
        item.voiveProgress = 0;
        break;
      case 'IMG':
        item.imageUrl = filterImage(extObj.imageUrl);
        item.imageId = extObj.friendTrackId;
        item.resourceType = extObj.resourceType;
        item.isUnderwearUnlocked = !!extObj.isUnderwearUnlocked;
        break;
      case 'ASMR':
        item.asmrUrl = filterImage(extObj.asmrUrl);
        break;
      default:
        break;
    }

    setList((state) => {
      const CopyList = [...state];
      CopyList[index] = item;
      return CopyList;
    });
  };

  const onSocketMessage = (e: any, isSocket: boolean = false) => {
    let isFormList = false;
    let item: any;
    if (e.id) {
      item = e;
      isFormList = true;
    } else {
      const { data = '{}' } = e;
      if (data === 'PONG') return;
      item = JSON.parse(data);
      if (item.type === 'HEARTBEAT') return;

      if (item.source === 'MEMBER') {
        switch (item.action) {
          case 'Kiss on':
            setVideoPlayerName(VideoName.KISS);
            break;
          case 'Touch':
            setVideoPlayerName(VideoName.TOUCH);
            break;
          case 'Hug':
            setVideoPlayerName(VideoName.HUG);
            break;
        }
      }
    }

    state.entering = false;

    if (list.findIndex((listItem) => item.id === listItem.id) !== -1) return;

    if (state.readyReturn) {
      state.afterSysNotice = false;
      state.readyItem = e;
      state.readyReturn = false;
      return;
    }
    state.readyReturn = false;

    if (item.type === 'SYSTEM_NOTICE' && item.scene) {
      setCurSceneStartT(
        item.timestamp > curSceneStartT ? item.timestamp : curSceneStartT
      );

      if (!isFormList) {
        state.readyReturn = true;
      }
    }

    let {
      extObj,
      isLastMessage,
      plotRound,
      friendPointChange,
      isPlotStage: itemIsPlotStage,
    } = item;
    if (extObj) {
      const jsonExtObj = JSON.parse(extObj) || {};

      if (jsonExtObj.plotReplies) {
        if (isFormList && isLastMessage && plotRound) {
          itemIsPlotStage = !!itemIsPlotStage;
        }
      }
    }

    if (!isFormList && item.source !== 'MEMBER') {
      itemIsPlotStage = !!itemIsPlotStage;
    }

    if (queryingPast) return;

    if (list.length >= MAX_LEN) {
      list.splice(0, Math.floor(MAX_LEN / 2));
    }
    filterMessage(item, !isFormList);
    setList((state) => state.concat(item));

    if (friendPointChange) {
      setDataLocal({
        point: Number(userState.point) + Number(friendPointChange),
      });
    }

    const time = setTimeout(() => {
      scrollToBottom();
      clearTimeout(time);
    }, 200);
  };

  const getPast = () => {
    const { timestamp, id } = list?.[0] || {};
    if (!id) return;
    if (id === state?.firstId) return;
    if (detail.scene && curSceneStartT >= timestamp) return;

    setLoading(true);
    setQueryingPast(true);
    state.listLoading = true;
    fetchRequest('/restApi/chatMessage/list', {
      pageSize: 10,
      friendId: state.friendId,
      lastMessageId: id,
    })
      .then((res) => {
        const { rows } = res.result;
        if (!rows.length) {
          state.firstId = id;
        }
        rows.forEach((item: any) => {
          item.friendPointChange = 0;

          const { length } = list;
          if (length >= MAX_LEN) {
            const startIdx = length - Math.floor(MAX_LEN / 2);

            setList((state) => {
              const CopyList = [...state];
              CopyList.splice(startIdx);
              return CopyList;
            });
          }
          setTimeout(() => {
            filterMessage(item);

            setList((state) => {
              const CopyList = [...state];
              CopyList.unshift(item);
              return CopyList;
            });
          }, 50);
        });
      })
      .finally(() => {
        setLoading(false);
        state.listLoading = false;
      });
  };

  const scrollToBottom = (duration: number = 200) => {
    if (queryingPast) return;

    const element = scrollDom.current;
    if (!element) return;

    const start = element.scrollTop;
    const end = element.scrollHeight - element.clientHeight;
    const change = end - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      element.scrollTop = start + change * progress;

      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const getList = () => {
    if (state?.listLoading) return;
    state!.listLoading = true;

    const form = {
      firstMessageId: newestId.value,
      friendId: state?.friendId,
      pageSize: 20,
    };

    fetchRequest('/restApi/chatMessage/list', form)
      .then(({ result }) => {
        const list = result.rows?.reverse() || [];
        list.forEach((item: any) => {
          item.friendPointChange = 0;
          onSocketMessage?.(item);
        });
      })
      .finally(() => {
        state!.listLoading = false;
      });
  };

  const getDetail = () => {
    let loading = true;
    setLoading(loading);
    fetchRequest(`/restApi/friend/detail/${friendId}`)
      .then((res) => {
        detailCurrent.current = res.result;
        setDetail(res.result || {});
        getList();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const checkEntering = () => {
    const err = 'hold your horses';
    if (!state.afterSysNotice) {
      toast.warning(err);
      return true;
    }

    if (chat.current?.socket?.readyState !== 1) {
      state.entering = false;
      state.aiThinking = false;
      toast.warning('waiting for connection');
      console.log('客户端发送失败，重置重连', chat.current);

      // chat.current?.reconnect();
      return true;
    }

    if (state.entering || state.aiThinking) {
      toast.warning(err);
      return true;
    }

    return false;
  };

  const sendMsgFail = () => {
    toast.warning(`waiting for connection...`);
    state.entering = false;
    state.aiThinking = false;

    setTimeout(() => {
      getList();
    }, 500);
  };

  /**
   * 开启动画, 目前是购买狗粮和喂养狗粮调用
   * @param {string} source 来源
   */
  const showAnimationFun = (source: VideoName.FEED | VideoName.FOOD) => {
    setVideoPlayerName(source);
  };

  usePublicSocket(showAnimationFun);

  useBusWatch(_P + 'onSocketMessage', onSocketMessage);
  useBusWatch(_P + 'sendMsgFail', sendMsgFail);
  useBusWatch(_P + 'onSocketReadyState', (e) => {
    if (
      e.target.url ===
      `${AppConfigEnv.WSS}restApi/chatMessage/websocket/${state.friendId}`
    ) {
      setReadyState(e.target.readyState);
    }
  });

  useEffect(() => {
    if (friendId) {
      state.friendId = friendId;
      getDetail();
      chat.current.connect(
        `${AppConfigEnv.WSS}restApi/chatMessage/websocket/${state.friendId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendId]);

  useEffect(() => {
    if (recordListLength.current < list!.length) {
      scrollToBottom();
    }
    recordListLength.current = list!.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  return (
    <ChatContext.Provider
      value={{
        state,
        scrollDom,
        detail,
        setDetail,
        onSocketMessage,
        list,
        setList,
        videoData,
        setVideoData,
        queryingPast,
        setQueryingPast,
        curSceneStartT,
        setCurSceneStartT,
        getPast,
        getList,
        newestId,
        readyState,
        checkEntering,
        showAnimationFun,
      }}
    >
      <div className="h-full flex flex-col flex-1 overflow-y-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/bg.jpg"
          alt="bg"
          className="w-full h-full absolute z-[0] left-0 top-0"
        />

        <Navbar></Navbar>

        <div className="overflow-hidden flex-1 flex flex-col relative">
          <ClientChatRecord></ClientChatRecord>
        </div>

        <ClientSendMsg
          sendMsg={sendMsg}
          _P={_P}
          detailCurrent={detailCurrent}
        ></ClientSendMsg>
      </div>

      <ShowIntroductionAnimation _P={_P}></ShowIntroductionAnimation>

      <VideoPlayer
        name={videoPlayerName}
        onEnd={() => {
          setVideoPlayerName(VideoName.NONE);
        }}
      ></VideoPlayer>
    </ChatContext.Provider>
  );
};
