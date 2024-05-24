'use client';
import { Button } from '@/components/Button';
import { useShare } from '@/hooks/use-share';
import { useUserStore } from '@/hooks/use-user';
import { filterImage } from '@/utils/business';
import { debounce } from '@/utils/debounce-throttle';
import { fetchRequest } from '@/utils/request';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { RiLinksFill } from 'react-icons/ri';
import { FaChevronLeft } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { Lists, LoadMore } from '@/components/List';
import { useTranslation } from '@/hooks/useTranslation';
import { LOCALE_KEYS } from '@@/locales';

export default function InvitePage() {
  const { userState } = useUserStore();
  const router = useRouter();
  const { handleShare } = useShare();
  const { t } = useTranslation();
  const [list, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [inviteNumber, setInviteNumber] = useState('0');
  const [inviteAmount, setInviteAmount] = useState('0');
  const pageSize = 10;

  const loadLists = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const { result } = await fetchRequest('/restApi/member/inviteMembers', {
        pageNo,
        pageSize,
        inviteMemberId: userState.id,
      });
      setInviteAmount(result.inviteAmount);
      setInviteNumber(result.inviteNumber);

      setLists((prevLists) => [...prevLists, ...result.page.rows]);
      setHasMore(result.page.total / pageSize > pageNo);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounce(loadLists);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  return (
    <Lists trigger={() => setPageNo((state) => state + 1)} hasMore={hasMore}>
      <div className="sticky top-0 bg-[#fdf6ff] pb-5 z-10">
        <div
          className="absolute top-0 h-16 flex items-center pl-5"
          onClick={() => {
            router.back();
          }}
        >
          <FaChevronLeft className="text-black text-2xl" />
        </div>
        <div className="absolute text-2xl w-48 left-6 bottom-10">
          <span>Invite friends to play can earn $AIPET !</span>
          <Button
            title="Invite"
            className="bg-gradient-to-r from-[#D18EF7] to-[#FA3B67] text-white !w-24 h-9 mt-2"
            click={() => {
              handleShare();
            }}
          ></Button>
        </div>

        <Image
          src="/images/invite.png"
          width={750}
          height={504}
          alt="invite bg"
        ></Image>
      </div>

      <div className="p-5 pb-0 bg-white">
        <div className="border-b border-[#EEEEEE] text-lg pb-5">
          <div className="text-black mb-3">
            {t(LOCALE_KEYS.INVITATION_RECORD)}
          </div>
          <div className="text-[#999999]">
            <span className="pr-2 border-r border-[#D9D9D9]">
              {t(LOCALE_KEYS.TOTAL_INVITATION)}:{' '}
              <span className="text-black">{inviteNumber}</span>
            </span>
            <span className="pl-2">
              {t(LOCALE_KEYS.EARN_AIPET)}:
              <span className="text-black"> {inviteAmount}</span>
            </span>
          </div>
        </div>

        <div className="w-full h-full">
          {list?.map((item) => (
            <div className="py-5 border-b border-[#EEEEEE]" key={item.id}>
              <div className="mb-4 flex justify-between items-center">
                <span className="text-black">{item.created_time}</span>
                <span className="text-[#FF2F53]">+${item.pointChange}</span>
              </div>

              <div className="flex items-center">
                <div className="mr-7 w-[35%]">
                  <div className="mb-1 text-black line-clamp-2 text-ellipsis2">
                    {item.nick_name}
                  </div>
                  <div className="text-sm text-[#666666]">
                    TG:{item.google_openid}
                  </div>
                </div>

                <RiLinksFill className="rotate-45 text-[#999999] text-xl" />

                <div className="flex-1 flex items-center ml-4">
                  <Image
                    width={40}
                    height={40}
                    alt=""
                    src={filterImage(item.friendHead)}
                    className="mr-2 rounded-full overflow-hidden"
                  ></Image>
                  <div className="mr-7 flex-1">
                    <div className=" text-black line-clamp-2 text-ellipsis2">
                      {item.friendName || 'Your Pet'}
                    </div>
                    <div className="text-sm text-[#666666]">LV{item.level}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <LoadMore
            loaded={!hasMore}
            isLoading={loading}
            emit={() => {
              setPageNo((state) => state + 1);
            }}
          ></LoadMore>
        </div>
      </div>
    </Lists>
  );
}
