'use client';
import useInterval from '@/hooks/use-interval';
import {
  useTonConnectModal,
  useTonConnectUI,
  CHAIN,
  useTonAddress,
} from '@tonconnect/ui-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TonProofDemoApi } from '@/lib/ton-proofApi';
import { toast } from 'sonner';
import { useUserStore } from '@/hooks/use-user';
import emitter from '@/utils/bus';
import { debounce } from '@/utils/debounce-throttle';
import { useBusWatch } from './use-bus-watch';

interface useConnectWalletProps {
  bindSuccessCB?: () => void;
}

let timer: NodeJS.Timeout;

export const useConnectWallet = ({
  bindSuccessCB,
}: useConnectWalletProps = {}) => {
  const { state, open } = useTonConnectModal();
  const { userState, setDataLocal } = useUserStore();
  const address = useTonAddress(true);
  const [isCheck, setIsCheck] = useState(Boolean(address));
  const firstProofLoading = useRef<boolean>(true);
  const [tonConnectUI] = useTonConnectUI();

  const handleOpen = async () => {
    if (tonConnectUI.connected) {
      await tonConnectUI.disconnect();
    }

    open();
  };

  const recreateProofPayload = useCallback(async () => {
    if (firstProofLoading.current) {
      tonConnectUI?.setConnectRequestParameters({ state: 'loading' });
      firstProofLoading.current = false;
    }

    const payload = await TonProofDemoApi.generatePayload();

    if (payload) {
      tonConnectUI?.setConnectRequestParameters({
        state: 'ready',
        value: payload,
      });
    } else {
      tonConnectUI?.setConnectRequestParameters(null);
    }
  }, [tonConnectUI, firstProofLoading]);

  if (firstProofLoading.current) {
    recreateProofPayload();
  }

  useInterval(recreateProofPayload, TonProofDemoApi.refreshIntervalMs);

  useEffect(() => {
    const unChange = tonConnectUI.onStatusChange((w) => {
      debounce(async () => {
        console.log('w ==>', w);

        if (!w) {
          TonProofDemoApi.reset();
          return;
        }

        if (w.account.chain === CHAIN.TESTNET) {
          toast('You cannot log in using the test network!');
          return;
        }

        if (w.connectItems?.tonProof && 'proof' in w.connectItems.tonProof) {
          try {
            emitter.emit('setGlobalLoading', true);
            setIsCheck(false);
            const { result, ok } = await TonProofDemoApi.checkProof(
              w.connectItems.tonProof.proof,
              w.account
            );

            if (ok) {
              setIsCheck(true);
              setDataLocal(result);
              emitter.emit('bindTonSuccess');
            } else {
              toast('Check failure');
              tonConnectUI.disconnect();
            }
            emitter.emit('setGlobalLoading', false);
          } catch (msg: any) {
            toast(msg);
            emitter.emit('setGlobalLoading', false);
            tonConnectUI.disconnect();
          }
        }
      }, 1000);
    });

    return () => {
      unChange();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   console.log(state.status, 'status');
  //   const overflow = 100;
  //   if (state.status === 'closed') {
  //     timer = setTimeout(() => {
  //       document.body.style.height = window.innerHeight + overflow + 'px';
  //       document.body.style.marginTop = `${overflow}px`;
  //       document.body.style.paddingBottom = `${overflow}px`;

  //       if (/iphone/gi.test(window.navigator.userAgent)) {
  //         window.scrollTo(0, 0);
  //       } else {
  //         window.scrollTo(0, overflow);
  //       }
  //       clearTimeout(timer);
  //       console.log('guanbio', /iphone/gi.test(window.navigator.userAgent));
  //     }, 1000);
  //   } else {
  //     if(timer) {
  //       clearTimeout(timer)
  //     }

  //     document.body.style.height =
  //       window.Telegram.WebApp.viewportStableHeight + 'px';
  //     document.body.style.marginTop = `${0}px`;
  //     document.body.style.paddingBottom = `${0}px`;
  //     document.body.style.top = `${0}px`;

  //     if (/iphone/gi.test(window.navigator.userAgent)) {
  //       window.scrollTo(0, 0);
  //     } else {
  //       window.scrollTo(0, 0);
  //     }
  //   }

  //   return () => {
  //     if(timer) {
  //       clearTimeout(timer)
  //     }
  //   };
  // }, [state]);

  useBusWatch('bindTonSuccess', () => {
    bindSuccessCB?.();
  });

  return {
    handleOpen,
    isCheck,
    state,
    tonConnectUI,
  };
};
