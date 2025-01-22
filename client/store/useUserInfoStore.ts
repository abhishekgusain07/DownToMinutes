import { create } from 'zustand'

interface UserInfoState {
  userInfo: {
    name: string;
    email: string;
    image: string;
  };
  setUserInfo: (userInfo: UserInfoState['userInfo']) => void;
}

export const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: {
    name: '',
    email: '',
    image: '',
  },
  setUserInfo: (userInfo: UserInfoState['userInfo']) => set({ userInfo }),
}))
