import { socketApi } from '../api/socket';
import { ServerResponse } from '../api/types';
import { state } from '../core/state';
import { navigate } from '../core/router';

export function setupLoginListeners(
  form: HTMLFormElement,
  loginInp: HTMLInputElement,
  passInp: HTMLInputElement,
  loginErr: HTMLElement,
): void {
  form.onsubmit = (e: SubmitEvent): void => {
    e.preventDefault();

    if (state.authenticated) return;

    socketApi.send('USER_LOGIN', {
      user: {
        login: loginInp.value,
        password: passInp.value,
      },
    });
  };

  const handleSocket = (e: Event): void => {
    const { detail } = e as CustomEvent<ServerResponse>;

    if (detail.type === 'USER_LOGIN' && detail.payload.user?.isLogined) {
      state.setLogin(detail.payload.user.login);
      loginErr.textContent = '';

      navigate('/');
    } else if (detail.type === 'ERROR') {
      loginErr.textContent = detail.payload.error || 'Server error';
      loginInp.classList.add('input-error');
      passInp.classList.add('input-error');
    }
  };

  window.addEventListener('socket-message', handleSocket);

  state.subscribe(() => {
    if (state.authenticated) {
      loginInp.value = '';
      passInp.value = '';
      loginErr.textContent = '';
    }
  });
}
