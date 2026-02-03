// src/utils/message-controller.ts
import { socketApi } from '../api/socket';
import { state } from '../core/state';
import { ServerResponse, Message } from '../api/types';

export const messageController = {
  messages: [] as Message[],

  init(callback: () => void): void {
    socketApi.subscribe((response: ServerResponse) => {
      switch (response.type) {
        case 'MSG_SEND': {
          const payload = response.payload as { message: Message };
          const newMsg = payload.message;
          if (
            newMsg.from === state.activeChat ||
            newMsg.to === state.activeChat
          ) {
            this.messages.push(newMsg);
            if (newMsg.from === state.activeChat) {
              this.markAsRead(newMsg.id);
            }
            callback();
          }
          break;
        }

        case 'MSG_FROM_USER': {
          const payload = response.payload as { messages: Message[] };
          this.messages = payload.messages;
          callback();
          break;
        }

        case 'MSG_READ': {
          const payload = response.payload as { message: { id: string } };
          const readMsg = this.messages.find(
            (m) => m.id === payload.message.id,
          );
          if (readMsg) {
            readMsg.status.isReaded = true;
          }
          callback();
          break;
        }
      }
    });
  },

  sendMessage(text: string): void {
    if (!state.activeChat) return;
    socketApi.send('MSG_SEND', {
      message: {
        to: state.activeChat,
        text: text,
      },
    });
  },

  markAsRead(messageId: string): void {
    socketApi.send('MSG_READ', {
      message: { id: messageId },
    });
  },

  loadHistory(login: string): void {
    socketApi.send('MSG_FROM_USER', {
      user: { login },
    });
  },
};
