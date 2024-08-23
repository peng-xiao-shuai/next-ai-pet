'use client';

import { useEffect, useState } from 'react';

// import { useEffect, useState } from 'react';
// import { Client } from './_components/Client';
// import { ClientCreatePet } from './_components/CreatePet';
import Cookies from 'js-cookie';
// import { Loading } from '@/components/Loading';
// import { useUserStore } from '@/hooks/use-user';
// import { fetchRequest } from '@/utils/request';
// import { StepType, TourProvider, useTour } from '@reactour/tour';
// import { LOCALE_KEYS } from '@@/locales';
// import { useTranslation } from '@/hooks/useTranslation';
// import { _steps } from '@/utils/stpes';

// export function Home() {
//   const { userState } = useUserStore();
//   const [friendId, setFriendId] = useState<string | undefined>(undefined);
//   const [loading, setLoading] = useState(true);
//   const [isPet, setIsPet] = useState(false);
//   const [currentStep, setCurrentStep] = useState(0);
//   const { t } = useTranslation();
//   const [steps] = useState<StepType[]>(
//     _steps.map((item) => ({
//       ...item,
//       content: t(item.content as LOCALE_KEYS, item._contentArg || []),
//     }))
//   );

//   useEffect(() => {
//     if (friendId) {
//       setLoading(false);
//       setIsPet(true);
//       return;
//     }

//     const petCount = Number(Cookies.get('isPet'));
//     if (!Number.isNaN(petCount)) {
//       setIsPet(petCount > 0);
//       setLoading(false);

//       if (petCount > 0) {
//         fetchRequest('/restApi/friend/list/v2').then(({ result }) => {
//           if (result.conversations?.rows?.length) {
//             setFriendId(result.conversations.rows[0].id);
//           }
//         });
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userState]);

//   if (loading) {
//     return <Loading></Loading>;
//   }

//   return (
//     <>
//       {!isPet ? (
//         <ClientCreatePet
//           setIsPet={setIsPet}
//           setFriendId={setFriendId}
//         ></ClientCreatePet>
//       ) : (
//         <TourProvider
//           steps={steps}
//           currentStep={currentStep}
//           position="bottom"
//           showNavigation={false}
//           showBadge={false}
//           showCloseButton={false}
//           maskClassName="reactour__mask transition-all duration-300"
//           className="guide-popover !bg-[#FFEFE0] border-2 text-lg leading-5 border-[#FFD65F] !text-[#643C28] rounded-t-[36px] rounded-b-2xl !px-4 !py-3"
//           onClickMask={() => {}}
//           styles={{
//             close: (base) => ({
//               ...base,
//               top: '12px',
//               right: '12px',
//               height: '12px',
//               width: '12px',
//             }),
//             // @ts-ignore
//             maskArea: (base) => ({
//               ...base,
//               fill: 'white',
//             }),
//           }}
//         >
//           <div className="w-full h-full bg-[#d4a252]">
//             <Client
//               friendId={friendId}
//               className={`duration-200 transition-all`}
//             ></Client>
//           </div>
//         </TourProvider>
//       )}
//     </>
//   );
// }

export default function HomePage() {
  const [initData, setInitData] = useState('');
  const click = () => {
    window.TG_SDK.openPayPopup({
      title: '首冲礼包',
      message: '首冲礼包 ￥6 获得 xxx 钻石',
      /**
       * Stars 必须为整数
       */
      amount: '1',
      /**
       * 有概率支付失败，随机数可能会重复
       */
      order_id: String(Math.round(Math.random() * 10000)),
      start: () => {
        console.log('开始支付');
      },
      result: (status: any) => {
        console.log('支付状态 status', status);
      },
    });
  };

  const loginClick = () => {
    setInitData('');

    window.TG_SDK.login({
      cb: ({ status, data }: any) => {
        if (status === 'success') {
          setInitData(JSON.stringify(data));
          /**
           * 将 token 存储 cookie
           */
          Cookies.set('token', data.token);
        }
      },
    });
  };
  return (
    <div className="max-w-[80vw] mx-auto pt-10">
      <div className="flex justify-center gap-4">
        <div>
          <button
            className="btn py-2 border rounded-[0.5rem] border-white w-full text-white text-2xl"
            onClick={click}
          >
            Pay
          </button>

          <div
            className="text-white mt-4 mb-6"
            dangerouslySetInnerHTML={{
              __html: `
              window.TG_SDK.openPayPopup({</br>
              &emsp;title: '首冲礼包',</br>
              &emsp;message: '首冲礼包 ￥6 获得 xxx 钻石',</br>
              &emsp;/**</br>
              &emsp; * Stars 必须为整数</br>
              &emsp; */</br>
              &emsp;amount: '1',</br>
              &emsp;/**</br>
              &emsp; * 有概率支付失败，随机数可能会重复</br>
              &emsp; */</br>
              &emsp;order_id: String(Math.round(Math.random() * 10000)),</br>
              &emsp;start: () => {</br>
              &emsp;&emsp;console.log('开始支付');</br>
              &emsp;},</br>
              &emsp;result: (status: any) => {</br>
              &emsp;&emsp;console.log('支付状态 status', status);</br>
              &emsp;},</br>
              })`,
            }}
          ></div>
        </div>

        <div>
          <button
            className="btn py-2 border rounded-[0.5rem] border-white w-full text-white text-2xl"
            onClick={loginClick}
          >
            Login
          </button>

          <div
            className="text-white mt-4 mb-6"
            dangerouslySetInnerHTML={{
              __html: `
              window.TG_SDK.login({</br>
              &emsp;cb: ({ status, data }: any) => {</br>
              &emsp;&emsp;if (status === 'success') {</br>
              &emsp;&emsp;&emsp;setInitData(JSON.stringify(data));</br>
              &emsp;&emsp;&emsp;/**</br>
              &emsp;&emsp;&emsp; * 将 token 存储 cookie</br>
              &emsp;&emsp;&emsp; */</br>
              &emsp;&emsp;&emsp;Cookies.set('token', data.token);</br>
              &emsp;&emsp;}</br>
              &emsp;},</br>
              })`,
            }}
          ></div>
        </div>
      </div>

      <div className="w-[80vw] mx-auto break-words text-white">
        <div className="font-bold">登录返回：</div>
        {initData}
      </div>
    </div>
  );
}
