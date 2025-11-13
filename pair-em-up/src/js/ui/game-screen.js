import { renderStartScreen } from './start-screen.js';

function generateGrid(mode) {
  if (mode === 'classic') {
    const firstRow = [1,2,3,4,5,6,7,8,9];
    const secondThird = [];
    for (let i = 11; secondThird.length < 18; i++) {
      if (i === 10) continue;
      const digits = i.toString().split('').map(Number);
      for (const d of digits) {
        if (secondThird.length < 18) secondThird.push(d);
      }
    }
    return [...firstRow, ...secondThird];
  }

  if (mode === 'random') {
    const nums = [];
    while (nums.length < 27) {
      let n = Math.floor(Math.random() * 19) + 1;
      if (n === 10) continue; 
      const digits = n.toString().split('').map(Number);
      for (const d of digits) {
        if (nums.length < 27) nums.push(d);
      }
    }
    return nums;
  }

  if (mode === 'chaotic') {
    return Array.from({ length: 27 }, () => Math.floor(Math.random() * 9) + 1);
  }

  return [];
}


export function renderGameScreen(mode = 'classic') {
    document.body.innerHTML = '';

    const container = document.createElement('div');
    container.classList.add('game-screen');

    // Заголовок
    const header = document.createElement('div');
    header.classList.add('game-header');

    const title = document.createElement('h2');
    title.textContent = `${mode}`;

    const score = document.createElement('p');
    score.textContent = 'Score: 0';

    const timer = document.createElement('p');
    timer.textContent = 'Time: 00:00';

    header.append(title, score, timer);

    // Игровое поле
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');

    // Генерируем сетку
    const grid = generateGrid(mode);
    grid.forEach(num => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = num;
        gridContainer.append(cell);
    });

    // Кнопка "Назад"
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back to Menu';
    backBtn.classList.add('back-btn');
    backBtn.addEventListener('click', () => renderStartScreen());

    /*
    Кнопки управления :
Кнопка сброса: перезапускает текущую игру в том же режиме с новыми числами.
Кнопка «Сохранить игру»: сохраняет текущее состояние игры 
    (сетку, счет, таймер, режим, историю отмен, использование вспомогательных инструментов).
Кнопка «Продолжить игру»: 
   загружает ранее сохраненное состояние игры (доступно только при наличии сохраненной игры).
    */
    const controlButtons = document.createElement('div');
    controlButtons.classList.add('control-buttons');

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset Game';
    resetBtn.addEventListener('click', () => {
    container.classList.add('flash-effect'); 
    setTimeout(() => {
        container.classList.remove('flash-effect'); 
        renderGameScreen(mode); 
    }, 400);
});

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';

    const continueBtn = document.createElement('button');
    continueBtn.textContent = 'Continue';
    continueBtn.disabled = true; // неактивна

    controlButtons.append(resetBtn, saveBtn, continueBtn);


/*Вспомогательные кнопки: пять  инструментов 
(Подсказки, Возврат, Добавление чисел, Перемешивание, Ластик) со счетчиками использования
Кнопка настроек: быстрый доступ к настройкам игры во время игры.*/
    container.append(header, gridContainer, backBtn, controlButtons,);
    document.body.append(container);
}