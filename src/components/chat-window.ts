import './components.css';
import { state } from '../core/state';
import { messageController } from '../utils/message-controller';

function createMessageElement(
  text: string,
  isOwn: boolean,
  isReaded: boolean,
): HTMLElement {
  const msgElem = document.createElement('div');
  msgElem.className = `message-item ${isOwn ? 'own' : 'incoming'}`;

  const textSpan = document.createElement('span');
  textSpan.className = 'text';
  textSpan.textContent = text;

  const statusSpan = document.createElement('span');
  statusSpan.className = 'status';
  statusSpan.textContent = isReaded ? ' ✓✓' : ' ✓';

  msgElem.append(textSpan, statusSpan);
  return msgElem;
}

export function createChatWindow(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'chat-window';

  // Деструктуризация помогает TS отследить тип в пределах этой функции
  const { activeChat } = state;

  if (!activeChat) {
    const placeholder = document.createElement('div');
    placeholder.textContent = 'Select a user to start chatting';
    container.append(placeholder);
    return container;
  }

  const messagesList = document.createElement('div');
  messagesList.className = 'messages-list';

  const renderMessages = (): void => {
    messagesList.replaceChildren();
    messageController.messages.forEach((msg) => {
      const isOwn = msg.from === (state.user ?? '');
      messagesList.append(
        createMessageElement(
          msg.text ?? '',
          isOwn,
          msg.status.isReaded ?? false,
        ),
      );
    });
    messagesList.scrollTop = messagesList.scrollHeight;
  };

  messageController.init(renderMessages);

  if (activeChat) {
    messageController.loadHistory(activeChat);
  }

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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    messageController.sendMessage(input.value);
    input.value = '';
  });
  return form;
}
