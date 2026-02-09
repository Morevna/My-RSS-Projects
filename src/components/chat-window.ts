// src/components/chat-window.ts
import './components.css';
import { state } from '../core/state';
import { messageController } from '../utils/message-controller';
import { Message } from '../api/types';

function createMessageElement(msg: Message, isOwn: boolean): HTMLElement {
  const msgElem = document.createElement('div');
  msgElem.className = `message-item ${isOwn ? 'own' : 'incoming'}`;
  const textSpan = document.createElement('span');
  textSpan.className = 'text';
  textSpan.textContent = msg.text || '';

  const infoContainer = document.createElement('div');
  infoContainer.className = 'message-info';

  if (msg.datetime) {
    const timeSpan = document.createElement('span');
    timeSpan.className = 'time';
    timeSpan.textContent = new Date(msg.datetime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    infoContainer.append(timeSpan);
  }

  if (isOwn) {
    const statusSpan = document.createElement('span');
    statusSpan.className = `status ${msg.status.isReaded ? 'readed' : ''}`;
    statusSpan.textContent = msg.status.isReaded ? ' ✓✓' : ' ✓';
    infoContainer.append(statusSpan);
  }

  msgElem.append(textSpan, infoContainer);
  return msgElem;
}

function handleScrollAndLine(list: HTMLElement): void {
  const separator = list.querySelector('.unread-separator');
  if (separator) {
    separator.scrollIntoView({ block: 'center' });
  } else {
    list.scrollTop = list.scrollHeight;
  }

  const removeSeparator = (): void => {
    if (state.firstUnreadId) {
      state.firstUnreadId = null;
      separator?.remove();
    }
  };

  list.addEventListener('click', removeSeparator, { once: true });
  list.addEventListener('wheel', removeSeparator, { once: true });
}

export function createChatWindow(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'chat-window';
  if (!state.activeChat) {
    container.innerHTML =
      '<div class="chat-placeholder">Select a user to start chatting</div>';
    return container;
  }

  const messagesList = document.createElement('div');
  messagesList.className = 'messages-list';

  const render = (): void => {
    messagesList.replaceChildren();
    if (state.activeChat) messageController.markAllAsRead(state.activeChat);

    messageController.messages.forEach((msg) => {
      if (state.firstUnreadId === msg.id) {
        const sep = document.createElement('div');
        sep.className = 'unread-separator';
        sep.textContent = 'New Messages';
        messagesList.append(sep);
      }
      messagesList.append(
        createMessageElement(msg, msg.from === (state.user ?? '')),
      );
    });
    handleScrollAndLine(messagesList);
  };

  messageController.init(render);
  messageController.loadHistory(state.activeChat);
  container.append(messagesList, createMessageForm());
  return container;
}

function createMessageForm(): HTMLFormElement {
  const form = document.createElement('form');
  form.className = 'message-form';
  const input = document.createElement('input');
  input.required = true;
  const btn = document.createElement('button');
  btn.textContent = 'Send';

  form.append(input, btn);
  form.onsubmit = (e): void => {
    e.preventDefault();
    if (input.value.trim()) {
      messageController.sendMessage(input.value);
      input.value = '';
    }
  };
  return form;
}
