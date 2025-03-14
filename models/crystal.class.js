/**
 * Represents a crystal object in the game that can be collected by the player.
 * @extends MovableObject
 */
class Crystal extends MovableObject {
  /** @type {number} */
  width = 80;

  /** @type {number} */
  height = 80;

  /** @type {number} */
  value = 25;

  /**
   * Creates an instance of the Crystal class.
   * Initializes the crystal's position and loads its image.
   * @param {number} x - The x-coordinate of the crystal.
   * @param {number} y - The y-coordinate of the crystal.
   */
  constructor(x, y) {
    super();
    this.loadImage("../CYBERSTEVE/img/Crystals/4.png");
    this.x = x;
    this.y = y;
  }
}
