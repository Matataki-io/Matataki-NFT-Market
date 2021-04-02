import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserInfoState {
  avatar: string;
  nickname: string;
  username: string;
  website?: string;
  introduction?: string;
}

const initialState: UserInfoState = {
  avatar:
    'https://ipfs.fleek.co/ipfs/bafybeiewtexosej5yp2odjxiufbgjt6zs677cczqidximkz5x3i47wahke',
  nickname: 'Garfield550',
  username: 'garfield550',
  website: 'https://550.moe',
  introduction: 'Hello world!',
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
