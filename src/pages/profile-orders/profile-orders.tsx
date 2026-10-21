import { useEffect } from 'react';

import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import {
  userOrdersSelector,
  ordersLoadingSelector
} from '../../services/selectors';
import { getOrders } from '../../services/ordersSlice';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(userOrdersSelector);
  const isLoading = useSelector(ordersLoadingSelector);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
