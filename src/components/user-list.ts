// src/components/user-list.ts
import './components.css';
import { userController } from '../utils/user-controller';
import { messageController } from '../utils/message-controller'; // ИСПРАВЛЕНО: добавили импорт
import { state } from '../core/state';

export function createUserList(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'user-list';

  const searchInput = document.createElement('input');
  searchInput.placeholder = 'Search user';

  const listContainer = document.createElement('div');
  listContainer.className = 'list-container';

  container.append(searchInput, listContainer);

  const renderList = (): void => {
    listContainer.replaceChildren();
    const filtered = userController.search(searchInput.value);

    filtered.forEach((user) => {
      const item = document.createElement('div');
      item.className = `user-item ${state.activeChat === user.login ? 'active' : ''}`;

      // Добавляем индикатор непрочитанных из userController
      const unreadCount = user.unread ?? 0;
      const unreadBadge = unreadCount > 0 ? ` [${unreadCount.toString()}]` : '';

      item.textContent = `${user.login} ${user.isLogined ? '🟢' : '⚪️'}${unreadBadge}`;

      item.onclick = (): void => {
        state.activeChat = user.login;
        messageController.loadHistory(user.login); // Теперь TS видит этот метод
        renderList();
      };

      listContainer.appendChild(item);
    });
  };

  userController.init(renderList);
  searchInput.oninput = (): void => {
    renderList();
  };

  return container;
}
