/**
 * Represents a cloud in the game that moves horizontally.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  /** @type {number} */
  y = 0;

  /** @type {number} */
  height = 500;

  /** @type {number} */
  width = 1000;

  /**
   * Creates an instance of the Cloud class.
   * Initializes the cloud position and starts animation.
   */
  constructor() {
    super().loadImage("../CYBERSTEVE/img/Background/city 1/3.png");
    this.x = Math.random() * 300;
    this.animate();
  }

  /**
   * Moves the cloud to the left.
   */
  animate() {
    this.moveLeft();
  }
}
