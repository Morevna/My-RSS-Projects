// src/index.ts
import { initRouter } from './core/router';
import { socketApi } from './api/socket';
import { state } from './core/state';

socketApi.onOpen(() => {
  if (state.authenticated && state.user && state.password) {
    socketApi.send('USER_LOGIN', {
      user: {
        login: state.user,
        password: state.password,
      },
    });
  }
});

document.addEventListener('DOMContentLoaded', (): void => {
  socketApi
    .connect()
    .then(() => {
      initRouter();
    })
    .catch(() => {
      initRouter();
    });
});
