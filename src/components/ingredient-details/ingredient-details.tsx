import { IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/selectors';

export const IngredientDetails = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(ingredientsSelector);

  const ingredient = ingredients.find((item) => item._id === id);

  if (!ingredient) {
    return null;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
