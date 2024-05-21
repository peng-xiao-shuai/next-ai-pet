'use client';
import { Button } from '@/components/Button';
import Image from 'next/image';
import {
  Dispatch,
  FC,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { cn } from '@/lib/utils';
import { ClientChatDrawer } from './ClientChatDrawer';
import { useConnectWallet } from '@/hooks/use-connect-wallet';
import { useTonAddress } from '@tonconnect/ui-react';
import { fetchRequest } from '@/utils/request';
import LoadingRender from '@/app/loading';
import { beginCell, toNano } from 'ton';
import { toast } from 'sonner';
import { VideoName } from './ShowAnimation';
import { ChatContext } from './Client';
import { LOCALE_KEYS } from '@@/locales';
import { useTranslation } from '@/hooks/useTranslation';
import { CustomEvents, handleTriggerEvent } from '@/utils/GA-event';

export const ClientFoodDrawer: FC<{
  drawerVisible: boolean;
  setDrawerVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ drawerVisible, setDrawerVisible }) => {
  type Package = {
    id: string;
    price: number;
    amount: number;
    createTime: string;
    putaway: number;
    sort: number;
    updateTime: string;
    validated: number;
    version: number;
  };
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [feedValue, setFeedValue] = useState<Package | null>(null);
  const [loadingLoadPackage, setLoadingLoadPackage] = useState(false);
  const address = useTonAddress(true);
  const { handleOpen, isCheck, tonConnectUI, state } = useConnectWallet({
    bindSuccessCB: () => {
      if (drawerVisible && !isCheck && !address) {
        tonSendTransaction();
      }
    },
  });
  const [topUpPackage, setTopUpPackage] = useState<Package[]>([]);

  useEffect(() => {
    if (drawerVisible) {
      getTopUpPackage();

      handleTriggerEvent([
        {
          eventAction: CustomEvents.NUMBER_OF_VISITORS_TO_BUY_DOG_FOOD_PAGE,
          isSetCookie: true,
        },
      ]);

      // if (address && isCheck) {
      //   window.Telegram?.WebApp.MainButton.setText(
      //     address.substring(0, 4) +
      //       '...' +
      //       address.substring(address.length - 4)
      //   );
      //   window.Telegram?.WebApp.MainButton.show();
      // } else {
      window.Telegram?.WebApp.MainButton.hide();
      // }
    } else {
      window.Telegram?.WebApp.MainButton.hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, drawerVisible, isCheck]);

  const getTopUpPackage = async () => {
    setLoadingLoadPackage(true);
    const { result } = await fetchRequest('/restApi/recharge/package/list');
    const data = result.rows.map((item: Package) => ({
      ...item,
      price: item.price / 100,
    }));
    setTopUpPackage(data);
    setFeedValue(data[0]);
    setLoadingLoadPackage(false);
  };

  /**
   * 实际发起支付
   */
  const tonSendTransaction = async () => {
    setLoading(true);

    try {
      const { result } = await fetchRequest('/restApi/recharge/createOrder', {
        packageId: feedValue!.id,
      });
      const { boc } = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: 'UQCQDthXIzPPvPOBckZMr4d1ObrMp2nimwcaAKMFhn4RF7PE',
            amount: toNano(result.price / 100).toString(),
            payload: beginCell()
              .storeUint(0, 32)
              .storeStringTail(result.id)
              .endCell()
              .toBoc()
              .toString('base64'),
          },
        ],
      });

      handleTriggerEvent([
        {
          eventAction: CustomEvents.BUY_DOG_FOOD_USERS,
          isSetCookie: true,
        },
      ]);

      toast(t(LOCALE_KEYS.PURCHASE_SUCCEEDS, [feedValue?.amount]));
      setDrawerVisible(false);
      setLoading(false);
    } catch (error: any) {
      /**
       * FIX 修复禁止tg滚动功能导致取消支付会导致页面往下掉
       */
      // document.body.style.height = window.innerHeight + 'px';
      // document.body.style.marginTop = `${0}px`;
      // window.scrollTo(0, 0);

      toast(error.message);
      setLoading(false);
    }
  };

  const setVisible = useCallback<Dispatch<SetStateAction<boolean>>>(
    (value: SetStateAction<boolean>) => {
      if (state.status === 'closed') {
        return setDrawerVisible(value);
      } else {
        return () => {};
      }
    },
    [setDrawerVisible, state.status]
  );

  return (
    <ClientChatDrawer
      drawerVisible={drawerVisible}
      title={t(LOCALE_KEYS.FOOD)}
      setDrawerVisible={setVisible}
    >
      {loadingLoadPackage && topUpPackage.length === 0 ? (
        <div className="h-40 w-full overflow-hidden rounded-2xl mb-14">
          <LoadingRender />
        </div>
      ) : (
        <div className="actions-list grid grid-cols-2 gap-y-4 gap-x-4 mb-14">
          {topUpPackage.map((item) => (
            <div
              key={item.price}
              className={cn(
                'h-28 w-full bg-[#fffcf7] flex flex-wrap justify-center content-center rounded-2xl border-2 border-[#D3B996] transition-all duration-300',
                item == feedValue ? '!border-[#FDCD62] !bg-[#fff7d5]' : ''
              )}
              onClick={() => {
                setFeedValue(item);
              }}
            >
              <div className="flex gap-1 w-full items-center justify-center mb-3">
                <Image
                  src="/icons/feed.png"
                  width={28}
                  height={28}
                  alt={item + ' feed'}
                ></Image>
                <span
                  className="text-2xl font-bold text-center"
                  style={{
                    color: item === feedValue ? '#F1B62D' : '#7F6957',
                  }}
                >
                  {item.amount}
                </span>
              </div>
              <span
                style={{
                  color: item === feedValue ? '#7F6957' : '#8E8D92',
                }}
              >
                {item.price}Ton
              </span>
            </div>
          ))}
        </div>
      )}

      <Button
        click={() => {
          if (!address && !isCheck) {
            handleOpen();
          } else {
            tonSendTransaction();
          }
        }}
        disabled={loading}
        className={cn(
          'duration-300 transition-all border-2 border-[#A55636] bg-[#FFD262] text-[#FFFAEF] !mb-0'
        )}
      >
        <div
          className="bg-[#84420B] w-full h-full flex items-center justify-center rounded-full"
          style={{
            boxShadow: '0px 1px 1px white inset',
            WebkitTextStroke: '3px transparent',
            // @ts-ignore
            '-webkit-background-clip': 'text',
          }}
        >
          {t(LOCALE_KEYS.BUY)}
        </div>
      </Button>
    </ClientChatDrawer>
  );
};
