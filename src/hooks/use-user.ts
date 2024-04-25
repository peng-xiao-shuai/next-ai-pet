import { fetchRequest } from '@/utils/request';
import { create } from 'zustand';

const state = {
  id: '',
  head: '',
  nickName: '',
  adultSwitch: '',
  premiumStatus: 'NONE',
  interests: [],
  createdTime: '',
  tonAddress: '',
  premiumEndTime: '',
  hasRejectFriendStyle: '',
  playVideoCount: '',
  sex: '',
  playAllowWatchVideoCount: '',
  notPremiumSentMessageCount: '',
  hasEnterNewChatPage: '',
  hasComment: '',
  inviteMemberId: '',
  inviteCode: '',
  walletAble: 0,
  point: 0,
  level: 1,
  upgradeRequiredPoint: 0,
};

export interface UserStore {
  userState: typeof state;
  clearUser: () => void;
  setDataLocal: (data?: Partial<UserStore['userState']>) => void;
  setData: () => Promise<UserStore['userState']>;
}

export const useUserStore = create<UserStore>()((set) => ({
  userState: {
    ...state,
  },
  clearUser() {
    set(({ userState }) => {
      return {
        userState: {
          ...state,
        },
      };
    });
  },
  setDataLocal(data) {
    set(({ userState }) => {
      return { userState: { ...userState, ...data } };
    });
  },
  setData: () => {
    /**
     * 请求用户信息
     */
    return new Promise((resolve, reject) => {
      fetchRequest('/restApi/member/info')
        .then((res) => {
          if (res.code === 401) {
            reject();
            return;
          }

          set(({ userState }) => {
            return { userState: { ...userState, ...res.result } };
          });

          resolve(res.result);
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    });
  },
}));
