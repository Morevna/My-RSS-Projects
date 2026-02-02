// pages/login.ts
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
  submitBtn.disabled = true;
  submitBtn.className = 'submitLoginBtn';

  const checkForm = (): void => {
    const lErr = validateLogin(loginInp.value);
    const pErr = validatePassword(passInp.value);
    loginErr.textContent = lErr || '';
    passErr.textContent = pErr || '';

    if (lErr) {
      loginInp.classList.add('input-error');
    } else {
      loginInp.classList.remove('input-error');
    }

    if (pErr) {
      passInp.classList.add('input-error');
    } else {
      passInp.classList.remove('input-error');
    }

    submitBtn.disabled = !!(lErr || pErr);
  };

  loginErr.className = 'error-message';
  passErr.className = 'error-message';

  loginInp.oninput = checkForm;
  passInp.oninput = checkForm;

  setupLoginListeners(form, loginInp, passInp, loginErr);

  form.append(loginInp, loginErr, passInp, passErr, submitBtn);
  container.append(form);
  return container;
}
