import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName, onLogout: _onLogout }: TAppHeaderUIProps): React.JSX.Element => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <BurgerIcon type={location.pathname === '/' ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon type={location.pathname === '/feed' ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <NavLink to="/">
            <Logo className="" />
          </NavLink>
        </div>
        <div className={styles.link_position_last}>
          {userName ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.link_active : ''}`
              }
            >
              <ProfileIcon
                type={location.pathname.startsWith('/profile') ? 'primary' : 'secondary'}
              />
              <p className="text text_type_main-default ml-2">{userName}</p>
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.link_active : ''}`
              }
            >
              <ProfileIcon
                type={location.pathname === '/login' ? 'primary' : 'secondary'}
              />
              <p className="text text_type_main-default ml-2">Личный кабинет</p>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};
