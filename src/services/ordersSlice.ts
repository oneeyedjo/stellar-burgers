import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi, getOrdersApi } from '@api';
import type { TOrder } from '@utils-types';

export type TOrdersState = {
  feed: TOrder[];
  total: number;
  totalToday: number;
  userOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  feed: [],
  total: 0,
  totalToday: 0,
  userOrders: [],
  isLoading: false,
  error: null
};

export const getFeeds = createAsyncThunk('orders/getFeeds', async () =>
  await getFeedsApi()
);

export const getOrders = createAsyncThunk('orders/getOrders', async () =>
  await getOrdersApi()
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getFeeds
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ленты';
      })
      // getOrders
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки истории';
      });
  }
});

export const ordersReducer = ordersSlice.reducer;
