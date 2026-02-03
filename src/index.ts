// src/index.ts
import { initRouter } from './core/router';
import { socketApi } from './api/socket';

document.addEventListener('DOMContentLoaded', (): void => {
  socketApi
    .connect()
    .then(() => {
      initRouter();
    })
    .catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to connect:', err);
      initRouter();
    });
});
