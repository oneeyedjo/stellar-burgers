import type { RootState } from './store';

// --- User ---
export const isAuthCheckedSelector = (state: RootState): boolean =>
  state.user.isAuthChecked;

export const userDataSelector = (state: RootState) => state.user.user;

export const userLoadingSelector = (state: RootState): boolean =>
  state.user.isLoading;

export const userErrorSelector = (state: RootState): string | null =>
  state.user.error;

// --- Ingredients ---
export const ingredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;

export const ingredientsLoadingSelector = (state: RootState): boolean =>
  state.ingredients.isLoading;

export const ingredientsErrorSelector = (state: RootState): string | null =>
  state.ingredients.error;

// --- Orders ---
export const feedSelector = (state: RootState) => state.orders.feed;

export const feedTotalSelector = (state: RootState): number =>
  state.orders.total;

export const feedTotalTodaySelector = (state: RootState): number =>
  state.orders.totalToday;

export const userOrdersSelector = (state: RootState) =>
  state.orders.userOrders;

export const ordersLoadingSelector = (state: RootState): boolean =>
  state.orders.isLoading;

export const ordersErrorSelector = (state: RootState): string | null =>
  state.orders.error;

// --- Constructor ---
export const constructorBunSelector = (state: RootState) =>
  state.burgerConstructor.bun;

export const constructorIngredientsSelector = (state: RootState) =>
  state.burgerConstructor.ingredients;

// --- Order ---
export const orderRequestSelector = (state: RootState): boolean =>
  state.order.orderRequest;

export const orderModalDataSelector = (state: RootState) =>
  state.order.orderModalData;
