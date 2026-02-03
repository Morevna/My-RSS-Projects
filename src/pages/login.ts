// src/pages/login.ts
import { setupLoginListeners } from '../utils/login-controller';
import { validateLogin, validatePassword } from '../utils/validate-credentials';

function createField(
  placeholder: string,
  type = 'text',
): {
  input: HTMLInputElement;
  error: HTMLDivElement;
} {
  const input = document.createElement('input');
  input.placeholder = placeholder;
  input.type = type;

  const error = document.createElement('div');
  error.className = 'error';

  return { input, error };
}

export function renderLoginPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'login-page';

  const form = document.createElement('form');
  form.className = 'login-form';

  const { input: loginInp, error: loginErr } = createField('Login (your name)');
  const { input: passInp, error: passErr } = createField(
    'Password',
    'password',
  );

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Login';
  submitBtn.className = 'submitLoginBtn';
  submitBtn.disabled = true;

  const checkForm = (): void => {
    const lErr = validateLogin(loginInp.value);
    const pErr = validatePassword(passInp.value);

    loginErr.textContent = lErr || '';
    passErr.textContent = pErr || '';

    loginInp.classList.toggle('input-error', !!lErr);
    passInp.classList.toggle('input-error', !!pErr);

    submitBtn.disabled = !!(lErr || pErr);
  };

  loginErr.className = 'error-message';
  passErr.className = 'error-message';

  loginInp.addEventListener('input', checkForm);
  passInp.addEventListener('input', checkForm);

  const cleanup = setupLoginListeners(form, loginInp, passInp, loginErr);

  container.addEventListener('DOMNodeRemoved', () => {
    cleanup();
  });

  form.append(loginInp, loginErr, passInp, passErr, submitBtn);
  container.append(form);

  return container;
}
