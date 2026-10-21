import { useEffect } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import {
  feedSelector,
  ordersLoadingSelector
} from '../../services/selectors';
import { getFeeds } from '../../services/ordersSlice';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(feedSelector);
  const isLoading = useSelector(ordersLoadingSelector);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    dispatch(getFeeds());
  };

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
