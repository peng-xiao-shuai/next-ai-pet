'use client';
import { useEffect, useState } from 'react';
import { Client } from './_components/Client';
import { ClientCreatePet } from './_components/CreatePet';
import Cookies from 'js-cookie';
import { Loading } from '@/components/Loading';
import { useUserStore } from '@/hooks/use-user';
import { fetchRequest } from '@/utils/request';
import { TourProvider } from '@reactour/tour';
import { LOCALE_KEYS } from '@@/locales';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const { userState } = useUserStore();
  const [friendId, setFriendId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isPet, setIsPet] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();

  const steps = [
    {
      selector: '#first-step',
      content: t(LOCALE_KEYS.PLEASE_CHOOSE_AN_ACTION_TO_TOUCH_YOUR_PET),
    },
    // {
    //   selector: '.second-step',
    //   content: 'This is the second Step',
    // },
    // {
    //   selector: '.third-step',
    //   content: 'This is the third Step',
    // },
  ];

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
          styles={{
            close: (base) => ({
              ...base,
              top: '12px',
              right: '12px',
              height: '12px',
              width: '12px',
            }),
            dot: () => ({
              display: 'none',
            }),
            badge: () => ({
              display: 'none',
            }),
            arrow: () => ({
              display: 'none',
            }),
            controls: () => ({
              display: 'none',
            }),

            popover: (base) => ({
              ...base,
              top: '10px',
              borderRadius: '12px',
              padding: '24px 16px',
            }),
            // @ts-ignore
            maskArea: (base) => ({
              ...base,
              rx: '12px',
            }),
          }}
          setCurrentStep={() => {
            // if (currentStep === steps.length - 1) {
            //   setCurrentStep(0);
            // } else {
            //   setCurrentStep(currentStep + 1);
            // }
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
