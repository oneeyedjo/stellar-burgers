import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/selectors';
import { getOrderByNumberApi } from '@api';
import type { TIngredient, TOrder } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(ingredientsSelector);
  const [order, setOrder] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!number) return;
    setIsLoading(true);
    getOrderByNumberApi(Number(number))
      .then((data) => setOrder(data.orders[0]))
      .catch(() => setOrder(null))
      .finally(() => setIsLoading(false));
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: Record<string, TIngredient & { count: number }>, itemId) => {
        const ingredient = ingredients.find((ing) => ing._id === itemId);
        if (!ingredient) return acc;
        if (!acc[itemId]) acc[itemId] = { ...ingredient, count: 0 };
        acc[itemId].count += 1;
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date: new Date(order.createdAt),
      total
    };
  }, [order, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
