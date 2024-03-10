import { Universe } from 'wasm-game-of-life';

const wrapper = document.getElementById('game-of-life-canvas');
const universe = Universe.new();

const renderLoop = () => {
  wrapper.textContent = universe.render();
  universe.tick();

  requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
