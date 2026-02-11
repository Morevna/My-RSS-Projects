// src/components/chat-window.ts
import './components.css';
import { state } from '../core/state';
import { messageController } from '../utils/message-controller';
import { Message } from '../api/types';
import { userController } from '../utils/user-controller';

function createMessageActions(msg: Message): HTMLElement {
  const actions = document.createElement('div');
  actions.className = 'message-actions';
  const delBtn = document.createElement('button');
  delBtn.textContent = '🗑️';
  delBtn.onclick = (): void => {
    if (confirm('Delete?')) messageController.deleteMessage(msg.id);
  };
  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️';
  editBtn.onclick = (): void => {
    const text = prompt('Edit:', msg.text);
    if (text?.trim()) messageController.editMessage(msg.id, text.trim());
  };
  actions.append(editBtn, delBtn);
  return actions;
}

function createMessageElement(msg: Message, isOwn: boolean): HTMLElement {
  const msgElem = document.createElement('div');
  msgElem.className = `message-item ${isOwn ? 'own' : 'incoming'}`;
  if (msg.status.isDeleted) msgElem.classList.add('deleted');
  const textSpan = document.createElement('span');
  textSpan.className = 'text';
  textSpan.textContent = msg.status.isDeleted ? '🗑 Message deleted' : msg.text;
  const info = document.createElement('div');
  info.className = 'message-info';
  if (msg.status.isEdited && !msg.status.isDeleted) {
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
  if (isOwn && !msg.status.isDeleted) {
    const st = document.createElement('span');
    st.className = `status ${msg.status.isReaded ? 'readed' : ''}`;
    st.textContent = msg.status.isReaded ? ' ✓✓' : ' ✓';
    info.append(st, createMessageActions(msg));
  }
  msgElem.append(textSpan, info);
  return msgElem;
}

function renderMessageList(list: HTMLElement): void {
  list.replaceChildren();
  messageController.messages.forEach((msg) => {
    if (state.firstUnreadId === msg.id) {
      const sep = document.createElement('div');
      sep.className = 'unread-separator';
      sep.textContent = 'New Messages';
      list.append(sep);
    }
    const isOwn = msg.from === (state.user ?? '');
    list.append(createMessageElement(msg, isOwn));
  });
  const separator = list.querySelector('.unread-separator');
  if (separator) separator.scrollIntoView({ block: 'center' });
  else list.scrollTop = list.scrollHeight;
}

function updateChatHeader(header: HTMLElement): void {
  const user = userController.users.find((u) => u.login === state.activeChat);
  const status = user?.isLogined ? 'online' : 'offline';
  header.innerHTML = `<span>${state.activeChat ?? ''}</span> <small class="${status}">${status}</small>`;
}

export function createChatWindow(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'chat-window';
  const chatHeader = document.createElement('div');
  chatHeader.className = 'chat-header';
  const messagesList = document.createElement('div');
  messagesList.className = 'messages-list';
  const form = createMessageForm();
  const removeSep = (): void => {
    if (state.firstUnreadId) {
      state.firstUnreadId = null;
      messagesList.querySelector('.unread-separator')?.remove();
    }
  };
  messagesList.onwheel = (): void => {
    removeSep();
  };
  messagesList.onclick = (): void => {
    removeSep();
  };
  const render = (): void => {
    if (!state.activeChat) {
      container.innerHTML = '<div class="chat-placeholder">Select a user</div>';
      return;
    }
    if (!container.contains(form)) {
      container.innerHTML = '';
      container.append(chatHeader, messagesList, form);
    }
    updateChatHeader(chatHeader);
    renderMessageList(messagesList);
  };
  messageController.init(render);
  state.subscribe((): void => {
    render();
  });
  render();
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
  form.onsubmit = (e: SubmitEvent): void => {
    e.preventDefault();
    if (input.value.trim()) {
      messageController.sendMessage(input.value.trim());
      input.value = '';
      state.firstUnreadId = null;
    }
  };
  return form;
}
