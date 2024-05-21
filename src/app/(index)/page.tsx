'use client';
import { useEffect, useState } from 'react';
import { Client } from './_components/Client';
import { ClientCreatePet } from './_components/CreatePet';
import Cookies from 'js-cookie';
import { Loading } from '@/components/Loading';
import { useUserStore } from '@/hooks/use-user';
import { fetchRequest } from '@/utils/request';
import { StepType, TourProvider, useTour } from '@reactour/tour';
import { LOCALE_KEYS } from '@@/locales';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const { userState } = useUserStore();
  const [friendId, setFriendId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isPet, setIsPet] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();
  const [steps] = useState<StepType[]>([
    {
      selector: '#input-step',
      content: t(LOCALE_KEYS.SEND_MESSAGES_TO_EARN_$PETS),
      padding: { popover: [0, 0] },
      styles: {
        popover: (base) => ({
          ...base,
          width: '180px',
          left: 'unset',
          right: '20px',
        }),
      },
    },
    {
      selector: '#first-step',
      content: t(LOCALE_KEYS.PLEASE_CHOOSE_AN_ACTION_TO_TOUCH_YOUR_PET),
      padding: { popover: [40, 0] },
      styles: {
        popover: (base) => ({
          ...base,
          width: '250px',
        }),
      },
    },
    {
      selector: '#dog-bowl',
      content: t(LOCALE_KEYS.CLICK_TO_FEED_YOUR_PET_FOOD),
      position: 'right',
      styles: {
        popover: (base) => ({
          ...base,
          width: '200px',
        }),
      },
    },
  ]);

  useEffect(() => {
    if (friendId) {
      setLoading(false);
      setIsPet(true);
      return;
    }

    const petCount = Number(Cookies.get('isPet'));
    if (!Number.isNaN(petCount)) {
      setIsPet(petCount > 0);
      setLoading(false);

      if (petCount > 0) {
        fetchRequest('/restApi/friend/list/v2').then(({ result }) => {
          if (result.conversations?.rows?.length) {
            setFriendId(result.conversations.rows[0].id);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState]);

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      {!isPet ? (
        <ClientCreatePet
          setIsPet={setIsPet}
          setFriendId={setFriendId}
        ></ClientCreatePet>
      ) : (
        <TourProvider
          steps={steps}
          currentStep={currentStep}
          position="bottom"
          showNavigation={false}
          showBadge={false}
          showCloseButton={false}
          maskClassName="reactour__mask transition-all duration-300"
          className="guide-popover !bg-[#FFEFE0] border-2 text-lg leading-5 border-[#FFD65F] !text-[#643C28] rounded-t-[36px] rounded-b-2xl !px-4 !py-3"
          onClickMask={() => {}}
          styles={{
            close: (base) => ({
              ...base,
              top: '12px',
              right: '12px',
              height: '12px',
              width: '12px',
            }),
            // @ts-ignore
            maskArea: (base) => ({
              ...base,
              fill: 'white',
            }),
          }}
        >
          <Client
            friendId={friendId}
            className={`duration-200 transition-all`}
          ></Client>
        </TourProvider>
      )}
    </>
  );
}
