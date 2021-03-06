import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '../constant';

export interface UserInfoState {
  avatar: string;
  nickname: string;
  username: string;
  website?: string;
  introduction?: string;
  bio?: string;
  role?: UserRole | undefined;
  telegram: string;
  twitter: string;
  email: string;
  medium: string;
  facebook: string;
}

const initialState: UserInfoState = {
  avatar: '',
  nickname: '',
  username: '',
  website: '',
  introduction: '',
  telegram: '',
  twitter: '',
  email: '',
  medium: '',
  facebook: '',
};

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    updateUserInfo: (state, action: PayloadAction<UserInfoState>) => {
      state = action.payload;
    },
  },
});

export const { updateUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
