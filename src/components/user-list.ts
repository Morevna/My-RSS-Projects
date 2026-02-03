// src/components/user-list.ts
import './components.css';
import { userController } from '../utils/user-controller';
import { User } from '../api/types';

export function createUserList(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'user-list';

  const searchInput = document.createElement('input');
  searchInput.placeholder = 'Search user';
  container.appendChild(searchInput);

  const listContainer = document.createElement('div');
  container.appendChild(listContainer);

  function renderList(): void {
    listContainer.innerHTML = '';
    const filtered: User[] = userController.search(searchInput.value);

    filtered.forEach((user) => {
      const item = document.createElement('div');
      item.className = 'user-item';
      const unread = user.unread ? `(${user.unread.toString()})` : '';
      item.textContent = `${user.login} ${user.isLogined ? '🟢' : '⚪️'} ${unread}`;
      listContainer.appendChild(item);
    });
  }

  userController.init(renderList);

  searchInput.addEventListener('input', renderList);

  return container;
}
