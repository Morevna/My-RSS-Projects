import { renderStartScreen } from './start-screen.js';
import { GridManager } from '/src/js/logic.js';
import { toggleSettingsPanel } from './settings-panel.js';


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

  // Создаём GridManager
  const gridManager = new GridManager();
  gridManager.generate(mode);

  // ОТРИСОВКА СЕТКИ
  function renderGrid() {
    gridContainer.innerHTML = "";

    gridManager.grid.forEach((row, r) => {
      row.forEach((value, c) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        cell.textContent = value !== null ? value : "";

        // Проверка выделения
        if (gridManager.selection.some(sel => sel.row === r && sel.col === c)) {
          cell.classList.add('selected');
        }

        // обработка клика
        cell.addEventListener('click', () => {
          gridManager.selectCell(r, c);
          renderGrid(); // сразу показываем выбранные ячейки

          // Если выбраны две — проверяем пару после короткой задержки
          if (gridManager.selection.length === 2) {
            setTimeout(() => {
              gridManager.processSelection();
              renderGrid();
              score.textContent = `Score: ${gridManager.score}`;
            }, 200);
          } else {
            score.textContent = `Score: ${gridManager.score}`;
          }
        });

        gridContainer.append(cell);
      });
    });
  }

  renderGrid();

  // Кнопка "Назад"
  const backBtn = document.createElement('button');
  backBtn.textContent = '← Back to Menu';
  backBtn.classList.add('back-btn');
  backBtn.addEventListener('click', () => renderStartScreen());

  //Кнопки управления
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
  continueBtn.disabled = true;

  controlButtons.append(resetBtn, saveBtn, continueBtn);

  // Вспомогательные кнопки
  const assistButtons = document.createElement('div');
  assistButtons.classList.add('assist-buttons');

  const hintsBtn = document.createElement('button');
  hintsBtn.textContent = 'Hints';

  const revertBtn = document.createElement('button');
  revertBtn.textContent = 'Revert';

  const addNumbersBtn = document.createElement('button');
  addNumbersBtn.textContent = 'Add Numbers';

  const shuffleBtn = document.createElement('button');
  shuffleBtn.textContent = 'Shuffle';

  const eraserBtn = document.createElement('button');
  eraserBtn.textContent = 'Eraser';

  const settingsBtn = document.createElement('button');
  settingsBtn.textContent = '⚙️ Settings';
  settingsBtn.addEventListener('click', toggleSettingsPanel);

  assistButtons.append(hintsBtn, revertBtn, addNumbersBtn, shuffleBtn, eraserBtn, settingsBtn);

  container.append(header, gridContainer, backBtn, controlButtons, assistButtons);
  document.body.append(container);
}