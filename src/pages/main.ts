//src/pages/main.ts
import './styles.css';
import { createUserList } from '../components/user-list';

export function renderMainPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'main-page';

  const userList = createUserList();

  const chatArea = document.createElement('div');
  chatArea.className = 'chat-area';
  chatArea.textContent = 'Select a user to start chatting';

  container.append(userList, chatArea);

  return container;
}
