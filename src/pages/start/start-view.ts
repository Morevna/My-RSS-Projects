import { HeaderView } from '../../components/header/header-view';
import { GameView } from '../game/game-view';
import './start.css';

export class StartView {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'start-container';
  }

  private createGreeting(): HTMLElement {
    const greeting = document.createElement('h2');
    greeting.className = 'user-greeting';

    const rawData = localStorage.getItem('rss-puzzle-user');

    if (rawData) {
      const user = JSON.parse(rawData);
      greeting.textContent = `Hello, ${user.firstName} ${user.surname}!`;
    }

    return greeting;
  }

  public draw(): void {
    document.body.innerHTML = '';

    const header = new HeaderView();
    document.body.append(header.getElement());
    //
    const content = document.createElement('div');
    content.className = 'start-content';

    const greeting = this.createGreeting();
    const title = document.createElement('h1');
    title.className = 'app-name';
    title.textContent = 'RSS Puzzle';

    const description = document.createElement('p');
    description.className = 'game-description';
    description.textContent =
      'An interactive game for practicing English sentence construction. Drag and drop words to form sentences from classic literature.';

    const startBtn = document.createElement('button');
    startBtn.className = 'login-button start-game-btn';
    startBtn.textContent = 'Start Game';

    startBtn.addEventListener('click', () => {
      this.handleStartGame();
    });

    content.append(greeting, title, description, startBtn);
    this.container.append(content);
    document.body.append(this.container);
  }

  private handleStartGame(): void {
    const gamePage = new GameView();
    gamePage.draw();
  }
}
