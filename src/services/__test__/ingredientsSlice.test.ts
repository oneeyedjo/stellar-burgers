import { ingredientsReducer, getIngredients } from '../ingredientsSlice';

describe('Тестирование ingredientsSlice', () => {
  test('должен вернуть initial state при неизвестном экшене и undefined', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('должен обработать getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(undefined, action);
    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('должен обработать getIngredients.fulfilled', () => {
    const mockIngredients = [{ _id: '1', name: 'Булка', type: 'bun', price: 100 }];
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(undefined, action);
    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  test('должен обработать getIngredients.rejected', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = ingredientsReducer(undefined, action);
    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка загрузки'
    });
  });
});
