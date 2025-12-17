export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene'});
  }

  preload() {
    // load assets
    this.load.image('logo', 'assets/images/rubber_duck.png');
  }

  create() {
    this.scene.start('LoadingScene');
  }
}
