import { renderGameScreen } from './game-screen.js';

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
  classicBtn.textContent = 'classic';

  const randomBtn = document.createElement('button');
  randomBtn.textContent = 'random';

  const chaoticBtn = document.createElement('button');
  chaoticBtn.textContent = 'chaotic';

  modeButtons.append(classicBtn, randomBtn, chaoticBtn);

  // Кнопки утилит
  const utilityButtons = document.createElement('div');
  utilityButtons.classList.add('utility-buttons');

  const continueBtn = document.createElement('button');
  continueBtn.textContent = 'Continue Game';
  continueBtn.disabled = true; // неактивна пока нет незаконченной игры
  /*⚙️ Панель настроек. Настраиваемые игровые параметры:
  Управление звуком : Индивидуальные или групповые переключатели для звуковых эффектов:
  Выбор/отмена выбора ячеек
  Успешное сопоставление пар
  Недействительные попытки пары
  Помощь в использовании инструментов (сложение чисел, перемешивание)
  События начала и окончания игры
  Выбор темы : Полное визуальное переключение темы между светлым и темным режимами, влияющее на:
  Цвета фона
  Цвета игровой сетки и ячеек
  Цвета элементов пользовательского интерфейса (кнопки, счетчики, текст)
  Все интерактивные элементы и индикаторы*/
  const settingsBtn = document.createElement('button');
  settingsBtn.textContent = '⚙️ Settings';

  //Ведение журнала игры: каждая завершенная игра сохраняет: 
  // выбранный режим, окончательный счет, результат победы/поражения, 
  // время завершения и общее количество сделанных ходов.
  //Таблица рекордов: содержит 5 последних игр, отсортированных по времени завершения 
  // (формат ММ:СС).
  //Индикаторы побед: визуальные маркеры (например, звезды, трофеи) для игр,
  //  в которых были выиграны.
  //Сохранение данных: все результаты сохраняются в локальном хранилище 
  // для кросс-сессионного доступа.
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
  classicBtn.addEventListener('click', () => renderGameScreen('classic'));
  randomBtn.addEventListener('click', () => renderGameScreen('random'));
  chaoticBtn.addEventListener('click', () => renderGameScreen('chaotic'));
}
