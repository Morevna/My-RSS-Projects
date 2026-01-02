import { HeaderView } from '../../components/header/header-view';
import './start.css';

export class StartView {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'start-container';
  }

  public draw(): void {
    document.body.innerHTML = '';

    const header = new HeaderView();
    document.body.append(header.getElement());
    //
    const content = document.createElement('div');
    content.className = 'start-content';

    const title = document.createElement('h1');
    title.className = 'app-name';
    title.textContent = 'RSS Puzzle';

    const description = document.createElement('p');
    description.className = 'game-description';
    description.textContent =
      'An interactive game for practicing English sentence construction. Drag and drop words to form sentences from classic literature.';

    content.append(title, description);
    this.container.append(content);

    document.body.append(this.container);
  }
}
