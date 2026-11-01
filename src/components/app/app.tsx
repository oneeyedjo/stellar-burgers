import { useEffect } from 'react';
import { Routes, Route, useLocation, type Location } from 'react-router-dom';

import { AppHeader } from '@components';
import { ModalOrderInfo } from '../app/modal-order-info';
import { ModalIngredient } from '../app/modal-ingredient';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '@services/store';
import {
  ingredientsSelector,
  ingredientsLoadingSelector,
  ingredientsErrorSelector
} from '@services/selectors';
import { getIngredients } from '../../services/ingredientsSlice';
import { checkUserAuth } from '../../services/userSlice';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { OrderInfo } from '../order-info/order-info';

import '../../index.css';
import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent background={background} />
    </div>
  );
};

export default App;

const AppContent = ({ background }: { background?: Location }): React.JSX.Element => {
  const ingredients = useSelector(ingredientsSelector);
  const isLoading = useSelector(ingredientsLoadingSelector);
  const error = useSelector(ingredientsErrorSelector);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты: {error}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Нет ингредиентов
      </p>
    );
  }

  return <RouteComponent background={background} />;
};

const RouteComponent = ({ background }: { background?: Location }): React.JSX.Element => {
  const location = useLocation();

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route path='/login' element={<ProtectedRoute onlyUnAuth><Login /></ProtectedRoute>} />
        <Route path='/register' element={<ProtectedRoute onlyUnAuth><Register /></ProtectedRoute>} />
        <Route path='/forgot-password' element={<ProtectedRoute onlyUnAuth><ForgotPassword /></ProtectedRoute>} />
        <Route path='/reset-password' element={<ProtectedRoute onlyUnAuth><ResetPassword /></ProtectedRoute>} />

        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/profile/orders' element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/profile/orders/:number' element={<ProtectedRoute><OrderInfo /></ProtectedRoute>} />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route path='/ingredients/:id' element={<ModalIngredient />} />
          <Route path='/feed/:number' element={<ModalOrderInfo />} />
          <Route path='/profile/orders/:number' element={<ProtectedRoute><ModalOrderInfo /></ProtectedRoute>} />
        </Routes>
      )}
    </>
  );
};
