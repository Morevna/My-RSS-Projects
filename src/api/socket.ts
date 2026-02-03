//src/api/socket.ts
import { ServerResponse } from './types';
import { state } from '../core/state';

const SOCKET_URL = 'ws://localhost:4000';

type OutgoingMessage = {
  id: string;
  type: string;
  payload: unknown;
};

type SocketListener = (data: ServerResponse) => void;

class SocketApi {
  private socket: WebSocket | null = null;
  private listeners = new Set<SocketListener>();
  private onOpenCallbacks: (() => void)[] = [];

  public connect(): Promise<void> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const socket = new WebSocket(SOCKET_URL);
      this.socket = socket;

      socket.onopen = (): void => {
        if (state.user && state.password) {
          this.send('USER_LOGIN', {
            user: { login: state.user, password: state.password },
          });
        }
        this.onOpenCallbacks.forEach((cb) => {
          cb();
        });
        resolve();
      };

      socket.onerror = (): void => {
        reject(new Error('WebSocket connection failed'));
      };

      socket.onmessage = (event: MessageEvent<string>): void => {
        this.handleMessage(event);
      };
    });
  }

  public onOpen(cb: () => void): void {
    this.onOpenCallbacks.push(cb);
  }

  public isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public subscribe(listener: SocketListener): () => void {
    this.listeners.add(listener);

    return (): void => {
      this.listeners.delete(listener);
    };
  }

  private handleMessage(event: MessageEvent<string>): void {
    try {
      const data = JSON.parse(event.data) as ServerResponse;
      this.listeners.forEach((listener) => {
        listener(data);
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse socket message', error);
    }
  }

  public send(type: string, payload: unknown): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const message: OutgoingMessage = {
      id: Date.now().toString(),
      type,
      payload,
    };

    this.socket.send(JSON.stringify(message));
  }
}

export const socketApi = new SocketApi();
