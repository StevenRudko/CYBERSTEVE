/**
 * Represents an enemy character in the game.
 * Handles animations, movement, and interactions like taking damage and death.
 */
class Enemy1 extends MovableObject {
  height = 200;
  width = 100;
  y = 260;
  health = 300;
  isDying = false;
  hasPlayedHitSound = false;

  IMAGES_WALKING = [
    "../CYBERSTEVE/img/Enemies/2/Walk/1.png",
    "../CYBERSTEVE/img/Enemies/2/Walk/2.png",
    "../CYBERSTEVE/img/Enemies/2/Walk/3.png",
    "../CYBERSTEVE/img/Enemies/2/Walk/4.png",
    "../CYBERSTEVE/img/Enemies/2/Walk/5.png",
    "../CYBERSTEVE/img/Enemies/2/Walk/6.png",
  ];

  IMAGES_HURT = [
    "../CYBERSTEVE/img/Enemies/2/Hurt/1.png",
    "../CYBERSTEVE/img/Enemies/2/Hurt/2.png",
  ];

  IMAGES_DEAD = [
    "../CYBERSTEVE/img/Enemies/2/Death/1.png",
    "../CYBERSTEVE/img/Enemies/2/Death/2.png",
    "../CYBERSTEVE/img/Enemies/2/Death/3.png",
    "../CYBERSTEVE/img/Enemies/2/Death/4.png",
    "../CYBERSTEVE/img/Enemies/2/Death/5.png",
    "../CYBERSTEVE/img/Enemies/2/Death/6.png",
  ];

  currentDeathFrame = 0;
  deathAnimationComplete = false;

  /**
   * Creates an instance of the enemy.
   * Initializes the enemy's image, position, and movement speed.
   */
  constructor() {
    super().loadImage("../CYBERSTEVE/img/Enemies/2/Idle/1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  /**
   * Main animation loop for the enemy.
   * Handles movement and updates the enemy's animations based on its state.
   */
  animate() {
    setInterval(() => {
      if (!this.isDead()) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead() && !this.deathAnimationComplete) {
        this.playDeathAnimation();
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (!this.isDead()) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  /**
   * Plays the death animation for the enemy.
   * Stops the enemy from moving and plays a death sound.
   */
  playDeathAnimation() {
    if (this.currentDeathFrame < this.IMAGES_DEAD.length) {
      let path = this.IMAGES_DEAD[this.currentDeathFrame];
      this.img = this.imageCache[path];
      this.currentDeathFrame++;
      if (this.currentDeathFrame === 1) {
        const deathSound = new Audio("../CYBERSTEVE/audio/enemy-dead.mp3");
        deathSound.volume = 0.2;
        deathSound.play();
      }
      if (this.currentDeathFrame >= this.IMAGES_DEAD.length) {
        this.deathAnimationComplete = true;
      }
    }
  }

  /**
   * Plays hit marker sound effect
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
    setTimeout(() => {
      this.hasPlayedHitSound = false;
    }, 50);
  }

  /**
   * Plays enemy death sound
   */
  playDeathSound() {
    const deathSound = new Audio("../CYBERSTEVE/audio/enemy-dead.mp3");
    deathSound.volume = 0.2;
    deathSound.play();
  }

  /**
   * Handles enemy death state
   */
  handleDeath() {
    this.health = 0;
    this.isDying = true;
    this.playDeathSound();
  }

  /**
   * Main hit function coordinating damage and effects
   */
  hit() {
    if (!this.isDead()) {
      this.health -= 20;
      if (!this.hasPlayedHitSound) {
        this.playHitSound();
        this.handleHitSoundCooldown();
      }
      if (this.health < 0) {
        this.handleDeath();
      }
      super.hit();
    }
  }
}
