export class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadingScene'});
  }

  preload() {
    // game width and height
    const { width, height } = this.scale;
    // show logo
    this.add.image(width / 2, 250, 'logo');

    const barW = 150;
    const barH = 30;
    // progress bar background
    this.add.rectangle(width / 2, height / 2, barW, barH, 0xf5f5f5, 1);
    // progress bar
    const progressBar = this.add.rectangle(width / 2 - barW/2, height / 2, 0, barH, 0x9ad98d, 1).setOrigin(0, 0.5);

    // load assets
    this.load.image('backyard', 'assets/images/backyard.png');
    this.load.image('apple', 'assets/images/apple.png');
    this.load.image('candy', 'assets/images/candy.png');
    this.load.image('rotate', 'assets/images/rotate.png');
    this.load.image('toy', 'assets/images/rubber_duck.png');

    // load spritesheet
    this.load.spritesheet('pet', 'assets/images/pet.png', {
      frameWidth: 97,
      frameHeight: 83,
      margin: 1,
      spacing: 1,
    });

    // TESTING - to see the progress bar in action!
    // for (let i = 0; i < 2000; i += 1) {
    //   this.load.image(`toy${i}`, 'assets/images/rubber_duck.png');
    // }

    // listen to the "progress" event
    this.load.on(Phaser.Loader.Events.PROGRESS, (value) => {
      progressBar.setSize(value * barW, barH);
    });
  }

  create() {
    // create animation
    this.anims.create({
      key: 'funnyfaces',
      frames: this.anims.generateFrameNames('pet', { frames: [1, 2, 3] }),
      frameRate: 7,
      yoyo: true,
      repeat: 0, // to repeat forever: -1
    });

    this.scene.start('HomeScene');
  }
}
