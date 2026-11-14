import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import type { TConstructorIngredient } from '@utils-types';

describe('Тестирование constructorSlice', () => {
  const mockBun = { _id: '1', name: 'Булка', type: 'bun', price: 100, id: 'id1' } as TConstructorIngredient;
  const mockMain = { _id: '2', name: 'Котлета', type: 'main', price: 200, id: 'id2' } as TConstructorIngredient;
  const mockSauce = { _id: '3', name: 'Соус', type: 'sauce', price: 50, id: 'id3' } as TConstructorIngredient;

  test('должен вернуть initial state при неизвестном экшене и undefined', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('должен добавить булку (addIngredient)', () => {
    const action = addIngredient(mockBun);
    const state = constructorReducer(undefined, action);
    expect(state.bun).toBeDefined();
    expect(state.bun?.name).toBe('Булка');
    expect(state.bun?.id).toBeDefined();
    expect(state.ingredients).toEqual([]);
  });

  test('должен добавить начинку (addIngredient)', () => {
    const action = addIngredient(mockMain);
    const state = constructorReducer(undefined, action);
    expect(state.bun).toBeNull();
    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0].name).toBe('Котлета');
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('должен удалить ингредиент по id (removeIngredient)', () => {
    const initialState = { bun: null, ingredients: [mockMain, mockSauce] };
    const action = removeIngredient('id2');
    const state = constructorReducer(initialState, action);
    expect(state.ingredients).toEqual([mockSauce]);
  });

  test('должен переместить ингредиент (moveIngredient)', () => {
    const initialState = { bun: null, ingredients: [mockMain, mockSauce] };
    const action = moveIngredient({ from: 0, to: 1 });
    const state = constructorReducer(initialState, action);
    expect(state.ingredients).toEqual([mockSauce, mockMain]);
  });

  test('должен очистить конструктор (clearConstructor)', () => {
    const initialState = { bun: mockBun, ingredients: [mockMain] };
    const action = clearConstructor();
    const state = constructorReducer(initialState, action);
    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
