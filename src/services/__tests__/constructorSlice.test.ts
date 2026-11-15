import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import type { TIngredient } from '@utils-types';

describe('Тестирование constructorSlice', () => {
  const mockBun: TIngredient = { _id: '1', name: 'Булка', type: 'bun', price: 100, proteins: 1, fat: 1, carbohydrates: 1, calories: 100, image: '', image_mobile: '', image_large: '' };
  const mockMain: TIngredient = { _id: '2', name: 'Котлета', type: 'main', price: 200, proteins: 1, fat: 1, carbohydrates: 1, calories: 200, image: '', image_mobile: '', image_large: '' };
  const mockSauce: TIngredient = { _id: '3', name: 'Соус', type: 'sauce', price: 50, proteins: 1, fat: 1, carbohydrates: 1, calories: 50, image: '', image_mobile: '', image_large: '' };

  test('должен вернуть initial state при неизвестном экшене и undefined', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  test('должен добавить булку и сгенерировать ей id', () => {
    const action = addIngredient(mockBun);
    const state = constructorReducer(undefined, action);
    expect(state.bun?.name).toBe('Булка');
    expect(state.bun?.id).toBeDefined();
    expect(state.ingredients).toEqual([]);
  });

  test('должен добавить начинку', () => {
    const action = addIngredient(mockMain);
    const state = constructorReducer(undefined, action);
    expect(state.bun).toBeNull();
    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0].name).toBe('Котлета');
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('заменяет булку при добавлении другой булки', () => {
    const stateWithBun = { bun: { ...mockBun, id: 'id1' }, ingredients: [] };
    const otherBun = { ...mockBun, _id: '4', name: 'Другая булка' };
    const state = constructorReducer(stateWithBun, addIngredient(otherBun));
    expect(state.bun?.name).toBe('Другая булка');
  });

  test('должен удалить ингредиент по id (removeIngredient)', () => {
    const stateWithIngredients = { bun: null, ingredients: [{ ...mockMain, id: 'id2' }, { ...mockSauce, id: 'id3' }] };
    const action = removeIngredient('id2');
    const state = constructorReducer(stateWithIngredients, action);
    expect(state.ingredients).toEqual([{ ...mockSauce, id: 'id3' }]);
  });

  test('должен переместить ингредиент (moveIngredient)', () => {
    const stateWithIngredients = { bun: null, ingredients: [{ ...mockMain, id: 'id2' }, { ...mockSauce, id: 'id3' }] };
    const action = moveIngredient({ from: 0, to: 1 });
    const state = constructorReducer(stateWithIngredients, action);
    expect(state.ingredients).toEqual([{ ...mockSauce, id: 'id3' }, { ...mockMain, id: 'id2' }]);
  });

  test('должен очистить конструктор (clearConstructor)', () => {
    const stateWithIngredients = { bun: { ...mockBun, id: 'id1' }, ingredients: [{ ...mockMain, id: 'id2' }] };
    const action = clearConstructor();
    const state = constructorReducer(stateWithIngredients, action);
    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
