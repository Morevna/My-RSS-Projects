// src/index.ts
import { initRouter } from './core/router';
import { socketApi } from './api/socket';

socketApi.onOpen(() => {});

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
