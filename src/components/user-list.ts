// src/components/user-list.ts
import './components.css';
import { userController } from '../utils/user-controller';
import { User } from '../api/types';
import { state } from '../core/state';

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

      if (state.activeChat === user.login) {
        item.classList.add('active');
      }

      const unread = user.unread ? `(${user.unread.toString()})` : '';
      item.textContent = `${user.login} ${user.isLogined ? '🟢' : '⚪️'} ${unread}`;

      item.addEventListener('click', () => {
        state.activeChat = user.login;
        renderList();
        container.dispatchEvent(
          new CustomEvent('chat-selected', { detail: user.login }),
        );
      });

      listContainer.appendChild(item);
    });
  }

  userController.init(renderList);

  searchInput.addEventListener('input', renderList);

  return container;
}
