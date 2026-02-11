// src/core/state.ts
import { ServerResponse } from '../api/types';

class State {
  private currentUser: string | null = null;
  private currentPassword: string | null = null;
  private _activeChat: string | null = null;
  public firstUnreadId: string | null = null;
  private isAuth = false;
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  get user(): string | null {
    return this.currentUser;
  }

  get password(): string | null {
    return this.currentPassword;
  }

  get authenticated(): boolean {
    return this.isAuth;
  }

  get activeChat(): string | null {
    return this._activeChat;
  }

  set activeChat(login: string | null) {
    if (this._activeChat !== login) {
      this._activeChat = login;
      this.notify();
    }
  }

  setLogin(login: string, password: string): void {
    this.currentUser = login;
    this.currentPassword = password;
    this.isAuth = true;
    this.syncStorage();
    this.notify();
  }

  logout(): void {
    this.currentUser = null;
    this.currentPassword = null;
    this.isAuth = false;
    this._activeChat = null;
    this.syncStorage();
    this.notify();
  }

  subscribe(listener: () => void): void {
    this.listeners.push(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => {
      fn();
    });
  }

  private syncStorage(): void {
    if (this.isAuth && this.currentUser && this.currentPassword) {
      sessionStorage.setItem('currentUser', this.currentUser);
      sessionStorage.setItem('password', this.currentPassword);
      sessionStorage.setItem('isAuth', 'true');
    } else {
      sessionStorage.clear();
    }
  }

  private loadFromStorage(): void {
    const user = sessionStorage.getItem('currentUser');
    const pass = sessionStorage.getItem('password');
    const auth = sessionStorage.getItem('isAuth') === 'true';
    if (user && pass && auth) {
      this.currentUser = user;
      this.currentPassword = pass;
      this.isAuth = true;
    }
  }
}

export const state = new State();
export type { ServerResponse };
