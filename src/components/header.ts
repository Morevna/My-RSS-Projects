import './components.css';
import { createAboutButton } from './about-button';
import { createLogoutButton } from './logout-button';

export function createHeader(userName: string): HTMLElement {
  const header = document.createElement('header');
  header.className = 'header';

  const userElem = document.createElement('div');
  userElem.className = 'header-user';
  userElem.textContent = `User: ${userName}`;

  const appName = document.createElement('div');
  appName.className = 'header-app-name';
  appName.textContent = 'Fun Chat';

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'header-buttons';
  buttonsContainer.append(createAboutButton());
  buttonsContainer.append(createLogoutButton());

  header.append(userElem, appName, buttonsContainer);

  return header;
}
