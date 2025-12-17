export class HomeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HomeScene'});
  }

  create() {
    const { width, height } = this.scale;

    const bg = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();

    const text = this.add.text(width / 2, height / 2, '😄 VIRTUAL PET', {
      fill: '#ffffff',
      fontSize: '40px',
      fontFamily: 'Arial'
    }).setOrigin(0.5).setDepth(1);
    this.add.rectangle(text.x, text.y, text.width + 20, text.height + 20, 0x000000, 0.7);

    bg.once(Phaser.Input.Events.POINTER_DOWN, () => {
      this.scene.start('GameScene');
    }, this);
  }
}
