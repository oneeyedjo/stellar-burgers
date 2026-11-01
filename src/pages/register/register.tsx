import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/userSlice';
import { userErrorSelector } from '../../services/selectors';

export const Register = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorText = useSelector(userErrorSelector);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, name: userName }))
      .unwrap()
      .then(() => {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <RegisterUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      userName={userName}
      setUserName={setUserName}
      handleSubmit={handleRegister}
      errorText={errorText || ''}
    />
  );
};
