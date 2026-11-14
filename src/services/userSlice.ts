import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import type { TUser } from '@utils-types';

export type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  isLoading: false,
  error: null
};

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await dispatch(getUser())
        .unwrap()
        .catch(() => undefined);
    }
    dispatch(authChecked());
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const data = await getUserApi();
  return data.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    const data = await updateUserApi(user);
    return data.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки пользователя';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const { authChecked } = userSlice.actions;
export const userReducer = userSlice.reducer;
