// src/core/state.ts
class State {
  private currentUser: string | null = null;
  private currentPassword: string | null = null;
  public activeChat: string | null = null;
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

  setLogin(login: string, password: string): void {
    this.currentUser = login;
    this.currentPassword = password;
    this.isAuth = true;
    this.saveToStorage();
    this.notify();
  }

  logout(): void {
    this.currentUser = null;
    this.currentPassword = null;
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
    if (this.currentUser && this.currentPassword) {
      sessionStorage.setItem('currentUser', this.currentUser);
      sessionStorage.setItem('password', this.currentPassword);
      sessionStorage.setItem('isAuth', 'true');
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

  private clearStorage(): void {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('isAuth');
  }
}
export const state = new State();

export interface MessageStatus {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: MessageStatus;
}

interface UserLoginPayload {
  user: { login: string; password: string };
}

interface MessagePayload {
  message: Message;
}

interface HistoryPayload {
  messages: Message[];
}

type ServerResponse =
  | { id: string | null; type: 'USER_LOGIN'; payload: UserLoginPayload }
  | { id: string | null; type: 'MSG_SEND'; payload: MessagePayload }
  | { id: string | null; type: 'MSG_FROM_USER'; payload: HistoryPayload }
  | {
      id: string | null;
      type: 'MSG_READ';
      payload: { message: { id: string } };
    }
  | { id: string | null; type: 'ERROR'; payload: { error: string } };

export type { ServerResponse };
