// src\utils\login-controller.ts
import { socketApi } from '../api/socket';
import { state } from '../core/state';
import { navigate } from '../core/router';
import { ServerResponse } from '../api/types';

function handleLoginResponse(
  response: ServerResponse,
  loginInp: HTMLInputElement,
  passInp: HTMLInputElement,
  loginErr: HTMLElement,
): void {
  if (response.type === 'USER_LOGIN' && response.payload.user?.isLogined) {
    state.setLogin(response.payload.user.login);
    loginErr.textContent = '';
    navigate('/');
    return;
  }

  if (response.type === 'ERROR') {
    loginErr.textContent = response.payload.error || 'Server error';
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
