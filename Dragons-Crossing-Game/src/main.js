import { GameScene } from './scenes/game-scene.js';
import { TitleScene } from './scenes/title-scene.js';

// set the configuration of the game
const config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  scene: [TitleScene, GameScene],
  scale: {
    width: 640,
    height: 360,
    mode: Phaser.Scale.FIT,
  },
  backgroundColor: '#000000',
};

// create a new game, pass the configuration
const game = new Phaser.Game(config);