// src/components/chat-window.ts
import './components.css';
import { state } from '../core/state';
import { messageController } from '../utils/message-controller';
import { Message } from '../api/types';

function createMessageActions(msg: Message): HTMLElement {
  const actions = document.createElement('div');
  actions.className = 'message-actions';
  const delBtn = document.createElement('button');
  delBtn.textContent = '🗑️';
  delBtn.onclick = (): void => {
    if (confirm('Delete message?')) messageController.deleteMessage(msg.id);
  };
  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️';
  editBtn.onclick = (): void => {
    const text = prompt('Edit message:', msg.text);
    if (text && text.trim() && text.trim() !== msg.text) {
      messageController.editMessage(msg.id, text.trim());
    }
  };
  actions.append(editBtn, delBtn);
  return actions;
}

function createMessageElement(msg: Message, isOwn: boolean): HTMLElement {
  const msgElem = document.createElement('div');
  msgElem.className = `message-item ${isOwn ? 'own' : 'incoming'}`;
  const textSpan = document.createElement('span');
  textSpan.className = 'text';
  textSpan.textContent = msg.text || '';
  const info = document.createElement('div');
  info.className = 'message-info';

  if (msg.status.isEdited) {
    const ed = document.createElement('span');
    ed.className = 'edited-label';
    ed.textContent = '(edited) ';
    info.append(ed);
  }

  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = new Date(msg.datetime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  info.append(time);

  if (isOwn) {
    const st = document.createElement('span');
    st.className = `status ${msg.status.isReaded ? 'readed' : ''}`;
    st.textContent = msg.status.isReaded ? ' ✓✓' : ' ✓';
    info.append(st);
    msgElem.append(createMessageActions(msg));
  }

  msgElem.append(textSpan, info);
  return msgElem;
}

function handleScrollAndLine(list: HTMLElement): void {
  const separator = list.querySelector('.unread-separator');
  if (separator) {
    separator.scrollIntoView({ block: 'center' });
  } else {
    list.scrollTop = list.scrollHeight;
  }
  const removeSep = (): void => {
    if (state.firstUnreadId) {
      state.firstUnreadId = null;
      separator?.remove();
    }
  };
  list.addEventListener('click', removeSep, { once: true });
  list.addEventListener('wheel', removeSep, { once: true });
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
    const clean = input.value.trim();
    if (clean.length > 0) {
      messageController.sendMessage(clean);
      input.value = '';
    }
  };
  return form;
}
