/**
 * Represents a movable object in the game, such as a character or an enemy.
 * Provides methods for collision detection, movement, animation, and health management.
 */
class MovableObject extends DrawableObject {
  /** @type {number} - Speed of the object */
  speed = 0.15;

  /** @type {boolean} - Direction of the object (false: left, true: right) */
  otherDirection = false;

  /** @type {number} - Acceleration of the object */
  acceleration = 1;

  /** @type {number} - Health of the object */
  health = 100;

  /** @type {number} - Timestamp of the last hit */
  lastHit = 0;

  /**
   * Checks collision with adjusted hitbox
   */
  isColliding(obj) {
    const hitboxOffset = 30;
    return (
      this.x + hitboxOffset + (this.width - 2 * hitboxOffset) >= obj.x &&
      this.x + hitboxOffset <= obj.x + obj.width &&
      this.y + this.height >= obj.y &&
      this.y <= obj.y + obj.height
    );
  }

  /**
   * Checks top collision with adjusted hitbox
   */
  isCollidingFromTop(obj) {
    const hitboxOffset = 30;
    let characterBottom = this.y + this.height;
    let enemyTop = obj.y + 20;

    return (
      this.isColliding(obj) &&
      characterBottom >= enemyTop - 10 &&
      characterBottom <= enemyTop + 10 &&
      this.speedY < 0
    );
  }

  /**
   * Plays an animation based on the provided images array.
   *
   * @param {Array<string>} images - Array of image paths for the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Reduces the object's health by 20 and updates the last hit time.
   */
  hit() {
    this.health -= 20;
    if (this.health <= 0) {
      this.health = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object is hurt based on the time since the last hit.
   *
   * @returns {boolean} - True if the object is hurt, false otherwise.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks if the object is dead (health equals zero).
   *
   * @returns {boolean} - True if the object is dead, false otherwise.
   */
  isDead() {
    return this.health == 0;
  }

  /**
   * Moves the object to the right by its speed.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by its speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump by setting its vertical speed.
   */
  jump() {
    this.speedY = 20;
  }
}
