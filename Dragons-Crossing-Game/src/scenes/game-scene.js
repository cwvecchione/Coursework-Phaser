// create a new scene
export class GameScene extends Phaser.Scene {
    constructor() {
        super({
        key: 'GameScene',
        });
    }

    init() {
        if (this.levelsCompleted === undefined) {
        this.levelsCompleted = 0;
        }

        // player speed
        this.playerSpeed = 3;

        // enemy speed
        this.enemyMinSpeed = 1.5;
        this.enemyMaxSpeed = 3;

        // boundaries
        this.enemyMinY = 80;
        this.enemyMaxY = 280

        this.isGameOver = false;
    }

    // load assets
    preload() {
        // load images
        this.load.image('background', 'assets/background.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('enemy', 'assets/dragon.png');
        this.load.image('treasure', 'assets/treasure.png');
    }

    // called once after the preload ends
    create() {
        // create bg image
        const bg = this.add.image(0, 0, 'background');

        // change origin to the top-left corner
        bg.setOrigin(0, 0);

        // create the player
        this.player = this.add.image(40, this.scale.height / 2, 'player');

        // we are reducing the width and height by 50%
        this.player.setScale(0.5);

        // goal
        this.goal = this.add.image(this.scale.width - 80, this.scale.height / 2, 'treasure');
        this.goal.setScale(0.6);

        this.enemies = this.add.group({
        key: 'enemy',
        repeat: 4,
        setXY: {
            x: 90,
            y: 100,
            stepX: 100,
            stepY: 20
        }
        });
        Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);
        Phaser.Actions.Call(this.enemies.getChildren(), (enemy) => {
        enemy.flipX = true;

        // set enemy speed
        const dir = Math.random() < 0.5 ? 1 : -1;
        const speed = Phaser.Math.RND.between(this.enemyMinSpeed, this.enemyMaxSpeed);
        enemy.speed = dir * speed;
        });

        this.cameras.main.fadeIn(500);

        this.add.text(10, 10, `Score: ${this.levelsCompleted * 100}`, { fontSize: '22px' });

        // enable cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // this is called up to 60 times per second
    update() {
        if (this.isGameOver) {
        return;
        }

        // movement to the left
        if(this.cursors.left.isDown) {
            this.player.x -= this.playerSpeed;
            this.player.flipX = true;
        }

        // movement to the right
        else if(this.cursors.right.isDown) {
            this.player.x += this.playerSpeed;
            this.player.flipX = false;
        }

        // treasure overlap check
        const playerRect = this.player.getBounds();
        const goalRect = this.goal.getBounds();

        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)) {
        console.log('reached goal!!');

        this.handleGameOver(false);

        // make sure we leave this method
        return;
        }

        const enemies = this.enemies.getChildren();
        for (let i = 0; i < enemies.length; i += 1) {
        // enemy movement
        enemies[i].y += enemies[i].speed;

        // check we haven't passed min or max Y
        const conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
        const conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

        // if we passed the upper or lower limit, reverse
        if (conditionUp || conditionDown) {
            enemies[i].speed *= -1;
        }

        const enemyRect = enemies[i].getBounds();
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
            console.log('Game over!');

            this.handleGameOver(true);

            // make sure we leave this method
            return;
        }
        }
    }

    handleGameOver(playerDied) {
        this.isGameOver = true;

        if (playerDied) {
        this.cameras.main.shake(500);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => {
            this.cameras.main.fadeOut(500);
        });
        } else {
        this.cameras.main.fadeOut(500);
        }

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        if (playerDied) {
            this.levelsCompleted = 0;
        } else {
            this.levelsCompleted += 1;
        }
        // restart the Scene
        this.scene.restart();
        });
    }
}
