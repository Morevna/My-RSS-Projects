// src/utils/message-controller.ts
import { socketApi } from '../api/socket';
import { state } from '../core/state';
import { ServerResponse, Message } from '../api/types';

export const messageController = {
  messages: [] as Message[],
  subscribed: false,

  init(callback: () => void): void {
    if (this.subscribed) return;

    socketApi.subscribe((response: ServerResponse) => {
      switch (response.type) {
        case 'MSG_SEND':
          this.handleSend(response.payload, callback);
          break;
        case 'MSG_FROM_USER':
          this.handleHistory(response.payload, callback);
          break;
        case 'MSG_READ':
        case 'MSG_DELIVER':
          this.handleStatus(response, callback);
          break;
        case 'MSG_DELETE':
          this.handleDelete(response.payload, callback);
          break;
        case 'MSG_EDIT':
          this.handleEdit(response.payload, callback);
          break;
        default:
          break;
      }
    });
    this.subscribed = true;
  },

  handleSend(payload: { message: Message }, callback: () => void): void {
    const { message: newMsg } = payload;
    if (newMsg.from === state.activeChat || newMsg.to === state.activeChat) {
      if (!this.messages.some((m) => m.id === newMsg.id)) {
        this.messages.push(newMsg);
      }
      if (newMsg.from === state.activeChat) {
        this.markAsRead(newMsg.id);
      }
      callback();
    }
  },

  handleHistory(payload: { messages: Message[] }, callback: () => void): void {
    this.messages = payload.messages;
    const unread = this.messages.find(
      (m) => m.from === state.activeChat && !m.status.isReaded,
    );
    state.firstUnreadId = unread ? unread.id : null;
    callback();
  },

  handleStatus(response: ServerResponse, callback: () => void): void {
    if (response.type === 'MSG_READ' || response.type === 'MSG_DELIVER') {
      const { id, status } = response.payload.message;
      const msg = this.messages.find((m) => m.id === id);
      if (msg) {
        msg.status = { ...msg.status, ...status };
        callback();
      }
    }
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

  handleDelete(
    payload: { message: { id: string } },
    callback: () => void,
  ): void {
    this.messages = this.messages.filter((m) => m.id !== payload.message.id);
    callback();
  },

  handleEdit(payload: { message: Message }, callback: () => void): void {
    const index = this.messages.findIndex((m) => m.id === payload.message.id);
    if (index !== -1) {
      this.messages[index] = payload.message;
      callback();
    }
  },

  deleteMessage(messageId: string): void {
    socketApi.send('MSG_DELETE', {
      message: { id: messageId },
    });
  },

  editMessage(messageId: string, newText: string): void {
    const cleanText = newText.trim();
    if (cleanText.length > 0) {
      socketApi.send('MSG_EDIT', {
        message: { id: messageId, text: cleanText },
      });
    }
  },
};
