// src/utils/user-controller.ts
import {
  ServerResponse,
  UsersListPayload,
  UserLoginPayload,
  User,
} from '../api/types';
import { socketApi } from '../api/socket';
import { state } from '../core/state';

export const userController = {
  users: [] as User[],
  subscribed: false,

  init(callback: () => void): void {
    this.users = [];

    if (!this.subscribed) {
      socketApi.subscribe((response: ServerResponse) => {
        this.handleSocketMessage(response, callback);
      });
      this.subscribed = true;
    }

    if (state.user) {
      socketApi.send('USER_ACTIVE', null);
      socketApi.send('USER_INACTIVE', null);
    }
  },

  handleSocketMessage(response: ServerResponse, callback: () => void): void {
    switch (response.type) {
      case 'USER_ACTIVE':
      case 'USER_INACTIVE': {
        const payload = response.payload as UsersListPayload | null;
        if (payload) {
          this.updateUsersList(payload);
          callback();
        }

        break;
      }
      case 'USER_EXTERNAL_LOGIN':
      case 'USER_EXTERNAL_LOGOUT':
        this.handleExternalStatus(response);
        callback();
        break;
      case 'ERROR':
      default:
        break;
    }
  },

  updateUsersList(payload: UsersListPayload): void {
    payload.users.forEach((u) => {
      const index = this.users.findIndex((ex) => ex.login === u.login);
      if (index > -1) {
        this.users[index] = u;
      } else {
        this.users.push(u);
      }
    });

    if (state.user) {
      this.users = this.users.filter((u) => u.login !== state.user);
    }
  },

  handleExternalStatus(response: ServerResponse): void {
    const payload = response.payload as UserLoginPayload;
    const user = this.users.find((u) => u.login === payload.user.login);

    if (response.type === 'USER_EXTERNAL_LOGIN') {
      if (user) user.isLogined = true;
      else this.users.push(payload.user);
    } else if (user) {
      user.isLogined = false;
    }
  },

  search(filter: string): User[] {
    const searchTerm = filter.toLowerCase();
    return this.users.filter((u) => u.login.toLowerCase().includes(searchTerm));
  },
};
