// src/core/state.ts
class State {
  private currentUser: string | null = null;
  private isAuth = false;
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  get user(): string | null {
    return this.currentUser;
  }

  get authenticated(): boolean {
    return this.isAuth;
  }

  setLogin(login: string): void {
    this.currentUser = login;
    this.isAuth = true;
    this.saveToStorage();
    this.notify();
  }

  logout(): void {
    this.currentUser = null;
    this.isAuth = false;
    this.clearStorage();
    this.notify();
  }

  subscribe(listeners: () => void): void {
    this.listeners.push(listeners);
  }

  private notify(): void {
    this.listeners.forEach((fn) => {
      fn();
    });
  }

  private saveToStorage(): void {
    if (this.currentUser) {
      localStorage.setItem('currentUser', this.currentUser);
      localStorage.setItem('isAuth', 'true');
    }
  }

  private loadFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    const auth = localStorage.getItem('isAuth') === 'true';
    if (user && auth) {
      this.currentUser = user;
      this.isAuth = true;
    }
  }

  private clearStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuth');
  }
}
export const state = new State();
