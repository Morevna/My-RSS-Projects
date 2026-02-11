// src/pages/main.ts
import './styles.css';
import { createUserList } from '../components/user-list';
import { createChatWindow } from '../components/chat-window';

export function renderMainPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'main-page';

  const userList = createUserList();
  const chatArea = document.createElement('div');
  chatArea.className = 'chat-container-area';

  chatArea.append(createChatWindow());

  userList.addEventListener('chat-selected', () => {});

  container.append(userList, chatArea);
  return container;
}
