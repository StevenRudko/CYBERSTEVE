/**
 * Represents the game world including the character, level, and other game elements.
 */
class World {
  character;
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  energyBar = new EnergyBar();
  shots = [];
  lastShot = 0;
  shotCooldown = 150;
  lastHit = 0;
  damageCooldown = 500;
  enemyProjectiles = [];
  hitmarkerImage = new Image();
  hitmarkerTimeout = null;
  hitmarkers = [];

  shooting_sounds = [
    new Audio("../CYBERSTEVE/audio/shoot.mp3"),
    new Audio("../CYBERSTEVE/audio/shoot.mp3"),
    new Audio("../CYBERSTEVE/audio/shoot.mp3"),
  ];
  hitSounds = [
    new Audio("../CYBERSTEVE/audio/hitmarker.mp3"),
    new Audio("../CYBERSTEVE/audio/hitmarker.mp3"),
    new Audio("../CYBERSTEVE/audio/hitmarker.mp3"),
  ];
  currentSoundIndex = 0;
  currentHitSoundIndex = 0;
  isShootKeyPressed = false;

  /**
   * Initializes the world with the given canvas and keyboard input.
   * @param {HTMLCanvasElement} canvas - The canvas to render the game.
   * @param {Keyboard} keyboard - The keyboard input handler for controlling the game.
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.ctx = canvas.getContext("2d");
    this.hitmarkerImage.src = "../CYBERSTEVE/img/hitmarker.png";
    this.setupAllSounds();
    this.resetWorld();
    this.energyBar.setPercentage(25);
  }

  /**
   * Shows hitmarker at collision position
   */
  showHitmarker(x, y) {
    this.hitmarkers.push({
      x: x,
      y: y,
      time: new Date().getTime(),
    });
  }

  /**
   * Draws hitmarkers during main draw cycle
   */
  drawHitmarkers() {
    const currentTime = new Date().getTime();
    this.hitmarkers = this.hitmarkers.filter((marker) => {
      const age = currentTime - marker.time;
      if (age > 250) return false;

      const alpha = 1 - age / 250;
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.drawImage(
        this.hitmarkerImage,
        marker.x - 15,
        marker.y - 15,
        30,
        30
      );
      this.ctx.restore();
      return true;
    });
  }

  /**
   * Updates handleHit to use world coordinates
   */
  handleHit(enemy, shotIndex, shot) {
    const hitX = this.character.otherDirection
      ? shot.x - this.camera_x
      : shot.x + shot.width - this.camera_x;
    const hitY = shot.y + shot.height / 2;

    this.playHitSound();
    this.showHitmarker(hitX, hitY);
    enemy.hit();
    this.shots.splice(shotIndex, 1);
  }

  /**
   * Sets up all sounds for the game including shooting and hit sounds.
   */
  setupAllSounds() {
    this.shooting_sounds.forEach((sound) => {
      sound.defaultVolume = 0.15;
      sound.volume = sound.defaultVolume;
      sound.preload = "auto";
    });

    this.hitSounds.forEach((sound) => {
      sound.defaultVolume = 0.2;
      sound.volume = sound.defaultVolume;
      sound.preload = "auto";
    });

    if (this.character?.walking_sound) {
      this.character.walking_sound.defaultVolume = 0.2;
      this.character.walking_sound.volume =
        this.character.walking_sound.defaultVolume;
    }
  }

  /**
   * Cleans up projectiles and removes their references
   */
  clearProjectiles() {
    this.enemyProjectiles.forEach((projectile) => {
      if (projectile.clearProjectile) {
        projectile.clearProjectile();
      }
    });
    this.enemyProjectiles = [];
  }

  /**
   * Cleans up enemy intervals
   */
  clearEnemyIntervals() {
    if (this.level) {
      this.level.enemies.forEach((enemy) => {
        if (enemy.clearIntervals) {
          enemy.clearIntervals();
        }
      });
    }
  }

  /**
   * Cleans up game loops
   */
  clearGameLoops() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    if (this.soundLoop) {
      clearInterval(this.soundLoop);
      this.soundLoop = null;
    }
  }

  /**
   * Initializes new game state
   */
  initializeNewGame() {
    this.level = createLevel1();
    this.character = new Character();
    this.camera_x = 0;
    this.statusBar = new StatusBar();
    this.energyBar = new EnergyBar();
    this.energyBar.setPercentage(0);
    this.shots = [];
    this.lastShot = 0;
  }

  /**
   * Resets the world state
   */
  resetWorld() {
    this.clearProjectiles();
    this.clearEnemyIntervals();
    this.clearGameLoops();
    this.initializeNewGame();
    this.setWorld();
    this.setupAllSounds();
    this.draw();
    this.run();
  }
  /**
   * Sets up the shooting sounds for the world.
   */
  setupShootingSounds() {
    this.shooting_sounds.forEach((sound) => {
      sound.volume = 0.15;
      sound.preload = "auto";
    });
  }

  /**
   * Plays the continuous shooting sound while the shoot key is pressed.
   */
  playContinuousShootSound() {
    this.shooting_sounds[this.currentSoundIndex].currentTime = 0;
    this.shooting_sounds[this.currentSoundIndex].play();
    this.currentSoundIndex =
      (this.currentSoundIndex + 1) % this.shooting_sounds.length;
  }

  /**
   * Stops all shooting sounds.
   */
  stopShootSounds() {
    this.shooting_sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Sets the world context for the character and enemies and starts their animations.
   */
  setWorld() {
    this.character.world = this;
    this.character.animate();

    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      if (enemy instanceof Endboss || enemy instanceof Enemy2) {
        enemy.animate();
      }
    });

    if (this.level.crystals) {
      this.level.crystals.forEach((crystal) => {
        crystal.world = this;
      });
    }
  }

  /**
   * Starts the game loop and the sound loop.
   */
  run() {
    if (!this.gameLoop) {
      this.gameLoop = setInterval(() => {
        this.checkCollisions();
        this.checkShootingInput();
        this.checkShotCollisions();
      }, 1000 / 60);
    }

    if (!this.soundLoop) {
      this.soundLoop = setInterval(() => {
        if (this.isShootKeyPressed) {
          this.playContinuousShootSound();
        }
      }, 150);
    }
  }

  /**
   * Pauses the game by clearing the game and sound loops and stopping all sounds.
   */
  pause() {
    clearInterval(this.gameLoop);
    clearInterval(this.soundLoop);
    this.gameLoop = null;
    this.soundLoop = null;
    this.character.walking_sound.pause();
    this.stopShootSounds();
  }

  /**
   * Handles enemy collisions
   */
  handleEnemyCollisions(currentTime) {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isCollidingFromTop(enemy) && !enemy.isDead()) {
        this.handleTopCollision(enemy);
      } else if (
        this.character.isColliding(enemy) &&
        currentTime - this.lastHit > this.damageCooldown &&
        !enemy.isDead() &&
        !this.character.isCollidingFromTop(enemy)
      ) {
        this.handleNormalCollision(currentTime);
      }
    });
  }

  /**
   * Handles collision from top
   */
  handleTopCollision(enemy) {
    if (enemy instanceof Endboss) {
      enemy.hit();
    } else {
      enemy.health -= 50;
      enemy.hit();
      if (enemy.health <= 0) {
        enemy.isDying = true;
      }
    }
    this.character.speedY = 15;
    this.lastHit = new Date().getTime();
  }

  /**
   * Handles normal collision
   */
  handleNormalCollision(currentTime) {
    this.character.hit();
    this.statusBar.setPercentage(this.character.health);
    this.lastHit = currentTime;
  }

  /**
   * Handles crystal collisions
   */
  handleCrystalCollisions() {
    if (this.level.crystals) {
      this.level.crystals.forEach((crystal) => {
        if (this.character.isColliding(crystal)) {
          this.character.collectCrystal(crystal);
        }
      });
    }
  }

  /**
   * Main collision checker
   */
  checkCollisions() {
    let currentTime = new Date().getTime();
    this.handleEnemyCollisions(currentTime);
    this.handleCrystalCollisions();
    this.handleProjectileCollisions();
  }

  /**
   * Handles collisions with enemy projectiles
   */
  handleProjectileCollisions() {
    this.enemyProjectiles = this.enemyProjectiles.filter(
      (projectile, index) => {
        if (
          this.character.isColliding(projectile) &&
          !this.character.isDead()
        ) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.health);
          projectile.clearProjectile();
          return false;
        }
        return true;
      }
    );
  }

  /**
   * Plays hit sound
   */
  playHitSound() {
    this.hitSounds[this.currentHitSoundIndex].currentTime = 0;
    this.hitSounds[this.currentHitSoundIndex].volume = 0.2;
    this.hitSounds[this.currentHitSoundIndex].play();
    this.currentHitSoundIndex =
      (this.currentHitSoundIndex + 1) % this.hitSounds.length;
  }

  /**
   * Handles enemy hit by shot
   */
  handleEnemyShot(enemy, shotIndex) {
    if (!enemy.isDead()) {
      this.playHitSound();
      enemy.hit();
      this.shots.splice(shotIndex, 1);
    }
  }

  /**
   * Handles endboss shot collision
   */
  handleEndbossShot() {
    let endboss = this.level.enemies[this.level.enemies.length - 1];
    this.shots.forEach((shot, shotIndex) => {
      if (
        endboss instanceof Endboss &&
        shot.isColliding(endboss) &&
        !endboss.isDead()
      ) {
        this.playHitSound();
        endboss.hit();
        this.shots.splice(shotIndex, 1);
      }
    });
  }

  /**
   * Checks collisions between shots and enemies within camera view
   * Handles both regular enemies and endboss
   * Updates enemy list by removing dead enemies with completed animations
   */
  checkShotCollisions() {
    this.handleRegularEnemyShots();
    this.handleEndbossShots();
    this.removeDeadEnemies();
  }

  /**
   * Handles shot collisions with regular enemies
   */
  handleRegularEnemyShots() {
    this.shots.forEach((shot, shotIndex) => {
      this.level.enemies.forEach((enemy) => {
        if (
          shot.isColliding(enemy) &&
          !enemy.isDead() &&
          this.isInCameraView(enemy)
        ) {
          this.handleHit(enemy, shotIndex, shot);
        }
      });
    });
  }

  /**
   * Handles shot collisions with endboss
   */
  handleEndbossShots() {
    const endboss = this.level.enemies[this.level.enemies.length - 1];
    if (endboss instanceof Endboss && this.isInCameraView(endboss)) {
      this.shots.forEach((shot, shotIndex) => {
        if (shot.isColliding(endboss) && !endboss.isDead()) {
          this.handleHit(endboss, shotIndex, shot); // Added shot parameter
        }
      });
    }
  }

  /**
   * Handles hit effects and shot removal
   */
  handleHit(enemy, shotIndex, shot) {
    const hitX = shot.x + shot.width / 2;
    const hitY = shot.y + shot.height / 2;

    this.playHitSound();
    this.showHitmarker(hitX, hitY);
    enemy.hit();
    this.shots.splice(shotIndex, 1);
  }

  /**
   * Removes dead enemies with completed animations
   */
  removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (enemy) => !enemy.isDead() || !enemy.deathAnimationComplete
    );
  }

  /**
   * Checks if an object is visible in camera view
   */
  isInCameraView(obj) {
    const cameraX = -this.camera_x;
    const screenWidth = this.canvas.width;
    return obj.x >= cameraX && obj.x <= cameraX + screenWidth;
  }

  /**
   * Clears canvas and prepares for drawing
   */
  prepareCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
  }

  /**
   * Draws game world elements
   */
  drawWorldElements() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.enemyProjectiles);
    if (this.level.crystals) {
      this.addObjectsToMap(this.level.crystals);
    }
    this.addToMap(this.character);
    this.addObjectsToMap(this.shots);
  }

  /**
   * Draws UI elements
   */
  drawUI() {
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.energyBar);
    this.ctx.translate(this.camera_x, 0);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Main draw coordinator
   */
  draw() {
    this.prepareCanvas();
    this.drawWorldElements();
    this.drawHitmarkers();
    this.drawUI();

    let self = this;
    requestAnimationFrame(() => self.draw());
  }

  /**
   * Adds all objects in the given array to the map for drawing.
   * @param {Array} objects - The objects to add to the map.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single object to the map for drawing.
   * @param {MovableObject} mo - The object to add to the map.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the image of an object when it's facing the other direction.
   * @param {MovableObject} mo - The object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Flips the image back after drawing it.
   * @param {MovableObject} mo - The object to flip back.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Checks if shooting is allowed
   */
  canShoot() {
    return (
      !this.character.isDead() &&
      !this.character.isHurt() &&
      this.energyBar.percentage >= 2.5
    );
  }

  /**
   * Handles shoot key press state
   */
  handleShootKeyPress() {
    if (this.keyboard.D && !this.isShootKeyPressed) {
      this.isShootKeyPressed = true;
      this.playContinuousShootSound();
    } else if (!this.keyboard.D) {
      this.isShootKeyPressed = false;
      this.stopShootSounds();
    }
  }

  /**
   * Creates new shot if cooldown passed
   */
  createNewShot() {
    let currentTime = new Date().getTime();
    if (currentTime - this.lastShot > this.shotCooldown) {
      let shot = this.character.createShot();
      this.shots.push(shot);
      this.lastShot = currentTime;
      this.energyBar.setPercentage(
        Math.max(0, this.energyBar.percentage - 2.5)
      );
    }
  }

  /**
   * Main shooting input handler
   */
  checkShootingInput() {
    if (this.canShoot()) {
      this.handleShootKeyPress();
      if (this.keyboard.D && this.energyBar.percentage >= 2.5) {
        this.createNewShot();
      }
    } else {
      this.isShootKeyPressed = false;
      this.stopShootSounds();
    }
  }
}
