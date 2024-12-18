/**
 * Represents an Endboss character in the game.
 * Handles movement, animations, and interactions such as taking damage and playing sounds.
 */
class Endboss extends MovableObject {
  height = 400;
  width = 300;
  y = 70;
  health = 1000;
  isDying = false;
  currentDeathFrame = 0;
  deathAnimationComplete = false;
  speed = 4;
  otherDirection = false;
  moveLeft = true;
  minX = 0;
  maxX = 3200;
  world;
  firstSighting = true;
  movementStarted = false;
  engineSoundPlaying = false;
  hasPlayedHitSound = false;
  engineSoundInterval = null;

  /** @type {HTMLAudioElement} */
  engineSound = new Audio("../CYBERSTEVE/audio/engine-sound.mp3");

  IMAGES_WALKING = [
    "../CYBERSTEVE/img/Enemies/1/Walk/1.png",
    "../CYBERSTEVE/img/Enemies/1/Walk/2.png",
    "../CYBERSTEVE/img/Enemies/1/Walk/3.png",
    "../CYBERSTEVE/img/Enemies/1/Walk/4.png",
  ];

  IMAGES_HURT = [
    "../CYBERSTEVE/img/Enemies/1/Hurt/1.png",
    "../CYBERSTEVE/img/Enemies/1/Hurt/2.png",
  ];

  IMAGES_DEAD = [
    "../CYBERSTEVE/img/Enemies/1/Death/1.png",
    "../CYBERSTEVE/img/Enemies/1/Death/2.png",
    "../CYBERSTEVE/img/Enemies/1/Death/3.png",
    "../CYBERSTEVE/img/Enemies/1/Death/4.png",
    "../CYBERSTEVE/img/Enemies/1/Death/5.png",
    "../CYBERSTEVE/img/Enemies/1/Death/6.png",
  ];

  /**
   * Initializes the Endboss object with its walking, hurt, and death images.
   * Sets up initial position and engine sound properties.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = this.maxX;
    this.engineSound.loop = true;
    this.engineSound.volume = 0.1;
  }

  /**
   * Checks if the character is visible within the Endboss's view.
   * @returns {boolean} True if the character is visible, false otherwise.
   */
  isCharacterVisible() {
    if (!this.world || !this.world.character) return false;

    const cameraX = -this.world.camera_x;
    const screenWidth = this.world.canvas.width;

    const bossInView = this.x >= cameraX && this.x <= cameraX + screenWidth;
    const characterInView =
      this.world.character.x >= cameraX &&
      this.world.character.x <= cameraX + screenWidth;

    return bossInView && characterInView;
  }

  /**
   * Clears all intervals and sounds
   */
  clearIntervals() {
    if (this.engineSound) {
      this.engineSound.pause();
      this.engineSound.currentTime = 0;
      this.engineSoundPlaying = false;
    }

    [
      this.movementInterval,
      this.animationInterval,
      this.engineSoundInterval,
    ].forEach((interval) => {
      if (interval) {
        clearInterval(interval);
      }
    });

    this.movementInterval = null;
    this.animationInterval = null;
    this.engineSoundInterval = null;
  }

  /**
   * Checks if the engine sound should be played or paused based on the character's visibility.
   */
  checkEngineSound() {
    if (this.isCharacterVisible() && !this.isDead()) {
      if (!this.engineSoundPlaying) {
        this.engineSound.play().catch((error) => {
          console.error("Error playing engine sound:", error);
        });
        this.engineSoundPlaying = true;
      }
    } else {
      if (this.engineSoundPlaying) {
        this.engineSound.pause();
        this.engineSound.currentTime = 0;
        this.engineSoundPlaying = false;
      }
    }
  }

  /**
   * Handles movement timing after character is visible
   */
  handleMovementStart() {
    if (!this.movementStarted) {
      setTimeout(() => {
        this.movementStarted = true;
      }, 1000);
    }
  }

  /**
   * Updates engine sound state
   */
  updateEngineSound() {
    this.checkEngineSound();
    if (this.isDead()) {
      this.engineSound.pause();
      this.engineSound.currentTime = 0;
    }
  }

  /**
   * Handles movement logic when character is visible
   */
  handleVisibleCharacterMovement() {
    if (this.isCharacterVisible()) {
      this.handleMovementStart();
      if (this.movementStarted) {
        this.moveEndboss();
      }
    }
  }

  /**
   * Sets up animation intervals
   */
  animate() {
    this.clearIntervals();

    this.movementInterval = setInterval(() => {
      this.updateEngineSound();
      if (!this.isDead()) {
        this.handleVisibleCharacterMovement();
      }
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      this.updateAnimation();
    }, 200);
  }

  /**
   * Updates current animation based on state
   */
  updateAnimation() {
    if (this.isDead() && !this.deathAnimationComplete) {
      this.playDeathAnimation();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (!this.isDead()) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Plays death sound effect
   */
  playDeathSound() {
    const deathSound = new Audio("../CYBERSTEVE/audio/boss-dead.wav");
    deathSound.volume = 0.2;
    deathSound.muted = isMuted;
    deathSound.play();
  }

  /**
   * Stops engine sound
   */
  stopEngineSound() {
    if (this.engineSound) {
      this.engineSound.pause();
      this.engineSound.currentTime = 0;
      this.engineSoundPlaying = false;
    }
  }

  /**
   * Handles the initial sighting of the character and starts the Endboss movement.
   */
  checkFirstSighting() {
    if (this.firstSighting && this.isCharacterVisible()) {
      this.firstSighting = false;

      setTimeout(() => {
        this.movementStarted = true;
      }, 1500);
    }
  }

  /**
   * Moves the Endboss character towards the player.
   */
  moveEndboss() {
    if (this.world.character.x < this.x) {
      this.x -= this.speed;
      this.otherDirection = false;
    } else {
      this.x += this.speed;
      this.otherDirection = true;
    }
  }

  /**
   * Handles death animation frame updates
   * @returns {boolean} Whether animation is complete
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
   * Updates death animation sequence for Endboss
   */
  playDeathAnimation() {
    if (this.updateDeathFrame()) {
      if (this.currentDeathFrame === 1) {
        this.engineSound.pause();
        this.engineSound.currentTime = 0;
        this.engineSoundPlaying = false;
        this.playDeathSound();
      }
      if (this.currentDeathFrame >= this.IMAGES_DEAD.length) {
        this.deathAnimationComplete = true;
        this.showWinScreen();
      }
    }
  }

  /**
   * Displays the win screen when the Endboss is defeated.
   */
  showWinScreen() {
    const winScreen = this.createWinScreen();
    document.body.appendChild(winScreen);
    this.addWinScreenEventListeners();
  }

  /**
   * Creates the HTML structure for the win screen.
   * @returns {HTMLElement} The win screen element.
   */
  createWinScreen() {
    const winScreen = document.createElement("div");
    winScreen.className = "win-screen";
    winScreen.innerHTML = `
    <div class="win-content">
        <h2>YOU WIN!</h2>
        <p>Congratulations! You've defeated the boss.</p>
        <button class="btn" id="restart">Restart</button>
        <button class="btn" id="main-menu">Main Menu</button>
    </div>
  `;
    return winScreen;
  }

  /**
   * Adds event listeners to the win screen buttons (Restart and Main Menu).
   */
  addWinScreenEventListeners() {
    document
      .getElementById("restart")
      .addEventListener("click", this.restartGame);
    document
      .getElementById("main-menu")
      .addEventListener("click", this.returnToMainMenu);
  }

  /**
   * Restarts the game by resetting the world and the character.
   */
  restartGame() {
    document.querySelector(".win-screen").remove();
    world = new World(canvas, keyboard);
    world.character.x = 100;
    world.camera_x = 0;
  }

  /**
   * Handles game return to main menu
   */
  returnToMainMenu() {
    if (world) {
      if (world.level?.enemies) {
        world.level.enemies.forEach((enemy) => {
          if (enemy instanceof Endboss && enemy.engineSound) {
            enemy.engineSound.pause();
            enemy.engineSound.currentTime = 0;
          }
        });
      }
      world = null;
    }

    document.querySelector(".win-screen")?.remove();
    document.getElementById("canvas").style.display = "none";
    gameStarted = false;
    menuMusic.muted = menuIsMuted;
    loadPage("main");
    playMenuMusic();

    const soundButton = document.getElementById("sound-button");
    if (soundButton) {
      soundButton.addEventListener("click", toggleSound);
    }
    updateSoundIcon();
  }

  /**
   * Plays hit sound effect
   */
  playHitSound() {
    const hitSound = new Audio("../CYBERSTEVE/audio/hitmarker.mp3");
    hitSound.volume = 0.4;
    hitSound.muted = isMuted;
    hitSound.play();
  }

  /**
   * Handles hit sound cooldown
   */
  handleHitSoundCooldown() {
    this.hasPlayedHitSound = true;
    setTimeout(() => {
      this.hasPlayedHitSound = false;
    }, 50);
  }

  /**
   * Processes damage taken by endboss
   */
  hit() {
    if (!this.isDead()) {
      this.health -= 20;
      if (!this.hasPlayedHitSound) {
        this.playHitSound();
        this.handleHitSoundCooldown();
      }
      if (this.health < 0) {
        this.health = 0;
        this.isDying = true;
      }
      super.hit();
    }
  }

  /**
   * Checks if the Endboss is dead.
   * @returns {boolean} True if the Endboss is dead, false otherwise.
   */
  isDead() {
    return this.health === 0;
  }
}
