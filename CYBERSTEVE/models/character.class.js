/**
 * Represents the character controlled by the player.
 * @class
 * @extends MovableObject
 */
class Character extends MovableObject {
  height = 150;
  width = 100;
  speed = 7.5;
  y = 310;
  startX = this.getStartPosition();
  x = this.startX;
  speedY = 0;
  deathAnimationPlayed = false;
  currentDeathFrame = 0;
  lastIdleUpdate = 0;
  weapon = new Weapon();
  damageSoundPlayed = false;

  /**
   * Determines the starting position based on device type
   * @returns {number} The starting x-position for the character
   */
  getStartPosition() {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      return 200;
    } else {
      return 100;
    }
  }

  /**
   * Applies gravity to the character, updating its position over time.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 60);
  }

  /**
   * Checks if the character is above the ground.
   * @returns {boolean} True if the character is above ground, otherwise false.
   */
  isAboveGround() {
    return this.y < 305;
  }

  /**
   * The images used for different character states (idle, walking, jumping, etc.).
   * @type {string[]}
   */
  IMAGES_IDLE = [
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_idle/1.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_idle/2.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_idle/3.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_idle/4.png",
  ];

  IMAGES_WALKING = [
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_run/1.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_run/2.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_run/3.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_run/4.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_run/5.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_run/6.png",
  ];

  IMAGES_JUMPING = [
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_jump/1.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_jump/2.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_jump/3.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_jump/4.png",
  ];

  IMAGES_DEAD = [
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_death/1.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_death/2.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_death/3.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_death/4.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_death/5.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_death/6.png",
  ];

  IMAGES_HURT = [
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_hurt/1.png",
    "../CYBERSTEVE/img/Charakters/1%20Biker/Biker_hurt/2.png",
  ];

  world;
  walking_sound = new Audio("../CYBERSTEVE/audio/walking.wav");

  /**
   * Creates an instance of the Character class and loads images.
   */
  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.walking_sound.volume = 0.3;
    this.x = this.startX;
    this.applyGravity();
  }

  /**
   * Checks if device is touch-enabled
   * @returns {boolean} True if touch device
   */
  isTouchDevice() {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }

  /**
   * Handles right movement and sound
   */
  handleRightMovement() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.walking_sound.play();
    }
  }

  /**
   * Handles left movement and sound
   */
  handleLeftMovement() {
    const minPosition = this.isTouchDevice() ? this.startX - 100 : 0;
    if (this.world.keyboard.LEFT && this.x > minPosition) {
      this.moveLeft();
      this.otherDirection = true;
      this.walking_sound.play();
    }
  }

  /**
   * Handles jumping action
   */
  handleJumpAction() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
    }
  }

  /**
   * Main movement handler function
   */
  handleMovement() {
    if (!this.isDead()) {
      this.walking_sound.pause();
      this.handleRightMovement();
      this.handleLeftMovement();
      this.handleJumpAction();
      this.world.camera_x = -this.x + this.startX;
    }
  }

  /**
   * Handles death animation state
   */
  handleDeathState() {
    if (this.isDead()) {
      this.playDeathAnimation();
      return true;
    }
    return false;
  }

  /**
   * Handles hurt state animation
   */
  handleHurtState() {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      if (!this.damageSoundPlayed) {
        this.playDamageSound();
        this.damageSoundPlayed = true;
      }
      return true;
    }
    return false;
  }

  /**
   * Handles movement animations based on character state
   */
  handleMovementAnimations() {
    this.damageSoundPlayed = false;
    if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Main animation handler function
   */
  handleAnimation() {
    if (this.handleDeathState()) return;
    if (this.handleHurtState()) return;
    this.handleMovementAnimations();
  }

  /**
   * Starts the movement and animation cycles.
   */
  startAnimationCycle() {
    setInterval(() => {
      this.handleMovement();
    }, 1000 / 60);

    setInterval(() => {
      this.handleAnimation();
    }, 100);
  }

  /**
   * Main function to start animation for the character.
   * Calls the necessary functions to handle movement and animation.
   */
  animate() {
    this.startAnimationCycle();
  }

  /**
   * Plays the damage sound when the character gets hurt.
   */
  playDamageSound() {
    const damageSound = new Audio("../CYBERSTEVE/audio/character-damage.mp3");
    damageSound.volume = 0.3;
    damageSound.play();
  }

  /**
   * Resets the damage sound played flag.
   */
  resetDamageSound() {
    this.damageSoundPlayed = false;
  }

  /**
   * Initializes and plays the death sound effect
   */
  playDeathSound() {
    const deathSound = new Audio("../CYBERSTEVE/audio/character-death.mp3");
    deathSound.volume = 0.3;
    deathSound.play();
  }

  /**
   * Updates the current frame of death animation
   * @returns {boolean} Whether animation should continue
   */
  updateDeathFrame() {
    if (this.currentDeathFrame < this.IMAGES_DEAD.length) {
      let path = this.IMAGES_DEAD[this.currentDeathFrame];
      this.img = this.imageCache[path];
      this.currentDeathFrame++;
      return true;
    }
    return false;
  }

  /**
   * Starts the death animation interval
   */
  startDeathAnimationInterval() {
    const interval = setInterval(() => {
      if (!this.updateDeathFrame()) {
        clearInterval(interval);
        this.deathAnimationPlayed = true;
      }
    }, 10);
  }

  /**
   * Main death animation coordinator
   */
  playDeathAnimation() {
    if (!this.deathAnimationPlayed) {
      this.playDeathSound();
      this.weapon = null;
      this.showDeathScreen();
      this.startDeathAnimationInterval();
    }
  }

  /**
   * Plays the death sound for the character.
   */
  playDeathSound() {
    const deathSound = new Audio("../CYBERSTEVE/audio/character-death.mp3");
    deathSound.volume = 0.3;
    deathSound.play();
  }

  /**
   * Sets up the death screen to display when the character dies.
   */
  showDeathScreen() {
    const deathScreen = document.createElement("div");
    deathScreen.className = "death-screen";
    deathScreen.innerHTML = `
      <div class="death-content">
          <h2>YOU DIED</h2>
          <button class="btn" id="restart">Restart</button>
          <button class="btn" id="main-menu">Main Menu</button>
      </div>
  `;
    document.body.appendChild(deathScreen);

    document.getElementById("restart").addEventListener("click", restartGame);
    document
      .getElementById("main-menu")
      .addEventListener("click", returnToMainMenu);
  }

  /**
   * Updates the character's death animation frame.
   */
  updateDeathFrame() {
    let path = this.IMAGES_DEAD[this.currentDeathFrame];
    this.img = this.imageCache[path];
    this.currentDeathFrame++;
  }

  /**
   * Handles the death animation and ends it when all frames are shown.
   */
  handleDeathAnimation() {
    if (this.currentDeathFrame < this.IMAGES_DEAD.length) {
      this.updateDeathFrame();
    } else {
      this.deathAnimationPlayed = true;
    }
  }

  /**
   * Plays the death animation for the character, including the sound and visual effects.
   */
  playDeathAnimation() {
    if (!this.deathAnimationPlayed) {
      this.playDeathSound();
      this.weapon = null;
      this.showDeathScreen();

      const interval = setInterval(() => {
        this.handleDeathAnimation();
        if (this.deathAnimationPlayed) clearInterval(interval);
      }, 10);
    }
  }

  /**
   * Makes the character jump by increasing the vertical speed.
   */
  jump() {
    this.speedY = 20;
  }

  /**
   * Draws the character and its weapon to the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   */
  draw(ctx) {
    super.draw(ctx);
    if (this.weapon && !this.isHurt()) {
      this.weapon.updatePosition(this);
      this.weapon.draw(ctx);
    }
  }

  /**
   * Creates and returns a shot object fired by the character.
   * @returns {ShotObject} The created shot object.
   */
  createShot() {
    const offset = 10;
    const shotX = this.otherDirection
      ? this.x - offset
      : this.x + this.width + offset;
    return new ShotObject(shotX, this.y + 50, this.otherDirection);
  }

  /**
   * Collects a crystal, plays the collection sound, and adds the value to the energy bar.
   * @param {Crystal} crystal - The crystal object being collected.
   */
  collectCrystal(crystal) {
    const collectSound = new Audio("../CYBERSTEVE/audio/collect.mp3");
    collectSound.volume = 0.2;
    collectSound.play();

    this.world.energyBar.addEnergy(crystal.value);
    this.world.level.crystals.splice(
      this.world.level.crystals.indexOf(crystal),
      1
    );
  }

  /**
   * Checks if an enemy is within the character's sight range.
   * @param {Enemy} enemy - The enemy object to check.
   * @returns {boolean} True if the enemy is within sight, false otherwise.
   */
  isInSight(enemy) {
    if (enemy.x < this.x + 500) {
      return true;
    }
    return false;
  }
}
