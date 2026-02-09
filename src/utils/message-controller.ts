// src/utils/message-controller.ts
import { socketApi } from '../api/socket';
import { state } from '../core/state';
import { ServerResponse, Message } from '../api/types';

export const messageController = {
  messages: [] as Message[],

  init(callback: () => void): void {
    socketApi.subscribe((response: ServerResponse) => {
      switch (response.type) {
        case 'MSG_SEND':
          this.handleSend(response, callback);
          break;
        case 'MSG_FROM_USER':
          this.handleHistory(response, callback);
          break;
        case 'MSG_READ':
          this.handleRead(response, callback);
          break;
      }
    });
  },

  handleSend(response: ServerResponse, callback: () => void): void {
    const payload = response.payload as { message: Message };
    const { message: newMsg } = payload;
    if (newMsg.from === state.activeChat || newMsg.to === state.activeChat) {
      this.messages.push(newMsg);
      if (newMsg.from === state.activeChat) this.markAsRead(newMsg.id);
      callback();
    }
  },

  handleHistory(response: ServerResponse, callback: () => void): void {
    const payload = response.payload as { messages: Message[] };
    this.messages = payload.messages;
    const unread = this.messages.find(
      (m) => m.from === state.activeChat && !m.status.isReaded,
    );
    state.firstUnreadId = unread ? unread.id : null;
    callback();
  },

  handleRead(response: ServerResponse, callback: () => void): void {
    const payload = response.payload as { message: { id: string } };
    const msg = this.messages.find((m) => m.id === payload.message.id);
    if (msg) msg.status.isReaded = true;
    callback();
  },

  sendMessage(text: string): void {
    if (!state.activeChat) return;
    socketApi.send('MSG_SEND', {
      message: { to: state.activeChat, text },
    });
  },

  markAsRead(messageId: string): void {
    socketApi.send('MSG_READ', { message: { id: messageId } });
  },

  markAllAsRead(login: string): void {
    this.messages.forEach((msg) => {
      if (msg.from === login && !msg.status.isReaded) {
        this.markAsRead(msg.id);
      }
    });
  },

  loadHistory(login: string): void {
    socketApi.send('MSG_FROM_USER', { user: { login } });
  },
};
