import { IngredientsCategoryUI } from '@ui';
import { useMemo } from 'react';

import { useSelector } from '../../services/store';
import {
  constructorBunSelector,
  constructorIngredientsSelector
} from '../../services/selectors';

import type { TIngredientsCategoryProps } from './type';
import type { TConstructorState, TIngredient } from '@utils-types';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  const bun = useSelector(constructorBunSelector);
  const constructorIngredients = useSelector(constructorIngredientsSelector);

  const burgerConstructor: TConstructorState = {
    bun,
    ingredients: constructorIngredients
  };

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: Record<string, number> = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
};
