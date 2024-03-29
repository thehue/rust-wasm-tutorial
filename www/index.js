import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';
import { Universe, Cell } from 'wasm-game-of-life';

const CELL_SIZE = 5; // px
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#228B22';

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// 모든 셀들과 셀들 주위의 1px border에 대한 공간을 canvas에 제공
const canvas = document.getElementById('game-of-life-canvas');
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const renderLoop = () => {
  universe.tick();

  drawGrid();
  drawCells();
  requestAnimationFrame(renderLoop);
};

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // 수직선들
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // 수평선들
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const bitIsSet = (index, uint8Array) => {
  const byteIndex = Math.floor(n / 8); // 바이트 인덱스 계산
  const bitIndex = index % 8; // 비트 인덱스 계산
  const byteValue = uint8Array[byteIndex]; // 해당 바이트 값 얻기
  const mask = 1 << bitIndex; // 비트 마스크 생성
  return (byteValue & mask) !== 0; // 비트가 설정되어 있는지 확인
};

const getIndex = (row, column) => {
  return row * width + column;
};

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle =
        bitIsSet(idx, cells) === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE,
      );
    }
  }

  ctx.stroke();
};

requestAnimationFrame(renderLoop);
