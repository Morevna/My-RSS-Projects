import { navigate } from '../core/router';
import { state } from '../core/state';
import { socketApi } from '../api/socket';

export function createLogoutButton(): HTMLElement {
  const button = document.createElement('button');
  button.textContent = 'Logout';
  button.className = 'logout-btn';

  button.addEventListener('click', () => {
    if (socketApi.isConnected()) {
      socketApi.send('USER_LOGOUT', {
        user: { login: state.user, password: '' },
      });
      socketApi.disconnect();
    }
    state.logout();
    navigate('/login');
  });

  return button;
}
