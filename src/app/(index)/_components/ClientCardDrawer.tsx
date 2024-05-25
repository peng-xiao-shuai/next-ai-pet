'use client';
import { Button } from '@/components/Button';
import Image from 'next/image';
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import { ClientChatDrawer } from './ClientChatDrawer';
// import { useUserStore } from '@/hooks/use-user';
import { fetchRequest } from '@/utils/request';
import { ChatContext } from './Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lists, LoadMore } from '@/components/List';
import { filterImage } from '@/utils/business';
import { LOCALE_KEYS } from '@@/locales';
import { useTranslation } from '@/hooks/useTranslation';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { toast } from 'sonner';
// import { LOCALE_KEYS } from '@@/locales';
// import { useTranslation } from '@/hooks/useTranslation';
// import { CustomEvents, handleTriggerEvent } from '@/utils/GA-event';
// import emitter from '@/utils/bus';

enum CardType {
  /**
   * "集卡图片（Collection）"
   */
  IMAGE_COLLECTION = 'IMAGE_COLLECTION',

  /**
   * "集卡图片（Rare）"
   */
  IMAGE_RARE = 'IMAGE_RARE',

  /**
   * "集卡图片（Golden）"
   */
  IMAGE_GOLDEN = 'IMAGE_GOLDEN',
}

export const cacheCard: {
  [k in CardType]: {
    data: Cards[];
    pageNo: number;
    hasMore: boolean;
    label: string;
    color: string;
    desc: LOCALE_KEYS;
  };
} = {
  [CardType.IMAGE_COLLECTION]: {
    data: [],
    pageNo: 1,
    hasMore: true,
    label: 'Collection',
    color: '#A3B055',
    desc: LOCALE_KEYS.GET_A_COLLECTION_CARD,
  },
  [CardType.IMAGE_GOLDEN]: {
    data: [],
    pageNo: 1,
    hasMore: true,
    label: 'Golden',
    color: '#E8C46E',
    desc: LOCALE_KEYS.GET_A_GOLDEN_CARD,
  },
  [CardType.IMAGE_RARE]: {
    data: [],
    pageNo: 1,
    hasMore: true,
    label: 'Rare',
    color: '#B87DEA',
    desc: LOCALE_KEYS.GET_A_RARE_CARD,
  },
};

const tabs = [
  {
    value: CardType.IMAGE_COLLECTION,
    label: 'Collection',
  },
  {
    value: CardType.IMAGE_RARE,
    label: 'Rare',
  },
  {
    value: CardType.IMAGE_GOLDEN,
    label: 'Golden',
  },
];

export type Cards = {
  /**
   * "ID"
   */
  id: string;
  /**
   * "图片URL"
   */
  url: string;
  /**
   * 资源类型
   */
  resourceType: CardType;
};

let isToast = false;

export const ClientCardDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ drawerVisible, setDrawerVisible }) => {
  const pageSize = 10;
  const { t } = useTranslation();
  const { state } = useContext(ChatContext);
  const [cards, setCards] = useState<Cards[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState(CardType.IMAGE_COLLECTION);

  const getCards = async (type: CardType) => {
    if (!state?.friendId) return;
    if (!cacheCard[type].hasMore) {
      setCards(cacheCard[type].data);
      return;
    }
    setLoading(true);
    const { result } = await fetchRequest('/restApi/friendTrack/list', {
      friendId: state?.friendId,
      resourceType: type,
      pageNo: cacheCard[type].pageNo,
    });

    setLoading(false);
    cacheCard[type].data = [
      ...(cacheCard[type].pageNo > 1 ? cacheCard[type].data : []),
      ...(result.rows as Cards[]),
    ];

    if (!cacheCard[type].data.length && isToast) {
      isToast = false;
      toast(
        'Your dog will go out and take photo as collection for you, some of them will have special value! Please wait for your dog to take photo back for you ',
        {
          duration: 2000,
        }
      );
    }
    setCards(cacheCard[type].data);

    /**
     * 设置是否还有更多
     */
    cacheCard[type].hasMore = result.total / pageSize > cacheCard[type].pageNo;

    setHasMore(cacheCard[type].hasMore);
  };

  useBusWatch('setCard', (data: Cards) => {
    console.log(cacheCard[data.resourceType], '10-----------------------');
    cacheCard[data.resourceType]?.data?.push(data);
  });

  useEffect(() => {
    isToast = drawerVisible;
    if (drawerVisible) {
      // Object.keys(cacheCard).forEach((item) => {
      //   const key = item as CardType;
      //   cacheCard[key] = {
      //     ...cacheCard[key],
      //     data: [],
      //     pageNo: 1,
      //     hasMore: true,
      //   };
      // });
      getCards(CardType.IMAGE_COLLECTION);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerVisible]);

  return (
    <ClientChatDrawer
      drawerVisible={drawerVisible}
      title={t(LOCALE_KEYS.CARDS)}
      setDrawerVisible={setDrawerVisible}
    >
      <Tabs
        defaultValue={cardType}
        onValueChange={(val) => {
          setCardType(val as CardType);
          getCards(val as CardType);
        }}
        className="w-full"
      >
        <TabsList className="w-full *:flex-1 *:shadow-none">
          {tabs.map((item) => (
            <TabsTrigger
              className="data-[state=active]:!text-[#BF8154] text-base text-[#7F6957]"
              value={item.value}
              key={item.value}
              disabled={loading}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={cardType}>
          <Lists
            className="grid grid-cols-2 gap-5 max-h-[50vh] min-h-[50vh]"
            hasMore={hasMore}
            trigger={() => {
              cacheCard[cardType].pageNo += 1;
              getCards(cardType);
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className={`rounded-xl border-[6px] w-full h-full overflow-hidden min-w-16 min-h-24 max-h-[218px]`}
                style={{
                  borderColor: cacheCard[cardType].color,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={filterImage(card.url)}
                  alt=""
                  className="!static border-2 border-[#FEF4F2] rounded-[8px] w-full h-full"
                />
              </div>
            ))}
          </Lists>
          <LoadMore loaded={!hasMore} isLoading={loading}></LoadMore>
        </TabsContent>
      </Tabs>
    </ClientChatDrawer>
  );
};
