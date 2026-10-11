import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { useSelector } from '@services/store';
import {
  isAuthCheckedSelector,
  userDataSelector
} from '@selectors';
import type { ProtectedRouteProps } from '@utils-types';

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userDataSelector);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
