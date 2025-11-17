import './ui/start-screen.js';
import './ui/game-screen.js';


export class GridManager {
  constructor() {
    this.grid = [];        // 2D-сетка (матрица)
    this.selection = [];   // выбранные ячейки (до 2)
    this.score = 0;        // очки
  }

  //ПРЕОБРАЗОВАНИЕ В МАТРИЦУ
  toMatrix(flatArr) {
    const matrix = [];
    for (let i = 0; i < flatArr.length; i += 9) {
      matrix.push(flatArr.slice(i, i + 9));
    }
    return matrix;
  }

  //ГЕНЕРАЦИЯ
  generate(mode) {
    if (mode === "classic") this.grid = this.generateClassic();
    else if (mode === "random") this.grid = this.generateRandom();
    else if (mode === "chaotic") this.grid = this.generateChaotic();
  }

  generateClassic() {
    const flat = [
      1, 2, 3, 4, 5, 6, 7, 8, 9,
      1, 1, 1, 2, 1, 3, 1, 4, 1,
      5, 1, 6, 1, 7, 1, 8, 1, 9,
    ];
    return this.toMatrix(flat);
  }

  generateRandom() {
    const flat = [];
    for (let i = 1; i <= 9; i++) flat.push(i);

    let n = 10;
    while (flat.length < 27) {
      const digits = n.toString().split("").map(Number);
      for (let d of digits) {
        if (d !== 0 && flat.length < 27) flat.push(d);
      }
      n++;
    }

    // Перемешивание
    flat.sort(() => Math.random() - 0.5);

    return this.toMatrix(flat);
  }

  generateChaotic() {
    const flat = [];
    for (let i = 0; i < 27; i++) {
      flat.push(Math.floor(Math.random() * 9) + 1);
    }
    return this.toMatrix(flat);
  }


  //ДОБАВЛЕНИЕ СТРОКИ
  addRow(numbers) {
    if (numbers.length !== 9) {
      throw new Error("addRow() requires exactly 9 numbers");
    }
    this.grid.push(numbers);
  }


  //ВЫБОР ЯЧЕЙКИ
  selectCell(row, col) {
    if (!this.grid[row][col]) return;

    const exists = this.selection.find(i => i.row === row && i.col === col);
    if (exists) {
      this.selection = this.selection.filter(i => !(i.row === row && i.col === col));
      return;
    }
    if (this.selection.length === 2) return;

    this.selection.push({ row, col });
  }

  //ПРОВЕРКА ПАРЫ
  processSelection() {
    if (this.selection.length !== 2) return;

    const [a, b] = this.selection;
    const v1 = this.grid[a.row][a.col];
    const v2 = this.grid[b.row][b.col];

    const isPairValid = this.isValidPair(v1, v2);
    const isPathValid = this.canConnect(a, b);

    if (isPairValid && isPathValid) {
      this.deleteCells(a, b);
    }

    this.selection = [];
  }

  //ОЧКИ
  isValidPair(a, b) {
    if (a === b) {
      if (a === 5) {
        this.score += 3;
      } else {
        this.score += 1;
      }
      return true;
    }

    if (a + b === 10) {
      this.score += 2;
      return true;
    }

    return false;
  }


  // МЕСТОНАХОЖДЕНИЕ ЯЧЕЕК ИЗ ПАРЫ
  canConnect(c1, c2) {
    const row1 = c1.row;
    const col1 = c1.col;
    const row2 = c2.row;
    const col2 = c2.col;

    const gridWidth = this.grid[0].length;

    //1 Смежные по горизонтали или вертикали
    if (row1 === row2 && (col1 === col2 - 1 || col1 === col2 + 1)) {
      return true;
    }


    //2 Игнор пустые клетки в строке
    if (row1 === row2) {
      const start = Math.min(col1, col2) + 1;
      const end = Math.max(col1, col2);
      for (let c = start; c < end; c++) {
        if (this.grid[row1][c] !== null) return false;
      }
      return true;
    }


    // 3 Игнор пустые клетки в столбце
    if (col1 === col2) {
      const start = Math.min(row1, row2) + 1;
      const end = Math.max(row1, row2);
      for (let r = start; r < end; r++) {
        if (this.grid[r][col1] !== null) return false;
      }
      return true;
    }

    // 4 Переход между строками
    if (col1 === gridWidth - 1 && col2 === 0 && row1 + 1 === row2) return true;
    if (col2 === gridWidth - 1 && col1 === 0 && row2 + 1 === row1) return true;

    // Если ни одно не подошло
    return false;
  }

  // УДАЛЕНИЕ ПАРЫ
  deleteCells(a, b) {
    this.grid[a.row][a.col] = null;
    this.grid[b.row][b.col] = null;
  }
}

