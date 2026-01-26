import { getValidationError } from './login-validation';
import { StartView } from '../start/start-view';
import './login.css';

const MIN_FIRST_NAME_LENGTH = 3;
const MIN_SURNAME_LENGTH = 4;
const REDIRECT_DELAY = 1000;

export class LoginView {
  private container: HTMLElement;
  private firstNameInput!: HTMLInputElement;
  private surnameInput!: HTMLInputElement;
  private firstNameError!: HTMLElement;
  private surnameError!: HTMLElement;
  private loginButton!: HTMLButtonElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'login-container';
    this.createElements();
    this.validate();
    this.loadUserData();
  }

  private createElements(): void {
    const title = document.createElement('h1');
    title.textContent = 'RSS Puzzle - Login';

    const form = document.createElement('form');
    form.className = 'login-form';

    form.noValidate = true;
    //
    form.addEventListener('submit', this.saveToLocalStorage.bind(this));

    this.firstNameInput = this.createInput('First Name');
    this.firstNameError = this.createErrorSpan();

    this.surnameInput = this.createInput('Surname');
    this.surnameError = this.createErrorSpan();

    this.loginButton = document.createElement('button');
    this.loginButton.textContent = 'Login';
    this.loginButton.className = 'login-button';
    this.loginButton.disabled = true;

    this.firstNameInput.addEventListener('input', () => this.validate());
    this.surnameInput.addEventListener('input', () => this.validate());

    form.append(
      this.firstNameInput,
      this.firstNameError,
      this.surnameInput,
      this.surnameError,
      this.loginButton,
    );

    this.container.append(title, form);
  }

  private createInput(placeholder: string): HTMLInputElement {
    const input = document.createElement('input');
    input.placeholder = placeholder;
    input.className = 'login-input';
    return input;
  }

  private createErrorSpan(): HTMLElement {
    const span = document.createElement('span');
    span.className = 'error-message';
    return span;
  }

  private validate(): void {
    const fNameError = getValidationError(
      this.firstNameInput.value,
      MIN_FIRST_NAME_LENGTH,
    );
    const sNameError = getValidationError(
      this.surnameInput.value,
      MIN_SURNAME_LENGTH,
    );

    this.firstNameError.textContent = fNameError || '';
    this.surnameError.textContent = sNameError || '';

    this.firstNameInput.classList.toggle('input-error', !!fNameError);
    this.surnameInput.classList.toggle('input-error', !!sNameError);

    this.loginButton.disabled = !!(fNameError || sNameError);
  }

  public draw(): void {
    document.body.innerHTML = '';
    document.body.append(this.container);
  }
  //
  private saveToLocalStorage(event: Event): void {
    event.preventDefault();
    const userData = {
      firstName: this.firstNameInput.value,
      surname: this.surnameInput.value,
    };

    localStorage.setItem('rss-puzzle-user', JSON.stringify(userData));

    this.loginButton.textContent = 'Saved!';
    this.loginButton.style.backgroundColor = '#4caf50';
    this.loginButton.disabled = true;

    setTimeout(() => {
      const startPage = new StartView();
      startPage.draw();
    }, REDIRECT_DELAY);
  }

  private loadUserData(): void {
    const savedData = localStorage.getItem('rss-puzzle-user');

    if (savedData) {
      const user = JSON.parse(savedData);

      this.firstNameInput.value = user.firstName || '';
      this.surnameInput.value = user.surname || '';

      this.validate();
    }
  }
}
