// src/utils/user-controller.ts
import { ServerResponse, UsersListPayload, User } from '../api/types';
import { socketApi } from '../api/socket';
import { state } from '../core/state';

export const userController = {
  users: [] as User[],
  subscribed: false,

  init(callback: () => void): void {
    if (!this.subscribed) {
      socketApi.subscribe((response: ServerResponse): void => {
        this.handleSocketMessage(response, callback);
      });
      this.subscribed = true;
    }
    this.refresh();
  },

  refresh(): void {
    if (state.user) {
      socketApi.send('USER_ACTIVE', null);
      socketApi.send('USER_INACTIVE', null);
    }
  },

  handleSocketMessage(response: ServerResponse, callback: () => void): void {
    switch (response.type) {
      case 'USER_ACTIVE':
      case 'USER_INACTIVE':
        this.updateUsersList(response.payload);
        callback();
        break;
      case 'USER_EXTERNAL_LOGIN':
      case 'USER_EXTERNAL_LOGOUT': {
        const { user } = response.payload;
        const found = this.users.find((u) => u.login === user.login);
        if (found) {
          found.isLogined = response.type === 'USER_EXTERNAL_LOGIN';
        } else if (response.type === 'USER_EXTERNAL_LOGIN') {
          this.users.push(user);
        }
        callback();
        break;
      }
      case 'MSG_COUNT_NOT_READED_FROM_USER': {
        const { count } = response.payload as { count: number };
        if (state.activeChat) {
          this.updateUnreadCount(state.activeChat, count, callback);
        }
        break;
      }
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

  updateUnreadCount(login: string, count: number, callback: () => void): void {
    const user = this.users.find((u) => u.login === login);
    if (user) {
      user.unread = count;
      callback();
    }
  },

  search(filter: string): User[] {
    const searchTerm = filter.toLowerCase();
    return this.users.filter((u) => u.login.toLowerCase().includes(searchTerm));
  },
};
