'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useContext } from 'react';
import { PiShareFat } from 'react-icons/pi';
import { Progress } from '@/components/ui/progress';
import { ClientTips } from './ClientTips';
import { ChatContext } from './Client';
import { filterImage } from '@/utils/business';
import { useUserStore } from '@/hooks/use-user';
import { AiFillQuestionCircle } from 'react-icons/ai';

export const Navbar: FC<{
  children?: React.ReactNode;
  title?: string;
  back?: () => void;
}> = ({ children, title, back }) => {
  const { detail } = useContext(ChatContext);
  const { userState } = useUserStore();
  return (
    <>
      <div className={`px-4 w-full mb-3`}>
        <div
          className={`flex justify-between items-center rounded-lg bg-base-300 h-14 `}
        >
          {/* <div
            onClick={() => {
              if (back && typeof back === 'function') {
                back();
              } else {
                router.back();
              }
            }}
          >
            <div className="flex-none leading-none">
              <FaChevronLeft className=" size-6 svg-icon swap-off text-white rtl:rotate-180" />
            </div>
          </div> */}

          <div className="flex">
            {Boolean(detail.head) && (
              <Image
                src={filterImage(detail.head)}
                alt="avatar"
                width={44}
                height={44}
                className="rounded-full overflow-hidden"
              ></Image>
            )}
            <div className="pl-2 text-white">
              <div className="normal-case">{detail.name || 'Your TonPet'}</div>
              <div className="w-12 h-4 py-[2px] inline-flex items-center justify-center gap-1 rounded-full bg-[#4D4D4D]">
                <Image
                  width={10}
                  height={12}
                  src="/icons/level.png"
                  alt="level"
                ></Image>
                <span className="text-xs leading-none">
                  Lv{detail.friendPointDetail?.level}
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/icons/share-gold.png"
              width={28}
              height={28}
              alt="share gold"
            ></Image>
            <ClientTips
              className="right-0 translate-y-[20%] w-64"
              cornerClassName="top-0 -translate-y-2/4 right-3 bg-[#F5B5CF]"
              text={'If you invite a new user you will get 200 food'}
            ></ClientTips>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-white pr-4">
        <div className="py-[6px] px-3 rounded-tr-full rounded-br-full bg-[#4D4D4D]">
          <div className="text-xs flex items-center">
            <span>Next level need</span>
            <AiFillQuestionCircle className="size-[13px] ml-1 text-[#737373]"></AiFillQuestionCircle>
          </div>
          <div className="flex items-center gap-[2px]">
            <Image
              src="/icons/gold-coin.png"
              width={10}
              height={10}
              alt="gold coin"
            ></Image>
            <span className="text-xs">{detail.friendPointDetail?.point}</span>
            <Progress
              className="h-1 w-16 bg-[#947782]"
              value={detail.friendPointDetail?.point}
              max={detail.friendPointDetail?.upgradeRequiredPoint}
            />
          </div>
        </div>

        <div className="flex gap-[6px]">
          <div className="flex  items-center pl-1 py-1 pr-2 bg-[#4D4D4D] rounded-full gap-[2px]">
            <Image
              src="/icons/gold-coin.png"
              width={14}
              height={14}
              alt="gold coin"
            ></Image>
            <span className="text-sm font-bold">
              {detail.friendPointDetail?.point}
            </span>
          </div>
          <div className="flex  items-center pl-1 py-1 pr-2 bg-[#4D4D4D] rounded-full gap-[2px]">
            <Image
              src="/icons/feed.png"
              width={14}
              height={14}
              alt="food"
            ></Image>
            <span className="text-sm font-bold">{userState.walletAble}</span>
          </div>
        </div>
      </div>
    </>
  );
};
