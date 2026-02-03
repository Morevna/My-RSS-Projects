//src/pages/main.ts
import './styles.css';
import { createUserList } from '../components/user-list';
import { createChatWindow } from '../components/chat-window';

export function renderMainPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'main-page';

  const userList = createUserList();
  const contentArea = document.createElement('main');
  contentArea.className = 'chat-container-area';

  contentArea.append(createChatWindow());

  userList.addEventListener('chat-selected', (() => {
    contentArea.replaceChildren(createChatWindow());
  }) as EventListener);

  container.append(userList, contentArea);
  return container;
}
