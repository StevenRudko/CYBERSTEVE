class Enemy2 extends MovableObject {
  height = 150;
  width = 60;
  y = 260;
  health = 250;
  isDying = false;
  world;
  attackCooldown = 1000;
  lastAttack = 0;
  isAttacking = false;
  movementInterval = null;
  animationInterval = null;
  attackInterval = null;
  activeProjectiles = [];

  /**
   * Array of walking animation images for the enemy.
   * @type {Array<string>}
   */
  IMAGES_WALKING = [
    "../CYBERSTEVE/img/Enemies/3/Walk/1.png",
    "../CYBERSTEVE/img/Enemies/3/Walk/2.png",
    "../CYBERSTEVE/img/Enemies/3/Walk/3.png",
    "../CYBERSTEVE/img/Enemies/3/Walk/4.png",
    "../CYBERSTEVE/img/Enemies/3/Walk/5.png",
    "../CYBERSTEVE/img/Enemies/3/Walk/6.png",
  ];

  /**
   * Array of attack animation images for the enemy.
   * @type {Array<string>}
   */
  IMAGES_ATTACK = [
    "../CYBERSTEVE/img/Enemies/3/Attack/1.png",
    "../CYBERSTEVE/img/Enemies/3/Attack/2.png",
    "../CYBERSTEVE/img/Enemies/3/Attack/3.png",
    "../CYBERSTEVE/img/Enemies/3/Attack/4.png",
    "../CYBERSTEVE/img/Enemies/3/Attack/5.png",
    "../CYBERSTEVE/img/Enemies/3/Attack/6.png",
  ];

  /**
   * Array of hurt animation images for the enemy.
   * @type {Array<string>}
   */
  IMAGES_HURT = [
    "../CYBERSTEVE/img/Enemies/3/Hurt/1.png",
    "../CYBERSTEVE/img/Enemies/3/Hurt/2.png",
  ];

  /**
   * Array of death animation images for the enemy.
   * @type {Array<string>}
   */
  IMAGES_DEAD = [
    "../CYBERSTEVE/img/Enemies/3/Death/1.png",
    "../CYBERSTEVE/img/Enemies/3/Death/2.png",
    "../CYBERSTEVE/img/Enemies/3/Death/3.png",
    "../CYBERSTEVE/img/Enemies/3/Death/4.png",
    "../CYBERSTEVE/img/Enemies/3/Death/5.png",
    "../CYBERSTEVE/img/Enemies/3/Death/6.png",
  ];

  /**
   * Current death animation frame.
   * @type {number}
   */
  currentDeathFrame = 0;

  /**
   * Indicates whether the death animation has completed.
   * @type {boolean}
   */
  deathAnimationComplete = false;

  /**
   * Initializes the enemy, setting initial position and loading animations.
   */
  constructor() {
    super().loadImage("../CYBERSTEVE/img/Enemies/2/Idle/1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;
    this.canAttack = false;
    setTimeout(() => {
      this.canAttack = true;
    }, 2000);
    this.animate();
  }

  /**
   * Checks if the character is within attack range.
   * @returns {boolean} - True if the character is within range.
   */
  isCharacterInRange() {
    if (this.world?.character) {
      const distance = Math.abs(this.x - this.world.character.x);
      return distance < 400;
    }
    return false;
  }

  /**
   * Performs an attack by shooting a projectile towards the character.
   */
  attack() {
    if (this.isDead() || !this.world || !this.canAttack) return;

    this.isAttacking = true;
    let projectile = new EnemyProjectile(
      this.x + (this.otherDirection ? -this.width - 20 : this.width + 20),
      this.y + 50,
      this.world.character.x,
      this.world.character.y
    );
    this.activeProjectiles.push(projectile);
    this.world.enemyProjectiles.push(projectile);
    setTimeout(() => {
      this.isAttacking = false;
    }, 500);
  }

  /**
   * Handles movement logic
   */
  handleMovement() {
    if (!this.isDead() && !this.isHurt()) {
      this.moveLeft();
    }
  }

  /**
   * Handles animation state transitions
   */
  handleAnimationState() {
    if (this.isDead() && !this.deathAnimationComplete) {
      this.playDeathAnimation();
      return;
    }
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.moveLeft();
      return;
    }
    this.playNormalAnimation();
  }

  /**
   * Plays normal movement animations
   */
  playNormalAnimation() {
    if (this.isAttacking) {
      this.playAnimation(this.IMAGES_ATTACK);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Checks if attack is possible
   */
  canPerformAttack() {
    return (
      !this.isDead() &&
      !this.isHurt() &&
      this.world?.character?.isInSight(this) &&
      new Date().getTime() - this.lastAttack > this.attackCooldown &&
      this.isInCameraView()
    );
  }

  isInCameraView() {
    if (!this.world) return false;
    const cameraX = -this.world.camera_x;
    const screenWidth = this.world.canvas.width;
    return this.x >= cameraX && this.x <= cameraX + screenWidth;
  }

  /**
   * Executes attack if possible
   */
  handleAttack() {
    if (this.canPerformAttack()) {
      this.attack();
      this.lastAttack = new Date().getTime();
    }
  }

  /**
   * Sets up all animation intervals
   */
  setupIntervals() {
    this.movementInterval = setInterval(() => this.handleMovement(), 1000 / 60);
    this.animationInterval = setInterval(
      () => this.handleAnimationState(),
      150
    );
    this.attackInterval = setInterval(() => this.handleAttack(), 1000 / 60);
  }

  /**
   * Main animation coordinator
   */
  animate() {
    this.clearIntervals();
    this.setupIntervals();
  }

  /**
   * Clears projectiles and their references
   */
  clearActiveProjectiles() {
    this.activeProjectiles.forEach((projectile) => {
      projectile.clearProjectile();
      const index = this.world.enemyProjectiles.indexOf(projectile);
      if (index > -1) {
        this.world.enemyProjectiles.splice(index, 1);
      }
    });
    this.activeProjectiles = [];
  }

  /**
   * Clears all active intervals
   */
  clearIntervals() {
    [
      this.movementInterval,
      this.animationInterval,
      this.attackInterval,
    ].forEach((interval) => {
      if (interval) {
        clearInterval(interval);
      }
    });

    this.movementInterval = null;
    this.animationInterval = null;
    this.attackInterval = null;
    this.clearActiveProjectiles();
  }

  /**
   * Plays death sound effect
   */
  playDeathSound() {
    const deathSound = new Audio("../CYBERSTEVE/audio/enemy-dead-2.mp3");
    deathSound.volume = 0.2;
    deathSound.muted = isMuted;
    deathSound.play();
  }

  /**
   * Updates death animation frame
   */
  updateDeathFrame() {
    let path = this.IMAGES_DEAD[this.currentDeathFrame];
    this.img = this.imageCache[path];

    this.scheduleNextFrame();
  }

  /**
   * Schedules next death animation frame
   */
  scheduleNextFrame() {
    setTimeout(() => {
      this.currentDeathFrame++;
      if (this.currentDeathFrame >= this.IMAGES_DEAD.length) {
        this.deathAnimationComplete = true;
        this.clearIntervals();
      }
    }, 100);
  }

  /**
   * Handles death animation sequence
   */
  playDeathAnimation() {
    if (this.currentDeathFrame < this.IMAGES_DEAD.length) {
      if (this.currentDeathFrame === 0) {
        this.playDeathSound();
      }
      this.updateDeathFrame();
    }
  }

  /**
   * Plays hit sound with cooldown
   */
  playHitSound() {
    const hitSound = new Audio("../CYBERSTEVE/audio/hitmarker.mp3");
    hitSound.volume = 0.4;
    hitSound.muted = isMuted;
    hitSound.play();
  }

  /**
   * Manages hit sound cooldown
   */
  handleHitSoundCooldown() {
    this.hasPlayedHitSound = true;
    setTimeout(() => (this.hasPlayedHitSound = false), 50);
  }

  /**
   * Initializes death state
   */
  initiateDeath() {
    this.health = 0;
    this.isDying = true;
    this.currentDeathFrame = 0;
    this.deathAnimationComplete = false;
    this.clearIntervals();
    this.animate();
  }

  /**
   * Main hit handler
   */
  hit() {
    if (!this.isDead()) {
      this.health -= 20;
      if (!this.hasPlayedHitSound) {
        this.playHitSound();
        this.handleHitSoundCooldown();
      }

      if (this.health <= 0) {
        this.initiateDeath();
      } else {
        super.hit();
        this.lastHit = new Date().getTime();
      }
    }
  }
}
