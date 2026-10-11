import { useEffect } from 'react';

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
import { Routes, Route } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';
import {
  ingredientsSelector,
  ingredientsLoadingSelector,
  ingredientsErrorSelector
} from '@services/selectors';
import { getIngredients } from '../../services/ingredientsSlice';
import { checkUserAuth } from '../../services/userSlice';
import { ProtectedRoute } from '@components/protected-route/protected-route';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent />
    </div>
  );
};

export default App;

const AppContent = (): React.JSX.Element => {
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

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed' element={<Feed />} />

      <Route
        path='/login'
        element={
          <ProtectedRoute onlyUnAuth>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path='/register'
        element={
          <ProtectedRoute onlyUnAuth>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path='/forgot-password'
        element={
          <ProtectedRoute onlyUnAuth>
            <ForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path='/reset-password'
        element={
          <ProtectedRoute onlyUnAuth>
            <ResetPassword />
          </ProtectedRoute>
        }
      />

      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile/orders'
        element={
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        }
      />

      <Route path='/feed/:number' element={<ModalOrderInfo />} />
      <Route path='/ingredients/:id' element={<ModalIngredient />} />
      <Route
        path='/profile/orders/:number'
        element={
          <ProtectedRoute>
            <ModalOrderInfo />
          </ProtectedRoute>
        }
      />

      <Route path='*' element={<NotFound404 />} />
    </Routes>
  );
};
