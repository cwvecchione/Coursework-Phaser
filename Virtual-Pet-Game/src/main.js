import { GameScene } from './scenes/game-scene.js';
import { HomeScene } from './scenes/home-scene.js';
import { LoadingScene } from './scenes/loading-scene.js';
import { BootScene } from './scenes/boot-scene.js';

// our game's configuration
const config = {
  type: Phaser.AUTO,
  scale: {
    width: 360,
    height: 640,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  scene: [BootScene, LoadingScene, HomeScene, GameScene],
  title: 'Virtual Pet',
  pixelArt: false,
  backgroundColor: 'ffffff'
};

// create the game, and pass it the configuration
const game = new Phaser.Game(config);
