'use client';
import { Button } from '@/components/Button';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ClientChatDrawer } from './ClientChatDrawer';
import { useConnectWallet } from '@/hooks/use-connect-wallet';
import { useTonAddress } from '@tonconnect/ui-react';
import { fetchRequest } from '@/utils/request';
import LoadingRender from '@/app/loading';
import { beginCell, toNano } from 'ton';
import { toast } from 'sonner';

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
  const [loading, setLoading] = useState(false);
  const [feedValue, setFeedValue] = useState<Package | null>(null);
  const [loadingLoadPackage, setLoadingLoadPackage] = useState(false);
  const address = useTonAddress(true);
  const { handleOpen, isCheck, tonConnectUI } = useConnectWallet();
  const [topUpPackage, setTopUpPackage] = useState<Package[]>([]);

  useEffect(() => {
    if (drawerVisible) {
      getTopUpPackage();

      if (address) {
        window.Telegram?.WebApp.MainButton.setText(
          address.substring(0, 4) +
            '...' +
            address.substring(address.length - 4)
        );
      }

      window.Telegram?.WebApp.MainButton.show();
      window.Telegram?.WebApp.MainButton.onClick(handleOpen);
    } else {
      window.Telegram?.WebApp.MainButton.offClick(handleOpen);
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
            address: 'UQDqcDBO_RHKVjnNtU1op0nnwh1ROWNSdE8e7UOp-tTbBFiV',
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
      toast(
        'We are comfiring the payment, please wait and VIP is on the road!'
      );

      setLoading(false);
    } catch (error: any) {
      toast(error.message);
      setLoading(false);
    }
  };

  return (
    <ClientChatDrawer
      drawerVisible={drawerVisible}
      title="Food"
      setDrawerVisible={setDrawerVisible}
    >
      {loadingLoadPackage && topUpPackage.length === 0 ? (
        <div className="h-40 w-full bg-[#1D1C21] rounded-2xl mb-14">
          <LoadingRender />
        </div>
      ) : (
        <div className="actions-list grid grid-cols-2 gap-y-4 gap-x-4 mb-14">
          {topUpPackage.map((item) => (
            <div
              key={item.price}
              className={cn(
                'h-28 w-full bg-[#1D1C21] flex flex-wrap justify-center content-center rounded-2xl border-[#FDCD62]',
                item == feedValue ? 'border-2' : ''
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
                <span className="text-2xl font-bold text-white text-center">
                  {item.amount}
                </span>
              </div>
              <span className="text-[#8E8D92]">{item.price}Ton</span>
            </div>
          ))}
        </div>
      )}

      <Button
        title={'Buy'}
        click={() => {
          if (!address && !isCheck) {
            return handleOpen();
          }

          tonSendTransaction();
        }}
        disabled={loading}
        className={cn(
          'h-11 bg-gradient-to-r to-[#D18EF7] from-[#FA3B67] mb-0 text-white text-sm',
          !address && !isCheck ? 'grayscale' : ''
        )}
      ></Button>
    </ClientChatDrawer>
  );
};
