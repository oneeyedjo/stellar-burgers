import { AppHeaderUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { userDataSelector } from '../../services/selectors';
import { logoutUser } from '../../services/userSlice';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(userDataSelector);
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    dispatch(logoutUser());
  };

  return <AppHeaderUI userName={user?.name} onLogout={handleLogout} />;
};
