import { FeedInfoUI } from '@ui';
import { useSelector } from '../../services/store';
import {
  feedSelector,
  feedTotalSelector,
  feedTotalTodaySelector
} from '../../services/selectors';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const orders = useSelector(feedSelector);
  const total = useSelector(feedTotalSelector);
  const totalToday = useSelector(feedTotalTodaySelector);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ orders, total, totalToday, isLoading: false, error: null }}
    />
  );
};
