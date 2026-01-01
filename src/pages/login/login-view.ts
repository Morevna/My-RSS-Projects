import './login.css';

export class LoginView {
  private container: HTMLElement;
  private firstNameInput: HTMLInputElement;
  private surnameInput: HTMLInputElement;
  private loginButton: HTMLButtonElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'login-container';

    const title = document.createElement('h1');
    title.textContent = 'RSS Puzzle - Login';

    const form = document.createElement('form');
    form.className = 'login-form';

    this.firstNameInput = this.createInput('First Name', 'text');
    this.surnameInput = this.createInput('Surname', 'text');

    this.loginButton = document.createElement('button');
    this.loginButton.textContent = 'Login';
    this.loginButton.className = 'login-button';
    this.loginButton.disabled = true;

    form.append(this.firstNameInput, this.surnameInput, this.loginButton);
    this.container.append(title, form);
  }

  private createInput(placeholder: string, type: string): HTMLInputElement {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.required = true;
    input.className = 'login-input';
    return input;
  }

  public draw(): void {
    document.body.innerHTML = '';
    document.body.append(this.container);
  }
}
