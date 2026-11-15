import { ingredientsReducer, getIngredients } from '../ingredientsSlice';

describe('Тестирование ingredientsSlice', () => {
  test('должен вернуть initial state при неизвестном экшене и undefined', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual({ ingredients: [], isLoading: false, error: null });
  });

  test('должен обработать getIngredients.pending', () => {
    const stateWithError = { ingredients: [], isLoading: false, error: 'Старая ошибка' };
    const state = ingredientsReducer(stateWithError, getIngredients.pending('requestId'));
    expect(state).toEqual({ ingredients: [], isLoading: true, error: null });
  });

  test('должен обработать getIngredients.fulfilled', () => {
    const mockIngredients = [{ _id: '1', name: 'Булка' }] as any;
    const loadingState = { ingredients: [], isLoading: true, error: null };
    const state = ingredientsReducer(loadingState, getIngredients.fulfilled(mockIngredients, 'requestId'));
    expect(state).toEqual({ ingredients: mockIngredients, isLoading: false, error: null });
  });

  test('должен обработать getIngredients.rejected', () => {
    const loadingState = { ingredients: [], isLoading: true, error: null };
    const state = ingredientsReducer(loadingState, getIngredients.rejected(new Error('Ошибка загрузки'), 'requestId'));
    expect(state).toEqual({ ingredients: [], isLoading: false, error: 'Ошибка загрузки' });
  });
});
