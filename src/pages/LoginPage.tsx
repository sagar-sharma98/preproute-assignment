import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiError } from '../api/client';
import { LoginForm } from '../components/login/LoginForm';
import { LoginIllustration } from '../components/login/LoginIllustration';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    logout();
  }, [logout]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextUserIdError = userId.trim() ? '' : 'User ID is required';
    const nextPasswordError = password.trim() ? '' : 'Password is required';
    setUserIdError(nextUserIdError);
    setPasswordError(nextPasswordError);
    if (nextUserIdError || nextPasswordError) return;

    setServerError('');
    setIsSubmitting(true);
    try {
      await login(userId.trim(), password);
      navigate((location.state as { from?: string } | null)?.from ?? '/tests', { replace: true });
    } catch (error) {
      setServerError(getApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <LoginIllustration />
      <section className="login-panel">
        <LoginForm
          userId={userId}
          password={password}
          userIdError={userIdError}
          passwordError={passwordError}
          serverError={serverError}
          isSubmitting={isSubmitting}
          onUserIdChange={(value) => {
            setUserId(value);
            setUserIdError('');
            setServerError('');
          }}
          onPasswordChange={(value) => {
            setPassword(value);
            setPasswordError('');
            setServerError('');
          }}
          onSubmit={onSubmit}
        />
      </section>
    </main>
  );
}
