const CUSTOM_DATA_KEYS = Object.freeze({
  STATS: 'STATS'
});

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  // some parameters for our scene
  init() {
    this.stats = {
      health: 100,
      fun: 100,
    };
    // decay parameters
    this.decayRates = {
      health: -5,
      fun: -2,
    };
  }

  // executed once, after assets were loaded
  create() {
    // game background
    const bg = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();
    bg.on(Phaser.Input.Events.POINTER_DOWN, this.placeItem, this);

    this.pet = this.add.sprite(100, 200, 'pet', 0).setInteractive({
      draggable: true,
    });
    // you can also make a game object draggable by using the setDraggable method
    // this.input.setDraggable(this.pet);
    this.pet.setDepth(1);

    // event listener for when spritesheet animation ends
    this.pet.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      // set pet back to neutral face
      this.pet.setFrame(0);
      // set UI to ready
      this.refreshUi();
    }, this);

    // create ui
    this.createUi();
    this.createHud();
    this.refreshHud();

    // decay of health and fun over time
    this.timerEventForStateDecay = this.time.addEvent({
      delay: 1000,
      repeat: -1, // it will repeat forever
      callback: () => {
        // update stats & refresh hud
        this.updateStats(this.decayRates);
        this.refreshHud();
      },
      callbackScope: this,
    });

    // follow pointer (mouse/finger) when dragging
    this.input.on(Phaser.Input.Events.DRAG, (pointer, gameObject, dragX, dragY) => {
      // make sprite be located at the coordinates of the dragging
      gameObject.setPosition(dragX, dragY);
    });
  }

  createUi() {
    // buttons
    this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
    this.appleBtn.on(Phaser.Input.Events.POINTER_DOWN, () => { this.pickItem(this.appleBtn); });
    this.appleBtn.setData(CUSTOM_DATA_KEYS.STATS, { health: 20, fun: 0 });

    this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
    this.candyBtn.on(Phaser.Input.Events.POINTER_DOWN, () => { this.pickItem(this.candyBtn); });
    this.candyBtn.setData(CUSTOM_DATA_KEYS.STATS, { health: -10, fun: 10 });

    this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
    this.toyBtn.on(Phaser.Input.Events.POINTER_DOWN, () => { this.pickItem(this.toyBtn); });
    this.toyBtn.setData(CUSTOM_DATA_KEYS.STATS, { health: 0, fun: 15 });

    this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();
    // the third argument allows us to pass what scope we want to be bound to the method provide
    this.rotateBtn.on(Phaser.Input.Events.POINTER_DOWN, this.rotatePet, this);
    this.rotateBtn.setData(CUSTOM_DATA_KEYS.STATS, { health: 0, fun: 10 });

    this.uiButtons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];

    this.isUiLocked = false;
    this.selectedItem = null;
    this.placedItem = undefined;
  }

  // pick item
  pickItem(item) {
    // "this" scope is now referring to the GameScene instance

    // the ui can't be locked in order to select an item
    if (this.isUiLocked) {
      return;
    }

    // make sure the ui is ready
    this.refreshUi();

    // keep track of the selected item
    this.selectedItem = item;

    // change transparency
    item.setAlpha(0.5);

    console.log('we are picking ', item.texture.key);
    console.log(item.getData(CUSTOM_DATA_KEYS.STATS));
  }

  // rotate pet
  rotatePet() {
    // "this" scope is referring to the GameScene instance

    // the ui can't be locked in order to select an item
    if (this.isUiLocked) {
      return;
    }

    // make sure the ui is ready
    this.refreshUi();

    // lock the ui
    this.isUiLocked = true;

    // dim the rotate icon
    this.rotateBtn.setAlpha(0.5);

    // rotation tween
    this.tweens.add({
      targets: this.pet,
      angle: 720,
      duration: 600,
      onComplete: () => {
        // increase fun
        const customStats = this.rotateBtn.getData(CUSTOM_DATA_KEYS.STATS);
        this.updateStats(customStats);
        // set UI to ready
        this.refreshUi();
      },
      callbackScope: this,
    });

    console.log('we are rotating the pet!');
  }

  // unlock ui
  refreshUi() {
    // nothing is being selected
    this.selectedItem = null;

    // set all buttons to alpha 1 (no transparency)
    this.uiButtons.forEach((button) => {
      button.setAlpha(1);
    });

    // scene must be unlocked
    this.isUiLocked = false;

    // update hud
    this.refreshHud();
  }

  placeItem(pointer, localX, localY) {
    // scene must be unlocked
    if (this.isUiLocked) {
      return;
    }
    // check that an item was selected
    if (this.selectedItem === null) {
      return;
    }

    this.isUiLocked = true;

    // create a new item in the position the player clicked/tapped
    if (this.placedItem !== undefined) {
      this.placedItem.setPosition(localX, localY);
      this.placedItem.setTexture(this.selectedItem.texture.key);
      this.placedItem.setVisible(true);
    } else {
      this.placedItem = this.add.image(localX, localY, this.selectedItem.texture.key);
    }

    this.tweens.add({
      targets: this.pet,
      x: this.placedItem.x,
      y: this.placedItem.y,
      duration: 500,
      onComplete: () => {
        // hide our item game object
        this.placedItem.setVisible(false);
        // play spritesheet animation
        this.pet.play('funnyfaces');
        // increase stats
        const customStats = this.selectedItem.getData(CUSTOM_DATA_KEYS.STATS);
        this.updateStats(customStats);
      },
      callbackScope: this,
    });
  }

  // stat updater
  updateStats(customStats) {
    // flag to see if it's game over
    let isGameOver = false;

    // update the pet stats
    for (const [key, value] of Object.entries(customStats)) {
      // console.log(key, value);
      if (this.stats[key] !== undefined) {
        this.stats[key] += value;

        // stats can't be less than zero
        if (this.stats[key] <= 0) {
          this.stats[key] = 0;
          isGameOver = true;
        }
      }
    }

    // check to see if the game ended
    if (isGameOver) {
      this.handleGameOver();
    }
  }

  createHud() {
    this.healthText = this.add.text(20, 20, 'Health: ', {
      fill: '#000000',
      fontSize: '24px',
      fontFamily: 'Arial',
    });

    this.funText = this.add.text(170, 20, 'Fun: ', {
      fill: '#000000',
      fontSize: '24px',
      fontFamily: 'Arial',
    });
  }

  refreshHud() {
    this.healthText.setText(`Health: ${this.stats.health}`);
    this.funText.setText(`Fun: ${this.stats.fun}`);
  }

  handleGameOver() {
    // block ui
    this.isUiLocked = true;

    // cleanup timer event for stat decay
    this.timerEventForStateDecay.destroy();

    // change frame of the pet
    this.pet.setFrame(4);

    // keep the game on for a some time, the move on
    this.time.addEvent({
      delay: 2000,
      repeat: 0,
      callback: () => {
        this.scene.start('HomeScene');
      },
      callbackScope: this,
    });
  }
}
