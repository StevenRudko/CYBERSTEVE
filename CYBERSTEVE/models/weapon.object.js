class Weapon extends MovableObject {
  width = 60;
  height = 30;
  animationOffset = 0;
  animationDirection = 1;

  constructor() {
    super().loadImage("../CYBERSTEVE/img/Weapons/2 Guns/1_1.png");
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (!this.isHurt() && !this.isDead()) {
        this.animationOffset += 0.2 * this.animationDirection;
        if (this.animationOffset > 1) {
          this.animationDirection = -1;
        }
        if (this.animationOffset < -1) {
          this.animationDirection = 1;
        }
      }
    }, 1000 / 60);
  }

  /**
   * Updates the position of the weapon based on the character's state.
   * Adjusts the position when the character is hurt, when the character moves, and based on the direction.
   * @param {Character} character - The character to which the weapon is attached.
   */
  updatePosition(character) {
    let xOffset = 15;
    let yOffset = 45;

    this.updatePositionWhenHurt(character, xOffset, yOffset);
    this.updatePositionForMovement(character, xOffset, yOffset);
    this.updatePositionForDirection(character, xOffset);

    this.y = character.y + yOffset + this.animationOffset;
  }

  /**
   * Updates the weapon position when the character is hurt.
   * Adjusts the x and y offset if the character is hurt.
   * @param {Character} character - The character to check the hurt state.
   * @param {number} xOffset - The initial x position offset.
   * @param {number} yOffset - The initial y position offset.
   */
  updatePositionWhenHurt(character, xOffset, yOffset) {
    if (character.isHurt()) {
      xOffset = 10;
      yOffset = 65;
    }
  }

  /**
   * Updates the weapon position based on the character's movement.
   * Adjusts the x position offset when the character is moving right or in the air.
   * @param {Character} character - The character to check movement.
   * @param {number} xOffset - The initial x position offset.
   * @param {number} yOffset - The initial y position offset.
   */
  updatePositionForMovement(character, xOffset, yOffset) {
    if (character.world?.keyboard.RIGHT || character.isAboveGround()) {
      xOffset = 35;
    } else if (character.world?.keyboard.LEFT) {
      xOffset = 50;
    }

    if (character.otherDirection) {
      this.x = character.x + xOffset - 15;
    } else {
      this.x = character.x + xOffset;
    }
  }

  /**
   * Updates the weapon's direction based on the character's facing direction.
   * Sets the `otherDirection` property based on the character's facing direction.
   * @param {Character} character - The character to check direction.
   * @param {number} xOffset - The initial x position offset.
   */
  updatePositionForDirection(character, xOffset) {
    if (character.otherDirection) {
      this.otherDirection = true;
    } else {
      this.otherDirection = false;
    }
  }

  /**
   * Draws the weapon on the canvas.
   * Only draws if the weapon is not hurt or dead.
   * @param {CanvasRenderingContext2D} ctx - The canvas context used for drawing.
   */
  draw(ctx) {
    if (!this.isHurt() && !this.isDead()) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}
