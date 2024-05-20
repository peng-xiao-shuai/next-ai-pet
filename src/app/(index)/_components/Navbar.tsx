'use client';
import Image from 'next/image';
import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ClientTips } from './ClientTips';
import { ChatContext } from './Client';
import { filterImage } from '@/utils/business';
import { useUserStore } from '@/hooks/use-user';
import { useShare } from '@/hooks/use-share';
import { NumberRoll } from '@/components/NumberRoll';
import { Rules } from '@/components/Rules';
import { useTranslation } from '@/hooks/useTranslation';
import { LOCALE_KEYS } from '@@/locales';
import { SetLang } from './SetLang';
import { CenterPopup } from '@/components/CenterPopup';
import { toast } from 'sonner';
import { fetchRequest } from '@/utils/request';
import { ControlSound } from './ControlSound';
import { cn } from '@/lib/utils';

const numberBox =
  'inline-flex items-center text-xs min-w-20 box-border pr-1 rounded-full bg-gradient-to-t from-[#F1D8B1] to-[#FCF9F3] border border-[#CF9A68]';

export const Navbar: FC<{
  children?: React.ReactNode;
  title?: string;
  back?: () => void;
}> = ({ children, title, back }) => {
  const { detail, setDetail } = useContext(ChatContext);
  const { userState, setData } = useUserStore();
  const [changeNickNameDialogVisible, setChangeNickNameDialogVisible] =
    useState(false);
  const [name, setName] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const counts = useMemo(
    () => [
      {
        iconUrl: '/icons/gold-coin.png',
        alt: 'gold coin',
        val: userState.upgradeRequiredPoint - userState.point,
      },
      {
        iconUrl: '/icons/feed.png',
        alt: 'feed',
        val: userState.walletAble,
      },
      {
        iconUrl: '/icons/invite.png',
        alt: 'invite',
        val: userState.invites,
      },
    ],
    [
      userState.invites,
      userState.point,
      userState.upgradeRequiredPoint,
      userState.walletAble,
    ]
  );
  const [countsExpansion, setCountsExpansion] = useState([false, false, false]);

  const { handleShare } = useShare();
  const { t } = useTranslation();

  const changeNickname = (cb: () => void) => {
    if (!name) {
      toast('');
      return;
    }
    fetchRequest('/restApi/friend/update', {
      id: detail.id,
      name: name,
    }).then(() => {
      setDetail?.((state) => {
        return { ...state, name };
      });
      setChangeNickNameDialogVisible(false);

      cb();
    });
  };

  useEffect(() => {
    if (userState.point >= userState.upgradeRequiredPoint) {
      setData();
    }
  }, [setData, userState.point, userState.upgradeRequiredPoint]);

  return (
    <>
      <div
        className={`px-4 w-full my-[10px] relative z-10 leading-none flex flex-wrap justify-center`}
      >
        <div
          className={`flex justify-between items-center gap-2 mb-[10px] w-full`}
        >
          <div className="relative">
            <ControlSound></ControlSound>
          </div>

          <div
            className={cn(
              'flex flex-1 items-center relative z-10 text-[#874544] border-[#CF9A68] border bg-[#F9E3CD] rounded-[20px] px-[14px] py-[10px]',
              'before:w-[98%] before:h-[94%] before:z-[-1] before:shadow-[inset_0px_0px_7px_0px] before:shadow-[#C19E7D] before:absolute before:left-[1%] before:top-[3%] before:border before:border-[#CF9A68] before:rounded-[18px]'
            )}
          >
            {Boolean(detail.head) && (
              // eslint-disable-next-line @next/next/no-img-element
              <Image
                src={filterImage(detail.head)}
                alt="avatar"
                width={36}
                height={36}
                className="overflow-hidden rounded-full"
              />
            )}

            <div className="pl-2 flex-1 leading-none">
              <span
                className="line-clamp-1 max-w-48 text-ellipsis inline-block"
                onClick={() => {
                  setChangeNickNameDialogVisible(true);

                  setTimeout(() => {
                    setName(detail.name);
                    textAreaRef.current?.setSelectionRange(
                      detail.name.length,
                      detail.name.length
                    );
                  }, 100);
                }}
              >
                {detail.name || t(LOCALE_KEYS.YOUR_PET)}
              </span>

              <div className="flex">
                <div className="min-w-12 h-4 mr-2 text-xs border border-[#CF9A68] inline-flex items-center justify-center gap-1 rounded-full bg-gradient-to-t from-[#F3CF86] to-[#FFF5E0]">
                  <Image
                    width={10}
                    height={12}
                    src="/icons/level.png"
                    alt="level"
                  ></Image>
                  <NumberRoll prefix="Lv" end={userState.level}></NumberRoll>
                </div>

                <div className="flex items-center justify-center relative w-full">
                  <div
                    className={`flex items-center absolute z-10 ${
                      userState.point ||
                      userState.upgradeRequiredPoint > 100000000
                        ? 'text-[9px]'
                        : 'text-xs'
                    } *:max-w-12 *:inline-block *:line-clamp-1 *:text-ellipsis`}
                  >
                    <NumberRoll end={userState.point}></NumberRoll>
                    <div>/</div>
                    <NumberRoll
                      end={userState.upgradeRequiredPoint}
                    ></NumberRoll>
                  </div>
                  <Progress
                    className="h-4 min-w-28 w-full max-w-36 bg-[#EEC39B] border-[#CF9A68] border"
                    value={userState.point % 100}
                    max={userState.upgradeRequiredPoint % 100}
                  />
                </div>

                <Rules className="text-[#C19F80] !size-4"></Rules>
              </div>
            </div>
          </div>

          <div className="relative flex items-center">
            {/* <SetLang></SetLang> */}
            <Image
              src="/icons/share-gold.png"
              width={32}
              height={32}
              alt="share gold"
              onClick={handleShare}
            ></Image>
            {/* <ClientTips
              visible={false}
              className="right-0 translate-y-[20%] w-64"
              cornerClassName="top-0 -translate-y-2/4 right-3 bg-[#F5B5CF]"
              text={'If you invite a new user you will get 200 food'}
            ></ClientTips> */}
          </div>
        </div>

        <div className="inline-flex gap-3 items-center text-[#874544] relative z-10">
          {counts.map((item, index) => (
            <div
              key={item.alt}
              className={numberBox}
              onClick={() => {
                setCountsExpansion((state) => {
                  const CopyState = [...state];
                  CopyState[index] = !CopyState[index];
                  return CopyState;
                });
              }}
            >
              <Image
                src={item.iconUrl}
                width={22}
                height={22}
                alt={item.alt}
                className="mr-1"
              ></Image>

              <NumberRoll
                end={item.val}
                className={`max-w-24 text-ellipsis ${
                  countsExpansion[index] ? 'break-all' : 'line-clamp-1'
                } inline-block`}
              ></NumberRoll>
            </div>
          ))}
        </div>
      </div>

      <CenterPopup
        title={'Set name'}
        confirmText={'Confirm'}
        isBlack
        needClose
        open={changeNickNameDialogVisible}
        onClose={setChangeNickNameDialogVisible}
        onConfirm={changeNickname}
      >
        <textarea
          className="change-nickname__slot outline-none text-base overflow-y-auto resize-none mb-14 p-4 w-full h-26 text-black rounded-xl bg-[#f8f8f8]"
          value={name}
          ref={textAreaRef}
          onChange={({ target }) => {
            setName(target.value);
          }}
        ></textarea>
      </CenterPopup>
    </>
  );
};
