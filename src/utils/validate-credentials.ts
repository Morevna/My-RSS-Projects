export function validateLogin(login: string): string | null {
  if (login.length < 3) {
    return 'Login must be at least 3 characters';
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return null;
}
