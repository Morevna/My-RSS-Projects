export function renderStartScreen() {
  // Очистка body
  document.body.innerHTML = '';
  // создание html
  const container = document.createElement('div');
  container.classList.add('start-screen');
  
  const title = document.createElement('h1');
  title.textContent = 'Pair ’em Up';

  const modeButtons = document.createElement('div');
  modeButtons.classList.add('mode-buttons');

  const classicBtn = document.createElement('button');
  classicBtn.textContent = 'Classic Mode';

  const randomBtn = document.createElement('button');
  randomBtn.textContent = 'Random Mode';

  const chaoticBtn = document.createElement('button');
  chaoticBtn.textContent = 'Chaotic Mode';

  modeButtons.append(classicBtn, randomBtn, chaoticBtn);

  // Кнопки утилит
  const utilityButtons = document.createElement('div');
  utilityButtons.classList.add('utility-buttons');

  const continueBtn = document.createElement('button');
  continueBtn.textContent = 'Continue Game';
  continueBtn.disabled = true; // неактивна

  const settingsBtn = document.createElement('button');
  settingsBtn.textContent = '⚙️ Settings';

  const resultsBtn = document.createElement('button');
  resultsBtn.textContent = '🏆 Results';

  utilityButtons.append(continueBtn, settingsBtn, resultsBtn);

  // github
  const author = document.createElement('p');
  author.classList.add('author');

  const authorLink = document.createElement('a');
  authorLink.href = 'https://github.com/Morevna/'; 
  authorLink.target = '_blank';
  authorLink.textContent = '@morevna';

  author.textContent = 'by ';
  author.append(authorLink);

  // 
  container.append(title, modeButtons, utilityButtons, author);
  document.body.append(container);

  // Обраблтчики 
//   classicBtn.addEventListener('click', ());
//   randomBtn.addEventListener('click', ());
//   chaoticBtn.addEventListener('click', ());
}
