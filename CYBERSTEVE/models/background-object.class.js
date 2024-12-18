/**
 * Represents a background object in the game.
 * @class
 * @extends MovableObject
 * @param {string} imagePath - Path to the background image.
 * @param {number} x - Initial x-coordinate of the background object.
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates an instance of the BackgroundObject class.
   * @param {string} imagePath - Path to the image file.
   * @param {number} x - x-coordinate position.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
