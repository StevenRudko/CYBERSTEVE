/**
 * Represents a shot object (bullet) in the game, fired by a character or enemy.
 * Handles its movement and direction based on the character's orientation.
 */
class ShotObject extends MovableObject {
  /**
   * Creates a new shot object at the given coordinates.
   *
   * @param {number} x - The initial x-coordinate of the shot.
   * @param {number} y - The initial y-coordinate of the shot.
   * @param {boolean} otherDirection - The direction in which the shot is fired (true for left, false for right).
   */
  constructor(x, y, otherDirection) {
    super().loadImage("../CYBERSTEVE/img/Weapons/5 Bullets/5.png");
    this.height = 10;
    this.width = 30;
    this.otherDirection = otherDirection;

    if (this.otherDirection) {
      this.x = x - this.width;
    } else {
      this.x = x;
    }
    this.y = y;

    this.shot();
  }

  /**
   * Makes the shot move either left or right based on the `otherDirection` property.
   * The shot moves at a fixed speed.
   */
  shot() {
    setInterval(() => {
      this.x += this.otherDirection ? -20 : 20;
    }, 16);
  }
}
