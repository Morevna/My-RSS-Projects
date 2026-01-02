import { getValidationError } from './login-validation';
import './login.css';

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
  }

  private createElements(): void {
    const title = document.createElement('h1');
    title.textContent = 'RSS Puzzle - Login';

    const form = document.createElement('form');
    form.className = 'login-form';

    form.noValidate = true;

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
    const fNameError = getValidationError(this.firstNameInput.value, 3);
    const sNameError = getValidationError(this.surnameInput.value, 4);

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
}
