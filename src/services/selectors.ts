import type { RootState } from './store';

// --- User ---
export const isAuthCheckedSelector = (state: RootState): boolean =>
  state.user.isAuthChecked;

export const userDataSelector = (state: RootState) =>
  state.user.user;

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
