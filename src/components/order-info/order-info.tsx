import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { currentOrderSelector, orderLoadingSelector, ingredientsSelector } from '../../services/selectors';
import { getOrderByNumber } from '../../services/ordersSlice';
import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(currentOrderSelector);
  const isLoading = useSelector(orderLoadingSelector);
  const ingredients = useSelector(ingredientsSelector);

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const orderIngredients = order.ingredients.reduce((acc: { [key: string]: TIngredient & { count: number } }, id) => {
      const ingredient = ingredients.find((ing) => ing._id === id);
      if (!ingredient) return acc;

      if (!acc[id]) {
        acc[id] = { ...ingredient, count: 1 };
      } else {
        acc[id].count++;
      }
      return acc;
    }, {});

    const totalPrice = Object.values(orderIngredients).reduce(
      (acc, ing) => acc + ing.price * ing.count,
      0
    );

    return {
      ...order,
      ingredientsInfo: orderIngredients,
      date: new Date(order.createdAt),
      total: totalPrice,
    };
  }, [order, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo as any} />;
};
