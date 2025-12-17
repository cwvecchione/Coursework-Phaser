// create a new scene
export class TitleScene extends Phaser.Scene {
    constructor() {
        super({
        key: 'TitleScene',
        });
    }

    // load assets
    preload() {
        // load images
        this.load.image('titleBackground', 'assets/title-background.png');
    }

    // called once after the preload ends
    create() {
        const bg = this.add.image(0, 0, 'titleBackground');
        bg.setOrigin(0, 0);

        this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'Crossing Road Adventure', {
        fontSize: '28px',
        })
        .setOrigin(0.5);

        this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Click to play!', {
        fontSize: '18px',
        })
        .setOrigin(0.5);

        this.cameras.main.fadeIn(500);

        this.input.once('pointerup', () => {
        this.cameras.main.fadeOut(500);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start('GameScene');
        });
    }
}
