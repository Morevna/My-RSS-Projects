import { ServerResponse } from './types';

const SOCKET_URL = 'ws://localhost:4000';
export const SOCKET_EVENT = 'socket-message';

type OutgoingMessage = {
  id: string;
  type: string;
  payload: unknown;
};

class SocketApi {
  private socket: WebSocket | null = null;

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(SOCKET_URL);
      this.socket = socket;

      socket.onopen = (): void => {
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

  public isConnected(): boolean {
    return !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private handleMessage(event: MessageEvent<string>): void {
    try {
      const data = JSON.parse(event.data) as ServerResponse;

      const customEvent = new CustomEvent<ServerResponse>(SOCKET_EVENT, {
        detail: data,
      });

      window.dispatchEvent(customEvent);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse socket message', error);
    }
  }

  public send(type: string, payload: unknown): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      // eslint-disable-next-line no-console
      console.error('Socket is not open');
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
