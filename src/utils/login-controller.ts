// src\utils\login-controller.ts
import { socketApi } from '../api/socket';
import { state } from '../core/state';
import { navigate } from '../core/router';
import { ServerResponse } from '../api/types';
import { userController } from './user-controller';

function handleLoginResponse(
  response: ServerResponse,
  loginInp: HTMLInputElement,
  passInp: HTMLInputElement,
  loginErr: HTMLElement,
): void {
  if (response.type === 'USER_LOGIN') {
    const payload = response.payload as {
      user?: { login: string; isLogined: boolean };
    };
    if (payload.user?.isLogined) {
      state.setLogin(payload.user.login, passInp.value);
      loginErr.textContent = '';
      userController.init(() => {
        // eslint-disable-next-line no-console
        console.log('Users list updated');
      });
      navigate('/');
    }
  }

  if (response.type === 'ERROR') {
    const payload = response.payload as { error?: string };
    loginErr.textContent = payload.error || 'Server error';
    loginInp.classList.add('input-error');
    passInp.classList.add('input-error');
  }
}

async function submitLogin(login: string, password: string): Promise<void> {
  if (!socketApi.isConnected()) {
    await socketApi.connect();
  }

  socketApi.send('USER_LOGIN', {
    user: { login, password },
  });
}

export function setupLoginListeners(
  form: HTMLFormElement,
  loginInp: HTMLInputElement,
  passInp: HTMLInputElement,
  loginErr: HTMLElement,
): () => void {
  let isActive = true;

  const onSubmit = (e: SubmitEvent): void => {
    e.preventDefault();
    void submitLogin(loginInp.value, passInp.value);
  };

  form.addEventListener('submit', onSubmit);

  const unsubscribeSocket = socketApi.subscribe((response) => {
    if (!isActive) return;
    handleLoginResponse(response, loginInp, passInp, loginErr);
  });

  return (): void => {
    isActive = false;
    unsubscribeSocket();
    form.removeEventListener('submit', onSubmit);
  };
}
