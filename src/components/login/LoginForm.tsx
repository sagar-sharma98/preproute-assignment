import type { FormEvent } from 'react';
import { Button } from '../shared/Button';
import { ErrorMessage } from '../shared/ErrorMessage';
import { Field, Input } from '../shared/FormField';
import { Logo } from '../shared/Logo';

interface LoginFormProps {
  userId: string;
  password: string;
  userIdError: string;
  passwordError: string;
  serverError: string;
  isSubmitting: boolean;
  onUserIdChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function LoginForm({
  userId,
  password,
  userIdError,
  passwordError,
  serverError,
  isSubmitting,
  onUserIdChange,
  onPasswordChange,
  onSubmit
}: LoginFormProps) {
  return (
    <form className="login-card" onSubmit={onSubmit}>
      <Logo />
      <div>
        <h1>Login</h1>
        <p>Use your company provided Login credentials</p>
      </div>
      <Field label="User ID" error={userIdError}>
        <Input name="userId" value={userId} onChange={(event) => onUserIdChange(event.target.value)} placeholder="Enter User ID" />
      </Field>
      <Field label="Password" error={passwordError}>
        <Input
          name="password"
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="Enter Password"
        />
      </Field>
      <button type="button" className="text-link">
        Forgot password?
      </button>
      {serverError ? <ErrorMessage title="Login failed" message={serverError} /> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
